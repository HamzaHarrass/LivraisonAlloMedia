const mongoose = require('mongoose');

const url ="mongodb+srv://hamzaharrass05:1234567890@cluster0.o4hwrvz.mongodb.net/AlloMedia?retryWrites=true&w=majority";
function connection (){
    mongoose.connect(url).then(()=>{
        console.log(" db connection success");
    }).catch(()=>{
        console.log(" db connection failed");
    });
}

module.exports = connection; 