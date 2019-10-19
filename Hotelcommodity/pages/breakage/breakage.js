// pages/breakage/breakage.js
const app = getApp()
Page({
  data: {
    warelist:''
  },
  onLoad: function (options) {    
  },
  onShow: function () {
    app.getload('/wx/console/api/getClothErrors', {}, this);//布草报损列表
  },
  add:function(){
    wx.navigateTo({
      url:'../../pages/breakageing/breakageing'//跳转设置报损信息页--添加新报损
    });
  },  
  load_win:function (urls, datas) {
    if (urls == '/wx/console/api/getClothErrors'){      
      if (datas.errorCode==0){
        datas=datas.data;        
        for(var i of datas){          
          for (var j of i.clothView.clothTypes){
            i.clothView[j.cloth_kind] = j.desc;
          }
        }
      }      
      this.setData({
        warelist:datas
      })
    }
  }
})