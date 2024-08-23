import React from 'react';
import Home from './pages/Home';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div className="App" style={{ display: "flex", flexDirection: "column", minHeight: "100vh", margin: "0"}}>
        <Home />
        <footer className="footer" style={{marginTop: "auto", backgroundColor: "#f1f1f1", textAlign: "center", padding: "10px 0", width: "100%", borderTop: "1px solid #ccc"}}>
        <p className='center'>copyright&copy;{new Date().getFullYear()}</p>
        </footer>
    </div>
  );
}

export default App;