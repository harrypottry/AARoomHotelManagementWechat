const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    todayTaskList: [],
    arr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.postload('/wx/console/api/getmissionListbyempId', {}, this);
  },

  // 单选任务列表
  bindchange: function (e) {
    var that = this;
    var value = e.detail.value;
    this.setData({
      arr: value
    })
  },
  // 点击领取布草 
  getClothGrass: function (e) {
    var arrToStrParams = this.data.arr;
    console.log('arrToStrParams:', arrToStrParams);
    if (arrToStrParams.length == 0) {
      app.show_Toast('请先选择房间任务', 'none', 1400);
      return false;
    }
    wx.navigateTo({
      url: '../hasGetClothGrassList/hasGetClothGrassList?roomIds=' + arrToStrParams
    });
  },
  load_win: function (urls, datas) {
    var desContentPreArr = [];
      datas.map((item, index) => {
        var apartAttibute = [];
        if (item.mission_type_desc != '') {
          desContentPreArr = item.mission_type_desc.split('/');
        }
        item['apartAttibute'] = desContentPreArr;
      });
      this.setData({
        todayTaskList: datas
      });
  }
});
