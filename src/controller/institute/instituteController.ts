import { NextFunction, Request, Response } from "express";
import sequelize from "../../database/connection";
import generateRandomInstituteNumber from "../../services/generateRandomInstituteNumber";
import { IExtendedRequest } from "../../middleware/type";
import User from "../../database/models/userModel";
import categories from "../../../seed";


class InstituteController {
  static async createInstitute(req: IExtendedRequest, res: Response, next: NextFunction) {
    try {


      const { instituteName, instutiteEmail, institutePhoneNumber, instituteAddress } = req.body;
      const instituteVatNo = req.body.instituteVatNo || null
      const institutePanNo = req.body.institutePanNo || null
      if (!instituteName || !instutiteEmail || !institutePhoneNumber || !instituteAddress) {
        res.status(400).json({
          message: "Please provide instituteName, instituteEmail, institutePhoneNumber, instituteAddress"
        }) 
        return
      }

      // User.findByPk(req.user && req.user.id)
      const instituteNumber = generateRandomInstituteNumber()

      await sequelize.query(`CREATE TABLE IF NOT EXISTS institute_${instituteNumber} (
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      instituteName VARCHAR(255) NOT NULL,
      instituteEmail VARCHAR(255) NOT NULL UNIQUE,
      institutePhoneNumber VARCHAR(255) NOT NULL UNIQUE,
      instituteAddress VARCHAR(255) NOT NULL,
      institutePanNo VARCHAR(255),
      instituteVatNo VARCHAR(255),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP on UPDATE CURRENT_TIMESTAMP 
      ) `)
      await sequelize.query(`INSERT INTO institute_${instituteNumber}(instituteName,instituteEmail,institutePhoneNumber,instituteAddress,institutePanNo,instituteVatNo) VALUES (?,?,?,?,?,?)`, {
        replacements: [instituteName, instutiteEmail, institutePhoneNumber, instituteAddress, institutePanNo,
          instituteVatNo]
      })

      //create institute history table where user created institute are stored
      await sequelize.query(`CREATE TABLE IF NOT EXISTS user_institute(
        id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
          userId VARCHAR(255) REFERENCES users(id),
          instituteNumber INT UNIQUE
        )`)
      if (req.user) {
        await sequelize.query(`INSERT INTO user_institute(userId, instituteNumber)VALUES(?,?)`, {
          replacements: [req.user.id, instituteNumber]
        })

        await User.update({
          currentInstituteNumber: instituteNumber,
          role: "institute"
        }, {
          where: { id: req.user.id }
        })
      }
      if(req.user){
        req.user.currentInstituteNumber = instituteNumber
      } 
      next()


    } catch (error) {
      console.log(error, "Error")
      res.status(500).json({
        message: error
      })

    }
  }
  static async createTeacherTable(req: IExtendedRequest, res: Response, next: NextFunction) {
    try {


      const instituteNumber = req.user?.currentInstituteNumber
      await sequelize.query(`CREATE TABLE teacher_${instituteNumber}(
     id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      teacherName VARCHAR(255) NOT NULL,
      teacherEmail VARCHAR(255) NOT NULL UNIQUE,
      teacherPhoneNumber VARCHAR(255) NOT NULL UNIQUE,
      teacherExpertise VARCHAR(255),
      joinedDate DATE,
      salary VARCHAR(255),
      teacherPhoto VARCHAR(255),
      teacherPassword VARCHAR(255),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

        )`)
      next()
    } catch (error) {
      console.log(error, "Error")
      res.status(500).json({
        message: error
      })
    }


  }
  static async createStudentTable(req: IExtendedRequest, res: Response, next: NextFunction) {
    try {


      const instituteNumber = req.user?.currentInstituteNumber
      await sequelize.query(`CREATE TABLE student_${instituteNumber}(
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      studentName VARCHAR(255) NOT NULL,
      studentEmail VARCHAR(255) NOT NULL UNIQUE,
      studentPhoneNumber VARCHAR(255) NOT NULL UNIQUE,
      studentAddress VARCHAR(255),
      enrolledDate DATE,
      studentImage VARCHAR(255),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`)
      next()
    } catch (error) {
      console.log(error, "Error")
      res.status(500).json({
        message: error
      })
    }

  }
  static async createCourseTable(req: IExtendedRequest, res: Response) {

    const instituteNumber = req.user?.currentInstituteNumber
    await sequelize.query(`CREATE TABLE course_${instituteNumber}(
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      courseName VARCHAR(255) NOT NULL UNIQUE,
      coursePrice  VARCHAR(255) NOT NULL,
      courseDuration  VARCHAR(100) NOT NULL,
      courseLevel ENUM('beginner','intermediate','advance') NOT NULL,
      courseThumbnail VARCHAR(200),
      courseDescription TEXT,
      teacherId VARCHAR(36) REFERENCES teacher_${instituteNumber}(id),
      categoryId VARCHAR(36) NOT NULL REFERENCES category_${instituteNumber} (id),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`)
    res.status(200).json({
      msg: "Institute created successfully",
      instituteNumber
    })


  }
  static async createCategoryTable(req:IExtendedRequest,res:Response,next:NextFunction){
    try{
    const instituteNumber = req.user?.currentInstituteNumber
    await sequelize.query(`CREATE TABLE IF NOT EXISTS category_${instituteNumber}(
      id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
      categoryName VARCHAR(255) NOT NULL,
      categoryDescription TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`)
      categories.forEach(async function(category){
            await sequelize.query(`INSERT INTO category_${instituteNumber}(categoryName,categoryDescription) VALUES(?,?)`,{
                replacements : [category.categoryName,category.categoryDescription]
            })

        })



      next()
    }catch (error) {
      console.log(error, "Error")
      res.status(500).json({
        message: error
      })
    }
  }

}
export default InstituteController