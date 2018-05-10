import axios from 'axios';
const ACTION_TYPE='ACTION_TYPE';

export function  getData(){
    return function(dispatch, getState){
        axios.get('http://localhost:4000/api/users/getUsers').then(response => {
        //    console.log(response.data);
           return dispatch({type:ACTION_TYPE ,payload:response.data.data});
       }).catch(error => { throw error });
    }
}
