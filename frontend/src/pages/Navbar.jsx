import React, { Component} from 'react';
import { Link } from 'react-router-dom'
// import { useState, useEffect } from 'react';
import User from './User';
import Logout from './Logout';
import MotorWorking from './MotorWorking';
// import Contact from './Contact';
export default function Navbar(){

    return(
        <div className='Navbar'>
            <ul>
                {/* <li><Link to="/">Home</Link></li>
                <li><Link to="/blog">Blog</Link></li> */}
                <li><Link to="/contact">Contact</Link></li>
            </ul>

            <MotorWorking />

            <User />

            <Logout />
        </div>
    );
}