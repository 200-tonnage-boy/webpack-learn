

function inline1 (source) {
  console.log('行内inline11--loader')
  return source + '// 行内inline11'
}

inline1.pitch = () => {
  console.log('inline1  --- pitch')
}

module.exports = inline1