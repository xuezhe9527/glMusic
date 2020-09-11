// pages/recommendSong/recommendSong.js
import request from '../../../utils/request.js'
import PubSub from 'pubsub-js'
Page({

   /**
    * 页面的初始数据
    */
   data: {
      day:"",
      month:"",
      recommendList:[],
      currentIndex:null,
   },
   toSongPage(event){
      let {id,index} = event.currentTarget.dataset
      //在跳转至song页面之前应该保存下当前的index
      this.setData({
         currentIndex:index
      })
      wx.navigateTo({
         // url: '/pages/song/song',
         url: '/packageSong/pages/song/song?songId='+id
      })
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: async function (options) {
      PubSub.subscribe("switchSong",(msg,data)=>{
         // console.log("11",data)
         let { currentIndex, recommendList} = this.data
         if(data==="next"){
            if(currentIndex === recommendList.length-1){
               currentIndex = 0
            }else{
               currentIndex++
            }           
         }else{
            if(currentIndex===0){
               currentIndex = recommendList.length-1
            }else{
               currentIndex--
            }          
         }

         this.setData({
            currentIndex
         })
         //发布消息，广播切换之后的id
         PubSub.publish("changeAudioId",recommendList[currentIndex].id)
      })
      this.setData({
         day:new Date().getDate(),
         month:new Date().getMonth() + 1
      })
      if(!wx.getStorageSync("cookies")){
         wx.showModal({
            title: '请注意',
            content: '该页面的功能需要登陆后才能使用',
            cancelText:"返回首页",
            confirmText:"去登陆",
            success(res){
               if(res.confirm){
                  wx.navigateTo({
                     url: '/pages/login/login',
                  })
               }else{
                  wx.navigateBack()
               }
            }
         })
      }
      let result = await request('/recommend/songs')
      this.setData({
         recommendList:result.recommend
      })
   },

   /**
    * 生命周期函数--监听页面初次渲染完成
    */
   onReady: function () {
      
   },

   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function () {

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