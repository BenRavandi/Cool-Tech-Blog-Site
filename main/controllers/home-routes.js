const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

// Homepage Route
router.get("/", async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      attributes: ["id", "title", "content", "created_at"],
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

    const posts = dbPostData.map((post) => post.get({ plain: true }));

    res.render("homepage", {
      posts,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Login Route
router.get("/login", async (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("login");
});

// Signup Route
router.get("/signup", async (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("signup");
});

// Add Post Route
router.get("/addpost", withAuth, async (req, res) => {
  res.render("add-post", {
    dashboard: true,
    loggedIn: true,
  });
});

// Edit Post Route
router.get("/editpost/:id", withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "title", "content", "created_at"],
    });

    if (!dbPostData) {
      res.status(404).json({ message: "No post found with this id" });
      return;
    }

    const post = dbPostData.get({ plain: true });

    res.render("edit-post", {
      post,
      dashboard: true,
      loggedIn: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Dashboard Route with withAuth middleware
router.get("/dashboard", withAuth, async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      where: { user_id: req.session.user_id },
      attributes: ["id", "title", "content", "created_at"],
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

    const posts = dbPostData.map((post) => post.get({ plain: true }));

    res.render("dashboard", {
      posts,
      dashboard: true,
      loggedIn: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Single Post Route
router.get("/post/:id", async (req, res) => {
  try {
    const dbPostData = await Post.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "title", "content", "created_at"],
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

    if (!dbPostData) {
      res.status(404).json({ message: "No post found with this id" });
      return;
    }

    const post = dbPostData.get({ plain: true });

    res.render("single-post", {
      post,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
