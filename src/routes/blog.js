const router = require('express').Router();
const Blog = require('../models/Blog')
const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Your routing code goes here
router.post('/blog', async (req, res) => {
    try {
        let newBlog = await new Blog({
            topic: req.body.topic,
            description: req.body.description,
            posted_at: new Date(),
            posted_by: req.body.posted_by
        })
        newBlog.save().then(data => {
            res.json({
                mesasage: 'success',
                result: data
            })
        })
    }
    catch {
        err => {
            res.json({ mesasage: err.mesasage })
        }
    }
})

router.get('/blog', async (req, res) => {
    try {
        const blogRes = await Blog.find({ posted_by: new RegExp(req.query.search, "i") })
        const page = req.query.page
        const startIndex = (page - 1) * 5
        const lastIndex = page * 5
        const getblog = blogRes.splice(startIndex, lastIndex)
        res.status(200).json({
            status: "success",
            result: getblog
        })
    }
    catch {
        err => {
            res.status(401).json({ messaage: err.messaage })
        }
    }
})

router.put('/blog/:id', async (req, res) => {
    const id = req.params.id
    try {
        const blog = await Blog.findById(id)
        if (blog) {
            const newBlog = await Blog.findByIdAndUpdate(id, req.body)
            const updatedBlog = await newBlog.save()
            res.status(200).json({
                status: "success",
                result: updatedBlog
            })
        } else {
            res.status(401).json({
                message: "data not found"
            })
        }
    }
    catch {
        err => res.json({
            message: err.message
        })
    }
})

router.delete('/blog/:id', async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id)
        res.status(200).json({
            status: "success",
            result: deletedBlog
        })
    }
    catch {
        message: "Failed to delete"
    }
})

router.get('/blog', (req, res) => {
    res.json({ ok: 'blog' })
})


module.exports = router;