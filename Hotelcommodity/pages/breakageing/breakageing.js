const app = getApp()
Page({
  data: {  
    arr: [
      {id:'Lost', name: '丢失' },
      {id: 'Broken', name: '破损' },
      {id: 'QRBroken', name: '二维码破损' },
    ],
    arr_name:'丢失',
    arr_id: 'Lost',
    cloth_id:'',//二维码id
    comment:'',//备注
  },
  bindPickerChange: function (e) {
    this.setData({
      arr_name: this.data.arr[e.detail.value].name,
      arr_id: this.data.arr[e.detail.value].id
    })
  },
//输入布草id
  voteNums: function (e) {
    this.setData({
      cloth_id: e.detail.value
    })
  },
  //报损类型
  bindinput: function (e) {
    this.setData({
      comment: e.detail.value
    });    
  },
  //扫一扫报损
  scandbs:function(){
    app.scan_Code(this);//调用扫码功能 
  },
  confirm_lose: function (e) {
    var that = this;    
    if (that.data.cloth_id == null){
      app.show_Toast('报损ID和备注信息不可为空', 'none', 1500); 
      return;    
    }else{      
        wx.showModal({
        content: '确认将此布草转为报损状态',
        success(res) {
          if (res.confirm) {           
            app.postload('/wx/console/api/postClothError', {cloth_id: that.data.cloth_id, comment: that.data.comment, type: that.data.arr_id}, that);//新布草报损
          } else if (res.cancel) {            
          }
        }
      })
    }
    
  },  
  load_win: function (urls, datas) {          
    if (urls == '/wx/console/api/postClothError'){      
      if (datas.errorCode == '0'){        
        app.show_Toast('同步数据库成功', 'none', 1500);
        setTimeout(function () {
          wx.redirectTo({
            url: '../../pages/breakage/breakage'
          })
        }, 1500)
      } else if (datas.errorCode == '30101'){
        app.show_Toast('二维码数据错误', 'none', 1500);
      }else{        
        app.show_Toast('提交失败，请重新操作', 'none', 1500);
      }            
    }
    if (urls == 'scan_Code') {//扫码成功-datas二维码扫码信息
      this.setData({
        cloth_id:datas
      })
    }
  } 
})