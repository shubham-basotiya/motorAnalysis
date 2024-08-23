import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
// import { useRadioGroup } from '@mui/material';

export default function Edit(){
    const  motorbackend = 'https://motorbackend.onrender.com';

    const home = useNavigate();

    let token = sessionStorage.getItem('token');
    let tokenData = JSON.parse(token);
    token = tokenData.token;

    const [userDetails, setUserDatail] = useState([]);
    const [current_login_id, setCurrentLoginId] = useState();
    const [uploadFieldId, setUploadFieldId] = useState(null);
    const [profile, setProfile] = useState(null);
    const [fname, setFname] = useState();
    const [lname, setLname] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const {id} = useParams();

    useEffect(() => {
        axios.get(`${motorbackend}/edit/${id}`,{
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            // console.log(res);
            setUserDatail(res.data.fetch_user_detail);
            setCurrentLoginId(res.data.current_login_user_id);
            setUploadFieldId(res.data.fetch_user_detail._id);
        });

    }
    , []
);

    const updateFormData = async (e) => {
        e.preventDefault();

        // if (!profile) {
        //     alert("Please select a file first");
        //     return;
        // }

        const formData = new FormData();
        formData.append('profile', profile);
        formData.append('fname', fname || userDetails.fname);
        formData.append('lname', lname || userDetails.lname);
        formData.append('email', email || userDetails.email);
        formData.append('password', password || userDetails.password);

        axios.patch(`${motorbackend}/edit/${userDetails._id}`, formData,
            {
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
                }
            }
        ).then(res => {
            setUserDatail(res.data);
            alert("account updated successfully");
            // home('/');
            // if(sessionStorage.getItem('token')){
                // sessionStorage.clear();
                // document.location.href = 'http://localhost:3000';
                // document.location.reload();
            // }
            
        });
    }
    
    const deleteAccount = async () => {
        // let lastCall = confirm('Are you sure to delete account?', 0);
        // if(lastCall){
            axios.delete(`${motorbackend}/user/${userDetails._id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            ).then(res => {
                alert("account delete successfully " + res.data.usEmail);
                // home('/');
                if(sessionStorage.getItem('token')){
                    sessionStorage.clear();
                    document.location.reload();
                    document.location.href = 'https://motoranalysis.onrender.com';
                }
                
            })
        // }
    }

    const readOnly = current_login_id === userDetails._id ? false : true; 
    return (
        <div>
            <form onSubmit={updateFormData}>
                    <div className="profile-photo-container">
                        <div className="mb-3">
                            <label className="form-label" style={{float: "left", fontWeight: "bold"}}>Profile Photo: </label>
                                { userDetails.profile ? userDetails.profile && profile 
                                    ? (<img src={URL.createObjectURL(profile)} className="profile-photo rounded" alt="Profile" style={{objectFit: 'cover', height: '200px', width: '200px', border: '1px solid black', borderRadius:' 50%'}} readOnly={readOnly} />) 
                                    : (<img src={`${motorbackend}/file/${uploadFieldId}`} className="profile-photo rounded form-control" alt="Profile" readOnly={readOnly} style={{objectFit: 'cover', height: '200px', width: '200px', border: '1px solid black', borderRadius:' 50%'}}/>) 
                                    : profile 
                                    ? (<img src={URL.createObjectURL(profile)} className="profile-photo rounded" alt="Profile" style={{objectFit: 'cover', height: '200px', width: '200px', border: '1px solid black', borderRadius:' 50%'}} readOnly={readOnly} />) 
                                    : (<img src="https://motoranalysis.onrender.com/userpic.png" className="profile-photo rounded" alt="Profile" style={{objectFit: 'cover', height: '200px', width: '200px', border: '1px solid black', borderRadius:' 50%'}} readOnly={readOnly}/>)
                                }
                            <input readOnly={readOnly} className="form-control" type="file" style={{ cursor: 'pointer', width: '200px', height: '200px', margin: "-200px 0 0 95px", zIndex: "1"}} onChange={e => setProfile(e.target.files[0])} />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label" style={{float: "left", fontWeight: "bold"}}>First Name: </label>
                        <input readOnly={readOnly} type="text" className="form-control" placeholder={userDetails.fname} onChange={e => setFname(e.target.value)} />
                    </div>
                    <div className='mb-3'>
                        <label className='form-label' style={{float: "left", fontWeight: "bold"}}>Last Name: </label>
                        <input readOnly={readOnly} type="text" className="form-control" placeholder={userDetails.lname} onChange={e => setLname(e.target.value)} />
                    </div>
                    <div className='mb-3'>
                        <label className='form-label' style={{float: "left", fontWeight: "bold"}}>Email: </label>
                        <input readOnly={readOnly} type="email" className="form-control" placeholder={userDetails.email} onChange={e => setEmail(e.target.value)} />
                    </div>
                    {current_login_id === userDetails._id && (
                        <div className='mb-3'>
                            <label className='form-label' style={{float: "left", fontWeight: "bold"}}>Password: </label>
                            <input readOnly={readOnly} type="password" className="form-control" placeholder={userDetails.password} onChange={e => setPassword(e.target.value)}/>
                        </div>
                    )}
                    <div className='mb-3'>
                            {current_login_id === userDetails._id && <input type="submit" value="Edit" className='btn btn-info form-control'/>}
                    </div>
                    <div className='mb-3'>
                            {current_login_id === userDetails._id && <button onClick={deleteAccount} className='btn btn-danger form-control'> Delete A/C</button>}
                    </div>
            </form>
        </div>
    );
}