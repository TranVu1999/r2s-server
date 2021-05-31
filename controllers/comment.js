const Admin = require('./../models/Admin')
const Trainee = require('./../models/Trainee')
const Trainer = require('./../models/Trainer')
const Class = require('./../models/Class')
const Module = require('./../models/Module')
const Question = require('./../models/Question')
const Answer = require('./../models/Answer')
const Enrollment = require('./../models/Enrollment')
const Assignment = require('./../models/Assignment')
const TraineeComment = require('./../models/Trainee_Comment')

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


                let comment = {
                    Id: newComment._id,
                    Comment: newComment.Comment,
                    ClassId: newComment.Class,
                    ModuleId: newComment.Module,
                    TraineeId: newComment.Trainee
                }

                return res
                .status(200)
                .json({
                    isSuccess: true,
                    message: "Your action is done successfully",
                    comment
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
    },


    /**
     * get list comment by trainee
     */
    getListCommentByTrainee: async function(req, res){
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

            let listComment = await TraineeComment.find({Trainee: accountId})
            .populate("Class")
            .populate("Module")
            
            listComment = listComment.map(item =>{
                return {
                    Id: item._id,
                    Comment: item.Comment,
                    ClassId: item.Class._id,
                    ClassName: item.Class.ClassName,
                    ModuleId: item.Module._id,
                    ModuleName: item.Module.ModuleName
                }
            })

            return res
                .status(200)
                .json({
                    isSuccess: true,
                    message: "Your action is done successfully",
                    listComment
                })


        } catch (error) {
            showErrorSystem(res, error)
        }
    }

}