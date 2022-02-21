

function normal2 (source) {
  console.log('正常normal22--loader')
  return source + '// 正常normal22'
}

normal2.pitch = () => {
  console.log('normal2  --- pitch')
  return true
}

module.exports = normal2