const app = getApp()
Page({
  data: {    
    pageId:'',//显示页//2:库房、0：房间、3：洗衣厂、1：保洁子页
    pagename:'',
    // pagedata:'',
    standby:[]//当前页面数组          
  },
  onLoad: function (options) {
       
  },
  onShow: function () {
    var pageid = wx.getStorageSync('publicA67810');
    this.setData({
      pageId: pageid,
      pagename: wx.getStorageSync('publicA67810name'),           
    })
    if (pageid=='0'){//房间子页面
      app.getload('/wx/console/api/getRoomClothDetail', { room_name: wx.getStorageSync('publicA67810data')}, this); 
    }else{
      app.getload('/wx/console/api/getClothsByClothTypeAndEmp', { typeIds: wx.getStorageSync('publicA67810data'), possessor_type: pageid, possessor_id: wx.getStorageSync('possessor_id') }, this); 
    }  
       
  },
  load_win: function (urls, datas) {
    if (urls =='/wx/console/api/getClothsByClothTypeAndEmp'){
      if (datas.errorCode == '0') {
        datas = datas.data;
        for (var i in datas) {
          for (var j of datas[i].clothTypes) {
            datas[i][j.cloth_kind] = j.desc;
          }
        }
        this.setData({
          standby: datas
        })
      } else {
        app.show_Toast('加载失败，请重新加载', 'none', 1400);
      }     
    } 
    if (urls == '/wx/console/api/getRoomClothDetail') {//房间子页面      
      for (var i in datas) {
        for (var j of datas[i].cloth_type_brand_size_material) {
          datas[i][j.cloth_kind] = j.desc;
        }
      }
      this.setData({
        standby: datas
      })
    }
  }
})