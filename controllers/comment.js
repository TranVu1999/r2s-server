const Admin = require('./../models/Admin')
const Trainee = require('./../models/Trainee')
const Trainer = require('./../models/Trainer')
const Class = require('./../models/Class')
const Module = require('./../models/Module')
const Question = require('./../models/Question')
const Answer = require('./../models/Answer')
const Enrollment = require('./../models/Enrollment')
const Assignment = require('./../models/Assignment')
const TraineeComment = require('./../models/TraineeComment')

const showErrorSystem = function(res, error){
    console.log(error)
    return res
    .status(500)
    .json({
        success: false,
        message: "Internal server error"
    })
}


module.exports = {
    /**
     * add comment
     */
    add: async function(req, res){
        const {
            ClassId, 
            ModuleId, 
            Comment
        } = req.body

        try {
            const {accountId} = req
            
            const account = await Trainee.findById(accountId);

            if(!account){
                return res
                .status(400)
                .json({
                    isSuccess: false,
                    message: "This account is not found"
                })
            }

            const class_db = await Class.findById(ClassId)
            const module_db = await Module.findById(ModuleId)

            if(class_db && module_db){
                const newComment = new TraineeComment({
                    Comment: Comment,
                    Class: ClassId,
                    Module: ModuleId,
                    Trainee: accountId
                })

                await newComment.save()

                return res
                .status(200)
                .json({
                    isSuccess: true,
                    message: "Your action is done successfully",
                    comment: newComment
                })
            }


            return res
                .status(400)
                .json({
                    isSuccess: false,
                    message: "Can not add this comment"
                })

        } catch (error) {
            showErrorSystem(res, error)
        }
    }

}