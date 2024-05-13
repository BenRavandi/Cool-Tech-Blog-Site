const router = require("express").Router();
const { User, Post, Comment } = require("../../models");
const withAuth = require("../../utils/auth");

// Get all users
router.get("/", withAuth, async (req, res) => {
  try {
    const dbUserData = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(dbUserData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get a single user by id
router.get("/:id", withAuth, async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      attributes: { exclude: ["password"] },
      where: { id: req.params.id },
      include: [
        {
          model: Post,
          attributes: ["id", "title", "content", "created_at"],
        },
        {
          model: Comment,
          attributes: ["id", "comment_text", "created_at"],
          include: {
            model: Post,
            attributes: ["title"],
          },
        },
      ],
    });
    if (!dbUserData) {
      res.status(404).json({ message: "No user found with this id" });
    } else {
      res.json(dbUserData);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Create a new user
router.post("/", async (req, res) => {
  try {
    const dbUserData = await User.create({
      username: req.body.username,
      password: req.body.password,
    });
    req.session.user_id = dbUserData.id;
    req.session.username = dbUserData.username;
    req.session.loggedIn = true;
    res.json(dbUserData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// User login
router.post("/login", async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!dbUserData) {
      return res.status(400).json({ message: "No user with that username!" });
    }

    const validPassword = dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      return res.status(400).json({ message: "Incorrect password!" });
    }

    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;
      res.json({ user: dbUserData, message: "You are now logged in!" });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// User logout
router.post("/logout", withAuth, async (req, res) => {
  try {
    if (req.session.loggedIn) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Update a user by id
router.put("/:id", withAuth, async (req, res) => {
  try {
    const dbUserData = await User.update(req.body, {
      individualHooks: true,
      where: { id: req.params.id },
    });
    if (dbUserData[0] === 0) {
      res.status(404).json({ message: "No user found with this id" });
    } else {
      res.json(dbUserData);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Delete a user by id
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const dbUserData = await User.destroy({
      where: { id: req.params.id },
    });
    if (!dbUserData) {
      res.status(404).json({ message: "No user found with this id" });
    } else {
      res.json(dbUserData);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
