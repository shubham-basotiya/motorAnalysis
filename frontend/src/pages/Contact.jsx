import React, { Component } from 'react';

function Contact(){
    return(
        <div className='Contact'>
            <h1>Contact page</h1>
                <p>Name : Shubham Sharma</p>
                <p>Email - shubhambabai8@gmail.com</p>
            <p>Copyright@{`${new Date().getFullYear()}`}</p>
        </div>
    );
}

export default Contact;