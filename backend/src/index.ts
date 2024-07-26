import "dotenv/config";
import express from "express"
import cors from "cors";
import env from "./utils/validateEnv"



// defining the express app
const app = express();


// using cors in app
app.use(cors());


// defining the port
const port = env.PORT


// using the listen callback func to log out port definition
app.listen(port , () => {
    console.log(`app is running at ${port}`);
})