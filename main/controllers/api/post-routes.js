const router = require("express").Router();
const { Post, User, Comment } = require("../../models");
const withAuth = require("../../utils/auth");

// Get all posts
router.get("/", async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      attributes: ["id", "title", "content", "created_at"],
      order: [["created_at", "DESC"]],
      include: [
        {
          model: Comment,
          attributes: [
            "id",
            "comment_text",
            "post_id",
            "user_id",
            "created_at",
          ],
          include: {
            model: User,
            attributes: ["username"],
          },
        },
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });
    res.json(dbPostData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get a single post
router.get("/:id", async (req, res) => {
  try {
    const dbPostData = await Post.findOne({
      where: { id: req.params.id },
      attributes: ["id", "title", "content", "created_at"],
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });
    if (!dbPostData) {
      res.status(404).json({ message: "No post found with this id" });
    } else {
      res.json(dbPostData);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Post a post (withAuth added)
router.post("/", withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.create({
      title: req.body.title,
      content: req.body.content,
      user_id: req.session.user_id,
    });
    res.json(dbPostData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Update a post's title and content (withAuth added)
router.put("/:id", withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.update(
      { title: req.body.title, content: req.body.content },
      { where: { id: req.params.id } }
    );
    if (dbPostData[0] === 0) {
      res.status(404).json({ message: "No post found with this id" });
    } else {
      res.json(dbPostData);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Delete a post (withAuth added)
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.destroy({
      where: { id: req.params.id },
    });
    if (!dbPostData) {
      res.status(404).json({ message: "No post found with this id" });
    } else {
      res.json(dbPostData);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
