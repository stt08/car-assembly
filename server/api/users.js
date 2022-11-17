const { ObjectId } = require('mongodb');
const mongo = require('./mongo.js');
const express = require('express');
const router = express.Router();

let empty = {_id: "-1"};

async function getdata() {
  return (await mongo.collection('users'));
}

router.get('/', async (req,res) => {
  let users = await getdata();
  res.send(await users.find({}).toArray());
})

router.get('/:id', async (req,res) => {
  let users = await getdata();
  try {
    let id = new ObjectId(req.params.id);
    res.send(await users.findOne({ _id: id }) || empty);
  } catch (e) { res.send(empty); }
})

router.post('/', async (req,res) => {
  // check if any of the required fields are empty
  if (req.body.name == "" || req.body.role == "" || req.body.secret == "") return res.status(400).send("Incorrect data");

  let users = await getdata();
  await users.insertOne({
    name: req.body.name,
    role: req.body.role,
    secret: req.body.secret,
    createdAt: new Date()
  })
  res.status(201).send();
})

router.post('/:id', async (req,res) => {
  // check if any of the required fields are empty
  if (req.body.name == "" || req.body.role == "" || req.body.secret == "") return res.status(400).send("Incorrect data");

  let users = await getdata();
  try {
    let id = new ObjectId(req.params.id);
    await users.updateOne({_id: id}, {$set:{
      name: req.body.name,
      role: req.body.role,
      secret: req.body.secret,
      createdAt: new Date()
    }});
    res.status(200).send();
  } catch (e) { res.send(empty); }
})

router.delete('/:id', async (req,res) => {
  let users = await getdata();
  await users.deleteOne({ _id: new ObjectId(req.params.id) });
  res.status(200).send();
})

router.get('/auth/:secret;:id', async (req,res) => {
  let users = await getdata();
  try {
    let id = new ObjectId(req.params.id);
    let user = await users.findOne({ _id: id, secret: req.params.secret }) || empty;
    if (user._id != '-1') {
      res.cookie('user', user._id.toString(), {expires: new Date(Date.now() + (1*60000))})
    }
    res.send(user);
  } catch (e) { res.send(empty); }
})

console.log("[express]: route created '/api/users'")
module.exports = router;
