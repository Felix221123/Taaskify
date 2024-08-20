import { cleanEnv, num, port, str } from 'envalid'

export default cleanEnv(process.env, {
  MONGO_CONNECTION_STRING:str(),
  PORT: port(),
  SERVER_TOKEN_EXPIRETIME:num(),
  SERVER_TOKEN_ISSUER:str(),
  SERVER_TOKEN_SECRET:str(),
  SERVER_HOSTNAME:str(),
  RESEND_EMAIL_API_KEY:str(),
  NODE_ENV:str(),
  FRONTEND_BASE_URL:str()
})
