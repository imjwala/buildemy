import jwt from 'jsonwebtoken';
import { envConfig } from '../config/config';

const generateJWTToken = (data:{
  id: string,
  instituteNumber?:string
})=>{
  const token = jwt.sign({data},envConfig.jwt_key!,{
    expiresIn: '30d'
  })
  return token
}
export default generateJWTToken