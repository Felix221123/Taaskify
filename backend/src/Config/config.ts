import 'dotenv/config'
import env from "../utils/validateEnv"





// defining env variables here
const SERVER_HOSTNAME = env.SERVER_HOSTNAME;
const SERVER_PORT = env.PORT;
const SERVER_TOKEN_EXPIRETIME = env.SERVER_TOKEN_EXPIRETIME;
const SERVER_TOKEN_ISSUER = env.SERVER_TOKEN_ISSUER;
const SERVER_TOKEN_SECRET = env.SERVER_TOKEN_SECRET;

// defining the server
const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    token: {
        expireTime: SERVER_TOKEN_EXPIRETIME,
        issuer: SERVER_TOKEN_ISSUER,
        secret: SERVER_TOKEN_SECRET
    }
};


// put the server in a config object and exporting it
const config = {
  server: SERVER
};


export default config

