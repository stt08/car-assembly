const { ObjectId } = require('mongodb');
const mongo = require('./mongo.js');
const express = require('express');
const router = express.Router();

let empty = {_id: "-1"};

async function getdata() {
  return (await mongo.collection('products'));
}

router.get('/', async (req,res) => {
  let products = await getdata();
  res.send(await products.find({}).toArray());
})

router.get('/:id', async (req,res) => {
  let products = await getdata();
  try {
    let id = new ObjectId(req.params.id);
    res.send(await products.findOne({ _id: id }) || empty);
  } catch (e) { res.send(empty); }
})

router.post('/', async (req,res) => {
  // check if any of the required fields are empty
  if (req.body.name == "" || req.body.status == "" || !(req.body.price > 0) || !(req.body.amount > 0)) return res.status(400).send("Incorrect data")

  let products = await getdata();
  await products.insertOne({
    name: req.body.name,
    price: req.body.price,
    amount: req.body.amount,
    status: req.body.status,
    description: "",
    imageurl: "",
    createdAt: new Date()
  })
  res.status(201).send();
})

router.post('/:id', async (req,res) => {
  // check if any of the required fields are empty
  if (req.body.name == "" || req.body.status == "" || !(req.body.price > 0) || !(req.body.amount > 0)) return res.status(400).send("Incorrect data")

  let products = await getdata();
  try {
    let id = new ObjectId(req.params.id);
    await products.updateOne({_id: id}, {$set:{
      name: req.body.name,
      price: req.body.price,
      amount: req.body.amount,
      status: req.body.status,
      description: req.body.description,
      imageurl: req.body.imageurl,
      createdAt: new Date()
    }});
    res.status(200).send();
  } catch (e) { res.send(empty); }
})

router.delete('/:id', async (req,res) => {
  let products = await getdata();
  await products.deleteOne({ _id: new ObjectId(req.params.id) });
  res.status(200).send();
})


console.log("[express]: route created '/api/products'")
module.exports = router;
