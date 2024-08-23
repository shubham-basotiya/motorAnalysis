import react from 'react';


export default function Logout(){
    const cleartokenData = () => {
        if(sessionStorage.getItem('token')){
        sessionStorage.clear();
        document.location.reload();
        }
    }
    return(
        <button className="btn btn-primary form-control" onClick={cleartokenData}>Logout</button>
    );
}