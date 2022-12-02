const { ObjectId } = require('mongodb');
const { mongo } = require('./mongo.js');
const express = require('express');
const router = express.Router();

class Products {
  static empty = {_id: "-1"};

  static validator(obj) {
    if (obj.name == "" || obj.status == "" || !(parseInt(obj.price) > 0) || !(parseInt(obj.amount) > 0))
      return {status: 400, message: "Incorrect data"};

    return {status: 200, message: "OK"};
  }

  static async getdata() {
    return (await mongo.collection('products'));
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
        price: obj.price,
        amount: obj.amount,
        status: obj.status,
        description: "",
        imageurl: "",
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
        price: obj.price,
        amount: obj.amount,
        status: obj.status,
        description: obj.description || "",
        imageurl: obj.imageurl || "",
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
  res.send(await Products.getAll());
})

router.get('/:id', async (req,res) => {
  res.send(await Products.get(req.params.id));
})

router.post('/', async (req,res) => {
  let result = await Products.add(req.body);
  res.status(result.status).send(result.message);
})

router.post('/:id', async (req,res) => {
  let result = await Products.update(req.params.id, req.body);
  res.status(result.status).send(result.message);
})

router.delete('/:id', async (req,res) => {
  let result = await Products.delete(req.params.id);
  res.status(result.status).send(result.message);
})

console.log("[express]: route created '/api/products'")
module.exports = {router, Products};
