// pages/video/video.js
import request from '../../utils/request.js'
import videoListTemp from  '../../utils/videoListTemp.js' 
Page({

   /**
    * 页面的初始数据
    */
   data: {
      videoGroup:[],
      videoList:[],
      id:0,
      isFinish:false,
      vid: "videoC55D42DD52176B4A8170860FBC4C2018" //上一个视频的videoid
   },

   //点击图片播放
   handleImageTap(event){
      let vid = event.target.id
      this.setData({vid})
      let videoContext = wx.createVideoContext(vid)
      videoContext.play()
   },
   //点击video播放逻辑(这个方法可以与handleImageTap相结合，这个方法的功能基本用不上了)
   handlePlay(event){
      // console.log(event)
      let vid = event.target.id
      this.videoContext && vid !== this.data.vid && this.videoContext.pause() 
      this.setData({
         vid
      })
      this.videoContext = wx.createVideoContext(vid)     
   },
   //下拉到底的操作
   scrollToLower(){
      console.log("scrollToLower")   
      wx.showLoading({
         title: '正在努力加载中',
      })
      //这里只做测试使用（数据合并一下）,一般有自己单独的接口
      setTimeout(()=>{
         this.setData({
            videoList: [...this.data.videoList, ...videoListTemp]
         })
         wx.hideLoading()
      },2000)
   },
   //下拉刷新执行的操作
   pullUpdate(){
      console.log("pullUpdate")
      this.getVideoList(this.data.id)
   },
   //导航上面的按钮切换
   changeId(event){
      let { id } = event.target.dataset
      this.setData({
         id
      })
      this.getVideoList(id)
   },
   //获取某个id下视频列表的方法
   async getVideoList(id){ 
      //请求之前弹出加载中
      wx.showLoading({
         title: '正在为您加载，请稍候',
      })  
      let videoListData = await request("/video/group", { id })   
      setTimeout(wx.hideLoading, 1000) //便于查看效果
      // wx.hideLoading() //这样就可以隐藏
      this.setData({
         videoList: videoListData.datas,
         isFinish: false
      })
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: async function (options) {
      // console.log(videoListTemp);
      this.setData({videoList : []})  //每次加载的时候先清空原有的数据（用户体验）
      let result = await request('/video/group/list')  
      
      let videoGroup = result.data.slice(0,14)
      let id = videoGroup[0].id
      this.setData({
         videoGroup,
         id
      })
      this.getVideoList(id)    
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
   onShareAppMessage: function (shareObj) {
      // console.log(shareObj)
      let { imageurl,title } = shareObj.target.dataset
      
      if(shareObj.from === "button"){
         return{
            title,
            imageUrl:imageurl,
            path:'/pages/video/video'
         }
      }else{
         console.log("小程序左上角全局页面分享")
      }
   }
})