const message = {
  id: 1,
  title: "緊急通知：2018/12/25 下午10點緊急維修，系統暫停使用"
}


export function getMessage () {
  return new Promise((resolve, reject) => {
    try {
      resolve(message)
    } catch(e) {
      reject(e)
    }
  })
}