const mongoose = require('mongoose');
require('dotenv').config();
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');



const articleSchema = mongoose.Schema({
    title: {
        type: String,
        maxLength: 100,
        required: [true, 'A title is required']
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    excerpt: {
        type: String,
        required: [true, 'An excerpt is required'],
        maxLength: 500
    },
    score: {
        type: Number,
        min: 0,
        max: 100,
        required: true
    },
    director: {
        type: String,
        required: true,
    },
    actors: {
        type: [String],
        required: true,
        validate: {
            validator: function(array) {
                return array.length >= 2
            },
            message: "You must add at least two actors"
        },
    },
    status: {
        type: String,
        required: true,
        enum: ['draft', 'public'],
        default: 'draft',
        index: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

articleSchema.plugin(aggregatePaginate);

const Article = mongoose.model('Article', articleSchema);

module.exports = { Article };