<template>
  <div class="upload-file-wrapper">
    <div
      v-for="(item,index) in fileList"
      :key="index"
      class="file-upload-list"
    >
      <template v-if="item.status === 'finished'">
        <img
          v-if="item.type == 'image'"
          class="img-item"
          :src="createUid(item.url)"
        >
        <i
          v-else-if="item.type == 'video'"
          class="el-icon-video-camera"
        />
        <i
          v-else
          type="ios-help-empty"
          class="simple-i"
        />
        <div class="file-upload-list-cover">
          <i
            class="el-icon-view"
            @click="$previewImg(item.url)"
          />
          <i
            v-if="!disabled"
            class="el-icon-close"
            @click="handleRemove(index)"
          />
        </div>
      </template>
      <template v-else>
        <Progress
          class="progress"
          :percentage="item.percentage"
        />
      </template>
    </div>
    <Upload
      v-show="fileList.length < max"
      ref="upload"
      :class="{uploader: true, 'upload-disabled': disabled}"
      list-type="picture-card"
      :disabled="disabled"
      :headers="headers"
      name="image"
      :show-file-list="false"
      :on-progress="handleProgress"
      :on-success="handleSuccess"
      :on-error="handleError"
      :format="fileTypes[fileType].format"
      :accept="fileTypes[fileType].accept"
      :max-size="maxSize"
      :on-format-error="handleFormatError"
      :on-exceeded-size="handleMoreMaxFile"
      :before-upload="handleBeforeUpload"
      :multiple="multiple"
      :data="data"
      :file-list="fileList"
      :action="`${actionBaseUrl}${action}?type=${qureryType}`"
      type="drag"
    >
      <slot name="upload-content">
        <i class="el-icon-plus" />
      </slot>
    </Upload>
  </div>
</template>
<script>
import Emitter from '@/mixins/emitter'
import { Upload, Progress } from 'element-ui'
import { getToken } from '@/utils/auth'
import { uid } from 'uid'
const testVideo = /\.mp4$/
const imageFromat = ['jpg', 'jpeg', 'png']
const imageAccept = 'image/jpg, image/jpeg, image/png'
const videoFromat = ['mp4']
const videoAccept = 'video/mp4'
const fileTypes = {
  image: {
    format: imageFromat,
    accept: imageAccept
  },
  video: {
    format: videoFromat,
    accept: videoAccept
  },
  both: {
    format: imageFromat.concat(videoFromat),
    accept: imageAccept + ', ' + videoAccept
  }
}
function getFileType (url) {
  return testVideo.test(url) ? 'video' : 'image'
}
function getItem (item) {
  return {
    url: item.url,
    status: 'finished',
    type: item.type || getFileType(item.url)
  }
}
export default {
  name: 'UploadFile',
  components: { Upload, Progress },
  mixins: [Emitter],
  props: {
    multiple: Boolean,
    data: { // 上传时附带的额外参数
      type: Object,
      default: () => {}
    },
    qureryType: {
      required: true,
      type: String,
      default: ''
    },
    disabled: Boolean,
    // 文件类型，图片和视频
    fileType: {
      type: String,
      default: 'image' // video | both
    },
    // 文件最大数量限制
    max: {
      type: [Number, String],
      default: 1
    },
    // 双向绑定的数据对象
    value: {
      type: Array,
      default: () => []
    },
    // 提交地址
    action: {
      type: String,
      default: '/v1/upload/common/image'
    },
    // 文件上传的 key 值
    name: {
      type: String,
      default: 'file'
    },
    // 最大容量限制
    maxSize: {
      type: [Number, String],
      default: 5120 // 5M
    },
    handleImgSize: { // 图片规格处理，返回true说明规格通过
      type: Function,
      default: () => true
    }
  },
  data () {
    const defaultFileList = []
    this.value.some((item, index) => {
      if (index < this.max) {
        defaultFileList.push(getItem(item))
      } else {
        return true
      }
    })
    return {
      actionBaseUrl: process.env.VUE_APP_BASE_URL,
      fileTypes,
      defaultFileList,
      fileList: []
    }
  },
  computed: {
    headers () {
      return {
        'mg-cms-env': this.$store.getters.env,
        'mg-cms-token': getToken()
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        this.fileList = val.map(getItem)
      }
    }
  },
  methods: {
    createUid (url) {
      return `${url}?u=${uid(16)}`
    },
    handleRemove (index) {
      console.log('remove')
      this.fileList.splice(index, 1)
      this.updateValue()
    },
    handleProgress (e, file, fileList) {
      this.fileList = fileList
    },
    updateValue () {
      const files = this.fileList.map(item => {
        return {
          url: item.url
        }
      })
      console.log(this.fileList)
      this.$emit('input', files)
      this.$emit('change', files)
      this.dispatch('FormItem', 'on-form-change', files)
    },
    handleSuccess (res, file, fileList) {
      console.log(fileList)
      console.log(res, file)
      if (res.code === 0) {
        const url = res.data.url
        file.url = url
        file.type = getFileType(url)
        this.fileList = fileList
        this.updateValue()
      } else {
        // 上传失败，清除progress中的文件
        const findIndex = this.fileList.findIndex(item => item.uid === file.uid)
        if (findIndex > -1) {
          this.fileList.splice(findIndex, 1)
        }
        console.log('errror')
        this.$message({ type: 'error', message: res.msg || '上传失败', duration: 3000 })
      }
    },
    handleError () {
      console.log('error')
      this.$message({ type: 'error', message: '上传失败', duration: 3000 })
    },
    handleFormatError (file) {
      this.$notify.warning({
        title: '文件格式错误',
        desc: `文件 ${file.name} 错误, 请选择 jpg、png 的图片或者 mp4 视频`
      })
    },
    handleMaxSize (file) {
      if (this.maxSize) {
        console.log(file.size / 1024)
        const isMax = file.size / 1024 > this.maxSize
        if (isMax) {
          this.$notify.warning({
            title: '文件超过限制',
            message: `文件 ${file.name} 太大了, 请选择小于 ${parseFloat(this.maxSize / 1024).toFixed(2)}M 的文件`
          })
          return false
        }
      }
      return true
    },
    // 超出文件个数
    handleMoreMaxFile (file) {
      this.$notify.warning({
        title: `最多可上传 ${this.max} 个文件`
      })
    },
    async handleBeforeUpload (file) {
      if (this.handleImgSize) {
        const res = await this.asyncImgChecked(file)
        // 校验不通过不上传
        if (!res) {
          return Promise.reject()
        }
      }
      if (!this.handleMaxSize(file)) {
        console.log('before upload max')
        return Promise.reject()
      }

      const check = this.fileList.length < this.max
      if (!check) {
        this.$notify.warning({
          title: `最多可上传 ${this.max} 个文件`
        })
      }
      return check ? Promise.resolve() : Promise.reject()
    },
    asyncImgChecked (file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        console.log(file.raw)
        reader.readAsDataURL(file) // 必须用file.raw
        console.log('file')
        reader.onload = () => { // 让页面中的img标签的src指向读取的路径
          const img = new Image()
          img.src = reader.result
          if (img.complete) { // 如果存在浏览器缓存中
            resolve(this.handleImgSize(img))
          } else {
            img.onload = () => {
              resolve(this.handleImgSize(img))
            }
          }
        }
      })
    },
    resetUploadFile () {
      this.fileList = []
    }
  }
}
</script>
<style lang="scss" scoped>
  $width: 100px;
  $height: $width;
  .upload-file-wrapper {
    line-height: 0;
    margin-right: 8px;

    .add-btn {
      width: $width - 2;
      height: $height - 2;
      line-height: $height;
    }
    .simple-i {
      font-size: 26px;
    }
  }

  .uploader {
    ::v-deep
    .el-upload--picture-card {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      height: 100px;
    }
    .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      &:hover {
        border-color: $theme-color;
      }
    }
  }

  .upload-disabled {
    ::v-deep {
      .el-upload--picture-card:hover {
        border-color: #c0ccda;
        color: unset;
        cursor: not-allowed;
      }
    }
  }

  .progress {
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    transform: translateY(-50%);
  }
  .file-upload-list {
    display: inline-block;
    width: $width;
    height: $height;
    text-align: center;
    line-height: $height;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    img {
      width: 100%;
      height: 100%;
    }
    &:hover .file-upload-list-cover {
      display: block;
    }
  }
  .file-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
    i {
      color: #fff;
      font-size: 16px;
      cursor: pointer;
      margin: 0 2px;
    }
  }

  .img-item {
    object-fit: cover;
  }
</style>
