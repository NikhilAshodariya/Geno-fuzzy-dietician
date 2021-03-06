var mongoose = require('mongoose');
var bcrypt= require('bcrypt-nodejs');

//User Schema
var userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  type:String,
  profile: {  
    fname: { type: String, default: '' },
    gender: { type: String, default: '' },
    lname : { type: String, default: '' },
    height: { type: Number, default: '' },
    weight: { type: Number, default: '' },
    age : { type: Number, default: '' },
    ethnicity: [String],
    foodpref:[String],
    diseases:[String],
    allergies:[String],
    activity:String,
    goal: String,
  },
  dislikeforever:[String],
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

/**
 * Password hash middleware.
 */
userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// Compile Schema into a mongoose Model
var User = mongoose.model('User',userSchema);
module.exports = User;	
