

function inline2 (source) {
  console.log('行内inline22--loader')
  return source + '// 行内inline22'
}

inline2.pitch = () => {
  console.log('inline2  --- pitch')
}

module.exports = inline2