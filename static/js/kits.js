var kits = {};

kits.getUrlParams = function () {
    let arr = location.search.substring(1).split('&');
    let prams = {};
    arr.forEach(e => {
        let temp = e.split('=');
        let key = temp[0];
        let val = temp[1];
        prams[key] = val;
    })
    return prams;
}

//状态模式
let strategies = {
    isNoEmpty: function (val, msg) {
        if (val.trim().length === 0) {
            return msg;
        }
    },
    minLength: function (val, len, msg) {
        if (val.trim().length < len) {
            return msg;
        }
    },
}

function Validator() {
    //用来存储所有的验证函数的数组
    this.validateFuns = [];
}

Validator.prototype.add = function (dom, arr) {
    // 遍历数组，往this.validateFuns 添加新的验证的方法
    for (let i = 0; i < arr.length; i++) {
        let fn = function () {
            let rule = arr[i];
            let params = rule.fnName.split(':');
            let fnName = params.shift(); //删除数组的第一个元素
            params.unshift(dom.value); //在数组的开头添加
            params.push(rule.errMsg); //在数组的末尾添加
            return strategies[fnName].apply(dom, params);
        }
        this.validateFuns.push(fn);
    }
}

// 把数组里面的每个函数都执行的方法
Validator.prototype.start = function () {
    for (let i = 0; i < this.validateFuns.length; i++) {
        let msg = this.validateFuns[i]();
        if (msg) {
            return msg;
        }
    }
}