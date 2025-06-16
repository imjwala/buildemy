import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import User from "../database/models/userModel";
import { IExtendedRequest } from "./type";
import { envConfig } from "../config/config";




class Middleware {

  static isLoggedIn(req: IExtendedRequest, res: Response, next: NextFunction) {
    //check if login or not
    //token accept
    const token = req.headers.authorization
    if (!token) {
      res.status(403).json({
        msg: "please provide token"
      })
      return
    }
    //verify token
    const secretKey = envConfig.jwt_key
    jwt.verify(token,secretKey, async (error: any, result: any) => {
      if (error) {
        res.status(401).json({
          msg: "Token invalid"
        })
      } else {
        const userData = await User.findByPk(result.id)
        if (!userData) {
          res.status(403).json({
            msg: "No user with that id, invalid token"
          })
        } else {
          req.user = userData
          next()

        }
      }
    })


  }
 
}
export default Middleware