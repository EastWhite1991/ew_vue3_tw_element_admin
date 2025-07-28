const checkUsername = (rule, value, callback) => {
  if (value.length < 5) {
    return callback(new Error('用户名长度不能小于5'))
  } else {
    callback()
  }
}

const checkPassword = (rule, value, callback) => {
  if (value.length < 6) {
    return callback(new Error('密码长度不能小于6'))
  } else {
    callback()
  }
}

export { checkUsername, checkPassword }
