

function post2 (source) {
  console.log('后置post22 --loader')
  return source + '// 后置 post22'
}

post2.pitch = () => {
  console.log('post2  --- pitch')
}

module.exports = post2