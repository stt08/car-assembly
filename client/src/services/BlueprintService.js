import axios from 'axios';

const url = 'http://localhost:3000/api/blueprints/';

class BlueprintService {
  // Get all items
  static load() {
    return new Promise((resolve, reject) => {
      axios.get(url).then((res) => {
        resolve(res.data);
      }).catch(err => { reject(err); })
    });
  }

  // Create one item
  static insert(name,items) {
    return axios.post(url, {name,items});
  }

  // Delete one item
  static delete(id) {
    return axios.delete(url+id);
  }

  // Modify one item
  static modify(id, name,items) {
    return axios.post(url+id, {name,items});
  }
}

export default BlueprintService;
