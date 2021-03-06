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
     * Add new topic
     */
    add: async function(req, res){
        const {TopicName} = req.body
        const {accountId} = req

        try {
            const account = await Admin.findById(accountId)

            if(account){
                const topic = await Topic.findOne({TopicName})

                if(!topic){
                    const newTopic = new Topic({TopicName})
                    await newTopic.save()

                    return showErrorClient(res, 200, {
                        isSuccess: true,
                        message: "Your action is done successfully",
                        topic: newTopic
                    })
                }
                
            }


            return showErrorClient(res, 400, {
                isSuccess: false,
                message: "Can not add this topic"
            })
               

        } catch (error) {
            showErrorSystem(res, error)
        }
    },


    /**
     * Get list topic
     */
    getListtopic: async function(req, res){
        const {accountId} = req

        try {
            const account = await Admin.findById(accountId)

            if(account){
                let listTopic = []
                const listTopic_db = await Topic.find().lean()
                const listQuestion_db = await Question.find({isDeleted: false}).lean()

                for(let topicItem of listTopic_db){
                    let topic = {
                        Id: topicItem._id,
                        TopicName: topicItem.TopicName,
                        listQuestion: []
                    }

                    for(let questionItem of listQuestion_db){
                        if(topic.Id.toString() === questionItem.TopicId.toString()){
                            let question = {
                                Id: questionItem._id,
                                QuestionContent: questionItem.QuestionContent
                            }

                            topic.listQuestion.push(question)
                        }
                    }

                    listTopic.push(topic)
                }

                return showErrorClient(res, 200, {
                    isSuccess: true,
                    message: "Your action is done successfully",
                    listTopic
                })
                
            }


            return showErrorClient(res, 400, {
                isSuccess: false,
                message: "Can not get list topic"
            })
               

        } catch (error) {
            showErrorSystem(res, error)
        }
    },

}