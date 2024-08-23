import React, { Component } from 'react';

class BlogDetail extends Component {
    constructor(props){
        super(props);
    }
    render() { 
        return (
            <p>{this.props.match.params.id}</p>
        );
    }
}
 
export default BlogDetail;