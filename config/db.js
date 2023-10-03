require ("dotenv").config()
const mongoose = require ("mongoose")

mongoose.connect(process.env.url).then(()=>{console.log('database is conected successfully')}
).catch((error)=>{
    console.log(error.message)
})