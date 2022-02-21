
// ------------------------------------------------------------------commonJS加载commonJS
// const {message, addTag} = require('./commonB.js');

// const a = 'main文件';
// const result = a + message + addTag(a);
// console.log('cjy----', result)

// -----------------------------------------------------------------commonJS,加载EsModule
// const {default:addTag, message} = require('./esB');
// const t =  require('./esB');

// const a = 'main文件';
// const result = a + message + addTag(a);
// console.log('cjy----', result)


// console.log('ttttt', t, t.toString())




// // ---------------------------------------------------------------esModule 加载commonJS
// // const {message, addTag} = require('./commonB.js');
// import { message, addTag } from "./commonB.js";
// import x from './commonB.js';
// console.log('看下导出', x);
// const a = "main文件";
// const result = a + message + addTag(a);
// console.log("cjy----esModule 加载commonJS", result);




// const {message, addTag} = require('./commonB.js');

// -----------------------------------------------------------------------------es加载es
// import handleMessage, { message } from "./esB.js";
// import * as x  from './esB.js';// * as x 才是全量导入
// import xx from './esB.js';// 这样引入的是default的值
// console.log('看下导出', x, xx);
// const a = "main文件";
// const result = a + message + handleMessage(a);
// console.log("cjy----esModule 加载es module", result);



//--------------------------------------------------------------异步加载es
const dom = document.getElementById('box');
dom.addEventListener('click', () => {
  import(/* webapckChunkName: 'AsyncB'*/'./esB.js').then(module => {
    console.log('异步加载', module)
    alert(module.message)
  })
})