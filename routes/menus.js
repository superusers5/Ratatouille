const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");

const Menu = require("../models/Menu");

// @desc    Show add page
// @route   GET /menus/add
router.get("/add", ensureAuth, (req, res) => {
    res.render("menus/add");
});

// @desc    Process add form
// @route   POST /menus
router.post("/", ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id;
        await Menu.create(req.body);
        res.redirect("/dashboard");
    } catch (err) {
        console.error(err);
        res.render("error/500");
    }
});

// @desc    Show all menus
// @route   GET /menus
router.get("/", ensureAuth, async (req, res) => {
    try {
        const menus = await Menu.find({ status: "public" })
            .populate("user")
            .sort({ createdAt: "desc" })
            .lean();

        res.render("menus/index", {
            menus,
        });
    } catch (err) {
        console.error(err);
        res.render("error/500");
    }
});

// @desc    Show single menu
// @route   GET /menus/:id
router.get("/:id", ensureAuth, async (req, res) => {
    try {
        let menu = await Menu.findById(req.params.id).populate("user").lean();

        if (!menu) {
            return res.render("error/404");
        }

        if (menu.user._id != req.user.id && menu.status == "private") {
            res.render("error/404");
        } else {
            res.render("menus/show", {
                menu,
            });
        }
    } catch (err) {
        console.error(err);
        res.render("error/404");
    }
});

// @desc    Show edit page
// @route   GET /menus/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
    try {
        const menu = await Menu.findOne({
            _id: req.params.id,
        }).lean();

        if (!menu) {
            return res.render("error/404");
        }

        if (menu.user != req.user.id) {
            res.redirect("/menus");
        } else {
            res.render("menus/edit", {
                menu,
            });
        }
    } catch (err) {
        console.error(err);
        return res.render("error/500");
    }
});

// @desc    Update menu
// @route   PUT /menus/:id
router.put("/:id", ensureAuth, async (req, res) => {
    try {
        let menu = await Menu.findById(req.params.id).lean();

        if (!menu) {
            return res.render("error/404");
        }

        if (menu.user != req.user.id) {
            res.redirect("/menus");
        } else {
            menu = await Menu.findOneAndUpdate(
                { _id: req.params.id },
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            );

            res.redirect("/dashboard");
        }
    } catch (err) {
        console.error(err);
        return res.render("error/500");
    }
});

// @desc    Delete menu
// @route   DELETE /menus/:id
router.delete("/:id", ensureAuth, async (req, res) => {
    try {
        let menu = await Menu.findById(req.params.id).lean();

        if (!menu) {
            return res.render("error/404");
        }
        if (menu.user != req.user.id && !chk) {
            res.redirect("/menus");
        } else {
            await Menu.remove({ _id: req.params.id });
            res.redirect("/dashboard");
        }
    } catch (err) {
        console.error(err);
        return res.render("error/500");
    }
});

// @desc    User menus
// @route   GET /menus/user/:userId
router.get("/user/:userId", ensureAuth, async (req, res) => {
    try {
        const menus = await Menu.find({
            user: req.params.userId,
            status: "public",
        })
            .populate("user")
            .lean();

        res.render("menus/index", {
            menus,
        });
    } catch (err) {
        console.error(err);
        res.render("error/500");
    }
});

module.exports = router;
