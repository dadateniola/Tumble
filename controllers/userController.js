const fs = require("fs")
const User = require("../Models/User");
const Video = require("../Models/Video");
const Subscription = require("../Models/Subscription");
const passwordHash = require("password-hash");
const likesDislike = require("../Models/LikesDislike");
const userComment = require("../Models/Comment");
const VideoView = require("../Models/VideoView");
const History = require("../Models/History");
const WatchLater = require("../Models/WatchLater");
const { getTimeDifference, formatDate } = require("../Models/Methods");

let showLandingPage = (req, res) => {
    res.render("index");
}

let showLoginForm = (req, res) => {
    res.render("login");
}

let login = async (req, res) => {
    let { email, password } = req.body;
    req.session.form = req.body;
    let [user] = await User.find(['email', email]);
    if (!user || Object.keys(user).length < 1) {
        req.flash(["Account Doesnt Exist", "error"])
        req.session.form = req.body;
        res.redirect("back");
    } else {
        if (passwordHash.verify(password, user.password)) {
            req.session.user_id = user.id;
            req.session.userInfo = user;
            delete req.session.form;
            res.redirect('/browse');
        } else {
            req.flash(["Invalid Login Details", "warning"])
            req.session.form = req.body;
            res.redirect("back");
        }
    }
}

let showRegisterForm = (req, res) => {
    res.render("register");
}

let register = async (req, res) => {
    let user = new User(req.body);
    let hashedPassword = passwordHash.generate(user.password);
    user.password = hashedPassword;
    let add = await user.add();
    if (add == "success") {
        req.flash(["Account Created Successfully", "success"]);
        res.redirect("/login")
    } else if (add == "exists") {
        req.session.form = req.body;
        req.flash(["Email/Phone no Already Exists", "error"]);
        res.redirect("back")
    } else {
        req.session.form = req.body;
        req.flash(["Error Creating Account", "error"]);
        res.redirect("back")
    }
}

let showHomePage = async (req, res) => {
    try {
        let currentUser = await User.find(["id", req.session.user_id]);
        if (!currentUser.length) throw new Error("No logged in User")
        let allVideos = await Video.find(["type", "video"]);
        let topVideos = await Video.selectDistinct("user_id", 3);

        let videos = allVideos.filter(obj2 => {
            return !topVideos.some(obj1 => {
                return obj1.id === obj2.id;
            });
        });

        let shorts = await Video.find(["type", "short"]);
        let users = await User.find();

        res.render("home", { videos, shorts, topVideos, users, currentUser })
    } catch (err) {
        console.log("Inactive Login Into Browse: " + err);
        req.flash(["Cant Access This Page", "error"])
        res.redirect("/login");
    }
}

let showShortsPage = async (req, res) => {
    //add path for any
    let [video] = (req.params.name == "any") ? await Video.find([["type", "short"], ["order by", "created_at", "desc"]]) : await Video.find([["path", req.params.name], ["type", "short"]]);
    if (video) {
        let user = await User.findById(video.user_id)
        res.render("shorts", { video, user });
    } else res.render("page-not-found");
}

let showVideosPage = async (req, res) => {
    try {
        let isOwnProfile = false;
        let [video] = await Video.find([["path", req.params.name], ["type", "video"]]);
        if (video) {
            let currentUser = await User.findById(req.session.user_id);
            let user = await User.findById(video.user_id);
            let sub = await Subscription.find([["user_id", req.session.user_id], ["sub_id", video.user_id]]);
            let allcomments = await userComment.find([["video_id", video.id], ["NOT user_id", video.user_id], ["order by", "created_at", "desc"]]);
            let currentUsersComment = await userComment.find([["user_id", currentUser.id], ["video_id", video.id], ["NOT user_id", video.user_id], ["order by", "created_at", "desc"]])
            let ownersComment = await userComment.find([["video_id", video.id], ["user_id", video.user_id]]);
            let videoViews = await VideoView.find(["video_id", video.id]);
            let watchlater = await WatchLater.find([["user_id", req.session.user_id], ["video_id", video.id]])
            let users = await User.find();

            let commentsLength = allcomments.length + ownersComment.length;
            let views = videoViews.length;

            let timeDifference = getTimeDifference(video.created_at);

            //filter out the logged in users comments
            let comments = allcomments.filter(obj2 => {
                return !currentUsersComment.some(obj1 => {
                    return obj1.id === obj2.id;
                });
            });

            if (Object.keys(currentUser).length < 1) throw new Error("No Logged In User")
            if (req.session.user_id == user.id) isOwnProfile = true;
            let isSubbed = false;
            if (sub.length) isSubbed = true;
            let isAdded = false;
            if (watchlater.length) isAdded = true;

            //format the comments dates
            for (let i = 0; i < comments.length; i++) {
                comments[i].created_at = formatDate(comments[i].created_at);
            }
            for (let i = 0; i < ownersComment.length; i++) {
                ownersComment[i].created_at = formatDate(ownersComment[i].created_at);
            }
            for (let i = 0; i < currentUsersComment.length; i++) {
                currentUsersComment[i].created_at = formatDate(currentUsersComment[i].created_at);
            }

            res.render("video", { video, user, isOwnProfile, currentUser, isSubbed, currentUsersComment, comments, users, commentsLength, ownersComment, views, isAdded, timeDifference });

            //Add a view to the vide if user hasnt viewed yet;
            let [hasViewed] = await VideoView.find([["user_id", req.session.user_id], ["video_id", video.id]]);

            if (!hasViewed) {
                let videoView = new VideoView({ user_id: req.session.user_id, video_id: video.id });
                let addView = await videoView.add();
                if (addView == "success") {
                    let history = new History({ user_id: req.session.user_id, video_id: video.id });
                    await history.add();
                }
            }

        } else res.render("page-not-found");
    } catch (err) {
        console.log("Error Showing Video Page: " + err);
        req.flash(["Error Loading Page", "error"])
        res.redirect("/browse");
    }
}

let showLibraryPage = async (req, res) => {
    //SELECT COUNT(*) FROM table_name;
    try {
        let loggedInUser = await User.findById(req?.session?.user_id);
        if (Object.keys(loggedInUser).length > 1) {
            let history = await Video.customSql(`SELECT * FROM videos WHERE id IN (SELECT video_id FROM histories WHERE user_id = ?) ORDER BY created_at DESC LIMIT 8`, [loggedInUser.id]);
            let watchlaters = await WatchLater.customSql(`SELECT * FROM videos WHERE id IN (SELECT video_id FROM watch_laters WHERE user_id = ?) ORDER BY created_at DESC LIMIT 8`, [loggedInUser.id])
            let users = await User.find();

            let watchLength = watchlaters.length

            res.render("library", { history, watchlaters, users, watchLength })
        } else {
            req.flash(["Login or Signup To Access This Page", "warning"])
            res.redirect("/login");
        }
    } catch (err) {
        console.log("Error In Library: " + err);
        req.flash(["Error Loading Library", "error"]);
        res.redirect("back");
    }
}

let getVideo = (req, res) => {
    try {
        const range = req.headers.range;
        const videoPath = `uploads/path/${req.params.name}`;
        const videoExt = videoPath.split(".").pop();
        const videoSize = fs.statSync(videoPath).size;

        const chunkSize = 1 * 1e+6;
        const start = Number(range.replace(/\D/g, ""));
        const end = Math.min(start + chunkSize, videoSize - 1);

        const contentLength = end - start + 1;

        const headers = {
            "Content-Range": `bytes ${start}-${end}/${videoSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": contentLength,
            "Content-Type": `video/${videoExt}`
        }
        res.writeHead(206, headers);

        const stream = fs.createReadStream(videoPath, { start, end });
        stream.pipe(res);
    } catch (err) {
        console.log(err);
        res.redirect("back")
    }
}

let yourChannel = async (req, res) => {
    let user = await User.findById(req?.session?.user_id)
    if (Object.keys(user).length > 1) {
        if (user.username) {
            res.redirect("/channel/you");
        } else {
            res.render("setup-channel")
        }
    } else {
        req.flash(["Login or Signup To Access Your Channel", "warning"])
        res.redirect("back");
    }
}

let setupChannel = async (req, res) => {
    if (!req?.files || Object.keys(req.files).length < 2) {
        req.session.form = req.body;
        req.flash(["Pick A Photo and Banner", "warning"]);
        res.redirect("back");
        return;
    } else {
        //check if username exists
        let [username] = await User.find(["username", req.body.username])
        if (username) {
            req.session.form = req.body;
            req.flash(["Username Already Exists", "warning"]);
            res.redirect("back");
            return;
        }
        let { photo, banner } = req.files;
        if (photo.mimetype.startsWith("image/") && banner.mimetype.startsWith("image/")) {
            if (photo.size < (10 * 1024 * 1024) && banner.size < (10 * 1024 * 1024)) {
                //Remove the extensions
                let photoExt = "." + photo.name.split(".").pop();
                let bannerExt = "." + banner.name.split(".").pop();
                //hash the filenames
                let photoHash = passwordHash.generate(photo.name.split(".").shift());
                let bannerHash = passwordHash.generate(banner.name.split(".").shift());
                //create the new file name from a combination of extension and hash
                let photoFileName = photoHash + photoExt;
                let bannerFileName = bannerHash + bannerExt;
                //set a variable to check if theres failure in upload
                let isError = false;
                //Move the photo and banner to respective folders
                photo.mv("uploads/photo/" + photoFileName, (err) => {
                    if (err) {
                        req.flash(["Error During Upload", "error"]);
                        isError = true;
                        res.redirect("back");
                    }
                })
                banner.mv("uploads/banner/" + bannerFileName, (err) => {
                    if (err) {
                        req.flash(["Error During Upload", "error"]);
                        isError = true;
                        res.redirect("back");
                    }
                })
                //check if theres error in upload
                if (isError == true) return;
                else {
                    //find current logged in user
                    let currentUser = await User.findById(req?.session?.user_id);
                    //set values
                    if (Object.keys(currentUser).length > 1) {
                        //Put req.body values into the curent user logged in
                        Object.assign(currentUser, req.body)
                        //Add the photo and banner
                        currentUser.photo = photoFileName;
                        currentUser.banner = bannerFileName;
                        //create an instance of user
                        let user = new User(currentUser);
                        //update the user details
                        await user.update();
                        res.redirect("/channel/you")
                    } else {
                        req.flash(["Error Updating Profile", "error"]);
                        res.redirect("back");
                    }
                }
            } else {
                console.log("Photo size: "(photo.size / (1024 * 1024)), "Banner size: " + (banner.size / (1024 * 1024)));
                req.session.form = req.body;
                req.flash(["Image Sizes Shouldn't Exceed 10mb", "warning"]);
                res.redirect("back");
            }
        } else {
            req.session.form = req.body;
            req.flash(["Please Upload An Image", "warning"]);
            res.redirect("back");
        }
    }
}

let showAUsersChannel = async (req, res) => {
    let loggedInUser = await User.findById(req?.session?.user_id);
    let user = req.params.user;
    if (Object.keys(loggedInUser).length > 1) {
        if (user == loggedInUser?.username) {
            res.redirect("/yourchannel")
        } else {
            let userToBeViewed = await User.find(["username", user]);
            if (!userToBeViewed.length) {
                res.render("page-not-found");
                return;
            } else {
                //Set Parameters
                let [currentUser] = userToBeViewed;
                let hasContent = false;
                let videos = await Video.find([["user_id", currentUser.id], ["type", "video"], ["order by", "created_at", "desc"]]);
                let shorts = await Video.find([["user_id", currentUser.id], ["type", "short"], ["order by", "created_at", "desc"]]);
                let sub = await Subscription.find([["user_id", loggedInUser.id], ["sub_id", currentUser.id]]);
                let subs = await Subscription.find(["sub_id", currentUser.id]);
                let subsLength = subs.length;
                let isSubbed = false;
                if (sub.length) isSubbed = true;
                //Check if user has content
                if (videos.length || shorts.length) hasContent = true;
                res.render("user-channel", { currentUser, videos, shorts, isOwnProfile: false, hasContent, isSubbed, subsLength })
            }
        }

    } else {
        req.flash(["Login or Signup To Access This Page", "warning"])
        res.redirect("/login");
    }
}

let showUserChannel = async (req, res) => {
    req.session.user_id = 2;
    try {
        let currentUser = await User.findById(req?.session?.user_id);
        if (Object.keys(currentUser).length > 1) {
            if (currentUser.username) {
                let hasContent = false;
                let videos = await Video.find([["user_id", currentUser.id], ["type", "video"], ["order by", "created_at", "desc"]]);
                let shorts = await Video.find([["user_id", currentUser.id], ["type", "short"], ["order by", "created_at", "desc"]]);
                let subs = await Subscription.find(["sub_id", currentUser.id]);
                let subsLength = subs.length;
                if (videos.length || shorts.length) hasContent = true;
                res.render("user-channel", { currentUser, videos, shorts, isOwnProfile: true, hasContent, subsLength })
            } else {
                res.render("setup-channel")
            }
        } else {
            req.flash(["Login or Signup To Access This Page", "warning"])
            res.redirect("/login");
        }
    } catch (err) {
        console.log("Error Showinng Channel: " + err);
        req.flash(["Error Loading Your Channel", "error"]);
        res.redirect("back");
    }
}

let logout = (req, res) => {
    delete req.session.user_id;
    delete req.session.userInfo;
    req.flash(["Logged Out Successfully", "success"]);
    // req.session.destroy();
    res.redirect("/");
}

//Extra Routes
let previewUpload = async (req, res) => {
    try {
        const file = req.files?.file;
        let currentUser = await User.findById(req?.session?.user_id);
        if (Object.keys(currentUser).length > 1) {
            if (file) {
                let name = file.name.split(".").shift();
                let ext = file.name.split(".").pop();
                let filename = `${currentUser.email}-${name}.${ext}`;
                file.mv("temporary-uploads/" + filename, (err) => {
                    if (err) console.log(err);
                })
                res.send({ url: "/" + filename })
                //Compress and move
            }
            else res.send({ url: undefined });
        } else {
            req.flash(["Error During Upload", "error"]);
            res.send({ url: undefined })
        }
    } catch (err) {
        console.log("Error Uploading File: " + err);
        req.flash(["Error During Upload", "error"]);
        res.redirect("back");
    }
}

let addVideoOrShort = async (req, res) => {
    let videoType = req.params.type.split("-").pop();
    if (!req?.files || Object.keys(req.files).length < 2) {
        req.session.form = req.body;
        req.session.preRender = { condition: true, videoType };
        req.flash(["Pick a placeholder", "warning"]);
        req.flash([`Select a ${videoType}`, "warning"]);
        res.redirect("back");
        return;
    } else {
        let { placeholder, path } = req.files;
        if (placeholder.mimetype.startsWith("image/") && path.mimetype.startsWith("video/")) {
            if (placeholder.size < (10 * 1024 * 1024)) {
                //find current logged in user
                let currentUser = await User.findById(req?.session?.user_id);
                if (Object.keys(currentUser).length > 1) {
                    //Get extensions
                    let placeholderExt = "." + placeholder.name.split(".").pop();
                    let pathExt = "." + path.name.split(".").pop();
                    //Hash file names
                    let placeholderHash = passwordHash.generate(placeholder.name.split(".").shift());
                    let pathHash = passwordHash.generate(path.name.split(".").shift());
                    //create the new file name from a combination of extension and hash
                    let placeholderFileName = placeholderHash + placeholderExt;
                    let pathFileName = pathHash + pathExt;
                    //set a variable to check if theres failure in upload
                    let isError = false;
                    //Move the placeholder and path to respective folders
                    placeholder.mv("uploads/placeholder/" + placeholderFileName, (err) => {
                        if (err) {
                            req.session.preRender = { condition: true, videoType };
                            req.flash(["Error During Upload", "error"]);
                            isError = true;
                            res.redirect("back");
                        }
                    })
                    path.mv("uploads/path/" + pathFileName, (err) => {
                        if (err) {
                            req.session.preRender = { condition: true, videoType };
                            req.flash(["Error During Upload", "error"]);
                            isError = true;
                            res.redirect("back");
                        }
                    })
                    //check if theres error in upload
                    if (isError == true) return;
                    else {
                        let obj = req.body;
                        //Put req.body values into the curent user logged in
                        Object.assign(currentUser, req.body)
                        obj.user_id = currentUser.id;
                        obj.placeholder = placeholderFileName;
                        obj.path = pathFileName;
                        obj.type = videoType;
                        //create an instance of user
                        let video = new Video(obj)
                        //update the video details
                        await video.add();
                        req.flash(["Video Added Successfully", "success"])
                        res.redirect("/channel/you")
                    }
                } else {
                    req.session.preRender = { condition: true, videoType };
                    req.flash(["Error Updating Profile", "error"]);
                    console.log("No user found");
                    res.redirect("back");
                }
            } else {
                req.session.preRender = { condition: true, videoType };
                req.session.form = req.body;
                req.flash(["Placeholder Size Shouldn't Exceed 10mb", "warning"]);
                res.redirect("back");
            }
        } else {
            req.session.preRender = { condition: true, videoType };
            req.session.form = req.body;
            req.flash(["Please Upload An Image And Video", "warning"]);
            res.redirect("back");
        }
    }
}

let addComment = async (req, res) => {
    let videoId = req.params?.id;
    let comment = decodeURIComponent(req.query?.comment);
    if (!comment) {
        res.send(undefined);
    } else {
        try {
            let user = await User.findById(req.session.user_id);
            if (!Object.keys(user).length) throw new Error("No Logged In User");
            let [video] = await Video.find(["id", videoId]);
            let addComment = new userComment({ "user_id": user.id, "video_id": video.id, "comment": comment })
            await addComment.add();
            res.send(comment);
        } catch (err) {
            console.log("Error During Comment Upload: " + err);
            req.flash(["Error During Comment Upload", "error"])
            res.send("error");
        }
    }
}

let subscribeOrUnsubscribe = async (req, res) => {
    let userName = req.params.user;
    try {
        let loggedInUser = await User.findById(req.session.user_id);
        if (!Object.keys(loggedInUser).length) throw new Error("No Logged In User");
        else {
            let [user] = await User.find(["username", userName]);
            let isSubbed = await Subscription.find([["user_id", loggedInUser.id], ["sub_id", user.id]]);
            if (isSubbed.length) {
                await Subscription.delete(isSubbed[0].id);
                res.send("unsubscribed");
            } else {
                let sub = new Subscription({ user_id: loggedInUser.id, sub_id: user.id });
                let addSub = await sub.add();
                if (addSub == "success") {
                    res.send("subscribed");
                    return;
                } else throw new Error("Error Adding Sub into Database");
            }
        }
    } catch (err) {
        console.log("Error During Subscription: " + err)
        req.flash(["Error During Subscription, Try Again", "error"]);
        res.send("error");
    }
}

let addToWatch = async (req, res) => {
    let videoId = req.params.id;
    try {
        let loggedInUser = await User.findById(req.session.user_id);
        if (!Object.keys(loggedInUser).length) throw new Error("No Logged In User");
        else {
            let [video] = await Video.find(["id", videoId]);
            let isAdded = await WatchLater.find([["user_id", loggedInUser.id], ["video_id", video.id]]);
            if (isAdded.length) {
                await WatchLater.delete(isAdded[0].id);
                res.send("removed");
            } else {
                let watchlater = new WatchLater({ user_id: loggedInUser.id, video_id: video.id });
                let addWatchLater = await watchlater.add();
                if (addWatchLater == "success") {
                    res.send("added");
                    return;
                } else throw new Error("Error Adding Watch Later into Database");
            }
        }
    } catch (err) {
        console.log("Error In Watch Later: " + err)
        req.flash(["Error, Try Again", "error"]);
        res.send("error");
    }
}

let removeComment = async (req, res) => {
    let comment_id = req.params.id;
    try {
        let loggedInUser = await User.findById(req.session.user_id);
        if (!Object.keys(loggedInUser).length) throw new Error("No Logged In User");
        else {
            let [user] = await userComment.find(["id", comment_id]);
            if (user.user_id == loggedInUser.id) {
                await userComment.delete(comment_id);
                res.send("success")
            } else throw new Error("Comment doesnt match logged in user");
        }
    } catch (err) {
        console.log("Error In Remove Comment: " + err)
        req.flash(["Error, Try Again", "error"]);
        res.send("error");
    }
}

module.exports = {
    showLandingPage, showLoginForm, login, showRegisterForm, register, showHomePage, showShortsPage, logout, showLibraryPage, yourChannel, setupChannel, showUserChannel,
    addVideoOrShort, showVideosPage, getVideo, addComment, showAUsersChannel, subscribeOrUnsubscribe, addToWatch, removeComment, previewUpload
}