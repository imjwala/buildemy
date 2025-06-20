import {v2 as cloudinary} from 'cloudinary'
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import { envConfig } from '../config/config'

cloudinary.config({
   cloud_name: envConfig.cloudinary_cloud_name, 
        api_key: envConfig.cloudinary_api_key, 
        api_secret:envConfig.cloudinary_api_secret 
})

const storage = new CloudinaryStorage({
        cloudinary,
        params:async(req,res)=>({
                folder:"buildemy"
        })
})
export {cloudinary,storage}