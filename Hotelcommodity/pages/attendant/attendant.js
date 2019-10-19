const app = getApp()
Page({
  data: {
    copytabBar:[
      { page: 'task_list', pagetext:'今日任务列表', text: '我的任务', imgurl:'/images/task_list.png', onimgurl:'/images/task_lists.png'},
      { page: 'chooseClothGrass', pagetext: '', text: '布草管理', imgurl:'/images/chooseClothGrass.png', onimgurl:'/images/chooseClothGrasss.png' }
    ],
    page:'task_list',
    pagetext:'今日任务列表',

    aroundData: {},
    room_type_id: '',
    id: '',
    room_id: '',
    mission_desc: '',
    status: ''
  },
  onLoad: function (options) {
  },
  onShow: function () {
    app.postload('/wx/console/api/getMyMession', {}, this);//保洁员任务列表
  }, 
  copytabBar:function(e){//页面切换    
    this.setData({
      page: e.currentTarget.dataset.page,
      pagetext: e.currentTarget.dataset.pagetext
    })
  },
  //页面跳转
  BtnTo: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url//跳转页
    });    
  },    
  onoff: function () {//上下班    
    app.postload('/console/api/AtworkOnOff', { working:'0'}, this);//下班请求    
  },
  load_win: function (urls, datas) {
    if (urls == '/wx/console/api/getMyMession') {//保洁员任务列表      
      if (datas.length>0){
        this.setData({
          aroundData:datas
        });
      }
    }
    if (urls == '/console/api/AtworkOnOff') {//下班请求
      if (datas.errorCode == '0') {//下班成功
        wx.redirectTo({
          url: '../../pages/main/main'
        })
      } else {
        app.show_Toast(datas.errorDesc, 'none', 1400);
      }
    }
  },
  /*点击保洁任务列表*/
  starttask: function (e) {
    // var that = this;
    // that.setData({
    //   _num: e.currentTarget.dataset.num
    // });
    var room_type_id = e.currentTarget.dataset.room_type_id;//房间类型id    
    wx.setStorageSync('room_type_id', room_type_id);
    var id = e.currentTarget.dataset.id;//任务id    
    wx.setStorageSync('id', id);
    var room_name = e.currentTarget.dataset.room_name;//房间号name   
    wx.setStorageSync('room_name', room_name);
    var room_id = e.currentTarget.dataset.room_id;//房间号id    
    wx.setStorageSync('room_id', room_id);
    var mission_desc = e.currentTarget.dataset.mission_desc;//任务类型   
    wx.setStorageSync('mission_desc', mission_desc);
    var status = e.currentTarget.dataset.status;//任务状态  
    wx.setStorageSync('status', status);
    if (status == 1) {
      //跳转
      wx.navigateTo({
        url: '../linen_allocation/linen_allocation'
      })
    } else {
      //跳转
      wx.navigateTo({
        url: '../room_update/room_update'
      })
    }
  }
})