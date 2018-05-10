import React, { Component } from 'react'
import { connect } from 'react-redux'
import '../bootstrap/dist/css/bootstrap.css';
class UserDetail extends Component {
    constructor(props) {
        super(props);

    }

    render() {

        const user = this.props.user;

        if (!this.props.user) {

            return <div className="col-sm-12"><br /><h4> Please  Select Any user </h4></div>

        }


        return (
            <div>
       <h3>{user.firstname}'s Details are:</h3>
       <table className="table table-hover" >
        <tbody >
        <tr >
             <th>firstname</th>
            <th>lastname</th>
            <th>email</th>
            <th>contact</th>
            </tr>
            <tr>
                <td>{user.firstname}</td>
                <td>{user.lastname}</td>
                <td>{user.email}</td>
                <td>{user.contact}</td>
            </tr>
        </tbody>
    </table>
</div>
        )
    }

}
function mapStateToProps(state, ownProps) {

    return {
        user: state.activeUser
    };
}

export default connect(mapStateToProps)(UserDetail)