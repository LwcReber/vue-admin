<template>
  <el-dialog
    width="500px"
    title="修改密码"
    center
    append-to-body
    :visible="visible"
    class="password-dialog"
    @close="close"
  >
    <el-form ref="form" class="password-form" :disabled="disabled" :model="form" label-width="0" :rules="rules">
      <el-form-item prop="oldPsd">
        <el-input v-model.trim="form.oldPsd" show-password placeholder="旧密码" />
      </el-form-item>
      <el-form-item prop="newPsd">
        <el-input v-model.trim="form.newPsd" show-password placeholder="新密码" />
      </el-form-item>
      <el-form-item prop="comfirmPsd">
        <div class="info">
          密码必须包含英文和数字且长度为6-20位
        </div>
        <el-input
          v-model.trim="form.comfirmPsd"
          :class="{'comfirm-psd': true, 'psd-correct': newPsdSure}"
          type="password"
          :show-password="newPsdSure ? false : true"
          :suffix-icon="newPsdSure ? 'el-icon-circle-check': ''"
          placeholder="确认新密码"
          @input="changeConfirmPsd"
        ></el-input>
      </el-form-item>
    </el-form>
    <span v-if="!disabled" slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">确认修改</el-button>
    </span>
  </el-dialog>
</template>

<script>
import mixin from '@/mixins/dialog'
import { validatePassword, validateErrorText } from '@/utils/validate'
// import { changePsd } from '@/api/user'
export default {
  mixins: [mixin],
  data () {
    const validatePsd = (rule, value, callback) => {
      if (!value) {
        callback(new Error(validateErrorText('密码')))
      }
      if (!validatePassword(value)) {
        callback(new Error('密码格式不符合条件'))
      } else {
        callback()
      }
    }
    return {
      newPsdSure: false,
      form: {
        oldPsd: '',
        newPsd: '',
        comfirmPsd: ''
      },
      rules: {
        oldPsd: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error(validateErrorText('旧密码')))
              }
              validatePsd(rule, value, callback)
            }
          }
        ],
        newPsd: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback(new Error(validateErrorText('新密码')))
              }
              validatePsd(rule, value, callback)
            }
          }
        ],
        comfirmPsd: [
          { required: true, message: validateErrorText('确认新密码'), trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              this.newPsdSure = false
              if (value === this.form.newPsd) {
                this.newPsdSure = true
                callback()
              } else {
                callback(new Error('新密码和确认新密码填写不一致'))
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    resetForm () {
      this.newPsdSure = false
      this.$refs.form && this.$refs.form.resetFields()
    },
    changeConfirmPsd (value) {
      console.log('change')
      this.newPsdSure = false
      if (value === this.form.newPsd) {
        this.newPsdSure = true
      }
    },
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.form)
          // const form = this.form
          // changePsd({
          //   oldPwd: form.oldPsd,
          //   newPwd: form.newPsd,
          //   confirmPwd: form.comfirmPsd
          // }).then(() => {
          //   this.newPsdSure = false
          //   this.$message({
          //     showClose: true,
          //     message: '密码修改成功！',
          //     type: 'success'
          //   })
          // this.close()
          // })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .password-dialog {
    ::v-deep {
      .el-dialog__body {
        padding: 0 20px;
        padding-top: 20px;
      }
    }
  }
  .password-form {
    margin: auto;
    width: 300px;
    .el-input {
      width: 300px;
    }
  }
  .comfirm-psd {
    &.psd-correct {
      ::v-deep {
        .el-input__icon {
          font-size: 16px;
          color: $color-success;
        }
      }
    }
  }
  .info {
    line-height: 18px;
    color: #888;
    font-size: 12px;
  }
</style>
