const app = getApp()
Page({
  data: {    
    pagename: '',    
    standby: []//当前页面数组          
  },
  onLoad: function (options) {
  },
  onShow: function () {    
    this.setData({      
      pagename: wx.getStorageSync('aunt_cargo_name'),
    })
    app.getload('/wx/console/api/getCleanerCloths', {cleaner_id: wx.getStorageSync('possessor_id')}, this);
  },
  //页面跳转
  BtnTo: function (e) {
    wx.navigateTo({
      url:'../../pages/publicA67810/publicA67810'//跳转页
    });    
    wx.setStorageSync('publicA67810data', e.currentTarget.dataset.data)//公用页data
    wx.setStorageSync('publicA67810name', e.currentTarget.dataset.name)//公用页name    
  }, 
  load_win: function (urls, datas) {    
    if (datas.errorCode == '0') {
      datas = datas.data;
      for (var i in datas) {
        for (var j of datas[i].clothTypes) {
          datas[i][j.cloth_kind] = j.desc;
        }
      }
      this.setData({
        standby:datas
      })
    } else {
      app.show_Toast('加载失败，请重新加载', 'none', 1400);
    }    
  }
})