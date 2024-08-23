import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';

export default function SignUp({setToken}){
    const  motorbackend = 'https://motorbackend.onrender.com';
    const [uploadFieldId, setUploadFieldId] = useState(null);
    const [profile, setProfile] = useState(null);
    const [fname, setFname] = useState();
    const [lname, setLname] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    // let token = sessionStorage.getItem('token');
    // let tokenData = JSON.parse(token);
    // token = tokenData.token;

    const submitFormData = async (e) => {
        e.preventDefault();
    
        if (!profile) {
          alert("Please select a file first");
          return;
        }
    
        const formData = new FormData();
        formData.append('profile', profile);
        formData.append('fname', fname);
        formData.append('lname', lname);
        formData.append('email', email);
        formData.append('password', password);
    
        try {
          const response = await fetch(`${motorbackend}/signup`, {
            method: 'POST',
            body: formData // FormData object
          });
    
          const data = await response.json();
          setUploadFieldId(data.token._id); 
          setToken(data);
        
        // .then(r =>  r.json().then(data => ({body: data})))
        // .then(obj => {
        //     console.log(obj);
        //     setToken(obj.body);
        // });

        document.location.href = 'https://motoranalysis.onrender.com/';
        } catch (error) {
            console.error('Error uploading profile:', error);
        }
    };

    return (<div>
            <h1>Sign Up</h1>
            <form onSubmit={submitFormData}>
                    <div className="mb-3">
                        <label htmlFor="profilePic" style={{float: "left", fontWeight: "bold"}} class="form-label">Profile Photo </label>
                        <input class="form-control" type="file" id="profilePic" onChange={e => setProfile(e.target.files[0])} placeholder='profilePic'/> {/*{uploadFieldId ? (<img src={`http://localhost:8080/file/${uploadFieldId}`} className="rounded" alt="Profile" />) : ()} */}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="fname" style={{float: "left", fontWeight: "bold"}}>First Name </label>
                        <input type="text" id="fname" className="form-control" onChange={e => setFname(e.target.value)} placeholder='First Name'/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="lname" style={{float: "left", fontWeight: "bold"}}>Last Name </label>
                        <input type="text" id="lname" className="form-control" onChange={e => setLname(e.target.value)} placeholder='Last Name'/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="email" style={{float: "left", fontWeight: "bold"}}>Email </label>
                        <input id="email" className="form-control" type="email" onChange={e => setEmail(e.target.value)} placeholder='Email'/>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password" style={{float: "left", fontWeight: "bold"}} >Password </label>
                        <input id="password" className="form-control" type="password" onChange={e => setPassword(e.target.value)} placeholder='Password'/>
                    </div>
                    <div className='mb-3'>
                        <input type="submit" className='form-control btn btn-dark' value="Sign Up" />
                    </div>
            </form>
            <div className='mb-3'>
                    <Link to="/" className="btn btn-link">Sign In</Link>
                </div>
        </div>);
}

SignUp.propTypes = {
    setToken: PropTypes.func.isRequired
}