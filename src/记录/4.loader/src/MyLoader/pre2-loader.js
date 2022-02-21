

function pre2 (source) {
  console.log('前置pre22--loader')
  return source + '// 前置pre22'
}

pre2.pitch = () => {
  console.log('pre2  --- pitch')
}

module.exports = pre2