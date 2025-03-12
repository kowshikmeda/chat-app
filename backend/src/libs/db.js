import mongoose from 'mongoose';

export const connectDb=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGODB_URL);
        console.log(`MongoDb connection  ${conn.connection.host}`);
    }catch(error){
        console.log("MongoDb connection error"+error);
    }
}