//To make our todo routes private we are using middleware.
//When we call next we are calling regular handler, if we never call next
//to require authentication, the private code is never gonna run
//middleware is going to run before regular handler ever executes
module.exports = function(db){
    return {
        requireAuthentication: function(req, res, next){
            var token = req.get('Auth');
            db.user.findByToken(token).then(function(user){
                req.user = user;
                next();
            }, function(){
                res.status(401).send();
            });
        }
    };
}