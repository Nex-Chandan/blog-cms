import mongoose from "mongoose"

const connectDb=async()=>{
    try{
        const connect=await mongoose.connect(process.env.MONGODB_URI)
        console.log("mongodb connected successfully")

    }
    catch(err){
        console.log(`some error occured during connection ${err}`)
    }
}

export default connectDb