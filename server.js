const express = require ("express")
const app = express()
const  PORT = 2314
const db = require("./config/db")
const router = require("./router/personrouter")
app.use (express.json())
app.use("/api", router)




app.listen( PORT, ()=>{
    console.log(`app is listening to ${PORT} `)
})