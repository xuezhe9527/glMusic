import config from './config.js'

export default function(url,data={},method="GET"){
   return new Promise((resolve,reject)=>{
      wx.request({
         // url,
         url:config.host+url,
         data,
         method,
         header:{
            cookie:JSON.parse(wx.getStorageSync("cookies")||"[]").toString()
         },
         success: (res) => {
            // console.log(res)
            let loginCookie = res.cookies
            let {isLogin} = data
            if(isLogin){
               wx.setStorageSync("cookies", JSON.stringify(loginCookie)) //登陆成功后保存响应返回的cookies信息
            }
            resolve(res.data)
         }
      })
   })
}