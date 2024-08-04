import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    tags: [
        {
            type: String
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    comments: [
        {
            user: String,
            comment: String,
            date:{
                type: Date,
                default: Date.now
            }
        }
    ],
    published: {
        type: Boolean,
        default: false
    },
    details1: {
        type: Boolean,
        default: true
    },
    details2: {
        type: Boolean,
        default: false
    }
});

const Article = mongoose.model('Article', ArticleSchema);

export default Article;