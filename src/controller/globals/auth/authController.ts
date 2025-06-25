import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import User from '../../../database/models/userModel'
import jwt from 'jsonwebtoken'
import { envConfig } from '../../../config/config'
import generateJWTToken from '../../../services/generateJwtToken'


class AuthController {
  static async registerUser(req: Request, res: Response) {
    try {
      if (req.body==undefined) {
        res.status(400).json({
          msg: "No data was sent!"
        })
        return

      }
      const { username, email, password } = req.body
      if (!username) {
        res.status(400).json({
          Error: "Username is required"
        })
        return
      }
      if (!email) {
        res.status(400).json({
          Error: "email is required"
        })
        return
      }
      if (!password) {
        res.status(400).json({
          Error: "password is required"
        })
        return
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      await User.create({
        username: username,
        email: email,
        password: hashedPassword
      })
      res.status(201).json({
        msg: "User registered successfully"
      })
    } catch (err) {
      res.status(500).json({
        Msg:"Internal server error",
        Error: err
      })
    }
  }
  
  static async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body
      if (!email) {
        res.status(400).json({
          Error: "email is required"
        })
        return
      }
      if (!password) {
        res.status(400).json({
          Error: "password is required"
        })
        return
      }
      const data = await User.findAll({
        where: { email }
      })
      if (data.length === 0) {
        res.status(404).json({
          Message: "Invalid email or password"
        })
        return
      }
      const isPasswordMatch = await bcrypt.compare(password, data[0].password)
      const secretKey = envConfig.jwt_key
      
      if (isPasswordMatch) {
        const token = generateJWTToken({id:data[0].id})
        res.status(200).json({
         token:token,
         msg:"Token created successfully"
        })
        return 

      } else {
        res.status(403).json({
          Error: "Invalid email or password"
        })
        return
      }
    } catch (err) {
      res.status(500).json({
        Error: "Internal server error" 
      })
    } 

  }
}
export default AuthController

