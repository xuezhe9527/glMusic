// pages/personal/personal.js
import request from '../../utils/request.js'
Page({

   /**
    * 页面的初始数据
    */
   data: {
      moveDistance:0,
      transResult:"none",
      playList:null,
      userInfo:{}
   },
   //手指按下
   handleStart(event){
      // console.log(event)
      // console.log(event.touches[0].clientY)
      this.setData({       
         transResult: "none"
      })
      this.startY = event.touches[0].clientY
   },
   //手指移动
   handleMove(event){
      this.moveY = event.touches[0].clientY
      let moveDistance = Math.floor(this.moveY - this.startY)
      if (moveDistance <= 0) return
      if (moveDistance > 80) {
         moveDistance = 80
      }
      this.setData({
         moveDistance,
      })
   },
   //手指抬起
   handleEnd(){      
      this.setData({
         moveDistance:0,
         transResult: "transform 1s linear" //回去的时候使用动画效果
      })
   },
    //跳转至登录页面
   toLoginPage(){
      // 如果已经登陆 不允许再跳转至登陆页面
      if(this.data.userInfo.nickname)return;
      wx.navigateTo({
         url: '/pages/login/login',
      })
   },
   
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad:  function (options) {
      // 不应该在onload请求，因为onload只在初始渲染时执行一次
      // wx.getStorage({
      //    key: 'userInfo',
      //    success: async ({data})=> {
      //       let objData = JSON.parse(data)
      //       console.log(objData)
      //       this.setData({
      //          userInfo:objData
      //       })
      //       let res = await request('user/record', { uid:objData.userId,type:1} )
      //       console.log(res)
      //    },
      // })
   },

   /**
    * 生命周期函数--监听页面初次渲染完成
    */
   onReady: function () {

   },

   /**
    * 生命周期函数--监听页面显示
    */
   onShow: async function () {
      let userInfo = JSON.parse(wx.getStorageSync("userInfo") ||"{}")
      //   console.log(result)
      this.setData({
         userInfo
         })
      if(userInfo){
         let res = await request('/user/record',{uid:userInfo.userId,type:0})
         // console.log(res)
         this.setData({
            // playList:res.weekData  //本周播放记录
            playList:res.allData         //所有播放记录
         })
      }

   },

   /**
    * 生命周期函数--监听页面隐藏
    */
   onHide: function () {

   },

   /**
    * 生命周期函数--监听页面卸载
    */
   onUnload: function () {

   },

   /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
   onPullDownRefresh: function () {

   },

   /**
    * 页面上拉触底事件的处理函数
    */
   onReachBottom: function () {

   },

   /**
    * 用户点击右上角分享
    */
   onShareAppMessage: function () {

   }
})