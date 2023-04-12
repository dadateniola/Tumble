const { Router } = require("express");
const { showLandingPage, login, showLoginForm, showRegisterForm, register, showHomePage, logout, showShortsPage, showLibraryPage, yourChannel, setupChannel, showUserChannel, addVideoOrShort, showVideosPage, getVideo, addComment, showAUsersChannel, subscribeOrUnsubscribe, addToWatch, removeComment } = require("../controllers/userController");
const loginValidator = require("../validators/loginValidator");
const registerValidator = require("../validators/registerValidator");
const setupValidator = require("../validators/setupValidator");
const addVideoOrShortValidator = require("../validators/addVideoOrShortValidator");

const router = Router();

const checkSession = (req, res, next) => {
    if (req?.session?.user_id) {
        req.flash(["Account Active", "success"]);
        res.redirect("/browse");
    } else {
        next();
    }
}

router.get("/", checkSession, showLandingPage)

router.get("/login", checkSession, showLoginForm)

router.post("/login", loginValidator, login)

router.get("/register", checkSession, showRegisterForm)

router.post("/register", registerValidator, register)

// router.use((req, res, next) => {
//     if(!req.session.user_id) {
//         req.flash(["Login or Signup To Access Homepage", "warning"])
//         res.redirect("/login");
//     } else {
//         next();
//     }
// })

router.get("/browse", showHomePage)

router.get("/shorts/:name", showShortsPage)

router.get("/library", showLibraryPage)

router.get("/yourchannel", yourChannel)

router.post("/setup-channel", setupValidator, setupChannel)

router.get("/channel/@:user", showAUsersChannel)

router.get("/channel/you", showUserChannel)

router.get("/logout", logout)

//Extra routes
router.get("/subscribe/:user", subscribeOrUnsubscribe)

router.post("/channel/you/:type", (req, res, next) => {
    let videoType = req.params.type.split("-").pop();
    req.session.preRender = videoType;
    next();
}, addVideoOrShortValidator, addVideoOrShort);

router.get("/feed/:type/:name", (req, res, next) => {
    let { type, name } = req.params;
    if (type == "shorts") res.redirect(`/shorts/${name}`);
    else if (type == "videos") res.redirect(`/videos/${name}`);
    else next();
})

router.get("/videos/:name", showVideosPage);

router.get("/get-video/:name", getVideo);

router.get("/comment/:id", addComment)

router.get("/watch-later/:id", addToWatch)

router.get("/delete-comment/:id", removeComment)

module.exports = router;