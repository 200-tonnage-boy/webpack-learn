import React from "react";
import ReactDOM from "react-dom";
import './index.css'
// let a = 'a';

// const getB = (v) => v+'后缀';

// const b = getB(a);
// console.log(b)


const MyFuncComponent = () => {
  return <div>函数组件</div>
}

ReactDOM.render(<MyFuncComponent />,document.getElementById('root'))