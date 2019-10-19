const app = getApp()
Page({
  data: {
    page_message: [//0:新订布草页、1：阿姨归库页、2：洗衣厂归库页、3：送洗页
      { pageid: 'new_linen', pagename: '新布草入库', affirmbtn: '入库', affirm_url:'/wx/console/api/initHotelCloth'},
      { pageid:'aunt_return', pagename: '阿姨归库',affirmbtn: '归库', affirm_url:'/wx/console/api/confirminto'},
      { pageid: 'wash_return', pagename: '洗衣厂归库', affirmbtn: '归库', affirm_url: '/wx/console/api/receiveFromLaundry'},
      { pageid: 'send_wash', pagename: '送洗', affirmbtn: '送洗', affirm_url: '/wx/console/api/sendToLaundry'}
      ],
    pageId:'',//显示页
    pagename:'',
    affirmbtn:'',
    affirm_url: '',//确认按钮url
    num:'0',//统计扫码成功数量
    clothIdList:[],//扫码成功的二维码集合
    clothId:'',//当前扫码成功二维码
    standby:[]//扫码成功存放当前页面信息         
  },
  onLoad:function(options){
    var pagenew = this.data.page_message[wx.getStorageSync('publicA134')];
    this.setData({
      pageId:pagenew.pageid,
      pagename:pagenew.pagename,
      affirmbtn:pagenew.affirmbtn,
      affirm_url:pagenew.affirm_url      
    })
  },  
  //扫一扫入库
  scanruku: function (e) {
    app.scan_Code(this);//调用扫码功能    
  },
  affirmBtn:function(){//确认按钮
    var that=this;   
    if(this.data.num=='0'){
      app.show_Toast('请先添加布草', 'none', 1400);
    }else{
      wx.showModal({        
        content: '确认所有布草' +that.data.affirmbtn+'吗',
        success: function (res) {
          if (res.confirm) {
            app.show_Toast('布草' + that.data.affirmbtn + '中','loading',3000);
            app.postload(that.data.affirm_url, {cloth_ids:that.data.clothIdList},that);//确认按钮请求
          } 
        }
      })      
    }
  },
  load_win: function (urls, datas) {    
    if (urls == this.data.affirm_url) {//确认按钮请求      
      if (datas.errorCode=='0'){
        app.show_Toast('布草'+this.data.affirmbtn+'成功', 'success', 1400);         
        this.setData({
          standby:[],
          num:'0',
          clothIdList:[]
        })
      }else{
        app.show_Toast('布草'+this.data.affirmbtn+'失败,请重新操作', 'none', 1400); 
      } 
    }
    if (urls == '/wx/console/api/getClothView') {//扫码获取布草详情 
      if (datas.errorCode == '0'){         
        var obtain_standby = this.data.standby;//获得扫码成功存放当前页面信息
        var obtain_num = this.data.num;
        var obtain_clothIdList = this.data.clothIdList;
        var add = '';//暂未将新布草加入页面
        for (var i of obtain_standby) {
          if (i.clothTypeIds == datas.data.clothTypeIds && i.status == datas.data.status) {
            i.num++;
            add = '1'; //已将新布草加入页面
          }
        }
        if (add == '') {//未将新布草加入页面
          for (var j of datas.data.clothTypes) {
            datas.data[j.cloth_kind] = j.desc;
          }
          datas.data['num'] = 1;
          obtain_standby.push(datas.data);
        }
        obtain_num++;
        obtain_clothIdList.push(this.data.clothId);        
        this.setData({
          standby: obtain_standby,
          num: obtain_num,
          clothIdList: obtain_clothIdList
        })
      }else{
        app.show_Toast('操作失败,请重新操作', 'none', 1400);
      }                                   
    }
    if (urls == 'scan_Code') {//扫码成功-datas二维码扫码信息      
      for (var i of this.data.clothIdList) {
        if (datas == i) {
          app.show_Toast('此二维码已扫过', 'none', 1400);
          return;
        }
      }
      app.getload('/wx/console/api/getClothView', {id: datas}, this);//扫码获取布草详情
      this.setData({
        clothId: datas
      })
    }
  }  
})