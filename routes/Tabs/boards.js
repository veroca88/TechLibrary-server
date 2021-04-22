const express = require("express");
const router = express.Router();
const Board = require("../../models/Board");
const User = require("../../models/User");
const routeGuard = require('../../configs/route-guard.config')

// DISPLAY FORM TO CREATE A BOARD

router.get('/board-input', routeGuard, (req, res) => {
    Board.find({ owner: req.session })
        .then(currentBoard => {
            res.render('boards/boardForm', { currentBoard });
        })
        .catch(err => console.log(`Err while displaying book input page: ${err}`));
});

// DISPLAY ALL BOARDS
router.get("/boards", routeGuard, (req, res, next) => {
    Board.find()
        .then(boardsFromDB => res.render('boards/boardList', { boards: boardsFromDB }))
        .catch(err => console.log(`Err while getting the books from the  DB: ${err}`));
})

// CREATE POST

router.post('/boards', (req, res) => {
    Board.create(req.body)
        .then(savePost => {
            res.redirect('/boards')
        })
        .catch(err => console.log(`Err while saving the book in the DB: ${err}`));
})

// DELETE POST

router.post('/boards/:boardId/delete', (req, res) => {
    Board.findByIdAndRemove(req.params.boardId)
        .then(() => res.redirect('/boards'))
        .catch(err => console.log(`Err while deleting the book from the  DB: ${err}`));
});



module.exports = router;