const BaseController=require("../core/BaseController")
const User=require("../models/User")
const config =require("../config")
const bcrypt=require("bcrypt")


const userController=new BaseController(User,{
    name:"User",


    get:{
        pagination:config.pagination,
        query:['role'],
        searchField:["name","mobile","email"],
        select:["-password","-otp"]
        
    },

  getById:{
    select:"-password",
  },
 create: {
  pre: async (payload, req, res) => {

    if (payload.password) {
      const salt = await bcrypt.genSalt(10);
      payload.role="admin"
      payload.password = await bcrypt.hash(payload.password, salt);
    }
  }
},

updateById: {
  pre: async (filter, updatePayload, req, res) => {
    if (updatePayload.password) {
      const salt = await bcrypt.genSalt(10);
      updatePayload.password = await bcrypt.hash(updatePayload.password, salt);
    }
  }
}

    
})

module.exports=userController