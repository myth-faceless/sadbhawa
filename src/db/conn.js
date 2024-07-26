import mongoose from "mongoose";
import { DB_NAME } from "../constants/app.constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`\nMONGODB connecetd !! DB HOST: ${connectionInstance.host}`)
    } catch (error) {
        console.log('MONGODB connection FAILED !', error)
        process.exit(1)
    }
}


// const connectDB = async () => {
//     try {
//       const dbURL = process.env.NODE_ENV === 'production' ? process.env.DB_PROD_URL : process.env.DB_DEV_URL;
//       await mongoose.connect(dbURL, {
//       });
//       console.log(`MongoDB connected: ${dbURL}`);
//     } catch (error) {
//       console.error(`Error: ${error.message}`);
//       process.exit(1);
//     }
//   };
  

export default connectDB; 