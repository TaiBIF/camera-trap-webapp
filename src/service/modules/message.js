const fake = {
  message: {
    id: 1,
    title: '緊急通知：2018/12/25 下午10點緊急維修，系統暫停使用'
  }
}

const getMessage = () => new Promise(resolve => resolve(fake.message))

export { getMessage }
