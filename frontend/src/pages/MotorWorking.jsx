import axios from 'axios';
import { useState, useEffect } from 'react';
import moment from 'moment';

export default function MotorWorking(){
    const  motorbackend = 'https://motorbackend.onrender.com';
    let token = sessionStorage.getItem('token');
    let tokenData = JSON.parse(token);
    token = tokenData.token;

    const [loggedInUserName, setLoggedInUserName] = useState();
    const [loggedInUserEmail, setLoggedInUserEmail] = useState();
    const [motorStatus, setStatus] = useState(false);
    const [loggedInUserId, setLoggedInUserId] = useState();

    const today = moment().format("YYYY-MM-DD");
    console.log(today);


    useEffect(() => {
        axios.get(`${motorbackend}/motorStatus?motor=${motorStatus}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            // console.log(res.data.motorStatus);
            setStatus(res.data.motorStatus);
            // console.log(res.data.loginUserFname);
            setLoggedInUserName(res.data.loginUserFname);
            // console.log(res.data.loginUserEmail);
            setLoggedInUserEmail(res.data.loginUserEmail);
            setLoggedInUserId(res.data.loggedInUserId);
        });
    }, []);

    const motorOn = async () => {
        // var motorObj = {};
        if(motorStatus === true){
            var motorObj = {userName: loggedInUserName, userEmail: loggedInUserEmail, stopTime: Date.now(), status: !(motorStatus)};
        } else{
            var motorObj = {userName: loggedInUserName, userEmail: loggedInUserEmail, startTime: Date.now(), status: !(motorStatus)};
        }
        axios.patch(`${motorbackend}/motorOn`, motorObj, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }).then(res => {
            setStatus(res.data);
        })
    }

    // const motorOff = async () => {
    //     axios.patch(`http://localhost:8080/motorOff`, {userName: loggedInUserName, userEmail: loggedInUserEmail, stopTime: Date.now(), status: !(motorStatus)}, {
    //         headers: {
    //             'Authorization': `Bearer ${token}`,
    //             'Content-Type': 'application/json'
    //         }
    //     }).then(res => {
    //         setStatus(res.data);
    //     })
    // }

    return(
        <div className='text text-primary'>
            Currently Motor Is: <input type="checkbox" checked = {motorStatus === true } onChange={() => {
                motorOn();
                // if(motorStatus === false){
                //     motorOn();
                // } else{
                //     motorOff();
                // }
            }} />
        </div>
    );
}