const { notEmpty } = require('../utils.js')

module.exports = {
  description: 'generate a view',
  prompts: [
    {
      type: 'input',
      name: 'pageName',
      message: 'folder path please',
      validate: notEmpty('pageName')
    },
    {
      type: 'input',
      name: 'name',
      message: 'view name please',
      validate: notEmpty('name')
    },
    {
      type: 'checkbox',
      name: 'blocks',
      message: 'Blocks:',
      choices: [{
        name: '<template>',
        value: 'template',
        checked: true
      },
      {
        name: '<script>',
        value: 'script',
        checked: true
      },
      {
        name: 'style',
        value: 'style',
        checked: true
      }
      ],
      validate(value) {
        if (value.indexOf('script') === -1 && value.indexOf('template') === -1) {
          return 'View require at least a <script> or <template> tag.'
        }
        return true
      }
    }
  ],
  actions: data => {
    const name = '{{name}}'
    const pageName = '{{pageName}}' // 页面路径顶级目录
    const actions = [{
      type: 'add',
      path: `src/views/${pageName}/${name}/index.vue`,
      templateFile: 'plop-templates/view/index.hbs',
      data: {
        name: name,
        template: data.blocks.includes('template'),
        script: data.blocks.includes('script'),
        style: data.blocks.includes('style')
      }
    },
    {
      type: 'add',
      path: `src/views/${pageName}/${name}/components/AddEditDialog.vue`,
      templateFile: 'plop-templates/dialog/index.hbs',
      data: {
        name: 'AddEditDialog',
        template: data.blocks.includes('template'),
        script: data.blocks.includes('script'),
        style: data.blocks.includes('style')
      }
    }
    ]

    return actions
  }
}
