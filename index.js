import app from "./src/app.js";
import dotenv from "dotenv"
import connectDB from "./src/db/conn.js";

dotenv.config();

const port = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running at port: ${port}`)
    })
}).catch((err) => {
    console.log('Mongo DB connection Failed !!', err)
})