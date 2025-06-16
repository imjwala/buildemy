import { NextFunction, Request, Response } from "express";
import sequelize from "../../database/connection";
import generateRandomInstituteNumber from "../../services/generateRandomInstituteNumber";
import { IExtendedRequest } from "../../middleware/type";
import User from "../../database/models/userModel";


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
      id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
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
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
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
      req.instituteNumber = instituteNumber
      next()
    } catch (err) {
      console.error("Error creating institute table:", err);
      res.status(500).json({ message: "Internal Server Error", err });

    }

  }
  static async createTeacherTable(req: IExtendedRequest, res: Response, next: NextFunction) {
    try {
      const instituteNumber = req.instituteNumber
      await sequelize.query(`CREATE TABLE teacher_${instituteNumber}(
      id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
      teacherName VARCHAR(255) NOT NULL,
      teacherEmail VARCHAR(255) NOT NULL UNIQUE,
      teacherPhoneNumber VARCHAR(255) NOT NULL UNIQUE

        )`)
      next()

    } catch (err) {
      console.error("Error creating teacher table:", err);
      res.status(500).json({ message: "Internal Server Error", err });
    }
  }
  static async createStudentTable(req: IExtendedRequest, res: Response, next: NextFunction) {
    try {
      const instituteNumber = req.instituteNumber
      await sequelize.query(`CREATE TABLE student${instituteNumber}(
      id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
      studentName VARCHAR(255) NOT NULL,
      studentEmail VARCHAR(255) NOT NULL UNIQUE,
      studentPhoneNumber VARCHAR(255) NOT NULL UNIQUE
        )`)
      next()

    } catch (err) {
      console.error("Error creating student table:", err);
      res.status(500).json({ message: "Internal Server Error", err });
    }
  }
  static async createCourseTable(req: IExtendedRequest, res: Response) {
    try {
      const instituteNumber = req.instituteNumber
      await sequelize.query(`CREATE TABLE course${instituteNumber}(
      id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
      courseName VARCHAR(255) NOT NULL UNIQUE,
      coursePrice VARCHAR(255) NOT NULL
        )`)
      res.status(200).json({
        msg: "Institute created successfully"
      })

    } catch (err) {
      console.error("Error creating student table:", err);
      res.status(500).json({ message: "Internal Server Error", err });
    }
  }

}
export default InstituteController