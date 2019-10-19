const app = getApp()
Page({
  data: {
    // numindex: null,
    consumeData: null,
    useIds:{}
  },
  onLoad: function (options) {
    var room_type_id = wx.getStorageSync('room_type_id');//房间类型id
    var room_id = wx.getStorageSync('room_id');//房间id
    var room_name = wx.getStorageSync('room_name');//房间name
    var id = wx.getStorageSync('id'); //任务id
    var mission_desc = wx.getStorageSync('mission_desc');//任务类型 
    var consumeData = app.globalData.consumption;
    consumeData.map((item) => {
      item.num = 0
    })
    this.setData({
      room_id: room_id,
      room_name: room_name,
      id: id,
      mission_desc: mission_desc,
      consumeData: consumeData,
      room_type_id: room_type_id
    });
  },
  voteNums: function (e) {
    var index = e.currentTarget.dataset.index;
    var val = e.detail.value;
    var valArr = [];
    this.data.consumeData[index].num = parseInt(val)
  },
  complete: function (e) {
    var itemObj = {};
    //var obj={};
    var consumeData = this.data.consumeData;
    this.data.consumeData.map((item, index) => {
      itemObj[parseInt(item.id)] = item.num
    })
    //itemObj.push(obj);
    // console.log(JSON.stringify(itemObj).replace(/\"/g, ""))
    //JSON.stringify(itemObj).replace(/\"/g,"");
    var cloth_id = wx.getStorageSync('cloth_id');
    app.postload('/wx/console/api/saveConsumptionByMissionId', { 'room_id': this.data.room_id, 'mission_id': this.data.id, 'conAndSumMap': JSON.stringify(itemObj).replace(/\"/g, ""), 'room_type_id': this.data.room_type_id}, this);//完成任务
  },  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  load_win: function (urls, datas) {
    if (urls == '/wx/console/api/saveConsumptionByMissionId') {
      if (datas.errorCode == '0'){
        wx.redirectTo({
          url: '../../pages/attendant/attendant'
        })
      } else if (datas.errorCode == '50107'){
        app.show_Toast(datas.errorDesc, 'none', 1500);
      }
    }
  }
})