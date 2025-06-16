import {config} from 'dotenv'
import { STRING } from 'sequelize'
config()

export const envConfig = {
  portNumber :Number(process.env.PORT),
  db_name: process.env.DB_NAME,
  db_userName:process.env.DB_USERNAME,
  db_password:process.env.DB_PASSWORD,

  db_host:process.env.DB_HOST,
  db_port:Number(process.env.DB_PORT),
  jwt_key:process.env.JWT_KEY||''
}