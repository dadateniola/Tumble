const fs = require("fs")
const path = require("path");
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
        let topVideos = await Video.selectDistinct(3);

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

let stream;
let maxvidsize = 500;
let maximgsize = 10;

let getVideo = (req, res) => {
    try {
        const range = req.headers.range;
        const videoPath = (req.query?.type == "preview") ? `temporary-uploads/${req.params.name}` : `uploads/path/${req.params.name}`;
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
        //Make sure next video to be streamed doesnt have same name as previous video
        if (!stream || req.params.name !== stream.filename) {
            if (stream) {
                stream.destroy();
            }
            stream = fs.createReadStream(videoPath, { start, end });
            res.writeHead(206, headers);
            stream.pipe(res);
        } else {
            res.status(200).send("Streaming Same Video");
        }
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
            res.render("setup-channel", { sizes: { isavailable: true, maximgsize, maxvidsize } })
        }
    } else {
        req.flash(["Login or Signup To Access Your Channel", "warning"])
        res.redirect("back");
    }
}

let setupChannel = async (req, res) => {
    try {
        let currentUser = await User.findById(req?.session?.user_id);
        if (Object.keys(currentUser).length > 1) {
            let [username] = await User.find(["username", req.body?.username]);
            if (username) {
                req.session.form = req.body;
                req.flash(["Username Already Exists", "warning"]);
                res.redirect("back");
                return;
            }
            let email = currentUser.email.split("@").shift();
            const tempFiles = fs.readdirSync(path.join(__dirname, "..", 'temporary-uploads'));

            const bannerFile = tempFiles.find(file => file.startsWith(`banner-${email}`));
            const photoFile = tempFiles.find(file => file.startsWith(`photo-${email}`));

            if (bannerFile && photoFile) {
                const bannerFileName = `${passwordHash.generate((bannerFile.split("-").pop()).split(".").shift())}.${(bannerFile.split("-").pop()).split(".").pop()}`;
                const photoFileName = `${passwordHash.generate((photoFile.split("-").pop()).split(".").shift())}.${(photoFile.split("-").pop()).split(".").pop()}`;

                const bannerSource = path.join(__dirname, "..", 'temporary-uploads', bannerFile);
                const photoSource = path.join(__dirname, "..", 'temporary-uploads', photoFile);

                const bannerDestination = path.join(__dirname, "..", 'uploads/banner/', bannerFileName);
                const photoDestination = path.join(__dirname, "..", 'uploads/photo/', photoFileName);

                fs.renameSync(bannerSource, bannerDestination);
                fs.renameSync(photoSource, photoDestination);

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
                req.flash(["Please Upload Both Files", "error"]);
                res.redirect("back");
            }
        }
    } catch (err) {
        console.log("Error in setupChannel: " + err);
        req.flash(["Error During Upload", "error"])
        res.redirect("back")
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
                res.render("user-channel", { currentUser, videos, shorts, isOwnProfile: false, hasContent, isSubbed, subsLength, sizes: { isavailable: false } })
            }
        }

    } else {
        req.flash(["Login or Signup To Access This Page", "warning"])
        res.redirect("/login");
    }
}

let showUserChannel = async (req, res) => {
    req.session.user_id = 6;
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
                res.render("user-channel", { currentUser, videos, shorts, isOwnProfile: true, hasContent, subsLength, sizes: { isavailable: true, maximgsize, maxvidsize } })
            } else {
                res.render("setup-channel", { sizes: { isavailable: true, maximgsize, maxvidsize } })
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
        let currentUser = await User.findById(req?.session?.user_id);
        if (Object.keys(currentUser).length > 1) {
            if (req?.files) {
                const file = (req.files) ? req.files[Object.keys(req.files)[0]] : undefined;

                const type = Object.keys(req.files)[0];
                const mimetype = file.mimetype.split("/").shift();

                if (mimetype == "image") { if (file.size > (maximgsize * 1024 * 1024)) return res.send({ url: undefined, msg: `File is larger than ${maximgsize}MB` }) }
                else if (mimetype == "video") { if (file.size > (maxvidsize * 1024 * 1024)) return res.send({ url: undefined, msg: `File is larger than ${maxvidsize}MB` }) }
                else return res.send({ url: undefined, msg: "Select an image or video" })

                let name = file.name.split('.').slice(0, -1).join('.');
                let ext = file.name.split(".").pop();
                let email = currentUser.email.split("@").shift();
                let filename = `${type}-${email}-${name}.${ext}`;
                let filePath = (mimetype == "video") ? `/get-video/${filename}?type=preview` : `/${filename}`;

                // Check if a file that starts with the current user's email already exists in the temporary-uploads directory
                const tempFiles = fs.readdirSync(path.join(__dirname, "..", 'temporary-uploads'));
                const matchedFiles = tempFiles.filter(file => file.startsWith(`${type}-${email}`));
                matchedFiles.forEach(file => {
                    fs.unlinkSync(path.join(__dirname, "..", 'temporary-uploads', file));
                });

                file.mv("temporary-uploads/" + filename, (err) => {
                    if (err) {
                        console.log(err);
                        return res.send({ url: undefined, msg: "Upload Failed" })
                    } else {
                        return res.send({ url: filePath, msg: "Upload Successful" })
                    }
                })
                //Compress and move
            }
            else {
                console.log("Error Uploading File: No File Selected");
                res.send({ url: undefined, msg: "No File Selected", type: "warning" });
            }
        } else {
            console.log("Error Uploading File: User not found");
            res.send({ url: undefined, msg: "No Logged In User" })
        }
    } catch (err) {
        console.log("Error Uploading File: " + err);
        res.send({ url: undefined, msg: "Error During Upload" });
    }
}

let addVideoOrShort = async (req, res) => {
    try {
        let videoType = req.params.type.split("-").pop();
        let { name, description } = req.body;
        let currentUser = await User.findById(req?.session?.user_id);
        if (name && description) {
            let email = currentUser.email.split("@").shift();
            const tempFiles = fs.readdirSync(path.join(__dirname, "..", 'temporary-uploads'));

            const pathFile = tempFiles.find(file => file.startsWith(`path-${email}`));
            const placeholderFile = tempFiles.find(file => file.startsWith(`placeholder-${email}`));

            if (pathFile && placeholderFile) {
                const pathFileName = `${passwordHash.generate((pathFile.split("-").pop()).split(".").shift())}.${(pathFile.split("-").pop()).split(".").pop()}`;
                const placeholderFileName = `${passwordHash.generate((placeholderFile.split("-").pop()).split(".").shift())}.${(placeholderFile.split("-").pop()).split(".").pop()}`;

                const pathSource = path.join(__dirname, "..", 'temporary-uploads', pathFile);
                const placeholderSource = path.join(__dirname, "..", 'temporary-uploads', placeholderFile);

                const pathDestination = path.join(__dirname, "..", 'uploads/path/', pathFileName);
                const placeholderDestination = path.join(__dirname, "..", 'uploads/placeholder/', placeholderFileName);

                fs.renameSync(pathSource, pathDestination);
                fs.renameSync(placeholderSource, placeholderDestination);

                //Put req.body values into an object
                let obj = req.body;
                obj.user_id = currentUser.id;
                obj.placeholder = placeholderFileName;
                obj.path = pathFileName;
                obj.type = videoType;
                //create an instance of user
                let video = new Video(obj)
                //add the video
                await video.add();

                req.flash(["Video Added Successfully", "success"]);
                res.redirect("/channel/you");
            } else {
                req.session.preRender = { condition: true, videoType };
                req.flash(["Please Upload Both Files", "error"]);
                res.redirect("back");
            }
        } else {
            req.session.preRender = { condition: true, videoType };
            req.flash(["Couldnt Get Values, Try Again", "error"]);
            res.redirect("back");
        }
    } catch (err) {
        console.log("Error in addVideoOrShort: " + err);
        req.flash(["Error During Upload", "error"])
        res.redirect("back")
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