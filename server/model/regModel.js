const mongoose =require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true,
        maxlength:10
    },
    work:{
        type:String,      
    },
    password:{
        type:String,
        required:true 
    },
    description:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    },
    messages:[{
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        phone:{
            type:Number,
            required:true,
            maxlength:10
        },
        msg:{
            type:String,      
        },
     }
     ],

    tokens: [{
        token: {
          type: String, required: true
        }
      }]
})
userSchema.methods.gencreateToken = async function (req,res) {
    try {
      const token = jwt.sign({ _id:this._id}, "mygod")
      this.tokens = this.tokens.concat({token})
      // console.log(this.tokens);
      await this.save()
      return token  
    } catch (error) {
    //   res.send(error)
      console.log("this error" + error)
    }
  }

userSchema.pre('save',async function(next){
    if(this.isModified("password"))
    {
        this.password=await bcrypt.hash(this.password,10)
    }
    next()
})

userSchema.methods.addmessage = async function(name,email,phone,msg){
    try {
        this.messages= this.messages.concat({name,email,phone,msg})
        await this.save()
        return this.messages
    } catch (error) {
        console.log(error); 
    }
}

module.exports = mongoose.model("user",userSchema)
