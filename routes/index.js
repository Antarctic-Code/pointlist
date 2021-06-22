const express = require("express");
const route = express.Router();

//Import Controlers
const userController = require("../controllers/userController");
const placeController = require("../controllers/placeController");



module.exports = () => {
  route.get("/", (req, res, next) => {
    return res.send("home");
  });


  //---User-----
//POST Add newUser 
route.post('/user', userController.newUser);
//GET alld user 
route.get('/user' , userController.allUser);
//GET one user
route.get('/user/:id', userController.oneUser);
//DELETE user
route.delete('/user/:id', userController.deleteUser);
//PUT update user 
route.put('/user/:id', userController.updateUser);
//PATCH update user 
route.patch('/user/update/:id', userController.updateUserPass);
//PATCH update user 
route.patch('/user/reset/:id', userController.resetUserPass);
//POST Login
route.post('/login', userController.login);


//---Place-----
//POST Add newPlace 
route.post('/place', placeController.newPlace);
//GET all place 
route.get('/place' , placeController.allPlace);
//GET one place
route.get('/place/:id', placeController.onePlace);
//GET place radius 
route.get('/place/radius/:id', placeController.allPlaceByRadius);
//DELETE place
route.delete('/place/:id', placeController.deletePlace);
//PUT update place 
route.put('/place/:id', placeController.updatePlace);


  return route;
};
