module.exports =
    {
        check: function (req,res,next) {
            if(req.session.auth){
                console.log("logged in");
               //    res.send(req.session);
                next();

            }
            else{
                res.redirect('/api/login');
            } 
                //res.send("you arent logged in");
        }
    }