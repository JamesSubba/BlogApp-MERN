const userModel = require('../models/User');
const bcrypt = require("bcrypt");

class userController {

    static getAllUser = async (req, res, next) => {
        let users;
        try{
            users = await userModel.find();
        } catch (err) {
            console.log(err);
        }
        if(!users) {
            return res.status(404).json({message: "No Users Found"});
        }
        return res.status(200).json({users});
    }

    static signup = async (req,res,next) => {
        const {name, email, password} = req.body;
        let existingUser;

        try{
            existingUser = await userModel.findOne({email});
        }catch (err){
            return console.log(err);
        }

        if(existingUser){
            return res.status(400).json({message: "User already exits!"});
        }
        const hashedPassword = bcrypt.hashSync(password, 10);

        const user = new userModel({
            name,
            email,
            password: hashedPassword,
            blogs: []
        });
        try{
            await user.save();
        } catch (err){
            return console.log(err);
        }
        return res.status(201).json({user});
    };
    static login = async (req, res, next) => {
        const {email, password} = req.body;
        let existingUser;
        try{
            existingUser = await userModel.findOne({email});
        }catch(err){
            return console.log(err);
        }
        if(!existingUser){
            return res.status(404).json({message: "Could not find the user"});
        }
        const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message: 'incorrect incorrect credentials'});
        }return res.status(200).json({message: 'login successful', user: existingUser})
    }
}

module.exports = userController;