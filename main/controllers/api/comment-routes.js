const router = require("express").Router();
const { Comment } = require("../../models");
const withAuth = require("../../utils/auth");

// Get all comments
router.get("/", withAuth, async (req, res) => {
  try {
    const dbUserData = await Comment.findAll();
    res.json(dbUserData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Create a new comment
router.post("/", withAuth, async (req, res) => {
  try {
    if (req.session) {
      const dbCommentData = await Comment.create({
        comment_text: req.body.comment_text,
        post_id: req.body.post_id,
        user_id: req.session.user_id,
      });
      res.json(dbCommentData);
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// Update a comment's content
router.put("/:id", withAuth, async (req, res) => {
  try {
    const dbPostData = await Comment.update(
      { comment_text: req.body.comment_text },
      { where: { id: req.params.id } }
    );
    if (dbPostData[0] === 0) {
      res.status(404).json({ message: "No comment found with this id" });
    } else {
      res.json(dbPostData);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Delete a comment
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const dbUserData = await Comment.destroy({
      where: { id: req.params.id },
    });
    if (!dbUserData) {
      res.status(404).json({ message: "No comment found with this id" });
    } else {
      res.json(dbUserData);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
