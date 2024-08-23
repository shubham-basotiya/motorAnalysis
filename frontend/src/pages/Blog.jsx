import React, { Component } from 'react';
import { Link } from 'react-router-dom';
function Blog(){
    const name = [
        {id: 0, name: "shubham"},
        {id: 1, name: "kunal"},
        {id: 2, name: "keshav"}
    ]
    return(
        <div className='Blog'>
            <h1>Blog page</h1>
            {name.map((name) => <Link to={`/blog/${name.id}`}>{name.name}</Link>)}
        </div>
    );
}

export default Blog;