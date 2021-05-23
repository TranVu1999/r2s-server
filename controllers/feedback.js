const Admin = require('./../models/Admin')
const Feedback = require('./../models/Feedback')
const Question = require('./../models/Question')
const TypeFeedback = require('./../models/TypeFeedback')
const Feedback_Question = require('./../models/Feedback_Question')
const { findById, findByIdAndUpdate } = require('./../models/Admin')


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
     * Add new feedback
     */
    add: async function(req, res){
        const {Title, TypeFeedbackId, listQuestion} = req.body

        try {
            const {accountId} = req
            const account = await Admin.findById(accountId)
            const typeFeedback = await TypeFeedback.findById(TypeFeedbackId)

            if(account && typeFeedback){

                let count = 0
                const listQuestion_db = await Question.find().lean()

                for(let item of listQuestion){
                    for(let item_db of listQuestion_db){
                        if(item === item_db._id.toString()){
                            console.log({item})
                            count++
                        }
                    }
                    
                }

                if(count === listQuestion.length){

                    const newFeedback = new Feedback({
                        AdminId: accountId,
                        TypeFeedbackId,
                        Title
                    })
                    await newFeedback.save()

                    for(let item of listQuestion){
                        let newFeedback_Question = new Feedback_Question({
                            FeedbackId: newFeedback._id,
                            QuestionId: item
                        })

                        await newFeedback_Question.save()
                    }

                    return res
                    .json({
                        isSuccess: true,
                        message: "Your action is done successfully",
                        feedback: newFeedback
                    })
                }
                
            }


            
            return showErrorClient(res, 400, {
                isSuccess: false,
                message: "Can not add this feedback"
            })
               

        } catch (error) {
            showErrorSystem(res, error)
        }
    },


    /**
     * Update feedback
     */
    update: async function(req, res){
        const {Title, TypeFeedbackId, listQuestion} = req.body
        const {id} = req.params

        try {
            const {accountId} = req
            const account = await Admin.findById(accountId)
            const typeFeedback = await TypeFeedback.findById(TypeFeedbackId)

            if(account && typeFeedback){

                let count = 0
                const listQuestion_db = await Question.find().lean()

                for(let item of listQuestion){
                    for(let item_db of listQuestion_db){
                        if(item === item_db._id.toString()){
                            count++
                        }
                    }
                    
                }

                if(count === listQuestion.length){

                    const updateFeedback = await Feedback.findByIdAndUpdate(id, {
                        AdminId: accountId,
                        TypeFeedbackId,
                        Title
                    })

                    if(updateFeedback){
                        const listOldFeedback_Question = await Feedback_Question.find({FeedbackId: id})
                        for(let item of listOldFeedback_Question){
                            await Feedback_Question.findByIdAndRemove(item._id)
                        }

                        for(let item of listQuestion){
                            let newFeedback_Question = new Feedback_Question({
                                FeedbackId: id,
                                QuestionId: item
                            })

                            await newFeedback_Question.save()
                        }

                        return res
                        .json({
                            isSuccess: true,
                            message: "Your action is done successfully",
                            feedback: updateFeedback
                        })
                    }
                }
                
            }


            
            return showErrorClient(res, 400, {
                isSuccess: false,
                message: "Can not update this feedback"
            })
               

        } catch (error) {
            showErrorSystem(res, error)
        }
    },


    /**
     * Get list feedback
     */
    getListFeedback: async function(req, res){

        try {
            const {accountId} = req
            const listAccount = await Admin.find().lean()
            
            let account = null
            for(let item of listAccount){
                if(item._id.toString() === accountId){
                    account = {...item}
                    break
                }
            }


            if(account){
                const listFeedback = await Feedback.find({isDeleted: false}).lean()
                const lenghtFeedback = listFeedback.length

                for(let item of listAccount){
                    for(let i = 0; i < lenghtFeedback; i++){
                        if(item._id.toString() === listFeedback[i].AdminId.toString()){
                            listFeedback[i]["AdminName"] = item.UserName
                        }
                    }
                }

                return res
                .json({
                    isSuccess: true,
                    message: "Your action is done successfully",
                    listFeedback: listFeedback
                })
            }
            
            return showErrorClient(res, 400, {
                isSuccess: false,
                message: "Can not get list feedback"
            })
               

        } catch (error) {
            showErrorSystem(res, error)
        }
    },


    /**
     * Remove feedback
     */
    removeFeedback: async function(req, res){
        const {id} = req.params

        try {
            const {accountId} = req
            const account = await Admin.findById(accountId)
            const updateFeedback = await Feedback.findByIdAndUpdate(id, {isDeleted: true})
            
            if(account && updateFeedback){
                return res
                .json({
                    isSuccess: true,
                    message: "Your action is done successfully",
                    feedback: updateFeedback
                })
            }
            
            return showErrorClient(res, 400, {
                isSuccess: false,
                message: "Can not remove this feedback"
            })
               

        } catch (error) {
            showErrorSystem(res, error)
        }
    },


    /**
     * Get feedback
     */
    getFeedback: async function(req, res){
        const {id} = req.params

        try {
            const {accountId} = req
            const account = await Admin.findById(accountId)
            const feedback_db = await Feedback.findById(id).lean()
            
            if(account && feedback_db){

                const test = await Feedback.findOne({Title: "New Feedback2"}).populate('AdminId')

                const test2 = await Feedback_Question.find({FeedbackId: feedback_db._id}).populate({
                    path: "QuestionId",
                    populate: {
                        path: "TopicId",
                        model: "Topic"
                    }
                })

                

                return res
                .json({
                    isSuccess: true,
                    message: "Your action is done successfully",
                    // test,
                    test2
                })
            }
            
            return showErrorClient(res, 400, {
                isSuccess: false,
                message: "Can not get this feedback"
            })
               

        } catch (error) {
            showErrorSystem(res, error)
        }
    },



}