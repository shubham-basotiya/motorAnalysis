import { useState } from 'react';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
// import SignUp from './SignUp';
// import { Route } from 'react-router-dom';

async function loginUser(credentinals){
    return fetch('https://motorbackend.onrender.com/login', {
        method: "post",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentinals)
    })
    .then(res => res.json())
    .then(data => data);
}

export default function Login({setToken}){
    const [usEmail, setusEmail] = useState('');
    const [usPassword, setusPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(usEmail  + " " + usPassword);

        const token = await loginUser({
            usEmail, usPassword
        });
        // console.log("token : " + token);
        if(token.token !== "no data"){
            setToken(token);
            document.location.href = 'https://motoranalysis.onrender.com/';
        } else{
            alert("wrong email and password");
        }
    }
    
    return (
        <div className='Home'>
                <h1>Sign In</h1>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                            <label htmlFor="usname" style={{float: "left", fontWeight: "bold"}}>Username </label>
                            <input id="usname" className="form-control"type="email" onChange={e => setusEmail(e.target.value)} />
                    </div>
                    <div className='mb-3'>
                            <label htmlFor="pwd" style={{float: "left", fontWeight: "bold"}}>Password </label>
                            <input id="pwd" className="form-control" type="password" onChange={e => setusPassword(e.target.value)} />
                    </div>
                    <div className='mb-3'>
                            <input className="form-control btn btn-dark" type="submit" value="Sign In"/>
                    </div>
                </form>
                {/* <div className='mb-3'>
                    <Link to="/forgetPwd" className='btn btn-dark'>Forget Password</Link>
                </div> */}
                <div className='mb-3'>
                    <Link to="/signup" className="btn btn-link">Sign Up</Link>
                </div>
            </div>
    );
}

Login.propTypes = {
    setToken: PropTypes.func.isRequired
}