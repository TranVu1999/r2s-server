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

                var salt = bcrypt.genSaltSync(10)
                const hashedPassword = bcrypt.hashSync(password, salt)
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
            if(!username || !password){
                return res
                .status(400)
                .json({success: false, message: "Missing username and/or password"})
            }

            
            let account = null
            const filter = {UserName: username}

            if(typeUser === "admin"){
                account = await Admin.findOne(filter)
            }else if(typeUser === "trainer"){
                account = await Trainer.findOne(filter)
            }else if(typeUser === "trainee"){
                account = await Trainee.findOne(filter)
            }

            // account exists
            if(account){
                // Username found
                const passwordValid = bcrypt.compareSync(password, account.Password)
                if(!passwordValid){
                    return res
                    .json({success: false, message: "Incorrect username or password"})
                }

                const accessToken = jwt.sign({
                    accountId: account._id, typeUser
                }, process.env.ACCESS_TOKEN_SECRET)
                return res.json({
                    success: true, 
                    message: "User logged successfully", 
                    accessToken,
                    account
                })
            }
            
            return res
            .status(400)
            .json({
                success: false, 
                message: "User is not found"
            })

                

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

                    var salt = bcrypt.genSaltSync(10)
                    const hashedPassword = bcrypt.hashSync(password, salt)
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

                    var salt = bcrypt.genSaltSync(10)
                    const hashedPassword = bcrypt.hashSync(password, salt)
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


    /**
     * Get list all account
    */
    getListAccount: async function(req, res){
        

        try {
            const listAdmin = await Admin.find()
            const listTrainee = await Trainee.find()
            const listTrainer = await Trainer.find()
            

            return res.json({
                success: true, 
                message: "Account created successfully",
                listAdmin,
                listTrainee,
                listTrainer
            })

        } catch (error) {
            showErrorSystem(res, error)
        }
    },


    /**
     * Get list admin
    */
    getListAdmin: async function(req, res){
        const {accountId} = req

        try {
            const admin = await Admin.findById(accountId)

            if(admin){
                let listAdmin = await Admin.find()
                
                listAdmin = listAdmin.map(item =>{
                    return {
                        Id: item._id,
                        UserName: item.UserName,
                        Password: "",
                        Name: item.Name,
                        Email: item.Email
                    }
                })

                return res.json({
                    success: true, 
                    message: "Your action is done successfully",
                    listAdmin
                })
            }

            return res
            .status(400)
            .json({
                success: false, 
                message: "This account is not found"
            })
            

        } catch (error) {
            showErrorSystem(res, error)
        }
    },


    /**
     * Get list trainer
    */
    getListTrainer: async function(req, res){
        const {accountId} = req

        try {
            const admin = await Admin.findById(accountId)

            if(admin){
                let listTrainer = await Trainer.find()
                
                listTrainer = listTrainer.map(item =>{
                    return {
                        Id: item._id,
                        UserName: item.UserName,
                        Password: "",
                        Name: item.Name,
                        Email: item.Email,
                        Phone: item.Phone,
                        Address: item.Address,
                        IsReceiveNotification: item.IsReceiveNotification,
                        ResetPasswordCode: item.ResetPasswordCode,
                        ActivationCode: item.ActivationCode,
                        isActive: item.isActive
                    }
                })

                return res.json({
                    success: true, 
                    message: "Your action is done successfully",
                    listTrainer
                })
            }

            return res
            .status(400)
            .json({
                success: false, 
                message: "This account is not found"
            })
            

        } catch (error) {
            showErrorSystem(res, error)
        }
    },



}