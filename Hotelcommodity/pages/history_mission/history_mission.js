const app = getApp()
Page({
  data:{
    pageNo:'1',//页码
    pageSize:'20',//每页多少条
    history:[],
    more:''//共多少页
  },
  onShow: function () {
    app.postload('/wx/console/api/showHistoryMissionByEmp', { pageSize: this.data.pageSize,pageNo:'1'},this);// 保洁员历史任务列表
  },
  btnmore:function(){
    var pageno = this.data.pageNo;
    if (pageno<this.data.more){
      pageno++;
      this.setData({
        pageNo: pageno
      }) 
      app.postload('/wx/console/api/showHistoryMissionByEmp', {pageSize:this.data.pageSize,pageNo:this.data.pageNo}, this);// 保洁员历史任务列表      
    }
  },
  load_win: function (urls, datas) {//请求成功后
    if (urls == '/wx/console/api/showHistoryMissionByEmp') {// 自动登录请求后--失败与否--请求消耗品 
      if (this.data.pageNo=='1'){//首次加载
        this.setData({
          history: datas.data,
          more: Math.ceil(datas.count / this.data.pageSize)
        })        
      }else{        
        datas.data = this.data.history.concat(datas.data);         
        this.setData({
          history: datas.data          
        }) 
      } 
      console.log(this.data.history)   
    }
  }
})