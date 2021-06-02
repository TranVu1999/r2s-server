const Admin = require('./../models/Admin')
const Trainer = require('./../models/Trainer')
const Trainee = require('./../models/Trainee')
const Class = require('./../models/Class')
const Enrollment = require('./../models/Enrollment')
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
     * Add new class
     */
    add: async function(req, res){
        const {ClassName, Capacity, StartTime, EndTime} = req.body

        try {
            const {accountId} = req
            const account = await Admin.findById(accountId)

            if(!account){
                return showErrorClient(res, 400, {
                    isSuccess: false,
                    message: "This account is not found"
                }) 
            }


            // check time
            const d = new Date()
            const now = {
                date: d.getDate(), 
                month: d.getMonth() + 1, 
                year: d.getFullYear()
            }

            let start = splitTimeString(StartTime)
            let end = splitTimeString(EndTime)

            

            if(start && end){

                if(compareTime(now, start) && compareTime(start, end) && Capacity > 0){
                    const newClass = new Class({
                        ClassName,
                        Capacity,
                        StartTime,
                        EndTime
                    })

                    await newClass.save()

                    return res
                    .json({
                        isSuccess: true,
                        message: "Your action is done successfully",
                        class: newClass
                    })
                }
            }

            return showErrorClient(res, 400, {
                isSuccess: false,
                message: "Can not add this class"
            })
               

        } catch (error) {
            showErrorSystem(res, error)
        }
    },


    /**
     * Get list class
     */
    getList: async function(req, res){
        const {accountId, typeUser} = req

        try {
            let listClass = []
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


            if(account){

                let listClass = null
                let listTrainee = []

                switch(typeUser){
                    case "admin":
                        listClass = await Class.find({isDeleted: false})

                        listClass = listClass.map(item =>{
                            return {
                                Id: item._id,
                                ClassName: item.ClassName,
                                Capacity: item.Capacity,
                                StartTime: item.StartTime,
                                EndTime: item.EndTime,
                                isDeleted: item.isDeleted
                            }
                        })
                        
                        break

                    case "trainee":
                        listClass = await Enrollment.find({Trainee: accountId})
                        .populate("Class")

                        listClass = listClass.map(item =>{
                            return {
                                Id: item.Class._id,
                                ClassName: item.Class.ClassName,
                                Capacity: item.Class.Capacity,
                                StartTime: item.Class.StartTime,
                                EndTime: item.Class.EndTime,
                                isDeleted: item.Class.isDeleted,
                                listTrainee: []
                            }
                        })

                        for(let classItem of listClass){
                            let listMember = await Enrollment.find({Class: classItem.Id})
                            .populate("Trainee")

                            listMember = listMember.map(item =>{
                                return {
                                    Id: item.Trainee._id,
                                    UserName: item.Trainee.UserName,
                                    Name: item.Trainee.Name,
                                    Email: item.Trainee.Email,
                                    Phone: item.Trainee.Phone,
                                    Address: item.Trainee.Address,
                                    isActive: item.Trainee.isActive,
                                    Password: "",
                                    ActivationCode: item.Trainee.ActivationCode,
                                    ResetPasswordCode: item.Trainee.ResetPasswordCode
                                }
                            })

                            classItem.listTrainee = [...listMember]
                        }
                        break

                    case "trainer":
                        listClass = await Assignment.find({Trainer: accountId})
                        .populate("Class")

                        listClass = listClass.map(item =>{
                            return {
                                Id: item.Class._id,
                                ClassName: item.Class.ClassName,
                                Capacity: item.Class.Capacity,
                                StartTime: item.Class.StartTime,
                                EndTime: item.Class.EndTime,
                                isDeleted: item.Class.isDeleted,
                                listTrainee: []
                            }
                        })

                        for(let classItem of listClass){
                            let listMember = await Enrollment.find({Class: classItem.Id})
                            .populate("Trainee")

                            listMember = listMember.map(item =>{
                                return {
                                    Id: item.Trainee._id,
                                    UserName: item.Trainee.UserName,
                                    Name: item.Trainee.Name,
                                    Email: item.Trainee.Email,
                                    Phone: item.Trainee.Phone,
                                    Address: item.Trainee.Address,
                                    isActive: item.Trainee.isActive,
                                    Password: "",
                                    ActivationCode: item.Trainee.ActivationCode,
                                    ResetPasswordCode: item.Trainee.ResetPasswordCode
                                }
                            })

                            classItem.listTrainee = [...listMember]
                        }
                       

                        break    

                    default:
                        break
                }

                

                return showErrorClient(res, 200, {
                    isSuccess: true,
                    message: "Your action is done successfully",
                    listClass
                })
            }

            return showErrorClient(res, 400, {
                isSuccess: false,
                message: "Cannot get list class",
            })
            
               

        } catch (error) {
            showErrorSystem(res, error)
        }
    },

    /**
     * Edit class
     */
    edit: async function(req, res){
        const {ClassName, Capacity, StartTime, EndTime} = req.body
        const {id} = req.params
        const {accountId} = req

        try {
            const account = await Admin.findById(accountId)
            

            if(account){
                // check time
                const d = new Date()
                const now = {
                    date: d.getDate(), 
                    month: d.getMonth(), 
                    year: d.getFullYear()
                }

                let start = splitTimeString(StartTime)
                let end = splitTimeString(EndTime)

                if(start && end){
                    if(compareTime(now, start) && compareTime(start, end) && Capacity > 0){
                        const data = {
                            ClassName,
                            Capacity,
                            StartTime,
                            EndTime
                        }
                        const updateClass = await Class.findByIdAndUpdate(id, data).lean()
        
                        if(updateClass){
                            return showErrorClient(res, 200, {
                                isSuccess: true,
                                message: "Your action is done successfully",
                                class: {
                                    ...updateClass,
                                    ...data
                                }
                            })
                        }
                    }
                }
            }

            return showErrorClient(res, 400, {
                isSuccess: false,
                message: "Cannot update this class"
            })
            
               

        } catch (error) {
            showErrorSystem(res, error)
        }
    },

    /**
     * Remove class
     */
    remove: async function(req, res){
        const {id} = req.params
        const {accountId} = req

        try {
            const account = await Admin.findById(accountId)

            if(account){

                const removeClass = await Class.findByIdAndUpdate(id, {isDeleted: true})

                if(removeClass){
                    return showErrorClient(res, 200, {
                        isSuccess: true,
                        message: "Your action is done successfully",
                        class: removeClass
                    })
                }
                
            }

            return showErrorClient(res, 400, {
                isSuccess: false,
                message: "Cannot update this class"
            })
            
               

        } catch (error) {
            showErrorSystem(res, error)
        }
    },


    /**
     * Remove class
     */
    getClassDetail: async function(req, res){
        const {id} = req.params
        const {accountId, typeUser} = req

        try {
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

            let class_res = null
            let listTrainee = []

            if(account){
                class_res = await Class.findById(id).lean()
                listTrainee = await Enrollment.find({Class: id})
                .populate("Trainee")

                class_res= {
                    Id: class_res._id,
                    ClassName: class_res.ClassName,
                    Capacity: class_res.Capacity,
                    StartTime: class_res.StartTime,
                    EndTime: class_res.EndTime,
                    isDeleted: class_res.isDeleted,
                }

                class_res["listTrainee"] = listTrainee.map(item =>{
                    return {
                        Id: item.Trainee._id,
                        UserName: item.Trainee.UserName,
                        Name: item.Trainee.Name,
                        Email: item.Trainee.Email,
                        Phone: item.Trainee.Phone,
                        Address: item.Trainee.Address,
                        isActive: item.Trainee.isActive,
                        Password: "",
                        ActivationCode: item.Trainee.ActivationCode,
                        ResetPasswordCode: item.Trainee.ResetPasswordCode
                    }
                })


                return showErrorClient(res, 200, {
                    isSuccess: true,
                    message: "Your action is done successfully",
                    class_res
                })
                
            }

            return showErrorClient(res, 400, {
                isSuccess: false,
                message: "Can not get this class"
            })

        } catch (error) {
            showErrorSystem(res, error)
        }
    }


}