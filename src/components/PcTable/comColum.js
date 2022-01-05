import dayjs from 'dayjs'
export const createTime = {
  label: '创建时间',
  prop: 'create',
  minWidth: 140,
  render (h, { row }) {
    const time = dayjs(row.gmtCreated).format('YYYY-MM-DD HH:mm:ss')
    return h('span', time)
  }
}

export const gmtModifyime = {
  label: '操作时间',
  prop: 'gmtModify',
  minWidth: 140
  // render (h, { row }) {
  //   const time = dayjs(row.gmtModify).format('YYYY-MM-DD HH:mm:ss')
  //   return h('span', time)
  // }
}

// 操作人
export const lastModifyName = {
  label: '最后一次操作人',
  prop: 'lastModifyName',
  minWidth: 140
}

export const lastModifyList = [
  lastModifyName,
  gmtModifyime
]
