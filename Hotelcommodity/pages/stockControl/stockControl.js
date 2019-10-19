// pages/stockControl/stockControl.js
Page({
  data: {

  },
  onLoad: function (options) {

  },
  //页面跳转
  BtnTo: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url//跳转页
    });
    if (e.currentTarget.dataset.page) {
      wx.setStorageSync('publicA134', e.currentTarget.dataset.page)//公用页存名-A-134阿姨归库、洗衣厂归库、送洗
    }
  },
  onReady: function () {

  },
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

  }
})