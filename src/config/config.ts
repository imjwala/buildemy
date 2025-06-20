import {config} from 'dotenv'
import { cloudinary } from '../services/cloudinaryConfig'

config()

export const envConfig = {
  portNumber :Number(process.env.PORT),
  db_name: process.env.DB_NAME,
  db_userName:process.env.DB_USERNAME,
  db_password:process.env.DB_PASSWORD,

  db_host:process.env.DB_HOST,
  db_port:Number(process.env.DB_PORT),
  jwt_key:process.env.JWT_KEY||'',
  cloudinary_cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key:process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret:process.env.CLOUDINARY_API_SECRET
}