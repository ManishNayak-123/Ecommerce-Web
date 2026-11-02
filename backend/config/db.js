import mongoose from "mongoose";
 const connectedDB = async () =>{
    try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected mongoDB successfully");
    }catch(error){
        console.log(error.message);
        process.exit(1);
    }
  
}

export default connectedDB;