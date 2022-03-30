const user = require("../model/regModel")
const jwt = require("jsonwebtoken")


const auth = async(req,res,next) =>{
    try {
 
        const token = req.cookies.jwtoken
      
        const verify =jwt.verify(token,"mygod")

        const rootuser= await user.findOne({_id:verify._id,"tokens.token":token})

        if(!rootuser){throw new error ('user not found')}
        req.token=token
        req.rootuser=rootuser
        req.userid = rootuser._id
        next()
    } catch (err) {
        res.status(401).send("authorized:no token provide")
        console.log(err);
    }
}

module.exports = auth