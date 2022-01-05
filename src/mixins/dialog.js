export default {
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }, // 禁用表单填写
    visible: {
      type: Boolean,
      required: true,
      default: false
    },
    title: {
      type: String,
      required: false
    },
    data: Object,
    // 模式，状态，通过此标记判断事件处理
    mode: {
      type: String,
      required: false,
      default: 'add'
    }
  },
  data() {
    return {
      btnLoading: false // 提交按钮loading
    }
  },
  watch: {
    visible(newVal) {
      // 编辑查看，填充数据
      if (!newVal) {
        return
      }
      this.btnLoading = false // 每次打开重置按钮loading

      this.$nextTick(() => {
        // 自定义的form resetFields
        if (typeof this.resetForm === 'function') {
          this.resetForm()
        } else if (this.$refs.form) {
          // 组件内的默认重置form表单
          this.$refs.form.resetFields()
        }

        if (this.mode === 'edit' || this.mode === 'check') {
          console.log(this.data)
          // 打开visible执行方法, 用于edit，check的时候回显数据
          if (typeof this.setFormData === 'function') {
            this.setFormData()
          }
        }
      })
    }
  },
  created() {
  },
  methods: {
    // 表单提交，按钮loading一体
    async submitForm () {
      this.$refs.form && this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.btnLoading = true
          // 提交form表单
          await this.handleSubmit() // 在组件内部声明该异步函数
          this.btnLoading = false
        } else {
          return false
        }
      })
    },
    close() {
      // 有form表单，重置值
      // if (this.$refs.form) {
      //   console.log('resetform')
      //   this.$refs.form.resetFields()
      // }
      this.$emit('update:visible', false)
    }
  }
}
