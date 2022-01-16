## commonjs加载commonjs
入口文件
~~~JavaScript
const {message, addTag} = require('./commonB.js');// 用了require，所以也是commonjs的模块

const a = 'main文件';
const result = a + message + addTag(a);
console.log('cjy----', result)
~~~

被加载的commonjs模块
~~~JavaScript
const message = '信息';
const handleMessage = (v) => {
  return v + '（tag）'
}
module.exports = {
  message,
  addTag: handleMessage
}
~~~

打包后文件分析
~~~JavaScript
// 整体是一个自执行文件，打包之后都是commonjs规范的文件；
(() => {
  // 模块
  // 这里是通过AST分析的模块，模块内部代码被包入到函数中
  var __webpack_modules__ = {
    "./src/commonB.js": (module) => {// 这里共有三个参数，module/export(module.exports)/require
      const message = "信息";
      const handleMessage = (v) => {
        return v + "（tag）";
      };
      module.exports = {
        message,
        addTag: handleMessage,
      };
    },
  };

  // 缓存
  var __webpack_module_cache__ = {};

  function __webpack_require__(moduleId) {
    // 缓存检测
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    // 缓存中没有的模块，会创建一个空的，并挂载到缓存
    var module = (__webpack_module_cache__[moduleId] = {
      exports: {},
    });

    // 执行模块代码，参考上面把模块代码包含在了一个函数中
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    // Return the exports of the module
    return module.exports;
  }

  /************************************************************************/
  var __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
  (() => {
    // 入口文件被放入立即执行函数中执行；
    const { message, addTag } = __webpack_require__("./src/commonB.js");
    const a = "main文件";
    const result = a + message + addTag(a);
    console.log("cjy----", result);
  })();
})();

~~~

## commonjs加载esModule

入口文件
~~~JavaScript
const {default:addTag, message} = require('./esB');// 注意这里的书写方式

const a = 'main文件';
const result = a + message + addTag(a);
console.log('cjy----', result)
~~~

被加载的esModule
~~~javascript
export const message = '信息';
const handleMessage = (v) => {
  return v + '（tag）'
}
export default handleMessage
~~~

打包后的文件：
> Symbol.toStringTag 是一个内置 symbol，它通常作为对象的属性键使用，对应的属性值应该为字符串类型，这个字符串用来表示该对象的自定义类型标签，通常只有内置的 Object.prototype.toString() 方法会去读取这个标签并把它包含在自己的返回值里。

主要有几个工具方法
- o: hasOwnProperty的简写；
- r: 主要是给传入的模块对象定义了两个属性
  - Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });： 当对引入的模块调用toString 的时候会返回[object Module]
  -  Object.defineProperty(exports, "__esModule", { value: true }); esModule的标识

~~~JavaScript
  const t =  require('./esB');
  console.log('ttttt', t, t.toString())
  输出为：
{// 可以看到被定义成了访问器属性；
  default: (v) => { return v + '（tag）' },
  message: "信息",
  __esModule: true,
  Symbol(Symbol.toStringTag): "Module",
  get default: () => (__WEBPACK_DEFAULT_EXPORT__),
  get message: () => (/* binding */ message),
}
[object Module]
~~~
- d: 遍历导出的属性，并挂载到export；并且设置为可枚举；注意这里是定义成了访问器属性，注意这里要结合B文件被处理后的形式来看，B文件导出的变量也都替换成了函数，
打包后：
注意exmodule的导出都会被定义为get访问器属性，并返回内部变量，这也满足了esModule的引用导出的特性。回顾前面commonJS，虽然是值导出，但是引用类型还是会互相影响，因为传递的是地址；
~~~JavaScript
(() => {
  var __webpack_modules__ = {
    "./src/esB.js": (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__
    ) => {
      "use strict";
      __webpack_require__.r(__webpack_exports__);
      __webpack_require__.d(__webpack_exports__, {
        message: () => /* binding */ message,// 注意这里的形式，结合d函数来看，如果这里不是函数形式，就会报错，因为还未定义__WEBPACK_DEFAULT_EXPORT__ /message；并且函数会直接作为get函数；
        default: () => __WEBPACK_DEFAULT_EXPORT__,// 注意这样也满足esModule的引用传递特性；
      });
      const message = "信息";
      const handleMessage = (v) => {
        return v + "（tag）";
      };

      const __WEBPACK_DEFAULT_EXPORT__ = handleMessage;
    },
  };
  /********************与上面相同的缓存和require逻辑**************************/
  var __webpack_module_cache__ = {};
  function __webpack_require__(moduleId) {
    var cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    var module = (__webpack_module_cache__[moduleId] = {
      exports: {},
    });
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    return module.exports;
  }

  /************************************************************************/
  /* webpack/runtime/define property getters */
  (() => {
    // define getter functions for harmony exports
    __webpack_require__.d = (exports, definition) => {
      for (var key in definition) {
        if (
          __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key)
        ) {
          Object.defineProperty(exports, key, {
            enumerable: true,
            get: definition[key],
          });
        }
      }
    };
  })();

  /* hasOwnProperty的简写版本*/
  (() => {
    __webpack_require__.o = (obj, prop) =>
      Object.prototype.hasOwnProperty.call(obj, prop);
  })();

  /* webpack/runtime/make namespace object */
  (() => {
    // define __esModule on exports
    __webpack_require__.r = (exports) => {
      if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
      }
      Object.defineProperty(exports, "__esModule", { value: true });
    };
  })();

  /************************************************************************/
  var __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
  (() => {
    const { default: addTag, message } = __webpack_require__("./src/esB.js");

    const a = "main文件";
    const result = a + message + addTag(a);
    console.log("cjy----", result);
  })();
})();

~~~

## esmodule 加载commonjS
入口文件
~~~JavaScript
  import { message, addTag } from "./commonB.js";
import x from './commonB.js';
console.log('看下导出', x);
const a = "main文件";
const result = a + message + addTag(a);
console.log("cjy----esModule 加载commonJS", result);
~~~
被加载文件
~~~JavaScript
 // 与之前相同
~~~
打包后文件
可以看到打包文件多了一个r方法；该方法主要是根据模块类型的不同返回不同的模块值，如果是es，返回default，如果是commonjs,返回模块本身；注意返回的都是函数，也就是返回值
需要再调用下才能拿到值；
即兼容es/common的一个获取可得到default exports函数的方法；
~~~JavaScript
(() => {
  var __webpack_modules__ = {
    "./src/commonB.js": (module) => {
      const message = "信息";
      const handleMessage = (v) => {
        return v + "（tag）";
      };
      module.exports = {
        message,
        addTag: handleMessage,
      };
    },
  };
  /************************************************************************/
  // require函数和之前相同
  // r d o和之前相同
  /************************************************************************/
  /* webpack/runtime/compat get default export */
  (() => {
    // getDefaultExport function for compatibility with non-harmony modules
    __webpack_require__.n = (module) => {
      var getter =
        module && module.__esModule ? () => module["default"] : () => module;
      __webpack_require__.d(getter, { a: getter });
      return getter;
    };
  })();

  /************************************************************************/
  var __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be in strict mode.
  (() => {
    "use strict";
    __webpack_require__.r(__webpack_exports__);// 标记当前模块是一个es模块；
    // 加载commonB;注意返回的是一个函数；
    var _commonB_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! ./commonB.js */ "./src/commonB.js"
    );
    // 给上面的函数添加一个_default属性；该属性是一个函数，可以用于获取default export；
    var _commonB_js__WEBPACK_IMPORTED_MODULE_0___default =
      /*#__PURE__*/ __webpack_require__.n(
        _commonB_js__WEBPACK_IMPORTED_MODULE_0__
      );
  // 对于commonJS，import x from './commonB.js'; x就是其默认导出，就是r函数可以获得的值，就是module.exports;
    console.log("看下导出", _commonB_js__WEBPACK_IMPORTED_MODULE_0___default());
    const a = "main文件";
    const result =
      a +
      _commonB_js__WEBPACK_IMPORTED_MODULE_0__.message +
      (0, _commonB_js__WEBPACK_IMPORTED_MODULE_0__.addTag)(a);
    console.log("cjy----esModule 加载commonJS", result);
  })();
})();

~~~
..







## es加载es
入口文件：
~~~JavaScript
import handleMessage, { message } from "./esB.js";
import * as x  from './esB.js';// * as x 才是全量导入
import xx from './esB.js';// 这样引入的是default的值
console.log('看下导出', x, xx);
const a = "main文件";
const result = a + message + handleMessage(a);
console.log("cjy----esModule 加载es module", result);
~~~
模块B：与之前相同；

打包后文件：可以看到与之前是一样的
~~~JavaScript
(() => { // webpackBootstrap
  	"use strict";
  	var __webpack_modules__ = ({
  "./src/esB.js":((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

  __webpack_require__.r(__webpack_exports__);
  __webpack_require__.d(__webpack_exports__, {
    "message": () => (/* binding */ message),
    "default": () => (__WEBPACK_DEFAULT_EXPORT__)
  });
  const message = '信息';
  const handleMessage = (v) => {
    return v + '（tag）'
  }
  const __WEBPACK_DEFAULT_EXPORT__ = (handleMessage);
  })

  var __webpack_exports__ = {};
  // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
  (() => {
  __webpack_require__.r(__webpack_exports__);
  var _esB_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./esB.js */ "./src/esB.js");
  console.log('看下导出', _esB_js__WEBPACK_IMPORTED_MODULE_0__, _esB_js__WEBPACK_IMPORTED_MODULE_0__["default"]);
  const a = "main文件";
  const result = a + _esB_js__WEBPACK_IMPORTED_MODULE_0__.message + (0,_esB_js__WEBPACK_IMPORTED_MODULE_0__["default"])(a);
  console.log("cjy----esModule 加载es module", result);
  })();
  
})();
~~~
-----------------------------------------------------------------------------问题记录-----------------------------------------------------


## 异步加载

入口文件：
~~~JavaScript
const dom = document.getElementById('box');
dom.addEventListener('click', () => {
  import(/* webapckChunkName: 'AsyncB'*/'./esB.js').then(module => {
    console.log('异步加载', module)
    alert(module.message)
  })
})
~~~

模块B此时会单独打一个包：
~~~JavaScript
"use strict";
// 注意这里是push了一个数组进去，与webpackJsonpCallback函数结合着看；
(self["webpackChunkwebpack_learn"] = self["webpackChunkwebpack_learn"] || []).push([["src_esB_js"],{
"./src/esB.js":((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
__webpack_require__.r(__webpack_exports__);
 __webpack_require__.d(__webpack_exports__, {
   "message": () => (message),
   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
 });
const message = '信息';
const handleMessage = (v) => {
  return v + '（tag）'
}
const __WEBPACK_DEFAULT_EXPORT__ = (handleMessage);

})
}]);
~~~
打包后文件：
~~~JavaScript
var __webpack_modules__ = {};
var __webpack_module_cache__ = {}; // 加载缓存
function __webpack_require__(moduleId) {
  // 与前同
}
// expose the modules object (__webpack_modules__)
__webpack_require__.m = __webpack_modules__;

/* webpack/runtime/ensure chunk */
(() => {
  __webpack_require__.f = {}; // 注意看下面，会给f一个j属性，是一个函数，使用jsonp的方式加载异步模块；
  // This file contains only the entry chunk.
  // The chunk loading function for additional chunks
  __webpack_require__.e = (chunkId) => {
    return Promise.all(
      Object.keys(__webpack_require__.f).reduce((promises, key) => {
        // promises --> previousValue   key--> currentValue
        __webpack_require__.f[key](chunkId, promises);
        return promises;
      }, [])
    );
  };
})();

/* webpack/runtime/jsonp chunk loading */
(() => {
  // no baseURI

  // object to store loaded and loading chunks
  // undefined = chunk not loaded, null = chunk preloaded/prefetched
  // [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
  var installedChunks = {
    // 用于记录已经或者正在加载的模块；具体含义如注释
    main: 0,
  };

  __webpack_require__.f.j = (chunkId, promises) => {// promise就是e方法中用于累加promise的数组
    // JSONP chunk loading for javascript
    var installedChunkData = __webpack_require__.o(installedChunks, chunkId)
      ? installedChunks[chunkId]
      : undefined;
    if (installedChunkData !== 0) {
      // 0 means "already installed".

      // a Promise means "currently loading".
      if (installedChunkData) {
        // 已经存在了，加入promise
        promises.push(installedChunkData[2]);
      } else {
        // 不存在，还没加载
        // 记录要加载的模块
        var promise = new Promise(
          (resolve, reject) =>
            (installedChunkData = installedChunks[chunkId] = [resolve, reject])
        );
        // 累加__webpack_require__.e中的数组；
        promises.push((installedChunkData[2] = promise));

        // start chunk loading
        var url = __webpack_require__.p + __webpack_require__.u(chunkId);// p就是url，u可以获取最终文件名
        // create error before stack unwound to get useful stacktrace later
        var error = new Error();
        var loadingEnded = (event) => {
          if (__webpack_require__.o(installedChunks, chunkId)) {
              // 错误处理相关
            }
          }
        };
        __webpack_require__.l(url, loadingEnded, "chunk-" + chunkId, chunkId);// l就是加载函数，创建script
      }
    }
  };

  // install a JSONP callback for chunk loading
  var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
    var [chunkIds, moreModules, runtime] = data;
    // chunkIds：["src_esB_js"]
    //moreModules：注意模块B中的代码
    // add "moreModules" to the modules object,
    // then flag all "chunkIds" as loaded and fire callback
    var moduleId,
      chunkId,
      i = 0;
    if (chunkIds.some((id) => installedChunks[id] !== 0)) {
      for (moduleId in moreModules) {
        if (__webpack_require__.o(moreModules, moduleId)) {
          __webpack_require__.m[moduleId] = moreModules[moduleId];// __webpack_require__.m就是全局的var __webpack_modules__ = {};用于存放模块代码的，
          // 也就是相当于此时模块代码已经取回来了，还没执行；
        }
      }
      if (runtime) var result = runtime(__webpack_require__);
    }
    if (parentChunkLoadingFunction) parentChunkLoadingFunction(data);
    for (; i < chunkIds.length; i++) {
      chunkId = chunkIds[i];
      if (
        __webpack_require__.o(installedChunks, chunkId) &&
        installedChunks[chunkId]
      ) {
        installedChunks[chunkId][0]();// 调用resolve；
      }
      installedChunks[chunkId] = 0;
    }
  };
  // 注意这里
  var chunkLoadingGlobal = (self["webpackChunkwebpack_learn"] =
    self["webpackChunkwebpack_learn"] || []);
  chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
  chunkLoadingGlobal.push = webpackJsonpCallback.bind(
    null,
    chunkLoadingGlobal.push.bind(chunkLoadingGlobal)
  );
})();



/* webpack/runtime/load script */
(() => {
  var inProgress = {};
  var dataWebpackPrefix = "webpack-learn:";
  // loadScript function to load a script via script tag
  __webpack_require__.l = (url, done, key, chunkId) => {
   // 创建script标签并append进去
  };
})();
~~~

最后主模块会是下面的样子：
首先使用JsonP的法子将B模块加载进来，B模块会调用`self["webpackChunkwebpack_learn"] || []).push`，而这个push方法是重写过的，该push方法会将模块
B的代码添加到全局模块var __webpack_modules__ = {}中，然后调用resove（之前e方法会把加载的模块包装成promise），就会触发require方法，返回模块的到处对象；
~~~JavaScript
var __webpack_exports__ = {};
 const dom = document.getElementById("box");
 dom.addEventListener("click", () => {
   __webpack_require__
     .e(/*! import() */ "src_esB_js")
     .then(
       __webpack_require__.bind(
         __webpack_require__,
         /*! ./esB.js */ "./src/esB.js"
       )
     )
     .then((module) => {
       console.log("异步加载", module);
       alert(module.message);
     });
 });
~~~
## 问题记录
- 可不可以一个文件中混用两种模式；