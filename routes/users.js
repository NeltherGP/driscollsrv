var express = require('express');
var router = express.Router();
var conn = require('../db/conn')
const mongodb = require('mongodb');
const { route } = require('.');

/* GET users listing. */
router.get('/', async function(req, res, next) {
  

  try{
    
    const db = await conn.getDbConnection();
    const collection = db.collection('users');

    const result = await collection.find({}).toArray();

    res.json(result);
  }
  catch(error){
    console.error(error);
    res.status(500).json({ message: error.message });
  }

  
});

/**
 * Get user by Id
 */
router.get('/:id',async function(req,res,next){
  
  const userId = req.params.id;

  try {
    const db = await conn.getDbConnection();
    const collection = db.collection('users');

    const result = await collection.findOne({ _id: new mongodb.ObjectId(userId) }); 

    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
})

/**
 * Insert new user
 */
router.post('/insertUser',async function(req,res,next){
  //received data 
  const data = req.body;

  try{
    const db = await conn.getDbConnection();
    const collection = db.collection('users');

    const insert = await collection.insertOne(data);

    res.status(200).json({ message: 'User created' });

  }catch(error){
    console.error(error);
    res.status(500).json({ message: error.message });
  }
  
})

/**
 * Edit User
 */
router.put('/editUser',async function(req,res,next){
  
  //Id stores the user id to update and updateData stores the new values
  const {userId,...updateData} = req.body;
  

  if(!userId){
    res.status(400).json({ message: 'User Id not valid' });
  }
  try{
    
    const db = await conn.getDbConnection();
    const collection = db.collection('users');

    const update = await collection.updateOne(
      { _id: new mongodb.ObjectId(userId) },
      { $set: updateData }
    );

    res.status(200).json({ message: 'User updated' });

  }catch(error){
    console.error(error);
    res.status(500).json({ message: error.message });
  }
})

/**
 * Delete user
 */
router.delete('/deleteUser/:id',async function(req,res,next){
  const userId = req.params.id;

  if(!userId){
    res.status(400).json({ message: 'User Id not valid' });
  }
  try{
    
    const db = await conn.getDbConnection();
    const collection = db.collection('users');

    const del = await collection.deleteOne({ _id: new ObjectId(userId) });

    if (del.deletedCount > 0) {
      res.status(200).json({ message: 'User deleted' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }


  }catch(error){
    console.error(error);
    res.status(500).json({ message: error.message });
  }

})



module.exports = router;
