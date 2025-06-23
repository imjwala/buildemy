import bcrypt from 'bcrypt';


const generateRandomPassword = (teacherName: string)=>{
  const randomNumber = Math.floor(1000+Math.random()*90000)
  const passwordData ={
    hashedversion : bcrypt.hashSync(`${randomNumber}_${teacherName}`,10),
    plainVersion : `${randomNumber}_${teacherName}`
  }
  return passwordData
}


export default generateRandomPassword