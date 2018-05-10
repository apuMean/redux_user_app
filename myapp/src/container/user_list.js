import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectUser } from '../actions/index.js';
import { bindActionCreators } from "redux";
import * as abc from '../actions/user_list';

class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }

        //  this.handleSubmit = this.handleSubmit.bind(this)
    }

    temp = [];

componentDidMount(){
    console.log('props ---->',this.props)
    console.log('getdata ---->',abc)
    this.props.actions.getData();
}
componentWillUpdate(nextProps){
    if(nextProps.users !== this.props.users){
        this.temp = nextProps.users ? nextProps.users : [];
    }
    
}
    handleSubmit(event) 
    {
        console.log("dssssssssss",event)
        // this.props.selectBook(books);
       
    }
    

    render() {
       
//       if (!this.props.books)
//         {
// return "data not found"

//         }

         
         const temp = this.props.users;
         const selectuser = this.props.selectUser;
        const data = this.temp.map(function (users) {
            return (
              
                <li 
                key={users.id}
                className="list-group-item"
                onClick={()=>selectuser(users.id)}>
                
                {users.firstname}

                </li>
            )
        })

        return (
            <ul>
                
                {data}
            </ul>
        )
    }
}

//CASE1:we want to take some state  and  map it to the props of our container..
//component to reducer
function mapStateToProps(state, ownProps) {
    console.log(state.users,"<<<<<<")
    return {
        users: state.users
    }
}

//CASE2: In which we take action creater 
//and make it available to be callled inside container also.

//anything returned from this function 
//will treated as props in the containers
//to connect action with component

function mapDispatchToProps(dispatch) {
    return{
        actions:bindActionCreators(abc,dispatch),
        selectUser:bindActionCreators(selectUser, dispatch)
    }
    //whenever an action eg selectbook is clicked 
    //or called the result shouls passed to all of the reducers.

    //2nd selectbook is the action creator from above and 1st is the key
    // return bindActionCreators({ selectUser: selectUser }, dispatch);

}
export default connect(mapStateToProps, mapDispatchToProps)(UserList);


