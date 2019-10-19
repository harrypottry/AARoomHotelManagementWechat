//app.js
App({
  globalData: {
    userInfo: null,
    consumption:[],//消耗品    
  },
  onLaunch: function(){    
  },
  getload: function (urls, getdata, that) {//GET请求统一     
    wx.request({
      // url: 'https://aaroom.ihotels.cc/hm' + urls,
      url: 'https://aaroomtest.bjlrsd.com' + urls,//测试
      // url: 'http://localhost:8080' + urls,      
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'JSESSIONID=' + wx.getStorageSync('sessionId')
      },
      data: getdata,
      success: function (res) {
        if (res.statusCode == '200') {
          res = res.data;          
          that.load_win(urls,res);
        }
      }
    })
  },
  postload: function (urls, postdata, that) {//POST请求统一    
    wx.request({
      // url: 'https://aaroom.ihotels.cc/hm' + urls,
      url: 'https://aaroomtest.bjlrsd.com' + urls,//测试
      // url: 'http://localhost:8080' + urls,
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie':'JSESSIONID='+ wx.getStorageSync('sessionId')
      },
      data: postdata,
      success: function (res) {
        if (res.statusCode == '200') {
          res = res.data;          
          that.load_win(urls,res);
        }
      }
    })
  },
  show_Toast: function (title, icon, time) {//提示
    wx.showToast({
      title: title,
      icon: icon,
      mask: true,
      duration: time
    })
  },
  scan_Code:function(that){//布草二维码获取
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {       
        // var reg = res.result.match(/\?.*id=([^&]*).*/)[1];
        // that.load_win('scan_Code', res.result.match(/\?.*id=([^&]*).*/)[1]);//--上线使用
        that.load_win('scan_Code', res.result);
      }
    })
  }
})