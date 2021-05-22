const Admin = require('./../models/Admin')
const TypeFeedback = require('./../models/TypeFeedback')

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
        const {TypeName} = req.body
        const {accountId} = req

        try {
            const account = await Admin.findById(accountId)

            if(account){
                const typeFeedback = await TypeFeedback.findOne({TypeName})

                if(!typeFeedback){
                    const typeFeedback = new TypeFeedback({
                        TypeName
                    })

                    await typeFeedback.save()

                    return showErrorClient(res, 200, {
                        isSuccess: true,
                        message: "Your action is done successfully",
                        typeFeedback: typeFeedback
                    })
                }
                
            }


            return showErrorClient(res, 400, {
                isSuccess: false,
                message: "Can not add this type feedback"
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

                const listTopic = await Topic.find()

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