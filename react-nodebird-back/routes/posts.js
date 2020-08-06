const express = require('express');

const { Post, User, Image, Comment } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      // limit: 10,
      // order: [['createdAt', 'DECS']],
      include: [
        {
          model: User,
        },
        {
          model: Image,
        },
        {
          model: Comment,
        },
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
