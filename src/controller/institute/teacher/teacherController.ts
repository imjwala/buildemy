import { Response } from "express";
import { IExtendedRequest } from "../../../middleware/type";
import sequelize from "../../../database/connection";
import { QueryTypes } from "sequelize";
import generateRandomPassword from "../../../services/generateRandomPassword";
import sendMail from "../../../services/sendMail";


const createTeacher = async(req:IExtendedRequest,res:Response)=>{
  const instituteNumber = req.user?.currentInstituteNumber
  const {teacherName, teacherEmail, teacherPhoneNumber,teacherExpertise, teacherSalary, teacherJoinedDate,courseId}=req.body
  const teacherPhoto= req.file?req.file.path:null;
  if(!teacherName||!teacherEmail||!teacherPhoneNumber||!teacherExpertise||!teacherSalary||!teacherJoinedDate){
    return res.status(400).json({
      message:"Please provide teacherName, teacherEmail, teacherPhoneNumber,teacherExpertise, teacherSalary, teacherJoinedDate "

    })
  }
  const data = generateRandomPassword(teacherName)
  const insertedData= await sequelize.query(`INSERT INTO teacher_${instituteNumber}(teacherName, teacherEmail, teacherPhoneNumber, teacherExpertise, joinedDate, salary, teacherPhoto, teacherPassword)VALUES(?,?,?,?,?,?,?,?)`,{
    type:QueryTypes.INSERT,
    replacements:[teacherName, teacherEmail, teacherPhoneNumber, teacherExpertise,teacherJoinedDate,teacherSalary,teacherPhoto, data.hashedversion]
  })
  const teacherData:{id:string}[] = await sequelize.query(`SELECT id FROM teacher_${instituteNumber}WHERE teacherEmail=?`,{
    type:QueryTypes.SELECT,
    replacements:[teacherEmail]
  })
  console.log(teacherData,'teacherData')

  await sequelize.query(`UPDATE course_${instituteNumber} SET teacherId=? WHERE id=?`,{
    type:QueryTypes.UPDATE,
    replacements:[teacherData[0].id,courseId]
  })
  const mailInformation ={
    to:teacherEmail,
    subject:"Welcome to Buildemy",
    text:`You have been assigned to the role of a teacher in buildemy. Your login details.Email: ${teacherEmail}, Password: ${data.plainVersion}, Your institute no: ${instituteNumber}`
  }


  await sendMail(mailInformation)

  res.status(200).json({
    message:"teacher created"
  })
}
const getTeachers = async(req:IExtendedRequest,res:Response)=>{
  const instituteNumber = req.user?.currentInstituteNumber
  const teachers = await sequelize.query(`SELECT * FROM teacher_${instituteNumber},`,{
    type:QueryTypes.SELECT
  })
  res.status(200).json({
    msg:"teacher fetched",
    data:teachers
  })
}
const deleteTeacher = async(req:IExtendedRequest,res:Response)=>{
  const instituteNumber = req.user?.currentInstituteNumber
  const id = req.params.id
  await sequelize.query(`DELETE FROM teacher_${instituteNumber} WHERE id=?`,{
    type:QueryTypes.DELETE,
    replacements:[id]
  })
  res.status(200).json({
    msg:"teacher deleted successfully"
  })
}

export {createTeacher, getTeachers,deleteTeacher}