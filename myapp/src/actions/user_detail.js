import axios from 'axios';
const ACTION_TYPE='DETAIL_ACTION';

export function  getDetails(){
    return function(dispatch, getState){
        axios.get("http://localhost:4000/api/users/getUserById",{
            params: {
              id: key
            }
          }).then(response => {
           return dispatch({type:ACTION_TYPE ,payload:response.data.data});
       }).catch(error => { throw error });
    }
}
