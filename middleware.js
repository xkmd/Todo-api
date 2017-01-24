//To make our todo routes private we are using middleware.
//When we call next we are calling regular handler, if we never call next
//to require authentication, the private code is never gonna run
//middleware is going to run before regular handler ever executes

var cryptojs = require('crypto-js');
module.exports = function(db){
    return {
        requireAuthentication: function(req, res, next){
            var token = req.get('Auth') || "";
            //we are looking for a token in database
            db.token.findOne({
                where:{
                    tokenHash: cryptojs.MD5(token).toString()
                }
            }).then(function(tokenInstance){ //we run this if we find that
                if(!tokenInstance)
                    throw new Error();
                req.token = tokenInstance;
                return db.user.findByToken(token);//keep the chain alive
            }).then(function(user){//if ok we run this
                req.user = user;
                next();
            }).catch(function(){
                res.status(401).send();
            });
//            db.user.findByToken(token).then(function(user){
//                req.user = user;
//                next();
//            }, function(){
//                res.status(401).send();
//            });
        }
    };
}
//even a valid token is now invalid unless it is saved