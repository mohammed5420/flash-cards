const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  userName: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  avatar: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  joinedAt: {
    type: Date,
    default: () => Date.now(),
  },
  isVerified: {
    type: Boolean,
    default: false,
    select: false
  },
  passwordChangedAt: {
    type: Date,
    default: () => Date.now(),
    select: false
  },
});

userSchema.methods.setUserAvatar = function(){
  this.avatar = `https://avatars.dicebear.com/api/identicon/${this.userName}.svg`;
}

module.exports = mongoose.model("users", userSchema);
