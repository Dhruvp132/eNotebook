const mongoose = require('mongoose');
const {Schema} = mongoose ;
const NotesSchema = new Schema({

    // this user links the user in models to store the user 
    //refrence model user from export name in mongoose model
    user : {
        //user is another model's user id (like a foreign key)
         type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
        
    },
    title: {
        type : String,
        rquired : true,
    }, 
    description: {
        type: String,
        require : true,
    },
    tag : {
        type : String,
        default : "Genral"
    },
    date : {
        type : Date,
        default : Date.now

    }
    
})

module.exports = mongoose.model('notes', NotesSchema)