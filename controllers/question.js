const Admin = require('./../models/Admin')
const Topic = require('./../models/Topic')
const Question = require('./../models/Question')

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
     * Add new question
     */
    add: async function(req, res){
        const {QuestionContent, TopicId} = req.body
        const {accountId} = req

        try {
            const account = await Admin.findById(accountId)
            const topic = await Topic.findById(TopicId)

            if(account && topic){
                const newQuestion = new Question({
                    QuestionContent,
                    TopicId
                })

                await newQuestion.save()

                return showErrorClient(res, 200, {
                    isSuccess: true,
                    message: "Your action is done successfully",
                    question: newQuestion
                }) 
            }


            return showErrorClient(res, 400, {
                isSuccess: false,
                message: "Can not add this question"
            })
               

        } catch (error) {
            showErrorSystem(res, error)
        }
    },

    /**
     * Edit question
     */
    edit: async function(req, res){
        const {QuestionContent, TopicId} = req.body
        const {accountId} = req
        const {id} = req.params

        try {
            const account = await Admin.findById(accountId)
            const topic = await Topic.findById(TopicId)

            if(account && topic){
                const editQuestion = await Question.findByIdAndUpdate(id, {
                    QuestionContent,
                    TopicId
                }).lean()

                return showErrorClient(res, 200, {
                    isSuccess: true,
                    message: "Your action is done successfully",
                    question: {
                        ...editQuestion,
                        QuestionContent,
                        TopicId
                    }
                }) 
            }


            return showErrorClient(res, 400, {
                isSuccess: false,
                message: "Can not edit this question"
            })
               

        } catch (error) {
            showErrorSystem(res, error)
        }
    },

    /**
     * Get list question
     */
    getListQuestion: async function(req, res){
        const {accountId} = req

        try {
            const account = await Admin.findById(accountId)

            if(account){
               
                let listQuestion = await Question.find({isDeleted: false})
                .populate("TopicId")

                listQuestion = listQuestion.map(item =>{
                    return {
                        Id: item._id,
                        TopicId: item.TopicId._id,
                        TopicName: item.TopicId.TopicName,
                        QuestionContent: item.QuestionContent,
                        isDeleted: item.isDeleted
                    }
                })

                return showErrorClient(res, 200, {
                    isSuccess: true,
                    message: "Your action is done successfully",
                    listQuestion
                }) 
            }


            return showErrorClient(res, 400, {
                isSuccess: false,
                message: "Can not get list question"
            })
               

        } catch (error) {
            showErrorSystem(res, error)
        }
    },


    /**
     * Get list question
     */
    getDetail: async function(req, res){
        const {accountId} = req
        const {id} = req.params

        try {
            const account = await Admin.findById(accountId)

            if(account){

                let question = await Question.findById(id)
                .populate("TopicId")

                question = {
                    Id: question._id,
                    TopicId: question.TopicId._id,
                    TopicName: question.TopicId.TopicName,
                    QuestionContent: question.QuestionContent,
                    isDeleted: question.isDeleted
                }

                return showErrorClient(res, 200, {
                    isSuccess: true,
                    message: "Your action is done successfully",
                    question
                }) 
            }


            return showErrorClient(res, 400, {
                isSuccess: false,
                message: "Can not get this question"
            })
               

        } catch (error) {
            showErrorSystem(res, error)
        }
    },

    /**
     * Get list question of topic
     */
    getListQuestionOfTopic: async function(req, res){
        const {TopicId} = req.body
        const {accountId} = req

        try {
            const account = await Admin.findById(accountId)

            if(account){

                let listQuestion = await Question.find({TopicId, isDeleted: false})
                .populate("TopicId")

                listQuestion = listQuestion.map(item =>{
                    return{
                        Id: item._id,
                        TopicId: item.TopicId._id,
                        TopicName: item.TopicId.TopicName,
                        QuestionContent: item.QuestionContent,
                        isDeleted: item.isDeleted
                    }
                })

                return showErrorClient(res, 200, {
                    isSuccess: true,
                    message: "Your action is done successfully",
                    listQuestion
                }) 
            }


            return showErrorClient(res, 400, {
                isSuccess: false,
                message: "Can not get list question"
            })
               

        } catch (error) {
            showErrorSystem(res, error)
        }
    },

    /**
     * Add new question
     */
    delete: async function(req, res){
        const {accountId} = req
        const {id} = req.params

        try {
            const account = await Admin.findById(accountId)

            if(account){
                const deleteQuestion = await Question.findByIdAndUpdate(id, {isDeleted: true})

                return showErrorClient(res, 200, {
                    isSuccess: true,
                    message: "Your action is done successfully",
                    question: deleteQuestion
                }) 
            }


            return showErrorClient(res, 400, {
                isSuccess: false,
                message: "Can not remove this question"
            })
               

        } catch (error) {
            showErrorSystem(res, error)
        }
    },

}