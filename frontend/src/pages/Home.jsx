import React from 'react';
import BlogDetail from './BlogDetail';
import Blog from './Blog';
import Contact from './Contact';
import Login from './Login';
import SignUp from './SignUp';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Navbar';
import User from './User';
import Edit from './Edit';
import { useState, useEffect } from 'react';
import axios from 'axios';
// import ForgetPwd from './ForgetPwd';

function setToken(userToken) {
    sessionStorage.setItem('token', JSON.stringify(userToken));
}
function getToken(){
    const tokenString = sessionStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken?.token;
}

// function formatTime(totalSeconds) {
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const seconds = totalSeconds % 60;
  
//     const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
//     return formattedTime;
//   }
  



export default function Home() {

    const motorbackend = 'https://motorbackend.onrender.com';

    const [motorDetail, setmotorDetail] = useState([]);

    const [totalSeconds, setTotalSeconds] = useState(0);

    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
          setTotalSeconds(prevSeconds => prevSeconds + 1);
        }, 1000);
    
        return () => {
          clearInterval(intervalId);
        };
    }, []);

    // const formattedTime = formatTime(totalSeconds);

    useEffect(() => {
        axios.get(`${motorbackend}/motorDetail`,{
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            console.log(res);
            // console.log("typeof res.data : " + typeof(res.data));
            // alert("typeof res.data : " + typeof(res.data));
            setmotorDetail([...res.data]);
            setTotalPages(res.data.length);
            // console.log(motorDetail)
            console.log("type of motorDeatil after data come : " + Array.isArray(motorDetail));
        });
    }, []);

    const token = getToken();
    // console.log("login page");

    if(!token){
        // return <Login setToken={setToken} />;
        return (
            <div className="container text-center" style={{margin: 0}}>
                <div className='row'>
                    <div className="col-md-5" style={{borderRight: "5px solid #000", borderWidth: "0.5em"}}>
                        <Routes>
                            {/* <Route path='/forgetPwd' element={<ForgetPwd setToken={setToken} />} /> */}
                            <Route path="/signup" element={<SignUp setToken={setToken} /> } />
                            <Route path="/" element={<Login setToken={setToken} />} />
                        </Routes>
                    </div>
                    <div className="col-md-7">
                        <h1 className="display-6" style={{marginLeft: "300px"}}>Daily Motor Data</h1>
                        <br />
                        <table className='table'>
                            <thead className='table-dark'>
                                <tr>
                                    <th scope="col">#</th>    
                                    <th scope="col">M.S. Name</th>
                                    <th scope="col">M.S. Name</th>
                                    <th scope="col">M.S. Email</th>
                                    <th scope="col">M.S. Email</th>
                                    <th scope="col">Start Time</th>
                                    <th scope="col">End Time</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Difference</th>
                                    {/* <td>Time Duration</td> */}
                                </tr>
                            </thead>
                            <tbody>
                        
                                    {motorDetail.map(( item, index ) => {

                                    let istStartString, istStopString, hours, minutes, seconds;

                                    // Convert UTC to IST for each item
                                    let utcStartTimestamp = item.startTime; // Assuming startTime is in UTC

                                    // console.log(item);
                                    
                                    if('stopTime' in item)
                                    {
                                        // console.log("if condition");
                                        let utcStopTimestamp = item.stopTime; //Assuming stopTime is in UTC
                                        let utcStartDate = new Date(utcStartTimestamp);
                                        let utcStopDate = new Date(utcStopTimestamp);
                                        // Convert UTC to IST
                                        let istStartDate = new Date(utcStartDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
                                        let isStopDate = new Date(utcStopDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
                                        
                                        // Format the date in IST
                                        istStartString = istStartDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                                        istStopString = isStopDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                                        // console.log(istStartString, istStopString);
                                        let timeDiff = new Date(isStopDate - istStartDate);
                                        // let istDiffString = diff.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                                        // Convert the time difference to hours, minutes, and seconds
                                        hours = Math.floor(timeDiff / (1000 * 60 * 60));
                                        minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                                        seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
                                    } 
                                    
                                    else {
                                        // let utcStopTimestamp = new Date(); //Assuming stopTime is in UTC
                                        let utcStartDate = new Date(utcStartTimestamp);
                                    
                                        // // Convert UTC to IST
                                        let istStartDate = new Date(utcStartDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
                                        
                                        // Format the date in IST
                                        istStartString = istStartDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                                        
                                        istStopString = "Currently Motor On";
                                        
                                            // time counter if end time is not defined/ currently motor on (how much time when motor start)
                                            function calculateElapsedTime(start) {
                                                // console.log("else condition");
                                                let utcStopTimestamp = new Date(); //Assuming stopTime is in UTC
                                                // console.log(`stop utc time : ${utcStopTimestamp}`);
                                                let utcStartDate = new Date(start);
                                                let utcStopDate = new Date(utcStopTimestamp);
                                                // Convert UTC to IST
                                                let istStartDate = new Date(utcStartDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
                                                let isStopDate = new Date(utcStopDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
                                                
                                                let timeDiff = new Date(isStopDate - istStartDate);
                                                // let istDiffString = diff.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                                                // Convert the time difference to hours, minutes, and seconds
                                                let hours = Math.floor(timeDiff / (1000 * 60 * 60));
                                                let minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                                                let seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
                                            
                                                return {
                                                hours,
                                                minutes,
                                                seconds
                                                };
                                            }

                                            function updateCounter(start) {
                                            
                                                function update() {
                                                const elapsedTime = calculateElapsedTime(start);
                                            
                                                hours = elapsedTime.hours;
                                                minutes = elapsedTime.minutes;
                                                seconds = elapsedTime.seconds;

                                    
                                                }
                                    
                                                update();
                                                
                                                // const interval = setInterval(update, 1000); // Update every second
                                                
                                            }

                                        


                                        // Set your starting time (e.g., '2023-01-01T00:00:00')
                                        const startingTime = utcStartTimestamp;

                                        // Call the function with the starting time
                                        const updatedCounterTime = updateCounter(startingTime);
                                
                                

                                    }
                                    
                                        return (
                                        <tr key={index}>
                                            <th scope='row'> {index+1}</th>
                                            <td>{item.userName[0]}</td>
                                            <td>{item.userName[1] === undefined ? 'null': item.userName[1]}</td>
                                            <td>{item.userEmail[0]}</td>
                                            <td>{item.userEmail[1] === undefined ? 'null' : item.userEmail[1]}</td>
                                            <td>{istStartString}</td>
                                            <td>{istStopString}</td>
                                            <td>{item.status === true ? 'on' : 'off'}</td>
                                            {/* {!('stopTime' in item) && <td>{`${formattedTime}`}</td>} */}
                                            <td>{`${hours}Hr:${minutes}Min:${seconds}Sec`}</td>
                                        </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
    return (
        //  <Navbar />
        <Routes>
            <Route path="/edit/:id" element={<Edit />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/blog" element={<Blog />} />
            {/* <Route path="/signup" element={SignUp} /> */}
            <Route path="/contact" element={<Contact />} />
            <Route path="/users" element={<User />} />
            <Route path="/" element={<Navbar />} />
            {/* <Route path="/" render={(props) => <Home sortBy="new" {...props}/>} /> */}
        </Routes>
        // {/* <SignInSide /> */}
    );
}
