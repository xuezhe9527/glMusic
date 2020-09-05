import config from './config.js'

export default function(url,data={},method="GET"){
   return new Promise((resolve,reject)=>{
      wx.request({
         // url,
         url:config.host+url,
         data,
         method,
         success: (res) => {
            // console.log(res.data)
            resolve(res.data)
         }
      })
   })
}