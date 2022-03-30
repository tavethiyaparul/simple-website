require("dotenv").config()
const express = require('express')
const app = express()
const port=5000
require('./dbconnect')
const regrouter = require('./router/regRouter')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser())
app.use("/",regrouter)

app.listen(port,()=>{
    console.log("server starting")
})