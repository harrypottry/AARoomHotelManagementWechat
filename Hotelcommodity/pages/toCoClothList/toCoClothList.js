var app = getApp();
var tools = require('../../utils/common.js');
Page({
  data: {
    toCoListSelect: null,
    rfIdsArr: [],
    queryB: [],
    idsStr: "",
    rfIdsStr: "",
    itemDataArr: [],
    count: 0
  },
  onLoad: function (options) {
    var that = this;
    var time = options.time;
    var type = parseInt(options.type);
    var queryB = JSON.parse(options.transParams);
    if (type) {
      that.setData({
        toCoListSelect: false
      });
      app.getload('/wx/console/api/getLatestClothList', {
        cloth_type_ids: that.data.idsStr,
        time: time
      }, that);
    } else {
      that.setData({
        toCoListSelect: true
      });
    }
    that.dealIds(queryB);
    that.setData({
      queryB: queryB
    });
    console.log("queryB", queryB);
  },
  // 扫一扫关联
  sanNext: function () {
    app.scan_Code(this); //调用扫码功能 
  },
  // 确定批量关联
  yesCo: function () {
    var that = this;
    app.postload('/wx/console/api/clothTypeRelBuild', {
      cloth_ids: that.data.rfIdsStr,
      cloth_type_ids: that.data.idsStr
    }, that);
    console.log('确定批量关联参数', that.data.rfIdsStr, that.data.idsStr);
    setTimeout(function () {
      wx.navigateBack({
        delta: 2
      });
    }, 2000);
  },
  load_win: function (urls, result) {
    if (urls == '/wx/console/api/clothTypeRelBuild') {
      if (result.errorCode == 0) {
        app.show_Toast(result.errorDesc, 'none', 1500);
      }
    }
    if (urls == 'scan_Code') { //扫码成功-datas二维码扫码信息
      var rfIdsStr = "";
      var that = this;
      var rfIdsArr = that.data.rfIdsArr;
      if (rfIdsArr.indexOf(result) > -1) {
        app.show_Toast('此件已关联', 'none', 1500);
        return false;
      }
      rfIdsArr.push(result);
      that.data.count += 1;
      that.updateData(result, true);
      rfIdsStr = that.data.rfIdsArr.join(",");
      that.setData({
        rfIdsStr: rfIdsStr,
        count: that.data.count
      });
    }
    if (urls == "/wx/console/api/getLatestClothList") {
      console.log("所有已关联列表：", result);
      if (result.errorCode != 0) {
        app.show_Toast(result.errorDesc, 'none', 1500);
      } else {
        this.updateData(result.data);
      }
    }
  },
  // 处理参数IDs
  dealIds: function (dealIds) {
    var idsArr = [];
    var idsStr = "";
    var keysArr = ["Brand", "Type", "Material", "Size", "Craft", "Woven", "Density"];
    keysArr.map(item => {
      if (dealIds[item]) {
        var itemId = dealIds[item].id;
        if (itemId && itemId != "" && itemId != undefined) {
          idsArr.push(itemId);
        }
      }
    });
    idsStr = idsArr.join(",");
    this.setData({
      idsStr: idsStr
    });
  },
  // 数据更新
  updateData: function (data, isScan) {
    var itemObj = {};
    var dataInit = this.data.queryB;
    var create_time = tools.dateFormat(new Date());
    for (var key in dataInit) {
      itemObj[key] = dataInit[key].desc;
    }
    if (isScan) {
      itemObj.id = data;
      itemObj.create_time = create_time;
    }
    this.data.itemDataArr.push(itemObj);
    this.setData({
      itemDataArr: this.data.itemDataArr
    });
    console.log("itemDataArr:", this.data.itemDataArr);
  }
});