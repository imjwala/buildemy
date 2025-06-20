import express, { Router } from 'express'
import InstituteController from '../../controller/institute/instituteController'
import Middleware from '../../middleware/middleware';
import asyncErrorHandler from '../../services/asyncErrorHandler';
import{multer, storage} from "./../../middleware/multerMiddlware"
const router: Router = express.Router()
const upload = multer({storage:storage})
router.route("/").post(Middleware.isLoggedIn,upload.single('institutePhoto'), InstituteController.createInstitute, InstituteController.createTeacherTable, InstituteController.createStudentTable,InstituteController.createCategoryTable, asyncErrorHandler(InstituteController.createCourseTable))


export default router 