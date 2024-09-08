import "dotenv/config"
import env from "./utils/validateEnv"
import mongoose from "mongoose"
import { server } from "./server"


// defining the port
const port = env.PORT;


// using mongoose to connect to mongodb database (NO_SQL DATABASE)
mongoose
  .connect(env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log(`You successfully connected to mongodb`);
    server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log(`there was an error ${error}`);
  });



