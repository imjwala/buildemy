import express, { Router } from 'express'

import { createCategory, deleteCategory, getCategories } from '../../../controller/institute/category/categoryController';
import asyncErrorHandler from '../../../services/asyncErrorHandler';
import Middleware from '../../../middleware/middleware';

const router:Router = express.Router()


router.route("/").post(Middleware.isLoggedIn,asyncErrorHandler(createCategory))
.get(Middleware.isLoggedIn,asyncErrorHandler(getCategories))

router.route("/:id").delete(Middleware.isLoggedIn,asyncErrorHandler(deleteCategory))

export default router ; 