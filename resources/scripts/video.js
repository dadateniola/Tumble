let comment = document.getElementById("comment");
let commentsSeeAll = document.querySelector(".comments-see-all");
let submitComment = document.getElementById("submit-comment");
let commentInvalid = document.querySelector(".comment-invalid");
let commentCount = document.getElementById("comment-count");
let watchLater = document.getElementById("watch-later");
let deleteComment = document.querySelectorAll(".delete-comment");
let deleteCommentBtn = document.querySelectorAll(".delete-comment-btn");
const maxLetters = 200;

comment.addEventListener('input', function () {
    //Remove invalid
    comment.classList.remove("is-invalid");
    commentInvalid.innerHTML = "";

    const letters = comment.value.split("");
    if (letters.length >= maxLetters) {
        comment.classList.add("is-invalid");
        commentInvalid.innerHTML = `Maximum of ${maxLetters} characters allowed`;
    } else {
        comment.setCustomValidity("");
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    }
});

submitComment.addEventListener("click", function () {
    let videoId = this.dataset.id;
    let pfp = this.dataset.pfp;
    let username = this.dataset.name;
    let commentValue = comment.value;
    let videoComment = encodeURIComponent(commentValue);
    if (videoComment.length < 5) {
        comment.classList.add("is-invalid");
        commentInvalid.innerHTML = "Minimum of 5 letters allowed";
        return;
    }
    fetch(`/comment/${videoId}?comment=${videoComment}`)
        .then(response => response.text())
        .then(data => {
            if (data == "error") location.reload();
            if (!data) {
                comment.classList.add("is-invalid");
                commentInvalid.innerHTML = "Comment cannot be empty";
                return;
            } else {
                comment.value = "";
                commentCount.innerHTML = Number(commentCount.innerHTML) + 1;
                let allComments = document.querySelector(".user-comments")
                let userComment = createUserComment(data, pfp, username);
                allComments.insertBefore(userComment, allComments.children[0]);
                setTimeout(() => {
                    userComment.classList.remove("new");
                }, 200);
            }
        })
        .catch(err => console.log(err));
})

function createUserComment(text, img, name) {
    let userComment = document.createElement("div");
    let optionsAvatar = document.createElement("div");
    let commentBox = document.createElement("div");
    let commentName = document.createElement("p")
    let comment = document.createElement("pre");

    if (img != "none") {
        let optionsImg = document.createElement("img");
        optionsImg.src = img;
        optionsAvatar.appendChild(optionsImg);
    }

    commentName.innerHTML = name;
    comment.innerHTML = text;

    userComment.classList.add("user-comment", "new");
    optionsAvatar.classList.add("options-avatar");
    commentBox.classList.add("comment-box");
    commentName.classList.add("comment-name");

    commentBox.append(commentName, comment);
    userComment.append(optionsAvatar, commentBox);
    return userComment;
}

watchLater.addEventListener("click", function () {
    let videoId = this.dataset.id;
    watchLater.disabled = true;
    watchLater.innerHTML = "<span class='spinner'></span>";
    fetch(`/watch-later/${videoId}`)
        .then(res => res.text())
        .then(data => {
            if (data == "error") location.reload();
            else if (data == "added") {
                setTimeout(() => {
                    watchLater.innerHTML = '<div class="tooltip">Remove</div><i class="fa-solid fa-check"></i>';
                    watchLater.disabled = false;
                }, 2000);
            } else {
                setTimeout(() => {
                    watchLater.innerHTML = '<div class="tooltip">Watch Later</div><i class="fa-solid fa-plus"></i>';
                    watchLater.disabled = false;
                }, 2000);
            }
        })
})

commentsSeeAll.addEventListener("click", () => {
    let comments = document.querySelector(".comments");
    comments.style.maxHeight = "100%";
    commentsSeeAll.classList.remove("on")
    comments.classList.remove("on");
})

for (let i = 0; i < deleteComment.length; i++) {
    deleteComment[i].addEventListener("click", function(e) {
        if(e.target.classList.contains("delete-comment-btn") || e.target.classList.contains("spinner")) return;
        if(this.classList.contains("active")) {
            this.classList.remove("active");
        } else {
            for (let j = 0; j < deleteComment.length; j++) {
                deleteComment[j].classList.remove("active");
            }
            this.classList.add("active");
        }
    })    
}

for (let i = 0; i < deleteCommentBtn.length; i++) {
    deleteCommentBtn[i].addEventListener("click", function() {
        let id = this.dataset.id;
        let vid_id = this.dataset.vid;
        this.disabled = true;
        this.innerHTML = "<span class='spinner'></span>";
        fetch(`/delete-comment/${id}?video=${vid_id}`)
        .then(res => res.text())
        .then(data => {
            if (data == "error") location.reload();
            else {
                let parent = this.parentNode.parentNode;
                parent.classList.add("new");
                setTimeout(() => {
                    parent.remove();
                }, 500);
            }
        })
    })    
}

function seeAll() {
    let comments = document.querySelector(".comments");

    if(comments.offsetHeight == 350) {
        comments.classList.add("on");
        commentsSeeAll.classList.add("on");
    } else {
        comments.classList.add("on");
        commentsSeeAll.classList.remove("on");
    }
}

window.onload = seeAll();