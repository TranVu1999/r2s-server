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
     * Add new enrollment
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

                const enrollment = await Enrollment.findOne({Class: ClassId, Trainee: TraineeId})

                if(!enrollment){
                    const newEnrollment = new Enrollment({
                        Class: ClassId,
                        Trainee: TraineeId
                    })
    
                    await newEnrollment.save()
    
                    return showErrorClient(res, 200, {
                        isSuccess: true,
                        message: "Your action is done successfully.",
                        enrollment: newEnrollment
                    })
                }

                return showErrorClient(res, 400, {
                    isSuccess: false,
                    message: "This enrollment already exists."
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

    /**
     * Add new enrollment
     */
    update: async function(req, res){
        const {ClassId, TraineeId} = req.body
        const {id} = req.params
        const {accountId} = req

        try {
            
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

                const enrollment = await Enrollment.findOne({Class: ClassId, Trainee: TraineeId})

                if(!enrollment){

                    const updateEnrollment = await Enrollment.findByIdAndUpdate(id, {
                        Class: ClassId
                    }, {new: true})

                    if(updateEnrollment){
                        return res
                        .json({
                            isSuccess: true,
                            message: "Your action is done successfully.",
                            enrollment: updateEnrollment
                        })
                    }

                    return res
                        .json({
                            isSuccess: true,
                            message: "Enrollment not found."
                        })
                }

                return showErrorClient(res, 400, {
                    isSuccess: false,
                    message: "This enrollment already exists."
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


    /**
     * Get enrollment
     */
     getEnrollmentDetail: async function(req, res){

        try {
            const {traineeId} = req.params
            const {accountId} = req
            const account = await Admin.findById(accountId)

            if(!account){
                return showErrorClient(res, 400, {
                    isSuccess: false,
                    message: "This account is not found"
                }) 
            }

            const enrollment_db = await Enrollment.find({Trainee: traineeId})
            .populate("Class")
            .populate("Trainee")

            if(enrollment_db.length > 0){

                let enrollment = {
                    Id: enrollment_db[0]._id,
                    TraineeId: enrollment_db[0].Trainee._id,
                    TraineeName: enrollment_db[0].Trainee.Name,
                    TraineePhone: enrollment_db[0].Trainee.Phone,
                    TraineeAddress: enrollment_db[0].Trainee.Address,
                    TraineeEmail: enrollment_db[0].Trainee.Email,
                    listClass: []
                }

                let listClass = enrollment_db.map(item =>{
                    return {
                        Id: item.Class._id,
                        ClassName: item.Class.ClassName,
                        Capacity: item.Class.Capacity,
                        StartTime: item.Class.StartTime,
                        EndTime: item.Class.EndTime,
                        isDeleted: item.Class.isDeleted
                    }
                })

                enrollment.listClass = [...listClass]

                return res
                .json({
                    isSuccess: true,
                    message: "Your action is done successfully.",
                    enrollment
                })
            }
            
            return showErrorClient(res, 400, {
                isSuccess: false,
                message: "Can not get this enrollment"
            })

        } catch (error) {
            showErrorSystem(res, error)
        }
    },


    /**
     * Get list enrollment
     */
    getListEnrollment: async function(req, res){

        try {
            const {ClassId} = req.params
            const {accountId} = req
            const account = await Admin.findById(accountId)

            if(!account){
                return showErrorClient(res, 400, {
                    isSuccess: false,
                    message: "This account is not found"
                }) 
            }

            let enrollment_db = ClassId ? 
            await Enrollment.find({Class: ClassId})
            .populate("Class")
            .populate("Trainee") : 
            await Enrollment.find()
            .populate("Class")
            .populate("Trainee")

            if(ClassId){
                enrollment_db = 
                await Enrollment.find({Class: ClassId})
                .populate("Class")
                .populate("Trainee")
            }else{
                enrollment_db = 
                await Enrollment.find()
                .populate("Class")
                .populate("Trainee")
            }
            

            if(enrollment_db.length > 0){

                let listEnrollment = enrollment_db.map(item =>{
                    return {
                       Id: item._id,
                       TraineeId: item.Trainee._id,
                       TraineeName: item.Trainee.Name,
                       ClassId: item.Class._id,
                       ClassName: item.Class.ClassName
                    }
                })
                return res
                .json({
                    isSuccess: true,
                    message: "Your action is done successfully.",
                    listEnrollment: listEnrollment
                })
            }
            
            return showErrorClient(res, 400, {
                isSuccess: false,
                message: "Can not get this enrollment"
            })

        } catch (error) {
            showErrorSystem(res, error)
        }
    },


}