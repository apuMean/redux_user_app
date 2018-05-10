import axios from 'axios';
const ACTION_TYPE='SELECTED_USER';

export function  selectUser(userid){
    return function(dispatch, getState){
        axios.get("http://localhost:4000/api/users/getUserById",{
            params: {
              id: userid
            }
          }).then(response => {
           return dispatch({type:ACTION_TYPE ,payload:response.data.data});
       }).catch(error => { throw error });
    }
}