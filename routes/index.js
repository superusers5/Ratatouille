const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth"); //ensuring protected routes

const Menu = require("../models/Menu");

// @desc    Login/Landing page
// @route   GET /
router.get("/", ensureGuest, (req, res) => {
    res.render("login", {
        layout: "login",
    });
});

// @desc    Dashboard
// @route   GET /dashboard
router.get("/dashboard", ensureAuth, async (req, res) => {
    try {
        const menus = await Menu.find({ user: req.user.id }).lean();
        res.render("dashboard", {
            name: req.user.firstName,
            menus,
        });
    } catch (err) {
        console.error(err);
        res.render("error/500");
    }
});

module.exports = router;
