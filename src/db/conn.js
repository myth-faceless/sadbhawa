import mongoose from "mongoose";
import {
  PRODUCTION_DB_NAME,
  DEVELOPMENT_DB_NAME,
} from "../constants/app.constants.js";

const connectDB = async () => {
  try {
    const dbURL =
      process.env.NODE_ENV === "production"
        ? process.env.MONGODB_PROD_URL
        : process.env.LOCAL_DB_URL;
    const database =
      process.env.NODE_ENV === "production"
        ? PRODUCTION_DB_NAME
        : DEVELOPMENT_DB_NAME;

    const connectionInstance = await mongoose.connect(`${dbURL}/${database}`);
    console.log(
      process.env.NODE_ENV === "production"
        ? `\nPRODUCTION_Database connected to: ${connectionInstance.connection.name}`
        : `\nLOCAL_Database connected to: ${connectionInstance.connection.name}`
    );
    // console.log(`\nDATABASE connected !! HOST: ${connectionInstance.connection.host}`)
  } catch (error) {
    console.log("DATABASE connection FAILED !", error);
    process.exit(1);
  }
};

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
