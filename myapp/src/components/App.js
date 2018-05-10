import React, { Component } from 'react';
import UserList from '../container/user_list';
import UserDetail from '../container/user_details';
import '../bootstrap/dist/css/bootstrap.css';

class App extends Component {

  render() {
    return (
      <div className="container">
        <div className="container">
  <div className="row">
   <div className="col-sm-6">
          <UserList />
        </div>
   <div className="col-sm-6">
          <UserDetail />
        </div>
  </div>
       
        </div>
      </div>
    );
  }
}

export default App;
