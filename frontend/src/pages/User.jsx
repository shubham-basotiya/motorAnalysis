import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function User()  {

    const  motorbackend = 'https://motorbackend.onrender.com';
    let token = sessionStorage.getItem('token');
    let tokenData = JSON.parse(token);
    token = tokenData.token;

    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
              const response = await fetch(`${motorbackend}/users`);
              const data = await response.json();
              console.log(data);
              setUsers(data);
            } catch (error) {
              console.log(error);
            }
        }
        fetchData();
    }, []);

    return (
        <table className='table'>
            <thead>
                <tr>
                    <th scope='col'>#</th>
                    <th scope='col'>Profile's Pic</th>
                    <th scope='col'>Profile's name</th>
                    <th scope='col'>Profile's email</th>
                </tr>
            </thead>
            <tbody>
            {
                users.map((item, index) => {
                    return (
                    <tr key={index+1}>         
                        <th scope='row'> {index + 1} </th>
                        <td>
                            {item.profile === undefined ?  
                                <img alt="profile_pic" src='https://motoranalysis.onrender.com/userpic.png' style={{height: "100px", width: "100px", borderRadius: "50%"}}/> 
                                : 
                                <img alt="profile_pic" src={`${motorbackend}/file/${item._id}`} style={{height: "100px", width: "100px", borderRadius: "50%"}}/>
                            }
                        </td>
                        <td>{`${item.fname} ${item.lname}`}</td>
                        <td><Link to={`/edit/${item._id}`}>{item._id === token ? "Your Profile" + item.email : item.email}</Link></td>
                    </tr>
                    );
                })
            }
            </tbody>
        </table>
    );
}