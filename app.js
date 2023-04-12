require("dotenv").config();
const express = require("express");
const { resolve } = require("path");
const session = require('express-session')
const fileUpload = require("express-fileupload")
const clientRoutes = require("./routes/clientRoutes");
const port = 3000;
const app = express();

var sess = {
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}

// app.use(session({ genid: function(req) {
//                     console.log(session)
//                     return genuuid() // use UUIDs for session IDs
//                 }, sess }))

app.use(session(sess))

app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : 'temp'
}));

app.use(express.static("resources"))
app.use(express.static("uploads"))

app.set("view engine", "ejs")
app.set("views", "views")

app.use((req, res, next) => {
    req.flash = function (arr = []) {
        //Put the necessary icon
        (arr.includes("success")) ? arr.push("check") :
        (arr.includes("error")) ? arr.push("xmark") :
        arr.push("exclamation");
        //Create object to be pushed
        let obj = {}
        arr.forEach((value, index) => {
            (index == 0) ? obj.message = value :
            (index == 1) ? obj.type = value : obj.icon = value
        })
        //Check if flash is an array to know whether to push into or create it
        if (Array.isArray(req.session.flash))
            req.session.flash.push(obj)
        else
            req.session.flash = [obj]
    }
    next()
})

app.use((req, res, next) => {
    //Set User_id
    res.locals.user_id = req.session.user_id
    //Set Form Values
    res.locals.form = req.session.form
    delete req.session.form
    //Set Pre-render Values
    res.locals.preRender = req.session.preRender
    delete req.session.preRender
    //Set Form Errors
    res.locals.formError = req.session.formError
    delete req.session.formError
    //Set LoggedIn User Image
    res.locals.userInfo = req.session.userInfo
    //Set Alerts
    res.locals.flash = req.session.flash
    delete req.session.flash
    next()
})

app.use(clientRoutes)

app.use((req, res) => {
    res.render("page-not-found")
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})