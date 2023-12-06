const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
    max: 20,
  },

  password:{
    type: String,
    required:true,
  },

  username:{
    type:String,
    required:true,
    unique:true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },

  contactNumber:{

    type: String,
    required: true,
    unique: true,
    max: 50,
  },
 
  token:{
    type: String,
    },
});

// userSchema.methods.generateVerificationToken = function () {
//   const user = this;
//   console.log(user);
//   const verificationToken = jwt.sign(
//     { ID: user._id },
//     process.env.USER_VERIFICATION_TOKEN_SECRET,
//     { expiresIn: "1d" }
//   );
//   return verificationToken;
// };

module.exports = mongoose.model("user", userSchema);

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

