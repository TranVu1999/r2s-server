const Admin = require('./../models/Admin')
const Trainee = require('./../models/Trainee')
const Trainer = require('./../models/Trainer')
const Class = require('./../models/Class')
const Module = require('./../models/Module')
const Question = require('./../models/Question')
const Answer = require('./../models/Answer')
const Enrollment = require('./../models/Enrollment')
const Assignment = require('./../models/Assignment')

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
     * add answer
     */
    add: async function(req, res){
        const {listAnswer} = req.body

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

            if(listAnswer.length > 0){
                const enrollment_db = await Enrollment.findOne({
                    Class: listAnswer[0].ClassId,
                    Trainee: accountId
                })
                const assignment_db = await Assignment.findOne({
                    Class: listAnswer[0].ClassId,
                    Module: listAnswer[0].ModuleId
                })

                if(enrollment_db && assignment_db){
                    for(let answerItem of listAnswer){
                        let answer_db = await Answer.findOne({
                            Class: answerItem.ClassId,
                            Module: answerItem.ModuleId,
                            Question: answerItem.Question,
                            Trainee: accountId
                        }).lean()

                        if(!answer_db){
                            let newAnswer = new Answer({
                                Value: (answerItem.Value > 4 && answerItem.Value) || (!answerItem.Value) < 0 ? 4 : answerItem.Value,
                                Class: answerItem.ClassId,
                                Module: answerItem.ModuleId,
                                Question: answerItem.QuestionId,
                                Trainee: accountId
                            })

                            await newAnswer.save()
                        }
                    }

                    return res
                    .json({
                        isSuccess: true,
                        message: "Your action is done successfully"
                    })
                    
                }
            }

            return res
                .status(400)
                .json({
                    isSuccess: false,
                    message: "Can not add this answer"
                })

        } catch (error) {
            showErrorSystem(res, error)
        }
    },


    /**
     * get list comment
     */
    getListComment: async function(req, res){

        try {
            const {accountId} = req
            
            const account = await Admin.findById(accountId);

            if(!account){
                return res
                .status(400)
                .json({
                    isSuccess: false,
                    message: "This account is not found"
                })
            }
            
            let listAnswer = await Answer.find().lean()

            listAnswer = listAnswer.map(item =>{
                return {
                    Id: item._id,
                    ClassId: item.Class,
                    ModuleId: item.Module,
                    QuestionId: item.Question,
                    Value: item.Value
                }
            })
            
            return res
                .json({
                    isSuccess: true,
                    message: "Can not add this answer",
                    listAnswer
                })

        } catch (error) {
            showErrorSystem(res, error)
        }
    },



}