

function pre1 (source) {
  console.log('前置pre11--loader')
  return source + '// 前置pre11'
}

pre1.pitch = () => {
  console.log('pre1  --- pitch')
}

module.exports = pre1