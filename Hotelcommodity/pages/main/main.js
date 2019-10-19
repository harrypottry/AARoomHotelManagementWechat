const app = getApp()
Page({
  data: {
    hotelname: 'AA连锁酒店(上海沪宜公路沪嘉客运店)',
    isLogin: 'true', //自动登录状态true-已登录
    job: '', //1-业务5-库管6-保洁
    // phone: '17723232323', //业务
    // phone:'15210845248',//库管
    // phone:'17562738199',//保洁
    // phone: '15315560689',//保洁
    // pwd: 'password'
  },
  onLoad: function (options) {
    wx.login({ // 登录获取      
      success: res => {
        if (res.code) {
          app.getload('/autoLogin', {
            code: res.code
          }, this); //自动登录判断          
        }
      }
    });
  },
  //页面跳转
  BtnTo: function (e) {
    if (e.currentTarget.dataset.type) {
      var type = parseInt(e.currentTarget.dataset.type);
      console.log("type:",type)
      wx.navigateTo({
        url: e.currentTarget.dataset.url + "?type=" + type //跳转页
      });
    } else {
      wx.navigateTo({
        url: e.currentTarget.dataset.url //跳转页
      });
      if (e.currentTarget.dataset.page) {
        wx.setStorageSync('publicA134', e.currentTarget.dataset.page) //公用页存名-A-1新订布草
      }
    }
  },
  onoff: function () { //上下班    
    app.postload('/console/api/AtworkOnOff', {
      working: '1'
    }, this); //上班请求    
  },
  // 绑定手机填写事件
  bindphone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 绑定密码填写事件
  bindpwd: function (e) {
    this.setData({
      pwd: e.detail.value
    })
  },
  // 登陆按钮
  submitBtn: function (e) {
    if (!this.checkData()) {
      return false
    }
    var that = this;
    wx.login({ //手机号密码首次登录      
      success: res => {
        if (res.code) {
          app.postload('/login', {
            code: res.code,
            account: that.data.phone,
            password: that.data.pwd
          }, that); //手机号密码首次登录                    
        }
      }
    })
  },
  // 表单验证
  checkData: function () {
    // var this = this
    var data = this.data
    if (data.phone == '') {
      app.show_Toast('请输入手机号', 'none', 1400);
      return false
    // } else if (data.phone.length < 11) {
    //   app.show_Toast('请输入正确的手机号', 'none', 1400);
    //   return false
    } else if (data.pwd == '') {
      app.show_Toast('请输入密码', 'none', 1400);
      return false
    }
    return true
  },
  load_win: function (urls, datas) { //请求成功后     
    if (urls == '/autoLogin') { //自动登录判断
      wx.setStorageSync('sessionId', datas.sessionId) //缓存登录用户信息
      this.setData({ //pan--后删--用下代码
        isLogin: '',
        job: ''
      })
      // if (datas.role_id) {//已登录-有身份
      //   this.setData({
      //     isLogin:true,
      //     job: datas.role_id
      //   })
      // } else {
      //   this.setData({
      //     isLogin:'',
      //     job:''
      //   })
      // }
      app.postload('/wx/api/getAllConsumption', {}, this); // 自动登录请求后--失败与否--请求消耗品           
    }
    if (urls == '/login') { //手机号密码首次登录      
      if (datas.role_id) { //已登录
        this.setData({
          isLogin: true,
          job: datas.role_id
        })
      } else {
        app.show_Toast(datas.message, 'none', 1400);
      }
    }
    if (urls == '/wx/api/getAllConsumption') { // 自动登录请求后--失败与否--请求消耗品      
      app.globalData.consumption = datas;
    }
    if (urls == '/console/api/AtworkOnOff') { //上班请求
      if (datas.errorCode == '0') { //上班成功
        wx.redirectTo({
          url: '../../pages/attendant/attendant'
        })
      } else {
        app.show_Toast(datas.errorDesc, 'none', 1400);
      }
    }
  }
})