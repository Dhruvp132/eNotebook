const express = require('express')
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs');
let jwt = require('jsonwebtoken');
let fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Harryisagoodb$oy';

//ROUTE : 1
//create User using POST "api/auth". Doesn;t require auth
router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {

  let success = false; 
    // console.log(req.body);
    // const user = User(req.body);
    // user.save();
    //If error return error and bad request 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
    }

    //check whether with this email exists already 
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ success, error: "Sorry a user with this email already exists" })
      }

      //Salt and Hash the password before saving it to database 
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt) 
      
      // Create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      })
    // .then(user => res.json(user))
    // .catch(err => {console.log(err)
    // res.json({error : "Enter correct vals", message : err.message})})
    
    //Now we'll send token and user id in that token coz we've index on id 
    const data = {
      user : {
        id: user.id,
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET);  //sync method
    
    success = true; //To send success val and authtoken only when its true 
    res.json({success, authToken});
  } 
  catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error occured");
  }
})

// ROUTE : 2
// ======= Authenticate a User ============
router.post('/login', [ 
  body('email', 'Enter a valid email').isEmail(), 
  body('password', 'Password cannot be blank').exists(), 
], async (req, res) => {
  let success = false;
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success, errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    //findOne Mongoose finds the data available in the mongoose database 
    let user = await User.findOne({ email });
    if (!user) {
      success = false
      return res.status(400).json({ error: "Please try to login with correct credentials" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false
      return res.status(400).json({ success, error: "Please try to login with correct credentials" });
    }


    //this data is a payload
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})



//ROUTE 3
//Get User details using Post login required
router.post('/getuser',fetchuser, async (req, res) => {
  try{ 
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch(error){
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
})

module.exports = router