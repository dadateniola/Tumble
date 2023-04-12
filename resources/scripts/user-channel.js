function fashi() {
    //Set genre positions
    let genre = document.querySelectorAll(".genre");
    let genreSpace = 0;
    for (let i = 0; i < genre.length; i++) {
        genre[i].style.left = `${genreSpace}px`;
        genreSpace += (genre[i].clientWidth + 20);
    }

    //Select necessary elements
    let genreBox = document.querySelector(".genre-box")
    let genreNext = document.querySelector(".genre-next")
    let genreBack = document.querySelector(".genre-back")
    let genreActive = 0;
    let genreDistance = 0;
    let genreDisabled = false;

    //Click event to move the slideshos by active elements width
    genreNext.addEventListener("click", () => {
        if (genreDisabled != true) {
            genrePositioning((genreActive + 1))
            let active = genre[genreActive].clientWidth + 17;
            genreDistance += active;
            genreBox.style.transform = `translateX(-${genreDistance}px)`;
            genreActive++;
        } else {
            return;
        }
    })

    //Click event to move the slideshows back by active elements width
    genreBack.addEventListener("click", () => {
        if (genreActive != 0) {
            let active = genre[genreActive - 1].clientWidth + 17;
            genreDistance -= active;
            genreBox.style.transform = `translateX(-${genreDistance}px)`;
            genreActive--;
            genreDisabled = false;
        } else {
            return;
        }
    })

    function genrePositioning(start) {
        let genreCont = document.querySelector(".genre-cont");
        let genreContWidth = genreCont.clientWidth;
        let genreWidth = 0;
        let lastGenre = 0;
        for (let i = start; i < genre.length; i++) {
            genreWidth += genre[i].clientWidth + 17;
            if (genreWidth >= genreContWidth) {
                if (i == 0) {
                    lastGenre = 0;
                    break;
                } else {
                    lastGenre = i - 1;
                    break;
                }
            } else if (genreWidth < genreContWidth && i == genre.length - 1) {
                lastGenre = genre.length - 1;
                genreDisabled = true;
            }
        }
    }

    // window.onresize = () => {
    //     genreActive = 0;
    //     genreDistance = 0;
    //     genreDisabled = false;
    //     genreBox.style.transform = "translateX(0px)"
    // }
}

let libraryBoxCont = document.querySelector(".library-box-cont")
let shortBoxCont = document.querySelector(".library-short-box-cont")
let libraryLoadMore = document.querySelector(".library-load-more")
let movingBoxPosition = 0;
if (libraryBoxCont || shortBoxCont) {
    if (isTouchDevice()) {
        if (libraryBoxCont) {
            let libraryNext = libraryBoxCont.querySelector(".library-box-next");
            let libraryPrev = libraryBoxCont.querySelector(".library-box-prev");
            libraryNext.style.display = "none";
            libraryPrev.style.display = "none";
            let libraryBoxesLength = libraryBoxCont.querySelectorAll(".library-box").length;
            libraryBoxCont.classList.add("mobile");
            if (libraryBoxesLength > 4) {
                libraryLoadMore.classList.add("mobile");
            }

            libraryLoadMore.addEventListener("click", () => {
                libraryBoxCont.style.maxHeight = "100%";
                libraryLoadMore.style.height = "0";
            })
        }
        if (shortBoxCont) {
            shortBoxCont.classList.add("mobile");
            let shortBoxes = shortBoxCont.querySelectorAll(".library-short-box");
            let space = 0;
            for (let j = 0; j < shortBoxes.length; j++) {
                shortBoxes[j].style.left = `${space}px`;
                space += (220)
            }
        }
    } else {
        if (libraryBoxCont) {
            let libraryNext = libraryBoxCont.querySelector(".library-box-next");
            let libraryPrev = libraryBoxCont.querySelector(".library-box-prev");
            let libraryMovingBox = libraryBoxCont.querySelector(".library-moving-box");
            let libraryBoxes = libraryBoxCont.querySelectorAll(".library-box");
            let space = 0;
            for (let j = 0; j < libraryBoxes.length; j++) {
                libraryBoxes[j].style.left = `${space}px`;
                space += (libraryBoxes[j].clientWidth + 10)
            }

            let numOfElementsInBox = 0;
            let libraryBoxesWidth = libraryBoxes[0].clientWidth + 10;

            libraryNext.addEventListener("click", () => {
                if (numOfElementsInBox == 0) return;
                if (movingBoxPosition < (space - (libraryBoxesWidth * numOfElementsInBox))) {
                    movingBoxPosition += libraryBoxesWidth;
                    libraryMovingBox.style.left = `-${movingBoxPosition}px`
                }
            })

            libraryPrev.addEventListener("click", () => {
                if (movingBoxPosition > 0) {
                    movingBoxPosition -= libraryBoxesWidth;
                    libraryMovingBox.style.left = `-${movingBoxPosition}px`
                }
            })

            function calcBoxesInBox() {
                movingBoxPosition = 0;
                libraryMovingBox.style.left = `${movingBoxPosition}px`
                let movingBoxLength = libraryMovingBox.clientWidth;
                let num = 0;
                for (let i = 0; i < libraryBoxes.length; i++) {
                    num += libraryBoxesWidth
                    if (num > movingBoxLength) {
                        numOfElementsInBox = i;
                        break;
                    } else {
                        numOfElementsInBox = 0;
                    }
                }
            }
        }
    }
}

function isTouchDevice() {
    return ('ontouchstart' in window || navigator.maxTouchPoints) & (window.matchMedia("(max-width: 800px)").matches);
}


let addVideoPlus = document.querySelector(".add-video-plus");
let addVideo = document.querySelector(".add-video");
let addShort = document.querySelector(".add-short");
let videoForm = document.querySelector(".video-form");
let videoFormClose = document.querySelector(".video-form-close");
let rotated = false;

if (addVideoPlus) {
    addVideoPlus.addEventListener("click", () => {
        addMenu();
    })
}

if (addVideo) {
    addVideo.addEventListener("click", () => {
        let addForm = document.querySelector(".add-form form");
        addForm.action = "/channel/you/add-video"
        document.body.classList.add("stop");
        videoForm.querySelector("h1").innerHTML = "Add Video";
        videoForm.classList.add("active");
        addMenu();
    })
}

if (addShort) {
    addShort.addEventListener("click", () => {
        let addForm = document.querySelector(".add-form form");
        addForm.action = "/channel/you/add-short";
        document.body.classList.add("stop");
        videoForm.querySelector("h1").innerHTML = "Add Short";
        videoForm.classList.add("active");
        addMenu();
    })
}

if (videoFormClose) {
    videoFormClose.addEventListener("click", () => {
        document.body.classList.remove("stop");
        videoForm.classList.remove("active");
    })
}

function checkForm() {
    if (videoForm) {
        if (videoForm.dataset.type) {
            let type = videoForm.dataset.type
            let addForm = document.querySelector(".add-form form");
            addForm.action = `/channel/you/add-${type}`;
            document.body.classList.add("stop");
            let heading = videoForm.querySelector("h1");
            heading.innerHTML = `Add ${type}`;
            heading.style.textTransform = "capitalize";
        } else return;
    }
}

function addMenu() {
    if (rotated) {
        addVideoPlus.classList.remove("on");
        addVideo.classList.remove("on");
        addShort.classList.remove("on");
        rotated = false;
    } else {
        addVideoPlus.classList.add("on");
        addVideo.classList.add("on");
        addShort.classList.add("on");
        rotated = true;
    }
}

var upload = document.querySelector(".upload");
if (upload) {
    upload.addEventListener("change", function () {
        let parent = upload.parentNode.parentNode.parentNode;
        const reader = new FileReader();
        reader.addEventListener("load", function () {
            uploaded = reader.result;
            parent.style.backgroundImage = `url(${uploaded})`;
        });
        reader.readAsDataURL(this.files[0]);
    })
}

let path = document.getElementById("path");
let videoPlayer = document.querySelector(".form-vid video");

if (path) {
    path.addEventListener('change', () => {
        const selectedFile = path.files[0];
        if (selectedFile && selectedFile.type.startsWith('video/')) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(selectedFile);
            fileReader.onload = () => {
                videoPlayer.src = fileReader.result;
                videoPlayer.play();
            };
        } else {
            alert('Please select a valid video file');
        }
    });
}



window.addEventListener("load", () => {
    checkForm();
    if (!isTouchDevice()) calcBoxesInBox();
})

window.addEventListener("resize", () => {
    if (!isTouchDevice()) {
        calcBoxesInBox();
    }
})