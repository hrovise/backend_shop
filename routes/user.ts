
const path = require('path');

const express = require('express');
 require('dotenv').config('.env');

const Auth = require("../middleware/check-auth");


const router = express.Router();


import * as UserController from '../controllers/user.controller'; 




router.post('/resetpasswordrequest', UserController.passwordResetRequest);

router.post('/resetpassword', UserController.passwordReset);

router.get('/activate/user/:id', UserController.activateUser);

router.post('/signup', UserController.signup); 


router.post("/login", UserController.login); 


router.get('/getuser', Auth, UserController.getUser);
 

router.post("/dashboard", Auth, UserController.userDashboard ); 



router.post("/dashboard-search", Auth, UserController.getDashboardSearch);

router.post("/dashboard-search-user", Auth, UserController.getUserDashboardSearch);
router.post("/role", Auth, UserController.getUserRole);
router.post('/block', Auth, UserController.blockUser);
router.post('/unblock', Auth, UserController.unBlockUser);
router.post('/updateuser', Auth, UserController.updateUser);


module.exports = router;
