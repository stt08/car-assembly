const { ObjectId } = require('mongodb');
const mongo = require('./mongo.js');
const express = require('express');
const router = express.Router();

let empty = {_id: "-1"};

// loading all the items from the collection
async function getdata() {
  return (await mongo.collection('items'));
}

// show the data of the items
router.get('/', async (req,res) => {
  let items = await getdata();
  res.send(await items.find({}).toArray());
})


router.get('/:id', async (req,res) => {
  let items = await getdata();
  try {
    let id = new ObjectId(req.params.id);
    res.send(await items.findOne({ _id: id }) || empty);
  } catch (e) { res.send(empty); }
})

router.post('/', async (req,res) => {
  // check if any of the required fields are empty
  if (req.body.name == "" || !(req.body.amount < 0)) return res.status(400).send("Incorrect data");

  let items = await getdata();
  await items.insertOne({
    name: req.body.name,
    amount: req.body.amount,
    shelf: req.body.shelf,
    createdAt: new Date()
  })
  res.status(201).send();
})

router.post('/:id', async (req,res) => {
  // check if any of the required fields are empty
  if (req.body.name == "" || !(req.body.amount < 0)) return res.status(400).send("Incorrect data")

  let items = await getdata();
  try {
    let id = new ObjectId(req.params.id);
    await items.updateOne({_id: id}, {$set:{
        name: req.body.name,
        amount: req.body.amount,
        shelf: req.body.shelf,
        createdAt: new Date()
      }})
    res.status(200).send();
  } catch (e) { res.send(empty); }
})

router.delete('/:id', async (req,res) => {
  let items = await getdata();
  await items.deleteOne({ _id: new ObjectId(req.params.id) });
  res.status(200).send();
})

router.get('/auth/:secret;:id', async (req,res) => {
  let items = await getdata();
  try {
    let id = new ObjectId(req.params.id);
    let item = await items.findOne({ _id: id, secret: req.params.secret }) || empty;
    if (item._id != '-1') {
      res.cookie('item', item._id.toString(), {expires: new Date(Date.now() + (1*60000))})
    }
    res.send(item);
  } catch (e) { res.send(empty); }
})

console.log("[express]: route created '/api/items'")
module.exports = router;

