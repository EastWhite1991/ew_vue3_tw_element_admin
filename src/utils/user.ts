const checkUsername = (rule: any, value: any, callback: any) => {
  if (value.length < 5) {
    return callback(new Error('用户名长度不能小于5'))
  } else {
    callback()
  }
}

const checkPassword = (rule: any, value: any, callback: any) => {
  if (value.length < 6) {
    return callback(new Error('密码长度不能小于6'))
  } else {
    callback()
  }
}

export { checkUsername, checkPassword }
