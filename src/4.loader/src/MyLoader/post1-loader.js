

function post1 (source) {
  console.log('后置post11--loader')
  return source + '// 后置 post11'
}

post1.pitch = () => {
  console.log('post1  --- pitch')
}

module.exports = post1