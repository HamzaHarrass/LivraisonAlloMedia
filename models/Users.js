const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username : {
        type : String,
        require : true
    },
    email : {
        type : String,
        require : true,
        unique : true
    },
    password : {
        type : String,
        require : true
    },
    role : {
        type : Schema.Types.ObjectId,
        ref : 'Roles'
    },
})

const User = mongoose.model('User',userSchema);
module.exports = User;