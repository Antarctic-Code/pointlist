const User = require("../models/User");
const { body, validationResult } = require('express-validator');
require('dotenv').config({path: 'variables.env'});
const jwt = require('jsonwebtoken');


exports.newUser = async (req,res) => {
    const rules = [
        body('user').escape().run(req),
        body('user','user cannot be empty').notEmpty().run(req),
        body('user','user is not valid').isAlphanumeric().run(req),
        body('password','password cannot be empty').notEmpty().run(req),
        body('repassword','password cannot be empty').notEmpty().run(req),
        body('password','password is very short').isLength({min:5}).run(req),
        body('repassword','password is very short').isLength({min:5}).run(req),
        body('password',"Password doesn't match").notEmpty().equals(req.body.repassword).run(req)
    ];
    await Promise.all(rules);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log('newUser error :>> ', errors);
        return res.status(400).json({mensaje: errors});
    }
    
    const user = new User(req.body);
    user.user= user.user.toLowerCase();
    try {
        await user.save();
        console.log('user:', "Users created correctly")
        return res.status(200).json({mensaje: "Users created correctly"});
    } catch (error) {
        console.log('newUser error :>> ', error);
        return res.status(400).json({mensaje: error});
    }
    
};


exports.allUser = async (req,res) => {
    try {
        const user = await User.findAll({
            attributes: ['id','user']
        });
        return res.status(200).json(user);
    } catch (error) {
        console.log('allUser error :>> ', error);
        return res.status(400).json({mensaje: error});
    }
    
};


exports.oneUser = async (req,res) => {
    try {
        const user = await User.findByPk(req.params.id,{
            attributes: ['id','user']
        });
        if (!user) return res.status(200).json({mensaje: "Not found"});
        return res.status(200).json(user);
    } catch (error) {
        console.log('oneUser error :>> ', error);
        return res.status(400).json({mensaje: error});
    }
};


exports.deleteUser = async (req,res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(200).json({mensaje: "Not found"});
        user.destroy();
        return res.status(200).json({mensaje: "destroy item"});
    } catch (error) {
        console.log('deleteUser error :>> ', error);
        return res.status(400).json({mensaje: error});
    }
};


exports.updateUser = async (req,res) => {    
    const rules = [
        body('user').escape().run(req),
        body('user','user cannot be empty').notEmpty().run(req),
        body('user','user is not valid').isAlphanumeric().run(req)
    ];
    await Promise.all(rules);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log('updateUser error :>> ', errors);
        return res.status(400).json({mensaje: errors});
    }
    try {
        const newUser ={};
        newUser.user= req.body.user;
        newUser.name= req.body.name;
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(200).json({mensaje: "Not found"});
        Object.assign(user,newUser);        
        await user.save();
        console.log('user:', "Users updated correctly")
        return res.status(200).json({mensaje: "Users updated correctly"});
    } catch (error) {
        console.log('updateUser error :>> ', error);
        return res.status(400).json({mensaje: error});
    }
    
};


exports.updateUserPass = async (req,res) => {    
    const rules = [
        body('oldpassword','password cannot be empty').notEmpty().run(req),
        body('password','password cannot be empty').notEmpty().run(req),
        body('repassword','password cannot be empty').notEmpty().run(req),
        body('password','password is very short').isLength({min:5}).run(req),
        body('repassword','confirm password is very short').isLength({min:5}).run(req),
        body('password',"Password doesn't match").notEmpty().equals(req.body.repassword).run(req),
    ];
    await Promise.all(rules);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log('updateUser error :>> ', errors);
        return res.status(400).json({mensaje: errors});
    }
    var newPass = req.body.password;
    const passwordOld = req.body.oldpassword;
    try { 
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(200).json({mensaje: "Not found"});
        if(!user.verifyPassword(passwordOld)) return res.status(200).json({mensaje: "Password invalido"});
        user.password = user.hashPassword(newPass);   
        await user.save();
        console.log('user:', "Password updated correctly")
        return res.status(200).json({mensaje: "Password updated correctly"});

    } catch (error) {
            console.log('updateUser error :>> ', error);
            return res.status(400).json({mensaje: error});
        }
};


exports.resetUserPass = async (req,res) => {    
    const rules = [
        body('password','password cannot be empty').notEmpty().run(req),
        body('repassword','password cannot be empty').notEmpty().run(req),
        body('password','password is very short').isLength({min:5}).run(req),
        body('repassword','confirm password is very short').isLength({min:5}).run(req),
        body('password',"Password doesn't match").notEmpty().equals(req.body.repassword).run(req),
    ];
    await Promise.all(rules);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log('updateUser error :>> ', errors);
        return res.status(400).json({mensaje: errors});
    }
    var newPass = req.body.password;
    try { 
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(200).json({mensaje: "Not found"});
        user.password = user.hashPassword(newPass);   
        await user.save();
        console.log('user:', "Password updated correctly")
        return res.status(200).json({mensaje: "Password updated correctly"});

    } catch (error) {
            console.log('updateUser error :>> ', error);
            return res.status(400).json({mensaje: error});
        }
};




exports.login = async (req,res) => {    
    const user = await User.findOne({where:{user: req.body.user}});
    if (!user) return res.status(401).json({mensaje: "Usuario No Encontrado"});
    if (!user.verifyPassword(req.body.password)) return res.status(401).json({mensaje: "Contraseña No Valida"});
    const token = jwt.sign({
        user: user.user,
        id: user.id
    },
    process.env.SECRETO,
    {
        expiresIn: '1h'
    });
    res.json(token);
        
};