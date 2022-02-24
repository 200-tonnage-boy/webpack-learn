const { SyncWaterfallHook } = require('tapable');
/**
 * 当事件回调函数的返回值非undefined的时候就会传递给后续的回调当参数，如果没返回就用前一个返回顶上
 * 
 */
const hook = new SyncWaterfallHook(["name", "age"]);

hook.tap('1', (name, age) => {
    console.log(1, name, age);// 1 zhufeng 13
    return 'A';
})

hook.tap('2', (name, age) => {
    console.log(2, name, age);// 2 A 13
    //如果有返回值，后面的都不走了
    // return 'B';
})

hook.tap('3', (name, age) => {
    console.log(3, name, age);//3 A 13
    return 'C';
})
hook.call('zhufeng', 13);