const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt-nodejs')
const Admin = require('./../models/Admin')
const Feedback = require('./../models/Feedback')
const Class = require('./../models/Class')
const Module = require('../models/Module')

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
     * Add new module
     */
    add: async function(req, res){
        const {
            ModuleName, 
            AdminId, 
            FeedbackId, 
            StartTime, 
            EndTime,
            FeedbackStartTime,
            FeedbackEndTime
        } = req.body

        try {
            if( AdminId &&
                ModuleName && FeedbackId && StartTime && 
                EndTime && FeedbackStartTime && FeedbackEndTime
            ){

                
                const {accountId} = req
                const account = await Admin.findById(accountId)

                if(!account){
                    return showErrorClient(res, 400, {
                        isSuccess: false,
                        message: "This account is not found"
                    }) 
                }

                // check time
                let flag = true
                const d = new Date()
                const now = {
                    date: d.getDate(), 
                    month: d.getMonth(), 
                    year: d.getFullYear()
                }

                let start = splitTimeString(StartTime)
                let end = splitTimeString(EndTime)
                if(
                    !start || !end || 
                    !compareTime(now, start) || !compareTime(start, end)
                ){
                    flag = false
                }

                let startFeedback = splitTimeString(FeedbackStartTime)
                let endFeedback = splitTimeString(FeedbackEndTime)
                if(
                    !startFeedback || !endFeedback || 
                    !compareTime(now, startFeedback) || 
                    !compareTime(startFeedback, endFeedback)
                ){
                    flag = false
                    
                }

                // check admin
                const admin = await Admin.findById(AdminId)
                if(!admin){
                    flag = false
                }

                // check feedback
                const feedback = await Feedback.findById(FeedbackId)
                if(!feedback){
                    flag = false
                }


                if(flag){
                    const module = new Module({
                        AdminId,
                        ModuleName,
                        StartTime,
                        EndTime,
                        FeedbackId,
                        FeedbackEndTime,
                        FeedbackStartTime
                    })

                    await module.save()

                    return res
                    .json({
                        isSuccess: true,
                        message: "Your action is done successfully",
                        module
                    })
                }
            }

            return showErrorClient(res, 400, {
                isSuccess: false,
                message: "Can not add this module"
            })

        } catch (error) {
            showErrorSystem(res, error)
        }
    },


    /**
     * Update module
     */
    update: async function(req, res){
        const {
            ModuleName, 
            AdminId, 
            FeedbackId, 
            StartTime, 
            EndTime,
            FeedbackStartTime,
            FeedbackEndTime
        } = req.body

        const {id} = req.params

        try {
            if( AdminId &&
                ModuleName && FeedbackId && StartTime && 
                EndTime && FeedbackStartTime && FeedbackEndTime
            ){

                
                const {accountId} = req
                const account = await Admin.findById(accountId)

                if(!account){
                    return showErrorClient(res, 400, {
                        isSuccess: false,
                        message: "This account is not found"
                    }) 
                }

                // check time
                let flag = true
                const d = new Date()
                const now = {
                    date: d.getDate(), 
                    month: d.getMonth(), 
                    year: d.getFullYear()
                }

                let start = splitTimeString(StartTime)
                let end = splitTimeString(EndTime)
                if(
                    !start || !end || 
                    !compareTime(now, start) || !compareTime(start, end)
                ){
                    flag = false
                }

                let startFeedback = splitTimeString(FeedbackStartTime)
                let endFeedback = splitTimeString(FeedbackEndTime)
                if(
                    !startFeedback || !endFeedback || 
                    !compareTime(now, startFeedback) || 
                    !compareTime(startFeedback, endFeedback)
                ){
                    flag = false
                    
                }

                // check admin
                const admin = await Admin.findById(AdminId)
                if(!admin){
                    flag = false
                }

                // check feedback
                const feedback = await Feedback.findById(FeedbackId)
                if(!feedback){
                    flag = false
                }


                if(flag){
                    const updateModule = await Module.findByIdAndUpdate(id, {
                        AdminId,
                        ModuleName,
                        StartTime,
                        EndTime,
                        FeedbackId,
                        FeedbackEndTime,
                        FeedbackStartTime
                    }, {new: true})

                    if(updateModule){
                        return res
                        .json({
                            isSuccess: true,
                            message: "Your action is done successfully",
                            module: updateModule
                        })
                    }

                    
                }
            }

            return showErrorClient(res, 400, {
                isSuccess: false,
                message: "Can not update this module"
            })

        } catch (error) {
            showErrorSystem(res, error)
        }
    },


    /**
     * Remove module
     */
    remove: async function(req, res){

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

            const updateModule = await Module.findByIdAndUpdate(id, {
                isDeleted: true
            }, {new: true})

            if(updateModule){
                return res
                .json({
                    isSuccess: true,
                    message: "Your action is done successfully",
                    module: updateModule
                })
            }

            return showErrorClient(res, 400, {
                isSuccess: false,
                message: "Can not remove this module"
            })

        } catch (error) {
            showErrorSystem(res, error)
        }
    },


    /**
     * Get list module
     */
    getListModule: async function(req, res){

        try {
            const {accountId} = req
            const account = await Admin.findById(accountId)

            if(!account){
                return showErrorClient(res, 400, {
                    isSuccess: false,
                    message: "This account is not found"
                }) 
            }

            const listModule = await Module.find({isDeleted: false})

            return res
            .json({
                isSuccess: true,
                message: "Your action is done successfully",
                listModule
            })

        } catch (error) {
            showErrorSystem(res, error)
        }
    },


}