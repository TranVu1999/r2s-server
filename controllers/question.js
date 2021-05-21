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
                    isSuccess: false,
                    message: "Can not add this question",
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

}