import nodemailer from 'nodemailer'
import { envConfig } from '../config/config'
import { text } from 'stream/consumers';


interface IMailInformation {
  to: string,
  subject: string,
  text: string
}

const sendMail = async (mailInformation: IMailInformation)=>{
  const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{ 
      user:envConfig.nodemailer_gmail,
      pass:envConfig.nodemailer_gmail_password
    }
  })
  const mailFormatObject ={
    from:"Buildemy <buildemy2025@gmail.com",
    to:mailInformation.to,
    subject:mailInformation.subject,
    text:mailInformation.text
  }
  try {
    await transporter.sendMail(mailFormatObject)
    
  } catch (error) {
    console.log(error)
    
  }
}
export default sendMail