const Admin = require('./../models/Admin')
const Class = require('./../models/Class')
const Trainee = require('./../models/Trainee')
const Enrollment = require('./../models/Enrollment')

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
     * Add new class
     */
    add: async function(req, res){
        const {ClassId, TraineeId} = req.body

        try {
            const {accountId} = req
            const account = await Admin.findById(accountId)

            if(!account){
                return showErrorClient(res, 400, {
                    isSuccess: false,
                    message: "This account is not found"
                }) 
            }

            const trainee_db = await Trainee.findById(TraineeId)
            const class_db = await Class.findById(ClassId)

            if(trainee_db && class_db){
                const newEnrollment = new Enrollment({
                    Class: ClassId,
                    Trainee: TraineeId
                })

                await newEnrollment.save()

                return showErrorClient(res, 400, {
                    isSuccess: true,
                    message: "Your action is done successfully",
                    enrollment: newEnrollment
                })
            }

            return showErrorClient(res, 400, {
                isSuccess: false,
                message: "Can not add this enrollment"
            })

        } catch (error) {
            showErrorSystem(res, error)
        }
    },


}