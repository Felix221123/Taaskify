import 'dotenv/config'
import env from "../utils/validateEnv"





// defining env variables here
const SERVER_HOSTNAME = env.SERVER_HOSTNAME;
const SERVER_PORT = env.PORT;
const SERVER_TOKEN_EXPIRETIME = env.SERVER_TOKEN_EXPIRETIME;
const SERVER_TOKEN_ISSUER = env.SERVER_TOKEN_ISSUER;
const SERVER_TOKEN_SECRET = env.SERVER_TOKEN_SECRET;
const RESEND_EMAIL_API_KEY = env.RESEND_EMAIL_API_KEY;
const NODE_ENV = env.NODE_ENV

// defining the server
const SERVER = {
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    token: {
        expireTime: SERVER_TOKEN_EXPIRETIME,
        issuer: SERVER_TOKEN_ISSUER,
        secret: SERVER_TOKEN_SECRET
    },
    resend_email_api_key: RESEND_EMAIL_API_KEY,
    node_env:NODE_ENV
};


// put the server in a config object and exporting it
const config = {
  server: SERVER
};


export default config

