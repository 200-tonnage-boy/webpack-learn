const { AsyncParallelBailHook } = require('tapable');
const hook = new AsyncParallelBailHook(["name"]);
/* console.time('cost');
hook.tapAsync('1', (name, callback) => {
    setTimeout(() => {
        console.log(1);
        callback();
    }, 1000);
});
hook.tapAsync('2', (name, callback) => {
    setTimeout(() => {
        console.log(2);
        callback();
    }, 2000);
});
hook.tapAsync('3', (name, callback) => {
    setTimeout(() => {
        console.log(3);
        callback();
    }, 3000);
});
hook.callAsync('zhufeng', (err) => {
    console.log(err);
    console.timeEnd('cost');
}); */



// 1
// 2
// done
// cost: 2.004s
// 3
// 注意这里的熔断，只是在有返回值的时候就调用结束的回调，剩下的那个还是在执行，因为是paralle并行，只是会丢弃结果

console.time('cost');
hook.tapPromise('1', (name) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(1);
            resolve();
        }, 1000);
    });
});
hook.tapPromise('2', (name) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(2);
            resolve('B');
        }, 2000);
    });
});
hook.tapPromise('3', (name,) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(3);
            resolve('C');
        }, 3000);
    });
});
hook.promise('zhufeng').then(() => {
    console.log('done');
    console.timeEnd('cost');
});