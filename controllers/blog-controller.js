const blogModel = require('../models/Blog')
const userModel = require('../models/User')
const mongoose = require('mongoose');

class blogController {
    static getAllBlogs = async (req, res, next) => {
        let blogs;
        try {
            blogs = await blogModel.find().populate("user");
        }catch (err) {
            return console.log(err);
        }
        if (!blogs) {
            return res.status(404).json({message: "No blogs found"})
        }
        return res.status(200).json({blogs});
    }
    static addBlog = async (req,res,next)=> {
        const {title, description, image, user} = req.body;
        console.log(title, description)

        let existingUser;
        try{
            existingUser = await userModel.findById(user);
        } catch (err) {
            return console.log(err);
        }
        if(!existingUser){
            return res.status(400).json({message: "User not found"});
        }
        const blog = new blogModel({
            title, 
            description,
            image,
            user
        });
        try {
            const session = await mongoose.startSession();
            session.startTransaction();
            await blog.save({session});
            existingUser.blogs.push(blog);
            await existingUser.save({session});
            await session.commitTransaction();
        } catch (err) {
            console.log(err);
            return res.status(500).json({message: err});
        }
        return res.status(200).json({blog});
    };
    static getById = async (req, res, next) => {
        const id = req.params.id;
        let blog;
        try {
            blog = await blogModel.findById(id);
        } catch (err){
            return console.log(err);
        }
        if(!blog) {
            return res.status(404).json({message: "No Blog Found"});
        }
        return res.status(200).json({blog});
    };
    static getByUserId = async (req, res, next) => {
        const userId = req.params.id;
        let userBlogs;
        try {
            userBlogs = await userModel.findById(userId).populate('blogs');
        } catch (err) {
            return console.log(err);
        }
        if(!userBlogs) {
            return res.status(404).json({message: "No Blog Found"});
        }
        return res.status(200).json({user: userBlogs});
    }
    static deleteBlog = async (req, res, next) => {
        const id = req.params.id;

        let blog;
        try {
            blog = await blogModel.findByIdAndRemove(id).populate("user");
            await blog.user.blogs.pull(blog);
            await blog.user.save();
        } catch (err) {
            console.log(err);
        }
        if(!blog) {
            return res.status(500).json({message: "unable to delete"})
        }
        return res.status(200).json({message: 'successfully deleted'});
    }
    static updateBlog = async (req, res, next) => {
        const {title, description} = req.body;
        const blogId = req.params.id;
        let blog;
        try {
            blog = await blogModel.findByIdAndUpdate(blogId, {
                title,
                description
            });
        } catch (err) {
            return console.log(err);
        }
        if (!blog) {
            return res.status(500).json({message: "Unable to update"});
        }
        return res.status(200).json({blog});
    }







}
module.exports = blogController;