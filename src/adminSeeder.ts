import User from "./database/models/User"
import bcrypt from 'bcrypt'

const adminSeeder = async():Promise<void> => {
    const [data] = await  User.findAll({
        where : {
            email : "p2admin@gmail.com",
        }
    })
    if(!data){
        await User.create({
            email : "p2admin@gmail.com",
            pasword :bcrypt.hashSync("admin123", 10),
            username : "p2admin",
            role : "admin"
        })
        console.log("Admin user created successfully")
    }else{
        console.log("Admin user already exist") 
    }
}
export default adminSeeder