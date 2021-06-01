const Admin = require('./../models/Admin')
const Trainee = require('./../models/Trainee')
const Enrollment = require('./../models/Enrollment')
const Assignment = require('./../models/Assignment')
const TraineeAssignment = require('./../models/Trainee_Assignment')


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


module.exports = {
    /**
     * Add new trainee assignment
     */
    add: async function(req, res){
        const {RegistrationCode} = req.body

        try {
            const {accountId} = req
            const account = await Trainee.findById(accountId)

            if(!account){
                return res
                .status(400)
                .json({
                    isSuccess: false,
                    message: "This account is not found"
                })
            }

            const traineeAssignment = await TraineeAssignment.findOne({
                Trainee: accountId,
                RegistrationCode
            })

            if(!traineeAssignment){
                const enrollment_db = await Enrollment.find({Trainee: accountId}).lean()

                let flag = false
                for(let enrollmentItem of enrollment_db){
                    let assignment = await Assignment.findOne({
                        Class: enrollmentItem.Class,
                        RegistrationCode
                    })

                    if(assignment){
                        flag = true
                        break
                    }
                }
                if(flag){
                    const newTraineeAssignment = new TraineeAssignment({
                        RegistrationCode,
                        Trainee: accountId
                    })
        
                    await newTraineeAssignment.save()
        
                    let traineeAssignment = {
                        Id: newTraineeAssignment._id,
                        TraineeId: accountId,
                        RegistrationCode
                    }
        
                    return res
                    .status(200)
                    .json({
                        success: true,
                        message: "Your action is done successfully",
                        traineeAssignment
                    })
                }

                return res
                .status(200)
                .json({
                    success: false,
                    message: "This code is not found"
                })
            }

            
            return res
            .status(200)
            .json({
                success: false,
                message: "This code is already exist"
            })
               

        } catch (error) {
            showErrorSystem(res, error)
        }
    },



}