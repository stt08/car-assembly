const { ObjectId } = require('mongodb');
const { mongo } = require('./mongo.js');
const express = require('express');
const router = express.Router();

class Blueprints {
  static empty = {_id: "-1"};

  static validator(obj) {
    if (obj.name == "" || obj.items.length == 0)
      return {status: 400, message: "Incorrect data"};
    
    try {
      for (let i = 0; i < obj.items.length; i++) {
        if (obj.items[i].id == "" || !(parseInt(obj.items[i].amount) > 0))
          return {status: 400, message: "Incorrect data"};
      }
    } catch (e) { return {status: 400, message: "Incorrect data"}; }

    return {status: 200, message: "OK"};
  }

  static async getdata() {
    return (await mongo.collection('blueprints'));
  }

  static async getAll() {
    let data = await this.getdata();
    return (await data.find({}).toArray());
  }

  static async get(id) {
    let data = await this.getdata();
    try {
      let object_id = new ObjectId(id);
      return (await data.findOne({_id: object_id}));
    } catch (e) { /* nothing */ }
    return (this.empty);
  }

  static async add(obj) {
    let check = this.validator(obj);
    if (check.status != 200) return check;

    let data = await this.getdata();
    try {
      let resId = await data.insertOne({
        name: obj.name,
        items: obj.items,
        createdAt: new Date()
      }).then(result => result.insertedId);
      return {status: 200, message: resId};
    } catch (e) { /* nothing */ }
    return {status: 400, message: "Unable to post data"};
  }

  static async update(id, obj) {
    let check = this.validator(obj);
    if (check.status != 200) return check;

    let data = await this.getdata();
    try {
      let object_id = new ObjectId(id);
      await data.updateOne({_id: object_id}, {$set:{
        name: obj.name,
        items: obj.items,
        createdAt: new Date()
      }});
      return {status: 200, message: "OK"};
    } catch (e) { /* nothing */ }
    return {status: 400, message: "Unable to update data"};
  }

  static async delete(id) {
    let data = await this.getdata();
    try {
      let object_id = new ObjectId(id);
      await data.deleteOne({ _id: object_id });
      return {status: 200, message: "OK"};
    } catch (e) { /* nothing */ }
    return {status: 400, message: "Unable to delete data"};
  }
}

router.get('/', async (req,res) => {
  res.send(await Blueprints.getAll());
})

router.get('/:id', async (req,res) => {
  res.send(await Blueprints.get(req.params.id));
})

router.post('/', async (req,res) => {
  let result = await Blueprints.add(req.body);
  res.status(result.status).send(result.message);
})

router.post('/:id', async (req,res) => {
  let result = await Blueprints.update(req.params.id, req.body);
  res.status(result.status).send(result.message);
})

router.delete('/:id', async (req,res) => {
  let result = await Blueprints.delete(req.params.id);
  res.status(result.status).send(result.message);
})

console.log("[express]: route created '/api/blueprints'");
module.exports = {router, Blueprints};
