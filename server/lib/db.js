import mongoose from "mongoose";

export const connectDB = async ()=>{
    try{
        mongoose.connection.on('connected',() => console.log('Mongoose connected to DB'));
        await mongoose.connect(`${
            process.env.MONGODB_URI
        }/task-app`);
        
    }catch(error){
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
}