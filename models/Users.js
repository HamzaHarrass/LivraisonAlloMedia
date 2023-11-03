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
        ref : 'Role',
    },
    status : {
        type : Boolean,
        default : false
    }
})

const User = mongoose.model('User',userSchema);
module.exports = User;