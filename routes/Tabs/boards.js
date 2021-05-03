const express = require("express");
const router = express.Router();
const Board = require("../../models/Board");
const User = require("../../models/User");
const routeGuard = require('../../configs/route-guard.config')
const xpath = require('xpath')
const axios = require('axios')
const { DOMParser } = require('xmldom')

// GET TITLE DESCRIPTION AND IMAGE FROM OG OPEN GRAPH SCRAPER

const xpaths = {
    title: 'string(//meta[@property="og:title"]/@content)',
    description: 'string(//meta[@property="og:description"]/@content)',
    image: 'string(//meta[@property="og:image"]/@content)'
}

const retrievePage = url => axios.request({ url })
const convertBodyToDoc = body => new DOMParser().parseFromString(body)
const nodesFromDoc = (document, xpathselector) => xpath.select(xpathselector, document);
const mapProps = (paths, document) =>
    Object.keys(paths).reduce((acc, key) =>
        ({ ...acc, [key]: nodesFromDoc(document, paths[key]) }), {});

const parseUrl = url =>
    retrievePage(url)
        .then((response) => {
            const document = convertBodyToDoc(response.data)
            const mappedProperties = mapProps(xpaths, document)
            return mappedProperties;
        })

// POST TITLE DESCRIPTION AND IMAGE FROM OG OPEN GRAPH SCRAPER

router.post('/scrape', (req, res) => {
    const { url } = req.body
    return parseUrl(url)
        .then((result) => res.json({ result }))
})

// DISPLAY FORM TO CREATE A BOARD

router.get('/board-input', routeGuard, (req, res) => {
    res.render('boards/boardForm');
})

// DISPLAY ALL BOARDS
router.get("/boards", routeGuard, (req, res, next) => {
    Board.find({ user: req.session.user._id })
        .then(boardsFromDB => {
            if (!boardsFromDB) {
                res.render('boards/boardList', {
                    boards: boardsFromDB,
                    message: "There is no post yet!"
                });
                return;
            }

            res.render('boards/boardList', { boards: boardsFromDB })
        })
        .catch(err => console.log(`Err while getting the posts from the  DB: ${err}`));
})

// CREATE POST

router.post('/boards', (req, res) => {

    const { url, description, category } = req.body
    if (!url || !description || !category) {
        res.render('/boards', {
            message: 'Please fill up the form!!'
        });
        return;
    }

    const owner = req.session.user._id;

    //  urlTitle: currentURLtitle, urlScreenshot: currentURLimage, urlDescription: currentURLdescription
    Board.create({ url, description, category, user: owner })
        .then(() => {
            res.redirect('/boards')
        })
        .catch(err => console.log(`Err while saving the post in the DB: ${err}`));

})

// DELETE POST

router.post('/boards/:boardId/delete', (req, res) => {
    Board.findByIdAndRemove(req.params.boardId)
        .then(() => res.redirect('/boards'))
        .catch(err => console.log(`Err while deleting the post from the  DB: ${err}`));
});

// SHOW POST DETAILS

router.get('/boards/:onePostId', (req, res) => {

    Board.findById(req.params.onePostId)
        .then(postFound => {
            res.render('boards/boardDetails', { post: postFound });
        })
        .catch(err => console.log(`Err while getting the specific post from the  DB: ${err}`))
})

// UPDATE POST

router.get('/boards/:id/edit', (req, res) => {
    Board.findOne({ user: req.session.user._id, _id: req.params.id })
        .then(foundPost => {
            if (!foundPost) {
                res.render('boards/boardEdit', {
                    message: 'There is no Post to update'
                });
                return;
            }
            res.render('boards/boardEdit', { post: foundPost })
        })
        .catch(err => console.log(`Err while getting the post from the  DB for the update: ${err}`));
})

// SAVE THE UPDATES

router.post('/boards/:id/update', (req, res) => {
    const { title, description, category } = req.body
    if (!title || !description || !category) {
        res.render('boards/boardEdit', {
            message: 'Please fill the form!'
        });
        return;
    }
    Board.findByIdAndUpdate(req.params.id, req.body)
        .then(updatedPost => res.redirect(`/boards/${req.params.id}`))
        .catch(err => console.log(`Err while updating the specific post in the  DB: ${err}`))
})



module.exports = router;