// const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function checkAuthorization(req, res, next) {
    const authHeader = req.headers['authorization'];
    console.log("headers : " + authHeader);
    const token = authHeader.split(' ')[1];
    // console.log(token);
    try{
    const user = jwt.verify(token, process.env.JWT_KEY);
    req.user = user;
    // const user = await Motorfile.findOne({email: req.body.usEmail});
    // console.log(req.user);
    // req.setHeader("Authorization", )
    next();
    } catch(err){
        console.log(err.message);
    }
}

module.exports = checkAuthorization;