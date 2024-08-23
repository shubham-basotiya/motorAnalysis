import { useState } from "react";
import { PropTypes } from 'prop-types';

function ForgetPwd({setToken}) {
    const  motorbackend = 'https://motorbackend.onrender.com';
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleResetPwd = async (e) => {
        e.preventDefault();

        if(email === ('' || undefined) && newPassword === ( '' || undefined)){
            alert('Please enter your registered email and new password');
            return;
        }

        try{
            const response = await fetch(`${motorbackend}/forgetpassword`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email, newPassword}) // FormData object
            });


        const token = await response.json();

        if(token.error !== "no data"){
            // console.log("token" + token);
            // setToken(token);
            document.location.href = 'https://motoranalysis.onrender.com';
        } else{
            alert("wrong email and password");
        }

        } catch (error) {
            console.error('Error reseting password: ', error.message);
        }
    }

    return ( 
        <div>
            <form onSubmit={handleResetPwd}>
                <div className="mb-3">
                    <label style={{float: "left", fontWeight: "bold"}}>Email:</label>
                    <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label style={{float: "left", fontWeight: "bold"}}>New Password:</label>
                    <input className="form-control" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <input className="form-control btn btn-dark" type="submit" value="Reset Password" />
            </form>
        </div>
     );
}

export default ForgetPwd;

ForgetPwd.propTypes = {
    setToken: PropTypes.func.isRequired
}
