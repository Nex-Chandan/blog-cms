import mongoose from "mongoose"

const userSchema=new mongoose.Schema({
    
name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

email:{
    type:String,
    required:[true,"email is required"],
    unique:true,
    lowercase: true,
    trim: true,
},
 profileImageURL:{
    type:String
 },

 password:{
    type:String,
    required:true,
    minlength: 8,

 },
 role:{
    type:String,
    enum:["User","Admin"],
    required:true,
    default: "User",

 },
 category:{
    type:String,
    default:null,

 }

},
  { timestamps: true }
)

export default mongoose.model("User", userSchema);