const esprima = require('esprima');
const traverse = require('estraverse');
const generate = require('escodegen');

// demo 利用ast转换，把== 替换为===；
const sourceCode = `(a) => {
  if(a == 10) {
    return true
  }
}`

const sourceAST = esprima.parse(sourceCode)

//访问器模式，采用深度优先遍历AST树；
const visitor = {
  enter(node, parent) {
    if(node.type === 'IfStatement' && node.test.type === 'BinaryExpression' && node.test.operator === '==') {
      node.test.operator = '==='
    }
  },
  leave(node, parent) {
    
  },
};

traverse.traverse(sourceAST,visitor)
let newSourceCode = generate.generate(sourceAST);
console.log(newSourceCode);
// 输出
// a => {
//   if (a === 10) {
//       return true;
//   }
// };