const app = getApp()
Page({
  data: {
    room_name: '', //房间name
    mission_desc: '',//任务类型
    status: '',//任务状态
    roomData:{},
    taskData:{},
    consumeData:{},
    result:"",
    resultnew: ""
  },
  //扫一扫开始任务
  scancode: function () {
    app.scan_Code(this);//调用扫码功能  
  },
  onLoad: function (options) {
    this.setData({
      room_name: wx.getStorageSync('room_name'),
      mission_desc: wx.getStorageSync('mission_desc'),
      status: wx.getStorageSync('status'),
      consumeData: app.globalData.consumption
    })
    app.postload('/wx/console/api/getEmpClothNumList', { 'room_type_id': wx.getStorageSync('room_type_id'), 'mission_id': wx.getStorageSync('id'), 'room_id': wx.getStorageSync('room_id')}, this);//任务匹配布草列表
  },
  load_win: function (urls, datas) {
    if (urls == '/wx/console/api/getEmpClothNumList') {//任务匹配布草列表      
      for (var i of datas) {
        for (var j of i.clothTypeList) {
          i[j.cloth_kind] = j.desc;
        }
      }
      this.setData({
        roomData: datas
      });
    }
    if (urls == '/wx/console/api/activeMission') {//开始任务的判断
      if (datas.errorCode == '0') {
        //跳转
        wx.navigateTo({
          url: '../linen_allocation/linen_allocation'
        });
      } else {
        app.show_Toast(datas.errorDesc, 'none', 1500);
      } 
    }
    if (urls == 'scan_Code') {//扫码成功-datas二维码扫码信息 
      if (wx.getStorageSync('room_id') != datas) {
        app.show_Toast('扫码房间不匹配，请检查！', 'none', 1500);        
      }else{
        app.postload('/wx/console/api/activeMission', { room_id: datas }, this);//开始任务，判断当前是否有未执行的任务
      }      
    }
  }
})