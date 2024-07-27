const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const jwt = require("jsonwebtoken");
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();
import { Request,Response} from "express";
const JWT_SECRET = require("../config");


router.post('/signin',async(req:Request,res:Response)=>{
    const email = req.body.email;
    const password = req.body.password;
    const phonenumber = req.body.phonenumber;
    const user = await prisma.admins.findFirst({
        where:{
            email:email
        }
    })
    if(user){
        const token = jwt.sign({
            email
        },JWT_SECRET);
        res.json({
            token
        })
    }
    else{
        res.status(411).json({
            message:"Incorrect email and pass"
        })
    }

});
router.post('/issue', adminMiddleware, async(req:Request, res:Response) => {
    // Implement course creation logic
    const {department,issue,labno,status} = req.body;
    const newIssue = await prisma.issues.create({
        data:{
            department,
            issue,
            labno,
            status
        }
    })
    
    console.log(issue);
    res.json({
        message:'Issue created successfully',issueId: newIssue.id
    })
});
router.get('/showIssue', async(req:Request,res:Response) => {

    const response = await prisma.issues.findMany({});
    console.log(response);
    res.json({
        issue: response
    })
})
module.exports = router;