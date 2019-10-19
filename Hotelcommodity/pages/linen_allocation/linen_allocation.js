const app = getApp()
Page({
  data: {
    room_id:'',//房间id
    room_name:'',//房间号
    mission_desc: '',//任务类型
    mission_id:'',//任务id 
    roomData: [],//房间布草信息    
    listId:'',//扫码index
    cloth_id:'',//当前扫码id
    cloth_type_list:'',//布草类型对应id
    // clothIdList:[]//扫码成功的二维码集合
  },
  onLoad: function (options) {    
    this.setData({
      room_id: wx.getStorageSync('room_id'),
      room_name: wx.getStorageSync('room_name'),
      mission_desc: wx.getStorageSync('mission_desc'),      
      mission_id: wx.getStorageSync('id')         
    })
    app.postload('/wx/console/api/getEmpClothNumList', {room_type_id: wx.getStorageSync('room_type_id'), mission_id:this.data.mission_id, room_id: this.data.room_id}, this);//任务匹配布草列表
  },
  //扫一扫配置
  scanbtn: function (e) {
    app.scan_Code(this);//调用扫码功能 
    this.setData({        
        listId: e.currentTarget.dataset.index,
        cloth_type_list: e.currentTarget.dataset.id
      })    
  },  
  load_win: function (urls, datas) {
    if (urls == '/wx/console/api/getEmpClothNumList') {//任务匹配布草列表 
      var lengths = 0;
      for (var i of datas) {
        if (i.clearNum == i.num) {lengths++;}//判断扫码与需要是否相同
        i['nums'] = i.clearNum;
        i['id']=[];        
        for (var j of i.clothTypeList) {
          i[j.cloth_kind] = j.desc;
          i['id'].push(j.id);
        }
      }
      if (lengths == datas.length) {        
        wx.redirectTo({
          url: '../../pages/consumables/consumables'
        })
      }else{
        this.setData({
          roomData: datas
        });
      }      
    }
    if (urls == '/wx/console/api/configDepartmentCloth') {///wx/console/api/conventClothStatus          
      if (datas.errorCode == '0'){
        var roomdata = this.data.roomData;
        // var cloth_ids = this.data.clothIdList;        
        roomdata[this.data.listId].nums++;             
        // cloth_ids.push(this.data.cloth_id);        
        this.setData({
          roomData: roomdata,
          // clothIdList:cloth_ids
        })
        var lengths=0;
        for (var i of roomdata){
          if (i.nums==i.num){
            lengths++;
          }
        }
        if (lengths == roomdata.length){          
          wx.redirectTo({
            url: '../../pages/consumables/consumables'
          })
        }        
      } else if (datas.errorCode == '50104'){
        var that=this;
        wx.showModal({
          content: '您扫描的是脏布草，是否将此布草设置为新布草',
          success(res) {
            if (res.confirm) {
              app.postload('/wx/console/api/conventClothStatus', { cloth_id: this.data.cloth_id, room_id:this.data.room_id, mission_id: this.data.mission_id}, that);//将房间内脏布草设置为干净
            } else if (res.cancel) {
              //console.log('用户点击取消')
            }
          }
        })
       }else{
          //提示
          app.show_Toast(datas.errorDesc, 'none', 1500);
       }
    }
    if (urls == '/wx/console/api/conventClothStatus') {
        // console.log(datas);
      if (datas.errorCode == '0'){
        app.show_Toast('该布草已转换成功', 'none', 1500);
      }else{
        app.show_Toast('未转换成功，请重新操作', 'none', 1500);
      }
    }
    if (urls == 'scan_Code') {//扫码成功-datas二维码扫码信息      
      this.setData({
        cloth_id:datas
      })
      app.postload('/wx/console/api/configDepartmentCloth', { cloth_id: datas, cloth_type_list: this.data.cloth_type_list, room_id: this.data.room_id, mission_id: this.data.mission_id}, this);//扫一扫配置
    }  
  }  
})