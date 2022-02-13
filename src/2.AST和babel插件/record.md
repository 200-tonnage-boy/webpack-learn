# babel
## 1.AST
### 1.1基础
AST即抽象语法树，即一个树状的，描述JavaScript语法的结构；可以表示为一个JavaScript对象，是对JavaScript语法的抽象描述；

#### 主要用途：
- 代码风格检查，高亮提示；
  - 如eslint, IDE
- 代码压缩混淆；
  - UglifyJS2
- 代码转化，如babel等

### 1.2生成过程
生成一个AST主要包含两个过程：**分词**、**语法分析**；

**分词**即将JavaScript代码拆分为token，token可以理解为JavaScript程序中具备实际意义的最小语法单元，比如：

- 空白：JS中连续的空格、换行、缩进等这些如果不在字符串里，就没有任何实际逻辑意义，所以把连续的空白符直接组合在一起作为一个语法单元。

- 注释：行注释或块注释，虽然对于人类来说有意义，但是对于计算机来说知道这是个“注释”就行了，并不关心内容，所以直接作为一个不可再拆的语法单元

- 字符串：对于机器而言，字符串的内容只是会参与计算或展示，里面再细分的内容也是没必要分析的

- 数字：JS语言里就有16、10、8进制以及科学表达法等数字表达语法，数字也是个具备含义的最小单元

- 标识符：没有被引号扩起来的连续字符，可包含字母、_、$、及数字（数字不能作为开头）。标识符可能代表一个变量，或者true、false这种内置常量、也可能是if、return、function这种关键字，是哪种语义，分词阶段并不在乎，只要正确切分就好了。

- 运算符：+、-、*、/、>、<等等，还有其他：如中括号、大括号、分号、冒号、点等等不再一一列举

- 以上摘抄自（[Babel是如何读懂JS代码的](https://zhuanlan.zhihu.com/p/27289600)）;

将代码分割为token之后，进行**语法分析**；语法分析就是对token流进行立体组合，结合语言规范，确定语句断句范围，以及语句类型，表达式类型等等，最终的到一颗树形的描述结构；

以如下代码为例：

~~~JavaScript
const a = (b) => b + '?';
~~~

在esprima的[在线网站](https://esprima.org/demo/parse.html#)测试的分词结果如下：

~~~JavaScript
[
    {
        "type": "Keyword",
        "value": "const"
    },
    {
        "type": "Identifier",
        "value": "a"
    },
    {
        "type": "Punctuator",
        "value": "="
    },
    {
        "type": "Punctuator",
        "value": "("
    },
    {
        "type": "Identifier",
        "value": "b"
    },
    {
        "type": "Punctuator",
        "value": ")"
    },
    {
        "type": "Punctuator",
        "value": "=>"
    },
    {
        "type": "Identifier",
        "value": "b"
    },
    {
        "type": "Punctuator",
        "value": "+"
    },
    {
        "type": "String",
        "value": "'?'"
    },
    {
        "type": "Punctuator",
        "value": ";"
    }
]
~~~

语法分析结果如下

~~~JavaScript
{
  "type": "Program",
  "body": [
    {
      "type": "VariableDeclaration",
      "declarations": [
        {
          "type": "VariableDeclarator",
          "id": {
            "type": "Identifier",
            "name": "a"
          },
          "init": {
            "type": "ArrowFunctionExpression",
            "id": null,
            "params": [
              {
                "type": "Identifier",
                "name": "b"
              }
            ],
            "body": {
              "type": "BinaryExpression",
              "operator": "+",
              "left": {
                "type": "Identifier",
                "name": "b"
              },
              "right": {
                "type": "Literal",
                "value": "?",
                "raw": "'?'"
              }
            },
            "generator": false,
            "expression": true,
            "async": false
          }
        }
      ],
      "kind": "const"
    }
  ],
  "sourceType": "script"
}
~~~

通过操作这颗语法树，修改我们感兴趣的结点，即可完成对源码的修改

### 1.3 esprima测试

可以通过esprima这个包进行语法树的生成、遍历以及代码生成；

~~~JavaScript
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
~~~

## 2.babel

### 工作原理及核心架构

#### 工作过程

babel的主要工作原理如下图所示：

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2018/12/24/167dfa8949b0401a~tplv-t2oaga2asx-watermark.awebp)

主要包含三个过程：

- 解析：将源码解析为AST语法树，babel的核心AST解析器为babylon，现在已经集成在babel/parser中；
- 转换：将语法树转换为对应目标代码的语法树，新的版本的babel中，这部分工作已经交给插件完成，babel本身不再负责AST的转换，在得到语法树后，babel-traverse包会对AST节点进行深度优先遍历，插件采用访问者模式作用，在遍历到节点后会交给要访问该节点的插件处理；
- 生成：将经过转换的AST通过babel-generator再转换成js代码，过程就是深度优先遍历整个AST，然后构建可以表示转换后代码的字符串；

注意Babel 只负责编译新标准引入的新语法，比如 Arrow function、Class、ES Module 等，它不会编译原生对象新引入的方法和 API，比如 Array.includes，Map，Set 等，这些需要通过 Polyfill 来解决；

#### 核心包

### 插件和预设

预设就是插件的集合，注意在配置文件中babel的插件是从前往后执行，然后执行预设，而预设是从后往前执行；

### 兼容性解决方案



### 实践demo
babelrc文件添加如下配置，可以使用本地的插件，插件内部使用commonjs方式导出；通过安装@babel/cli 可以单独转换文件，在没有添加插件之前，前后没有变化，因为babel本身不负责代码的转换；
~~~javascript
{
  "presets": [],
  "plugins": ["./src/ArrowPlugin.js", "./src/ClassPlugin.js"]

}
~~~

#### 箭头函数转换

#### 类声明转换
#### babel-plugin-import
按需加载


## 参考
### 在线测试网站

https://esprima.org/demo/parse.html；
https://astexplorer.net/

### AST
- [Babel是如何读懂JS代码的](https://zhuanlan.zhihu.com/p/27289600);
- [AST抽象语法树——最基础的javascript重点知识，99%的人根本不了解](https://segmentfault.com/a/1190000016231512);
- [AST系列(一): 抽象语法树为什么抽象](https://zhuanlan.zhihu.com/p/102385477);
- [【你应该了解的】抽象语法树AST](https://juejin.cn/post/6844904126099226631#heading-10);
- [JavaScript AST实现原理解密](https://www.jianshu.com/p/16c97c09664e);
- [AST in Modern JavaScript](https://zhuanlan.zhihu.com/p/32189701);
### babel
- [前端工程师的自我修养-关于 Babel 那些事儿](https://juejin.cn/post/6844904079118827533#heading-4);
- [不容错过的 Babel7 知识](https://juejin.cn/post/6844904008679686152#heading-6);
- [深入Babel，这一篇就够了](https://juejin.cn/post/6844903746804137991);
- [深入浅出 Babel 上篇：架构和原理 + 实战](https://juejin.cn/post/6844903956905197576#heading-7);

polyfill和runtime兼容性解决方案
- [前端工程化（7）：你所需要知道的最新的babel兼容性实现方案](https://juejin.cn/post/6976501655302832159);
- [结合Babel 7.4.0 谈一下Babel-runtime 和 Babel-polyfill](https://juejin.cn/post/6844903869353295879);
- [Babel 插件手册](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md#toc-scope);

  