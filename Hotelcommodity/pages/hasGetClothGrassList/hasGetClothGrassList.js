var app = getApp();
Page({
  data: {    
    itemList:[],//页面列表数组    
    clothIdList: [],//扫码成功的二维码集合
    clothId:''//当前扫码成功二维码    
  },
  onLoad: function (options) {
    app.postload('/wx/console/api/suggestReceiveCloth', { room_idlist: options.roomIds}, this);    
  },
  // 扫一扫领取布草
  scanToGetClothGrass: function () {
    app.scan_Code(this);//调用扫码功能
  },
  // 完成领取返回首页
  toHomePage: function () {    
    if (this.data.clothIdList.length!=0){
      app.postload('/wx/console/api/scanclothreceive', { cloth_id_list: this.data.clothIdList},this);
    }else{
      app.show_Toast('请先扫描布草', 'none', 1400);
    }     
  },
  load_win: function (urls, result) {    
    if (urls == '/wx/console/api/suggestReceiveCloth') {
      result.data={};
      var x;
      for(var i in result.name) {
        x={};
        x['num'] = result.num[i];
        x['nums'] = 0;//初始化已领取数量为0
        for (var j of result.name[i]) {
          x[j.cloth_kind] = j.desc;
        }
        result.data[i]=x;
      }
      this.setData({
        itemList: result.data
      })
    }
    if (urls == '/wx/console/api/getClothView') {      
      if (result.errorCode == '0') {
        var obtain_standby = this.data.itemList;//获得扫码成功存放当前页面信息        
        var obtain_clothIdList = this.data.clothIdList;
        var add = '';//暂未将新布草加入页面        
        for (var i in obtain_standby) {
          if (result.data.clothTypeIds==i) {
            obtain_standby[i].nums++;            
            add = '1'; //已将新布草加入页面
          }
        }
        if(add =='') {//未将新布草加入页面
          x={};
          for (var j of result.data.clothTypes) {
            x[j.cloth_kind] = j.desc;
          }
          x['nums'] = 1;
          x['num'] = 0;
          obtain_standby[result.data.clothTypeIds]=x;          
        }        
        obtain_clothIdList.push(this.data.clothId);
        this.setData({
          itemList: obtain_standby,          
          clothIdList: obtain_clothIdList
        })
      } else {
        app.show_Toast('操作失败,请重新操作', 'none', 1400);
      }
    }
    if (urls == '/wx/console/api/scanclothreceive') {      
      if (result.errorCode == 0) {
        app.show_Toast('完成领取', 'none', 1400);
        setTimeout(function () {
          wx.navigateBack({
            delta: 2
          });
        }, 1400);
      }else{
        app.show_Toast('操作失败,请重新操作', 'none', 1400);
      }
    }
    if(urls == 'scan_Code') {//扫码成功-datas二维码扫码信息
      for (var i of this.data.clothIdList) {
        if (result == i) {
          app.show_Toast('此二维码已扫过', 'none', 1400);
          return;
        }
      }
      app.getload('/wx/console/api/getClothView', { id: result },this);
      this.setData({
        clothId:result
      })
    }
  },  
});
// var app = getApp();
// Page({
//   data: {    
//     itemList:[],//页面列表数组
//     keyArr: []//已扫描布草id集合
//   },
//   onLoad: function (options) {
//     app.postload('/wx/console/api/suggestReceiveCloth', { room_idlist: options.roomIds}, this);
//     // console.log('options:', options);
//     // var roomIds = options.roomIds;
//     // this.setData({
//     //   roomIds: roomIds
//     // });
//     // if (roomIds && roomIds != undefined) {
      
//       // console.log('此次已经领取的布草参数room_idlist:', roomIds);
//     // }
//   },
//   // 扫一扫领取布草
//   scanToGetClothGrass: function () {
//     app.scan_Code(this);//调用扫码功能  
//     // var that = this;
//     // // 扫出产品url,取出产品id +++ 改
//     // wx.scanCode({
//     //   onlyFromCamera: true,
//     //   success(res) {
//     //     console.log('saoma:', res);
//     //     app.getload('/wx/console/api/getClothView', {
//     //       id:res.result
//     //     },that);
//     //     console.log('此次扫码布草参数id:', res.result);
//     //   }
//     // });
//   },
//   // 完成领取返回首页
//   toHomePage: function () {
//     var that = this;
//     console.log('完成领取返回首页');
//     // 请求接口 +++ 加
//     app.postload('/wx/console/api/scanclothreceive', {
//       cloth_id_list: that.data.keyArr
//     }, that);
//     console.log('返回首页参数room_id_list', that.data.keyArr);
//     setTimeout(function () {
//       wx.navigateBack({
//         delta: 2
//       });
//     }, 2500);
//   },
//   load_win: function (urls, result) {
//     var that = this;
//     if (urls == '/wx/console/api/suggestReceiveCloth') {
//       for (var i in result.name){
//         result.name[i]['num'] = result.num[i];
//         result.name[i]['nums'] =0;//初始化已领取数量为0
//         for (var j of result.name[i]){          
//           result.name[i][j.cloth_kind] = j.desc;
//         }       
//       }
//       this.setData({
//         itemList: result.name
//       })
//       console.log(this.data.itemList)
//       // console.log('此次建议领取的布草结果:', result);
//       // 处理已领取列表数据:1.将name的key和num的key相匹配，渲染页面 2.扫码找匹配，找到增加数量；找不到新增一条数据    
//       // that.dealData(result, false);
//     }
//     if (urls == '/wx/console/api/getClothView') {
//       console.log('此次扫码布草返回结果:', result);
//       var resSweep = {
//         name: {},
//         num: {}
//       };
//       var type = result.data.clothTypeIds;
//       var clothTypesArr = result.data.clothTypes;
//       resSweep.name[type] = clothTypesArr;
//       resSweep.num[type] = 0;
//       console.log('resSweep:', resSweep);
//       // that.dealData(resSweep, true);
//       console.log('扫码数据处理过');
//     }
//     if (urls == '/wx/console/api/scanclothreceive') {
//       console.log('完成领取返回首页结果:', result);
//       if (result.errorCode == 0) {
//         app.show_Toast('完成领取', 'none', 1400);
//       }
//     }
//     if (urls == 'scan_Code') {//扫码成功-datas二维码扫码信息      
//       app.getload('/wx/console/api/getClothView', {id:result},that);
//     }
//   },
//   // 重新组装data数据
//   dealData: function (result, isSweep) {
//     var that = this;
//     for (var key in result.num) {
//       var num = result.num[key];
//       var name = result.name[key];
//       var itemList = that.data.itemList;
//       var keyArr = that.data.keyArr;
//       var descArr = [];
//       if (result.name[key]) {
//         if (itemList[key]) {
//           itemList[key].count++;
//         } else {
//           keyArr.push(key);
//           name.map(item => {
//             if (item.cloth_kind == "Type") {
//               descArr.push(item.desc);
//             }
//             if (item.cloth_kind == "Size") {
//               descArr.push(item.desc);
//             }
//             if (item.cloth_kind == "Material") {
//               descArr.push(item.desc);
//             }
//           });
//           itemList[key] = {};
//           itemList[key].count = isSweep ? 1 : 0;
//           itemList[key].name = name;
//           itemList[key].descArr = descArr;
//           itemList[key].num = num;
//         }
//       }
//       var newData = {
//         itemList: itemList,
//         keyArr: keyArr,
//       };
//       console.log("newData: ", newData);
//       that.setData(newData);
//     }
//   }
// });