var mongoose    =   require("mongoose");
mongoose.connect('mongodb://localhost:27017/comApp');
var mongoSchema =   mongoose.Schema;

var newsSchema = { 
    "user":String,
    "password":String  
};
module.exports = mongoose.model('users',newsSchema);