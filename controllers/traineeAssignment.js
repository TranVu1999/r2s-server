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


/**
 * 
 * @param {*} str is a string of datetime
 * @returns object d{date, month, year} if str is string of datetime exactly
 */
 const splitTimeString = str => {
    let d = {}

    try{
        const splitStr = str.split("/")

        // convert to number
        if(isNaN(splitStr[0])) return null
        if(isNaN(splitStr[1])) return null
        if(isNaN(splitStr[2])) return null

        d.date = parseInt(splitStr[0])
        d.month = parseInt(splitStr[1])
        d.year = parseInt(splitStr[2])

    }catch(err){
        d = null
    }

    return d
}

const compareTime = (timeA, timeB) =>{
    if(timeB.year < timeA.year) return 0

    if(timeB.year === timeA.year){
        if(timeB.month < timeA.month) return 0

        if(timeB.month === timeA.month){
            if(timeB.date < timeA.date) return 0
        }

        return 1
    }

    return 1
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
                    success: false,
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
                let moduleEndTime = ""
                for(let enrollmentItem of enrollment_db){
                    let assignment = await Assignment.findOne({
                        Class: enrollmentItem.Class,
                        RegistrationCode
                    }).populate("Module")


                    if(assignment){
                        moduleEndTime = assignment.Module.EndTime
                        flag = true
                        break
                    }
                }

                // check time
                const d = new Date()
                const now = {
                    date: d.getDate(), 
                    month: d.getMonth() + 1, 
                    year: d.getFullYear()
                }

                moduleEndTime = splitTimeString(moduleEndTime)

                if(flag && compareTime(now, moduleEndTime)){
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