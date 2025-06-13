import { Request, Response } from "express";
import sequelize from "../../database/connection";
import generateRandomInstituteNumber from "../../services/generateRandomInstituteNumber";

class InstituteController {
  static async createInstitute(req: Request, res: Response) {
    const { instituteName, instutiteEmail, institutePhoneNumber, instituteAddress } = req.body;
    const instituteVatNo = req.body.instituteVatNo || null
    const institutePanNo = req.body.institutePanNo || null
    if (!instituteName || !instutiteEmail || !institutePhoneNumber || !instituteAddress) {
      res.status(400).json({
        message: "Please provide instituteName, instituteEmail, institutePhoneNumber, instituteAddress"
      })
      return
    }
    const instituteNumber = generateRandomInstituteNumber()
    try {
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
      await sequelize.query(`CREATE TABLE teacher_${instituteNumber}(
      id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
      teacherName VARCHAR(255) NOT NULL,
      teacherEmail VARCHAR(255) NOT NULL UNIQUE,
      teacherPhoneNumber VARCHAR(255) NOT NULL UNIQUE,
      teacherAddress VARCHAR(255) NOT NULL
        
        )`)

      res.status(200).json({
        msg: "Institute created "
      })
    } catch (err) {
      console.error("Error creating institute table:", err);
      res.status(500).json({ message: "Internal Server Error", err });

    }

  }
}
export default InstituteController