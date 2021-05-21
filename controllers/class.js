const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')
const Admin = require('./../models/Admin')
const Class = require('./../models/Class')

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
    if(timeB.month < timeA.month) return 0
    if(timeB.date < timeA.date) return 0

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
                month: d.getMonth(), 
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
     * Add new class
     */
    getList: async function(req, res){
        const {typeUser} = req.params
        const {accountId} = req

        try {
            let listClass = []
            let account = null
            switch(typeUser){
                case "admin":
                    account = await Admin.findById(accountId)
                    listClass = await Class.find({isDeleted: false})
                    break
                default:
                    break
            }


            if(account){
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
                        isSuccess: false,
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
    }


}