const mongoose = require('mongoose');

const url ="mongodb+srv://hamzagames080:8CfgyYEzw1aad3Q6@cluster0.ezvyfwo.mongodb.net/AlloMedia?retryWrites=true&w=majority";
function connection (){
    mongoose.connect(url).then(()=>{
        console.log(" db connection success");
    }).catch(()=>{
        console.log(" db connection failed");
    });
}

module.exports = connection; 