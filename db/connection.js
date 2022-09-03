const mongoose = require('mongoose');

const DB = process.env.DATABASE;

mongoose.connect(DB).then(()=>{
    console.log('mongoose connection successful')
}).catch((error)=>{
    console.log(error)
})