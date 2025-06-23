import { Request, Response } from "express";
import { IExtendedRequest } from "../../../middleware/type";
import sequelize from "../../../database/connection";
import { QueryTypes } from "sequelize";

const createCourse = async (req: IExtendedRequest, res: Response) => {
  const instituteNumber = req.user?.currentInstituteNumber
  const { coursePrice, courseName, courseDescription, courseDuration, courseLevel, categoryId } = req.body
  if (!coursePrice || !courseName || !courseDuration || !courseDescription || !courseLevel||!categoryId) {
    return res.status(400).json({
      message: "Please provide courseName, coursePrice,  courseDescription,courseDuration, courseLevelm categoryId"
    })
  }

  const courseThumbnail = req.file ? req.file.path : null
  console.log(courseThumbnail,"coursethumbnail")

  const returnedData = await sequelize.query(`INSERT INTO course_${instituteNumber}(courseName, coursePrice,  courseDescription,courseDuration, courseLevel, categoryId, courseThumbnail)VALUES(?,?,?,?,?,?,?)`, {
    type:QueryTypes.INSERT,
    replacements: [courseName, coursePrice, courseDescription, courseDuration, courseLevel,categoryId, courseThumbnail]
  })
  console.log(returnedData)
  res.status(200).json({
    message: "course created successfully "
  })
}


const deleteCourse = async (req: IExtendedRequest, res: Response) => {
  const instituteNumber = req.user?.currentInstituteNumber
  const courseId = req.params.id

  const courseData = await sequelize.query(`SELECT * FROM course_${instituteNumber} WHERE id = ?`, {
    type:QueryTypes.SELECT,
    replacements: [courseId]
  })
  if (courseData.length == 0) {
    return res.status(404).json({
      message: "No course matches with that id"

    })
  }

  await sequelize.query(`DELETE FROM course_${instituteNumber}WHERE id = ?`, {
    type:QueryTypes.DELETE,
    replacements: [courseId]
  })
  res.status(200).json({
    message: "Course deleted successfully"
  })
}

const getAllCourse = async (req: IExtendedRequest, res: Response) => {
  const InstituteNumber = req.user?.currentInstituteNumber
  const courses = await sequelize.query(`SELECT * FROM course_${InstituteNumber}`,{
    type:QueryTypes.SELECT
  })
  res.status(200).json({
    message: "Course fetched",
    data: courses
  })
}
const getSingleCourse = async (req: IExtendedRequest, res: Response) => {
  const InstituteNumber = req.user?.currentInstituteNumber
  const courseId = req.params.id
  const course = await sequelize.query(`SELECT * FROM course_${InstituteNumber}WHERE id = ?`, {
    replacements: [courseId],
    type:QueryTypes.SELECT
  })
  res.status(200).json({
    message: "single course fetched",
    data: course 
  })


}
export { createCourse, getAllCourse, deleteCourse, getSingleCourse }