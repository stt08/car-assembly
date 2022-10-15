const { ObjectId } = require('mongodb');
const mongo = require('./mongo.js');
const express = require('express');
const router = express.Router();

let empty = {_id: "-1"};

async function getdata() {
  return (await mongo.collection('blueprints'));
}

router.get('/', async (req,res) => {
  let blueprints = await getdata();
  res.send(await blueprints.find({}).toArray());
})

router.get('/:id', async (req,res) => {
  let blueprints = await getdata();
  try {
    let id = new ObjectId(req.params.id);
    res.send(await blueprints.findOne({ _id: id }) || empty);
  } catch (e) { res.send(empty); }
})

router.post('/', async (req,res) => {
  let blueprints = await getdata();
  await blueprints.insertOne({
    name: req.body.name,
    items: req.body.items,  //waiting for Panta
    createdAt: new Date()
  })
  res.status(201).send();
})

router.post('/:id', async (req,res) => {
  let blueprints = await getdata();
  try {
    let id = new ObjectId(req.params.id);
    await users.updateOne({_id: id}, {$set:{
      name: req.body.name,
      items: req.body.items,
      createdAt: new Date()
    }});
    res.status(200).send();
  } catch (e) { res.send(empty); }
})

router.delete('/:id', async (req,res) => {
  let blueprints = await getdata();
  await blueprints.deleteOne({ _id: new ObjectId(req.params.id) });
  res.status(200).send();
})


console.log("[express]: route created '/api/blueprints'")
module.exports = router;
