import jwt from "jsonwebtoken"
import logging from "../Config/logging"
import config from "../Config/config"
import { IUser } from "Interface/UserProps"

const NAMESPACE = "Auth"


const signJWT = (user:IUser, callback: (error:Error | null , token:string | null) => void):void => {
  logging.info(NAMESPACE , `Attempting to sign token for ${user.emailAddress}`);

  // using the try and catch block to assign a token
  try {
    jwt.sign(
      {
        _id : user._id,
        emailAddress : user.emailAddress,
      },
      config.server.token.secret,
      {
        issuer: config.server.token.secret,
        algorithm: "HS256",
        expiresIn: `${config.server.token.expireTime}s`
      },
      (error , token) => {
        if (error){
          callback(error, null)
        } else if (token){
          callback(null, token)
        }
      }
    )

  } catch (error:any) {
    logging.error(NAMESPACE, error.message, error);
    callback(error, null)
  }
}


export default signJWT;
