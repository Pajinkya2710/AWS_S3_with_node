const mongoose= require('mongoose');

const connect= mongoose.createConnection('mongodb+srv://ajinkyapawar0508:ajinkyapawar0508@cluster0.b3racto.mongodb.net/').on('open',()=>{
    console.log('mongodb connected')
}).on('error',()=>{
    console.log('mongodb error')
})

module.exports= connect;