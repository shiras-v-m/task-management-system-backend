const express=require('express')

const router=new express.Router()

const userController=require('../controller/userController')

router.post('/user/register',userController.register)
router.post('/user/login',userController.login)
router.post('/user/addtask',userController.addTask)
router.post('/user/gettask',userController.getTask)
router.post('/user/getEditTask',userController.getEditTask)
router.post('/user/setEditTask',userController.setEditTask)
router.post('/user/deleteTask',userController.deleteTask)
router.post('/user/updateStatus',userController.updateStatus)
// router.post('/user/sortTask',userController.sortTask)

module.exports=router