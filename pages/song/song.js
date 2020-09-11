// pages/song/song.js
import request from '../../utils/request.js'
import PubSub from 'pubsub-js'
import moment from 'moment'

let appInstance = getApp()
Page({

   /**
    * 页面的初始数据
    */
   data: {
      songId:null,
      songObj:{},
      isplaying:false,
      musicUrl:'',
      // currentTime:"00:00", //使用moment形式
      currentTime:0,          //使用wxs的filter
      durationTime:"",
      scale : 0
   },
   //点击按钮的播放操作
   async handlePlay(){
      this.setData({
         isplaying: !this.data.isplaying,
      })
      // /song/url ? id = 33894312 
      // let musicUrlData = await request('/song/url',{id:this.data.songId})
      // this.setData({
      //    musicUrl:musicUrlData.data[0].url,
      //    isplaying: !this.data.isplaying
      // })
      // 最后一个bug 点击播放时需要判断当前是否有歌曲正在播放（即又musicUrl，有的话就不应该再发送请求了）
      if(!this.data.musicUrl){
         await this.getMusicUrl();
      }
      

      // let songManager = wx.getBackgroundAudioManager() 
      //       // paused 是否在暂停状态,且首次读取的时候是undefined
      // // if (songManager.paused || songManager.paused === undefined) { 这种判断逻辑也成立
      // if (songManager.paused || typeof songManager.paused ==="undefined"){   
      //    songManager.src = this.data.musicUrl
      //    songManager.title = this.data.songObj.name
      // }else{         
      //    songManager.pause()
      // }

      this.changePlayState();
      // 提示报错，
      //  若需要小程序在退到后台后继续播放音频，你需要在 app.json 中配置 requiredBackgroundModes 属性，详见: https://developers.weixin.qq.com/miniprogram/dev/framework/config.html#requiredbackgroundmodes
      // "requiredBackgroundModes": ["audio"]

      // this.setData({
      //    isplaying:!this.data.isplaying
      // })
   },
   //改变歌曲的播放状态
   changePlayState(){
      // 1.在刚进入播放状态就应该保存播放的歌曲id和播放状态
      // 2.每次加载进来的时候判断下是否应该播放
      
      let songManager = wx.getBackgroundAudioManager()
      let{isplaying,songId,musicUrl,songObj} = this.data
      if (isplaying) {
         songManager.src = musicUrl
         songManager.title = songObj.name
         
         appInstance.globalData.musicId = songId
         appInstance.globalData.playState = true
      } else {
         songManager.pause()
         appInstance.globalData.playState = false
      }
   },
   //给当前背景音乐绑定监听事件
   addAudioListener(){
      //即使多次获取的是同一个backgroundAudioManager
      let songManager = wx.getBackgroundAudioManager()     
      songManager.onPlay(()=>{
         if(appInstance.globalData.musicId === this.data.songId){
            this.setData({
               isplaying:true
            })
         }
         appInstance.globalData.playState = true
      })
      songManager.onPause(()=>{
         if (appInstance.globalData.musicId === this.data.songId) {
            this.setData({
               isplaying: false
            })
         }
         appInstance.globalData.playState = false
      })
      songManager.onStop(()=>{
         if (appInstance.globalData.musicId === this.data.songId) {
            this.setData({
               isplaying: false
            })
         }
         appInstance.globalData.playState = false
      })
      //当背景音频时间更新时会触发
      songManager.onTimeUpdate(()=>{
         let {currentTime} = songManager
         let {dt} = this.data.songObj
         let scale = currentTime*1000*100 / dt   
                                       //毫秒和百分比换算
         console.log(currentTime)
         // console.log(moment(currentTime*1000).format("mm:ss"))
         //使用momentjs设置时间格式
         this.setData({
            currentTime, //将要用timeFilter处理的事件
            // currentTime:moment(currentTime*1000).format("mm:ss"), //moment方式设置的时间
            scale
         })
      })
      //当当前歌曲播放完毕切换下一首
      songManager.startTime = 185;//这里为了节省测试时间
      songManager.onEnded(()=>{
         PubSub.publish("switchSong","next")
      })
   },
   //获取播放歌曲的详细信息
   async getMusicDetail(){
      
      //请求歌曲的详细信息
      let result = await request('/song/detail',{ids:this.data.songId})
      // console.log(result)
      this.setData({
         songObj:result.songs[0],
         // durationTime:result.songs[0].dt
         durationTime: moment(result.songs[0].dt).format("mm:ss")
      })
      // 动态设置小程序的标题为当前歌曲的名字
      wx.setNavigationBarTitle({
         title: this.data.songObj.name
      })
      return Promise.resolve()
   },
   //获取播放歌曲有的url地址
   async getMusicUrl(){
      let musicUrlData = await request('/song/url', { id: this.data.songId })
      this.setData({
         musicUrl: musicUrlData.data[0].url,
         // isplaying: !this.data.isplaying
      })
      return Promise.resolve()
   },
   switchSong(event){
      // console.log(event.currentTarget)
      let { id } = event.currentTarget
      PubSub.publish("switchSong",id)
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: async function (options) {
      
      this.addAudioListener()
      
      let{songId} = options
      this.setData({songId})
      // //请求歌曲的详细信息
      // let result = await request('/song/detail',{ids:songId})
      // // console.log(result)
      // this.setData({
      //    songObj:result.songs[0]
      // })
      // // 动态设置小程序的标题为当前歌曲的名字
      // wx.setNavigationBarTitle({
      //    title: this.data.songObj.name
      // })
      await this.getMusicDetail();
      let { musicId, playState } = appInstance.globalData   
      if (playState && musicId === songId) {
         this.setData({
            isplaying: true
         })
      }

      //接收recommendSong返回页面的事件订阅（监听）只需要一个，所以要放在这个生命周期内，
      // 如果放在函数可能会被重复创建
      PubSub.subscribe("changeAudioId",async  (msg,songId)=>{        
         // console.log("返回"+ songId)
         this.setData({
            songId
         })
         await this.getMusicDetail()
         await this.getMusicUrl()
         this.changePlayState();
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