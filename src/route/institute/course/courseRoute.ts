import express, { Request, Response, Router } from 'express'
import Middleware from '../../../middleware/middleware'
import asyncErrorHandler from '../../../services/asyncErrorHandler'
import { createCourse, deleteCourse, getAllCourse, getSingleCourse } from '../../../controller/institute/course/courseController'
import multer from 'multer'
import upload from '../../../middleware/multerUpload'
//local storage
// import{multer, storage} from './../../../middleware/multerMiddlware'
// const upload = multer({storage: storage})



const router: Router = express.Router()



router.route("/")
.post(Middleware.isLoggedIn,upload.single('courseThumbnail'),asyncErrorHandler(createCourse))
.get(Middleware.isLoggedIn,asyncErrorHandler(getAllCourse))

router.route("/:id")
.get(asyncErrorHandler(getSingleCourse))
.delete(Middleware.isLoggedIn,asyncErrorHandler(deleteCourse))


export default router 