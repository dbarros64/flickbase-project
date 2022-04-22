const express = require('express');
let router = express.Router();
const { checkLoggedIn } = require('../../middlewares/auth');

const { Article } = require('../../models/articleModel');
const { grantAccess } = require('../../middlewares/rolesMiddleware');

const { sortArgsHelper } = require('../../config/sortHelper');


// add single article
// admin, get, patch, delete single article, (Draft or public)
// get articles, no auth
// fetch articles, load more
// fetch articles with pagination

router.route("/admin/add_article")
.post(checkLoggedIn, grantAccess('createAny', 'article'), async (req, res) => {
    try {
        const article = new Article({
            ...req.body,
            score: parseInt(req.body.score)
        });

        const result = await article.save();
        res.status(200).json(result);

    } catch (error) {
        res.status(400).json({ message: "Error creating article", error: error })
    }
});


router.route("/admin/:id")
.get(checkLoggedIn, grantAccess('readAny', 'article'), async (req, res) => {
    try {
        const _id = req.params.id
        const article = await Article.findById(_id);
        if (!article || article.length === 0) {
            return res.status(400).json({ message: "Sorry, this article was not found." })
        } else {
            res.status(200).json(article);
        }

    } catch (error) {
        res.status(400).json({ message: "Error getting article", error: error })
    }
})

.patch(checkLoggedIn, grantAccess('updateAny', 'article'), async (req, res) => {
    try {
        const _id = req.params.id
        const article = await Article.findOneAndUpdate(
            {_id},
            {
                "$set": req.body
            },
            {
                new: true
            }
        );

        if (!article) return res.status(400).json({message: "Article not found"})
        res.status(200).json(article);

    } catch (error) {
        res.status(400).json({message:'Error updating article',error});
    }
})

.delete(checkLoggedIn, grantAccess('deleteAny', 'article'), async (req, res) => {
    try {
        const _id = req.params.id
        const article = await Article.findByIdAndDelete(_id)
        if (!article) {
            return res.status(400).json({ message: "Article not found"})
        }

        res.status(200).json({ message: `Article ${_id} has been deleted`})

    } catch (error) {
        res.status(400).json({ message: "Error locating article to delete", error: error })
    }
});


router.route("/admin/paginate")
.post(checkLoggedIn, grantAccess('readAny', 'articles'), async (req, res) => {
    try {
        // let aggregateQuery = Article.aggregate([
        //     {$match: {status: "public"}},
        //     {$match: {title: {$regex:/something/}}}
        // ])

        const limit = req.body.limit ? req.body.limit : 5;
        const aggQuery = Article.aggregate()
        const options = {
            page: req.body.page,
            limit,
            sort: {_id: "desc"}
        }
        const articles = await Article.aggregatePaginate(aggQuery, options)

        res.status(200).json(articles);

    } catch (error) {
        res.status(400).json({ message: "Problem with paginating articles", error: error })
    }
})

/// NO AUTH REQUIRED ///
router.route("/get_byid/:id")
.get(async (req, res) => {
    try {
        const _id = req.params.id;
        const article = await Article.find({_id: _id, status: "public"})
        if (!article || article.length === 0) {
            return res.status(400).json({ message: "Sorry, this article was not found." })
        }
        res.status(200).json(article)

    } catch (error) {
        res.status(400).json({ message: "Error getting article", error: error })
    }
})

router.route("/loadmore")
.post(async (req, res) => {
    try {
        // {sortBy: "_id", order: "desc", limit: '10', skip: 0}
        let sortArgs = sortArgsHelper(req.body)

        const articles = await Article
        .find({ status: 'public' })
        .sort([[sortArgs.sortBy, sortArgs.order]])
        .skip(sortArgs.skip)
        .limit(sortArgs.limit)

        res.status(200).json(articles);

    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error loading articles", error })
    }
})




module.exports = router;
