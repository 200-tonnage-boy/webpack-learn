

function normal1 (source) {
  console.log('正常normal11--loader', source)
  return source + '// 正常normal11'
}

normal1.pitch = () => {
  console.log('normal1  --- pitch')
}

module.exports = normal1