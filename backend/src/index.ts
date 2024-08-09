import "dotenv/config"
import env from "./utils/validateEnv"
import mongoose from "mongoose"
import app from "./server"


// defining the port
const port = env.PORT;


// using mongoose to connect to mongodb
mongoose
  .connect(env.MONGO_CONNECTION_STRING)
  .then(() => {
    console.log(`You successfully connected to mongodb`);
    app.listen(port, () => {
      console.log(`Your app is listening at port ${port}`);
    });
  })
  .catch((error) => {
    console.log(`there was an error ${error}`);
  });



