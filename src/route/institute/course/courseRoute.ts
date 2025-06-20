import express, { Request, Response, Router } from 'express'
import Middleware from '../../../middleware/middleware'
import asyncErrorHandler from '../../../services/asyncErrorHandler'
import { createCourse, deleteCourse, getAllCourse, getSingleCourse } from '../../../controller/institute/course/courseController'
import { cloudinary,storage } from '../../../services/cloudinaryConfig'
import multer from 'multer'
//local storage
// import{multer, storage} from './../../../middleware/multerMiddlware'
// const upload = multer({storage: storage})


const upload = multer({storage:storage,
  fileFilter:(req:Request,file:Express.Multer.File,cb)=>{
    const allowedFileTypes =['image/png','image/jpeg','image/jpg']
    if(allowedFileTypes.includes(file.mimetype)){
      cb(null,true)
    }else{
      cb(new Error("Only supports Image"))
    }
  }
})
const router: Router = express.Router()



router.route("/")
.post(Middleware.isLoggedIn,upload.single('courseThumbnail'),asyncErrorHandler(createCourse))
.get(Middleware.isLoggedIn,asyncErrorHandler(getAllCourse))

router.route("/:id")
.get(asyncErrorHandler(getSingleCourse))
.delete(Middleware.isLoggedIn,asyncErrorHandler(deleteCourse))


export default router 