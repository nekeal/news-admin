var mongoose    =   require("mongoose");
mongoose.connect('mongodb://localhost:27017/comApp');
var mongoSchema =   mongoose.Schema;

var newsSchema = {
    "status":Number, 
     "title":String,
    "content":String,   
};
module.exports = mongoose.model('news',newsSchema);
``