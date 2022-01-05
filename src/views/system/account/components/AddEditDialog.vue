<template>
  <el-dialog
    top="20vh"
    width="600px"
    :title="title"
    :visible="visible"
    @close="close"
  >
    <el-form ref="form" class="account-form" :disabled="disabled" :model="form" label-width="120px" :rules="rules">
      <el-form-item v-if="mode !== 'add'" prop="account" label="账号">
        {{ form.account }}
      </el-form-item>
      <el-form-item prop="name" label="账号">
        <el-input v-model.trim="form.name" maxlength="50" />
      </el-form-item>
      <el-form-item prop="password" label="密码">
        <el-input v-model.trim="form.password" :show-password="!disabled" />
      </el-form-item>
      <el-form-item label="角色">
        <span v-if="mode === 'add'">超级管理员</span>
        <span v-else> {{ roleMap[form.roleCode] || '超级管理员' }}</span>
      </el-form-item>
      <el-form-item prop="status" label="状态">
        <el-radio-group v-model="form.status">
          <el-radio v-for="item in enableStatus" :key="item.value" :label="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span v-if="!disabled" slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="submitForm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import mixin from '@/mixins/dialog'
import { RadioGroup, Radio } from 'element-ui'
import { enableStatus } from '@/config'
import { validatePassword, validateErrorText } from '@/utils/validate'
import { add, modify } from '@/api/systerm/account'
import { roleMap } from '../config'
export default {
  components: { 'el-radio-group': RadioGroup, 'el-radio': Radio },
  mixins: [mixin],
  data () {
    const validatePsd = (rule, value, callback) => {
      if (!value) {
        callback(new Error(validateErrorText('密码')))
      }
      if (!validatePassword(value)) {
        callback(new Error('密码必须包含英文和数字且长度为6-20位'))
      } else {
        callback()
      }
    }
    return {
      roleMap,
      enableStatus,
      form: {
        account: '',
        name: '',
        password: '',
        status: 1,
        roleCode: ''
      },
      rules: {
        name: [
          { required: !this.disabled, message: validateErrorText('姓名'), trigger: 'blur' }
        ],
        password: [
          { required: !this.disabled, validator: validatePsd, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    setFormData () {
      console.log('新增')
      const data = this.data
      this.form = {
        account: data.userId,
        name: data.name,
        phone: data.phone,
        password: data.passwd,
        status: data.enable,
        roleCode: data.roleCode
      }
    },
    async handleSubmit () {
      const form = this.form
      const data = {
        name: form.name,
        phone: form.phone,
        passwd: form.password,
        enable: form.status,
        roleCode: 'admin'
      }
      console.log(data)
      const title = this.mode === 'add' ? '确认新增该账号？' : '确认提交本次对账号的编辑？'
      this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        if (this.mode === 'add') {
          await add(data).then(res => {
            this.$message({ message: '提交成功', type: 'success' })

            console.log(res)
            this.close()
            this.$emit('submit')
          }).catch(() => {})
        } else if (this.mode === 'edit') {
          await modify({ ...data, userId: this.data.userId }).then(res => {
            this.$message({ message: '提交成功', type: 'success' })

            console.log(res)
            this.close()
            this.$emit('submit')
          }).catch(() => {})
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .account-form {
    .el-input {
      width: 300px;
    }
  }
</style>
