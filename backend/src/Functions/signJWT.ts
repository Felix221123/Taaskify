import jwt from "jsonwebtoken"
import logging from "../Config/logging"
import config from "../Config/config"
import { IUser } from "Interface/UserProps"

const NAMESPACE = "Auth"


const signJWT = (user:IUser, callback: (error:Error | null , token:string | null) => void):void => {
  // defining json web token variables
  const timeSinchEpoch = new Date().getTime();
  const expirationTime = timeSinchEpoch + Number(config.server.token.expireTime) * 100000;
  const expirationTimeInSeconds = Math.floor(expirationTime / 1000);

  logging.info(NAMESPACE , `Attempting to sign token for ${user.emailAddress}`);

  // using the try and catch block to assign a token
  try {
    jwt.sign(
      {
        userID : user._id,
        emailAddress : user.emailAddress,
      },
      config.server.token.secret,
      {
        issuer: config.server.token.secret,
        algorithm: "HS256",
        expiresIn: expirationTimeInSeconds
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
