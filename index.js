import app from "./src/app";
import dotenv from "dotenv";
import connectDB from "./src/db/conn";

dotenv.config();

const port = process.env.PORT || 7000;

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is runnign at port: ${port}`)
    })
}).catch((err) => {
    console.log('MONGO DB connection Failed !', err)
})