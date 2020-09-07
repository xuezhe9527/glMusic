// pages/login/login.js
import request from '../../utils/request.js'
Page({

   /**
    * 页面的初始数据
    */
   data: {
      phone:'',
      password:''
   },
   handleChange(event){
      // console.log(event)
      let type = event.target.dataset.type
      let value = event.detail.value
      if(value.trim()){
         this.setData({
            [type]:value
         })
      }else{
         wx.showToast({
            title: '用户名或密码的格式不正确',
            icon:'none'
         })
      }
   },
   //登录请求
   async toLogin(){
      let {phone,password} = this.data
      
      const result = await request('/login/cellphone',{phone,password})
      console.log(result)
      if(result.code===400){
         wx.showToast({
            title: '手机号错误',
            icon:'none'
         })
      }else if(result.code===502){
         wx.showToast({
            title: '密码错误',
            icon:'none'
         })
      }else if(result.code===200){
         wx.showToast({
            title: '登陆成功，稍后跳转至个人中心',
            icon:'success',
            //延迟2000后跳转
            duration:2000,
            success(){
               wx.switchTab({
                  url: '/pages/personal/personal',
               })
            }
         })
      }
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {

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