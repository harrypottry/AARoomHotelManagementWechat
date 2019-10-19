const app = getApp()
Page({
  data: {
    copytabBar: [
      { page: 'warehouse',text: '库房', imgurl: '/images/warehouse.png', onimgurl: '/images/warehouses.png' },
      { page: 'room', text: '房间', imgurl: '/images/room.png', onimgurl: '/images/rooms.png' },
      { page: 'factory',text: '洗衣厂', imgurl: '/images/factory.png', onimgurl: '/images/factorys.png' },
      { page: 'aunt', text: '保洁', imgurl: '/images/aunt.png', onimgurl: '/images/aunts.png' }
    ],
    page:'warehouse',
    warehouse: [],//库房
    room: [],//房间
    factory: [],//洗衣厂
    aunt: []//保洁
  },
  onLoad: function (options){    
  },
  copytabBar: function (e) {//页面切换    
    this.setData({
      page: e.currentTarget.dataset.page,     
    })
  },
  //页面跳转
  BtnTo: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url//跳转页
    });
    wx.setStorageSync('publicA67810', e.currentTarget.dataset.id)//公用页id    
    if (e.currentTarget.dataset.data){      
      wx.setStorageSync('publicA67810data', e.currentTarget.dataset.data)//公用页data
      wx.setStorageSync('publicA67810name', e.currentTarget.dataset.name)//公用页name
    }else{
      wx.setStorageSync('possessor_id', e.currentTarget.dataset.possessor_id)//公用页data
      wx.setStorageSync('aunt_cargo_name', e.currentTarget.dataset.name)//公用页name
    }
  }, 
  onShow: function(){
    app.getload('/wx/console/api/getStorageCloths', {}, this);//库房
    app.getload('/wx/console/api/getRoomClothStatusAndNum', {}, this);//房间    
    app.getload('/wx/console/api/getLaundryCloths', {}, this);//洗衣厂
    app.getload('/wx/console/api/getEmpCloth', {}, this);//保洁
  }, 
  load_win: function (urls, datas) {
    if(urls == '/wx/console/api/getStorageCloths') {//库房
      for (var i in datas.data) {
        for (var j of datas.data[i].clothTypes) {
          datas.data[i][j.cloth_kind] = j.desc;
        }
      }      
      this.setData({
        warehouse:datas.data
      })     
    }
    if (urls == '/wx/console/api/getRoomClothStatusAndNum') {//房间      
      this.setData({
        room:datas.data
      })           
    }
    if (urls == '/wx/console/api/getLaundryCloths') {//洗衣厂 
      for (var i in datas.data) {
        for (var j of datas.data[i].clothTypes) {
          datas.data[i][j.cloth_kind] = j.desc;
        }
      }
      this.setData({
        factory:datas.data
      })       
    }
    if (urls == '/wx/console/api/getEmpCloth') {//保洁      
      datas.data['data'] = [];           
      for (var i in datas.data.num) {
        var rem = {};
        rem['id'] = i;
        rem['num'] = datas.data.num[i];
        rem['name'] = datas.data.desc[i];
        datas.data.data.push(rem);
      }
      this.setData({
        aunt:datas.data.data
      })
    }        
  },
})