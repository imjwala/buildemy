import { Sequelize } from 'sequelize-typescript'
import { envConfig } from '../config/config'

const sequelize = new Sequelize({
  database: envConfig.db_name,
  username: envConfig.db_userName,
  password: envConfig.db_password,
  host: envConfig.db_host,
  dialect: 'mysql',
  port: envConfig.db_port,
  models: [__dirname + '/models']

})

sequelize.authenticate()
  .then(() => {
    console.log("Authenticated, connected")
  })
  .catch((err) => {
    console.log(err)
  })

sequelize.sync({ alter: false })
  .then(() => {
    console.log("Migration successfull")
  })

export default sequelize