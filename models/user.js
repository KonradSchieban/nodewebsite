var bcrypt = require('bcryptjs');

//*************************** */
// Here starts the mongoose section
var mongoose    = require('mongoose');
mongoose.connect('mongodb://mongo/sportsbetting');

var promise = mongoose.createConnection('mongodb://mongo/sportsbetting', {
    useMongoClient: true,
    /* other options */
});
promise.then(function(db) {
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
      // we're connected!
    });
    
});
//*************************** */

var userSchema = new mongoose.Schema({
    email: { type : String , unique : true, required : true },
    username: { type : String , unique : true, required : true, index: true },
    password: { type : String, required : true },
    points: {type : Number, required : true, default: 0},
    wins: {type: Number, required : true, default: 0},
    losses: {type: Number, required : true, default: 0}
});

var User = mongoose.model('User', userSchema);

module.exports = {
    createUser: (user_data, callback) => {

        var newUser = new User(user_data);
    
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newUser.password, salt, function(err, hash) {
                newUser.password = hash;
                newUser.save(callback);
            });
        });
    },
    getUserByEmail: (email, callback) => {
        let Obj = {email: email}
        User.findOne(Obj, callback);
    },
    getUserByUsername: (username, callback) => {
        let Obj = {username: username};
        User.findOne(Obj, callback);
    },
    comparePassword: (password, hash, callback) => {
        bcrypt.compare(password, hash, function(err, isMatch){
            if(err) throw err;
            callback(null, isMatch);
        });
    },
    getUserById: (id, callback) => {
        User.findById(id, callback);
    },
    sessionIsValid: (req) => {
        getUserById(req.session.user_id,(err,user_obj) => {
            if(err) throw err;
            if(user_obj){
                return true;
            }else{
                return false;
            }
        });
    }
}





//var new_user = new User(user_data);
//new_user.save();
/*
User.createUser = (newUser, callback) => {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}
*/

/*
export const createUser = (newUser, callback) => {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}
export const getUserByEmail = (email, callback) => {
    let Obj = {email: email}
    User.findOne(Obj, callback);
}
  
export const comparePassword = (password, hash, callback) => {
    bcrypt.compare(password, hash, function(err, isMatch){
        if(err) throw err;
        callback(null, isMatch);
    });
}

export const getUserById = (id, callback) => {
    User.findById(id, callback);
}
*/

//export const User = mongoose.model('User', userSchema);