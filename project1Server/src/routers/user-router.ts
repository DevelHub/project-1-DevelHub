import { Request, Response } from 'express';
import express from 'express';
import * as userDao from '../dao/user-dao';
import { authMiddleware } from '../security/authorization-middleware';

export const userRouter = express.Router();
// const nodemailer = require('nodemailer');
// const bcrypt = require('bcrypt');
/**
 * Register new user with email
 */
// userRouter.post('/registration', async (req, resp) => {
//     try {
//         const user = await userDao.findByEmail(req.body.email);
//         if(user) {
//             req.session.user = user;
//             const transporter = nodemailer.createTransport({
//                 service: 'gmail',
//                 auth: {
//                     user: 'soccfutbol16@gmail.com',
//                     pass: 'Danesoccer16'
//                 }
//             });
//             let code = "";
//             const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//             for (let i = 0; i < 7; i++) {
//                 code += possible.charAt(Math.floor(Math.random() * possible.length));
//             }
//             const mailOptions = {
//                 from: 'soccfutbol16@gmail.com',
//                 to: user.email,
//                 subject: 'Smite Battle Ground - Complete Clan Registration',
//                 html: `<h1>Please use this private member code to complete your registration</h1>
//                         ${code}
//                         <p>Register here: http://localhost:3000/register</p>`
//             };
            
//             await transporter.sendMail(mailOptions, function (error, info) {
//                 if(error) {
//                     resp.sendStatus(400);
//                 }
//                 else {
//                     console.log('Email sent: ' + info.response);
//                     req.session.privateCode = code;
//                     console.log(req.session.privateCode);
//                     resp.json(user);
//                 }
//             })
//         }
//         else {
//             resp.sendStatus(401);
//         }
//     } catch (err) {
//         console.log(err);
//         resp.sendStatus(500);
//     }
// });

/**
 * Officially register new user
 */
// userRouter.post('/registration/new', async (req, resp) => {
//     try {
//         console.log(req.session.privateCode);
//         if(req.session.privateCode !== req.body.privateCode) {
//             resp.sendStatus(400);
//         }
//         else {
//             const email = req.session.user.email;
//             const password = req.body.password;
//             const saltRounds = 10;
//             // bcrypt.hash(password, saltRounds, async (err, hash) => { 
//                 const hash = await bcrypt.hashSync(password, saltRounds);
//                 const userNew = await userDao.fillNewUser(req.body.username, hash, req.body.firstname, req.body.lastname, email);
//                 const user = await userDao.findByUsernameAndPassword(req.body.username, req.body.password);
//                 if(user) {
//                     req.session.privateCode = null;
//                     req.session.user = user;
//                     resp.json(user);
//                 }
//                 else {
//                     resp.sendStatus(401);
//                 }
//             //  })
//         }
//     } catch (err) {
//         console.log(err);
//         resp.sendStatus(500);
//     }
// });

/**
 * Check employee's autherithy
 */
userRouter.get('/emp', [
    authMiddleware('employee'),
    async (req: Request, resp: Response) => {
        console.log('at authmiddlware now');
        resp.sendStatus(200);
    }
]);

/**
 * Check employee's and manager's autherithy
 */
userRouter.get('/emp/man', [
    authMiddleware('employee', 'manager'),
    async (req: Request, resp: Response) => {
        console.log('at authmiddlware now');
        resp.sendStatus(200);
    }
]);

// /**
//  * Check manager's autherithy
//  */
// userRouter.get('/man', [
//     authMiddleware('manager'),
//     async (req: Request, resp: Response) => {
//         console.log('at authmiddlware now');
//         resp.sendStatus(200);
//     }
// ]);

/**
 * Check credentials when user login
 */
userRouter.post('/login', async (req, resp) => {
    try {
        const user = await userDao.findByUsernameAndPassword(req.body.username, req.body.password);
        if(user) {
            req.session.user = user;
            resp.json(user);
        }
        else {
            resp.sendStatus(401);
        }
    } catch (err) {
        console.log(err);
        resp.sendStatus(500);
    }
});

/**
 * Logout
 */
userRouter.get('/getout', async (req, resp) => {
    console.log('loging out now ');
    req.session.user = null;
    console.log('this is session2 ');
    console.log(req.session);
    resp.sendStatus(200);
});

/**
 * Add reimbursement
 */
userRouter.post('/reimbursements/insert', [
    authMiddleware('employee'),
    async (req: Request, resp: Response) => {
        try {
            const authorId = req.session.user.id;
            const reim = await userDao.addReimbursement(
                req.body.amount, req.body.submitted, req.body.description,
                authorId, req.body.typeId);
            resp.sendStatus(201);
        } catch (err) {
            console.log(err);
            resp.sendStatus(500);
        }
    }
]);

/**
* Get user's past reimbursements
*/
userRouter.get('/reimbursements/retrieve/:id', [
    authMiddleware('employee'),
    async (req, resp) => {
        console.log('retriving reimbursments now');
        const sessionId = req.session.user.id;
        try {
            const reim = await userDao.getReimbursments(sessionId);
            if(reim) {
                resp.json(reim);
            }
            else {
                resp.sendStatus(412);
            }
        } catch (err) {
            console.log(err);
            resp.sendStatus(500);
        }
    }
]);

/**
* Get all user's past reimbursements
*/
userRouter.get('/reimbursements/retrieve-all', [
    authMiddleware('manager'),
    async (req, resp) => {
        console.log('retriving all reimbursments now');
        try {
            const reim = await userDao.getAllReimbursments();
            if(reim) {
                resp.json(reim);
            }
            else {
                resp.sendStatus(412);
            }
        } catch (err) {
            console.log(err);
            resp.sendStatus(500);
        }
    }
])

/**
* Update reimbursement
*/
userRouter.post('/update/one', async (req, resp) => {
    console.log('updating one reimbursment');
    try {
        const resolverId = req.session.user.id;
        const update = await userDao.updateReimbursement(req.body.reimbId, req.body.resolved, resolverId, req.body.statusId);
        resp.sendStatus(201);
    } catch (err) {
        console.log(err);
        resp.sendStatus(500);
    }
})
