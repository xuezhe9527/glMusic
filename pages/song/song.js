// pages/song/song.js
import request from '../../utils/request.js'
Page({

   /**
    * 页面的初始数据
    */
   data: {
      songId:null,
      songObj:{},
      isplaying:false,
      musicUrl:''
   },
   async handlePlay(){
      // /song/url ? id = 33894312 
      let musicUrlData = await request('/song/url',{id:this.data.songId})
      this.setData({
         musicUrl:musicUrlData.data[0].url,
         isplaying: !this.data.isplaying
      })

      let songManager = wx.getBackgroundAudioManager() 
            // paused 是否在暂停状态,且首次读取的时候是undefined
      // if (songManager.paused || songManager.paused === undefined) { 这种判断逻辑也成立
      if (songManager.paused || typeof songManager.paused ==="undefined"){   
         songManager.src = this.data.musicUrl
         songManager.title = this.data.songObj.name
      }else{         
         songManager.pause()
      }
      // 提示报错，
      //  若需要小程序在退到后台后继续播放音频，你需要在 app.json 中配置 requiredBackgroundModes 属性，详见: https://developers.weixin.qq.com/miniprogram/dev/framework/config.html#requiredbackgroundmodes
      // "requiredBackgroundModes": ["audio"]

      // this.setData({
      //    isplaying:!this.data.isplaying
      // })
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: async function (options) {
      
      let{songId} = options
      this.setData({songId})

      let result = await request('/song/detail',{ids:songId})
      // console.log(result)
      this.setData({
         songObj:result.songs[0]
      })

      // 动态设置小程序的标题为当前歌曲的名字
      wx.setNavigationBarTitle({
         title: this.data.songObj.name
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