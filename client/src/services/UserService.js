import axios from 'axios';

const url = 'http://localhost:3000/api/users/';

class UserService {
  // Get all items
  static getUsers() {
    return new Promise((resolve, reject) => {
      axios.get(url).then((res) => {
        resolve(res.data);
      }).catch(err => { reject(err); })
    });
  }

  // Create one item
  static insertUser(name,secret,role) {
    return axios.post(url, {name,secret,role});
  }

  // Delete one item
  static deleteUser(id) {
    return axios.delete(`${url}${id}`);
  }

  // Modify one item
  static modifyUser(name,secret,role) {
    return axios.post(url, {name,secret,role});
  }

  static auth(strdata) {
    if (strdata.split(';').length != 2) return false;
    
    return axios.get(`${url}auth/${strdata}`)
  }
}

export default UserService;
