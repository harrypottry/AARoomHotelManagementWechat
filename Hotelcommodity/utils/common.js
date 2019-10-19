// 获取地址栏参数字符串 --- 应用于扫码
function getAdressParams(url) {
    var name, value;
    var str = url; //取得整个地址栏
    var num = str.indexOf("?")
    str = str.substr(num + 1); //取得所有参数
    var arr = str.split("&"); //各个参数放到数组里
    if (str.indexOf("?")) {
        for (var i = 0; i < arr.length; i++) {
            num = arr[i].indexOf("=");
            if (num > 0) {
                name = arr[i].substring(0, num);
                value = arr[i].substr(num + 1);
                this[name] = value;
            }
        }
    } else {
        return false;
    }
    return url.id;
}
// 时间格式化
function dateFormat(date) {
    var y = date.getFullYear();
    var m = toPadZero(date.getMonth() + 1);
    var d = toPadZero(date.getDate());
    var h = toPadZero(date.getHours());
    var mm = toPadZero(date.getMinutes());
    var s = toPadZero(date.getSeconds());

    return y + '-' + m + '-' + d + ' ' + h + ':' + mm;
    // 2018   -     09    -   08   -    09   -   08
}

function toPadZero(num) {
    return num < 10 ? '0' + num : num;
}

module.exports = {
    dateFormat, 
    getAdressParams
};