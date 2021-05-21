const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')
const Admin = require('./../models/Admin')
const Trainee = require('./../models/Trainee')
const Trainer = require('./../models/Trainer')

const showErrorSystem = function(res, error){
    console.log(error)
    return res
    .status(500)
    .json({
        success: false,
        message: "Internal server error"
    })
}


module.exports = {
    /**
     * Sign up for admin
     */
    registerAdmin: async function(req, res){
        const {username, password, email, name} = req.body

        try {

            // check full infomation
            if(username && password && email && name){
                const account = await Admin.findOne({UserName: username}).lean()
                if(account){
                    return res
                    .status(400)
                    .json({
                        success: false, 
                        message: "This account already exists."
                    })
                }

                const hashedPassword = bcrypt.hashSync(password, 8)
                const newAccount = new Admin({
                    UserName: username,
                    Password: hashedPassword,
                    Name: name,
                    Email:email
                })
                await newAccount.save()

                const accessToken = jwt.sign({accountId: newAccount._id}, process.env.ACCESS_TOKEN_SECRET);

                return res.json({
                    success: true, 
                    message: "Account created successfully",
                    accessToken, 
                    account: newAccount
                })
            }

            showErrorSystem(res, "")    

        } catch (error) {
            showErrorSystem(res, error)
        }
    },

    /**
     * Login for account
    */
    login: async function(req, res){
        const {
            username, password, typeUser
        } = req.body

        try {
            // check full infomation
            let account = null

            if(typeUser === "admin"){
                account = await Admin.findOne({})
            }

                

        } catch (error) {
            showErrorSystem(res, error)
        }
    },
    /**
     * Sign up for trainer and trainee
    */
    register: async function(req, res){
        const {
            username, password, email, 
            name, address, phone,
            typeUser
        } = req.body

        try {
            // check full infomation
            if(username && password && email && name && address && phone){

                // check is trainee
                if(typeUser === "trainee"){
                    const trainee = await Trainee.findOne({UserName: username}).lean()
                    if(trainee){
                        return res
                        .status(400)
                        .json({
                            success: false, 
                            message: "This account already exists."
                        })
                    }

                    const hashedPassword = bcrypt.hashSync(password, 8)
                    const newTrainee = new Trainee({
                        UserName: username,
                        Password: hashedPassword,
                        Name: name,
                        Email:email,
                        Phone: phone,
                        Address: address
                    })
                    await newTrainee.save()

                    const accessToken = jwt.sign({accountId: newTrainee._id}, process.env.ACCESS_TOKEN_SECRET);

                    return res.json({
                        success: true, 
                        message: "Account created successfully",
                        accessToken, 
                        account: newTrainee
                    }) 
                }
                // check is trainer
                else if(typeUser === "trainer"){
                    const trainer = await Trainer.findOne({UserName: username}).lean()
                    if(trainer){
                        return res
                        .status(400)
                        .json({
                            success: false, 
                            message: "This account already exists."
                        })
                    }

                    const hashedPassword = bcrypt.hashSync(password, 8)
                    const newTrainer = new Trainer({
                        UserName: username,
                        Password: hashedPassword,
                        Name: name,
                        Email:email,
                        Phone: phone,
                        Address: address
                    })
                    await newTrainer.save()

                    const accessToken = jwt.sign({accountId: newTrainer._id}, process.env.ACCESS_TOKEN_SECRET);

                    return res.json({
                        success: true, 
                        message: "Account created successfully",
                        accessToken, 
                        account: newTrainer
                    })
                }
                
            }

            showErrorSystem(res, "")    

        } catch (error) {
            showErrorSystem(res, error)
        }
    },

}