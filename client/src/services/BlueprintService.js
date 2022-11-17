import axios from 'axios';

const url = 'http://localhost:3000/api/blueprints/';

class BlueprintService {
  // Handle errors
  static handelError(err) {
    if (err.request.status == 400) return 'One or more fields are empty!';
    else return err.code;
  }

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
    return axios.post(url, {name,items}).catch(err => this.handelError(err));
  }

  // Delete one item
  static delete(id) {
    return axios.delete(url+id);
  }

  // Modify one item
  static modify(id, name,items) {
    return axios.post(url+id, {name,items}).catch(err => this.handelError(err));
  }
}

export default BlueprintService;
