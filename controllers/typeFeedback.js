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
     * Add new type feedback
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
     * Get list type feedback
     */
     getListTypeFeedback: async function(req, res){
        const {accountId} = req

        try {
            const account = await Admin.findById(accountId)

            if(account){

                const listTypeFeedback = await TypeFeedback.find({isDeleted: false})

                return showErrorClient(res, 200, {
                    isSuccess: true,
                    message: "Your action is done successfully",
                    listTypeFeedback
                })
                
            }


            return showErrorClient(res, 400, {
                isSuccess: false,
                message: "Can not get list type feedback"
            })
               

        } catch (error) {
            showErrorSystem(res, error)
        }
    },

}