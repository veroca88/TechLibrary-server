const express = require("express");
const router = express.Router();
const Board = require("../../models/Board");
const User = require("../../models/User");
const routeGuard = require('../../configs/route-guard.config')


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
    const { url, description, category } = req.body
    if (!url || !description || !category) {
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