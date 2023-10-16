const mongoose = require('mongoose');


function connection (){
    mongoose.connect('mongodb://127.0.0.1:27017/AlloMedia').then(()=>{
        console.log(" db connection success");
    }).catch(()=>{
        console.log(" db connection failed");
    });
}

module.exports = connection; 