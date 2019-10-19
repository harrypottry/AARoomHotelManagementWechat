var app = getApp();
Page({
  data: {
    itemList: {},
    keyArr: []
  },
  onLoad: function (options) {
    app.postload('/wx/console/api/getClothByEmpType', {}, this);
  },
  load_win: function (urls, result) {
    if (urls == '/wx/console/api/getClothByEmpType') {
      console.log('查看布草详细信息结果:', result);
      result.data = {};
      for (var i in result.name) {
        var x = {};
        x['num'] = result.num[i];
        x['status'] = result.status[i];
        for (var j of result.name[i]) {
          x[j.cloth_kind] = j.desc;
        }
        result.data[i] = x;
      }
      this.setData({
        itemList: result.data
      });
    }
  }
});