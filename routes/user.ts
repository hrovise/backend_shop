
const path = require('path');
const filePath = path.join(__dirname, 'env');
const express = require('express');
 require('dotenv').config('.env');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Auth = require("../middleware/check-auth");
const  User = require('../models/user/user.model').UserModel;
const AccessHash = require('../models/user/access_hash/access_hash.model').AccessHashModel;

const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const PendingUser = require('../models/user/pendingUser.model').PendingUserModel;
const EmailService = require("../services/email.service");

const router = express.Router();
const ROLE_DEFAULT = 'USER';
const ROLE_ADMIN = 'ADMIN';

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
