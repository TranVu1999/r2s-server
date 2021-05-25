const Admin = require('./../models/Admin')
const Class = require('./../models/Class')
const Module = require('./../models/Module')
const Trainer = require('./../models/Trainer')
const Assignment = require('./../models/Assignment')

const showErrorSystem = function(res, error){
    console.log(error)
    return res
    .status(500)
    .json({
        success: false,
        message: "Internal server error"
    })
}

const showErrorClient = function(res, status, data){
    return res
    .status(status)
    .json({...data})
}

const createRegisterCode = function(classId, moduleId){
    let res = `CL${classId.slice(0, 1)}M${moduleId.slice(0, 1)}T${Date.now()}`

    return res
}


module.exports = {
    /**
     * Add new assignment
     */
    add: async function(req, res){
        const {ModuleId, ClassId, TrainerId} = req.body

        try {
            const {accountId} = req
            const account = await Admin.findById(accountId)

            if(!account){
                return showErrorClient(res, 400, {
                    isSuccess: false,
                    message: "This account is not found"
                }) 
            }

            const oldAssignment = await Assignment.findOne({
                Class: ClassId,
                Module: ModuleId,
                Trainer: TrainerId
            })

            if(oldAssignment){
                return showErrorClient(res, 400, {
                    isSuccess: false,
                    message: "This assignment already exist"
                }) 
            }


            const module_db = await Module.findById(ModuleId)
            const class_db = await Class.findById(ClassId)
            const trainer_db = await Trainer.findById(TrainerId)

            if(module_db && class_db && trainer_db){

                const newAssignmengt = new Assignment({
                    Class: ClassId,
                    Module: ModuleId,
                    Trainer: TrainerId,
                    RegistrationCode: createRegisterCode(ClassId, ModuleId)
                })

                await newAssignmengt.save()

                return showErrorClient(res, 400, {
                    isSuccess: true,
                    message: "Your action is done successfully",
                    assignmengt: newAssignmengt
                })
            }

            
            return showErrorClient(res, 400, {
                isSuccess: false,
                message: "Can not add this assignment"
            })
               

        } catch (error) {
            showErrorSystem(res, error)
        }
    },

    /**
     * Update assignment
     */
    update: async function(req, res){
        const {ModuleId, ClassId, TrainerId} = req.body
        const {id} = req.params

        try {
            const {accountId} = req
            const account = await Admin.findById(accountId)

            if(!account){
                return showErrorClient(res, 400, {
                    isSuccess: false,
                    message: "This account is not found"
                }) 
            }

            const oldAssignment = await Assignment.findOne({
                Class: ClassId,
                Module: ModuleId,
                Trainer: TrainerId
            })

            if(oldAssignment){
                return showErrorClient(res, 400, {
                    isSuccess: false,
                    message: "This assignment already exist"
                }) 
            }
            
            const module_db = await Module.findById(ModuleId)
            const class_db = await Class.findById(ClassId)
            const trainer_db = await Trainer.findById(TrainerId)

            if(module_db && class_db && trainer_db){
                const updateAssignment = await Assignment.findByIdAndUpdate(id, {
                    Class: ClassId,
                    Module: ModuleId,
                    Trainer: TrainerId
                }, {new: true})

                return showErrorClient(res, 400, {
                    isSuccess: true,
                    message: "Your action is done successfully",
                    assignmengt: updateAssignment
                })
            }

            
            return showErrorClient(res, 400, {
                isSuccess: false,
                message: "Can not update this assignment"
            })
               

        } catch (error) {
            showErrorSystem(res, error)
        }
    },

    
    /**
     * Get list assignment
     */
    getListAssignment: async function(req, res){

        try {
            const {accountId, typeUser} = req
            let account = null
            
            // check account
            switch(typeUser){
                case "admin":
                    account = await Admin.findById(accountId)
                    break

                case "trainer":
                    account = await Trainer.findById(accountId)
                    break

                case "trainee":
                    account = await Trainee.findById(accountId)
                    break
                default:
                    break
            }

            if(!account){
                return showErrorClient(res, 400, {
                    isSuccess: false,
                    message: "This account is not found"
                }) 
            }

            let listAssignment = []

            switch(typeUser){
                case "admin":
                    listAssignment = await Assignment.find()
                    .populate("Class")
                    .populate("Module")
                    .populate("Trainer")


                    listAssignment = listAssignment.map(item =>{
                        return {
                            Id: item._id,
                            ClassId: item.Class._id,
                            ClassName: item.Class.ClassName,
                            ModuleId: item.Module._id,
                            ModuleName: item.Module.ModuleName,
                            TrainerId: item.Trainer._id,
                            TrainerName: item.Trainer.UserName,
                            RegistrationCode: item.RegistrationCode
                        }
                    })

                    break

                case "trainer":
                    listAssignment = await Assignment.find({Trainer: accountId})
                    .populate("Class")
                    .populate("Module")
                    .populate("Trainer")


                    listAssignment = listAssignment.map(item =>{
                        return {
                            Id: item._id,
                            ClassId: item.Class._id,
                            ClassName: item.Class.ClassName,
                            ModuleId: item.Module._id,
                            ModuleName: item.Module.ModuleName,
                            TrainerId: item.Trainer._id,
                            TrainerName: item.Trainer.UserName,
                            RegistrationCode: item.RegistrationCode
                        }
                    })
                    break
                default:
                    break
            }

            
            return res
            .json({
                isSuccess: true,
                message: "Your action is done successfully",
                listAssignment
            })
               

        } catch (error) {
            showErrorSystem(res, error)
        }
    },

    
}