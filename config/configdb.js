const mongoose=require('mongoose')
require('dotenv').config()
 mongoose.connect(process.env.Mongo_url).then(function(){
                    console.log("MongoDB connected sucsessfully");
}).catch(function(err){
console.log(err);
 })




// module.exports=mongoose