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

//Video Parameters
const formVideo = document.querySelector(".form-video");
const vidUpload = document.querySelector(".vid-upload");
const vidUploadLabel = document.getElementById("vid-upload-label")
const formSubmitBtn = document.getElementById("form-submit-btn");
//Image Parameters
const formPlaceholder = document.querySelector(".form-placeholder");
const imgUpload = document.querySelector(".img-upload");
const impUploadLabel = document.querySelector(".form-label");

vidUpload.addEventListener("change", (e) => {
    let input = e.target;
    input.disabled = true;
    let file = e.target.files[0]
    let progressBox = formVideo.querySelector(".form-progress-box");
    let successBox = formVideo.querySelector(".form-success-box");
    let cancelBox = formVideo.querySelector(".form-cancel-box");
    let vidContainer = document.getElementById('vid-preview');
    let cancelUploadBtn = formVideo.querySelector("#cancal-upload");
    uploadFile(input, progressBox, successBox, cancelBox, vidContainer, cancelUploadBtn);
    vidUploadLabel.innerHTML = "Uploading..."
    vidUploadLabel.classList.add("off")
})

imgUpload.addEventListener("change", (e) => {
    console.log("worked");
    let input = e.target;
    input.disabled = true;
    let progressBox = formPlaceholder.querySelector(".form-progress-box");
    let successBox = formPlaceholder.querySelector(".form-success-box");
    let cancelBox = formPlaceholder.querySelector(".form-cancel-box");
    let vidContainer = false;
    let cancelUploadBtn = formPlaceholder.querySelector("#cancal-upload");
    console.log("started");
    uploadFile(input, progressBox, successBox, cancelBox, vidContainer, cancelUploadBtn);
    impUploadLabel.classList.add("off");
})

function uploadFile(input, progressBox, successBox, cancelBox, previewContainer, cancelUploadBtn) {
    //Disable Submit Btn
    formSubmitBtn.disabled = true;
    formSubmitBtn.classList.add("off");

    //Get variables
    var progressNum = progressBox.querySelector("#vid-progress-num")
    var progressSize = progressBox.querySelector("#vid-progress-size");
    var progress = progressBox.querySelector("#vid-progress")

    //Allow upload cancel
    cancelUploadBtn.addEventListener("click", cancelUpload)

    //Show progress box
    progressBox.classList.add("on");

    let xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", e => {
        let percent = Math.floor((e.loaded / e.total) * 100);
        let uploadedSize = Math.floor(e.loaded / 1000);
        let totalSize = Math.floor(e.total / 1000);
        let remainingSize = Math.floor((e.total - e.loaded) / 1000);
        let size = (remainingSize < 1024) ? `${remainingSize}KB` : `${(remainingSize / 1024).toFixed(2)}MB`
        let uploaded = (uploadedSize < 1024) ? `${uploadedSize}KB` : `${(uploadedSize / 1024).toFixed(2)}MB`
        let total = (totalSize < 1024) ? `${totalSize}KB` : `${(totalSize / 1024).toFixed(2)}MB`
        progressNum.innerHTML = `${percent}%`;
        progress.style.width = `${percent}%`;
        progressSize.innerHTML = `${uploaded} / ${total} (${size})`;
    })

    xhr.addEventListener("abort", () => {
        progressBox.classList.remove("on");
        cancelBox.classList.add("on");

        setTimeout(() => {
            //set progress to 0
            progress.style.width = "0%";

            cancelBox.classList.remove("on");
            cancelUploadBtn.removeEventListener("click", cancelUpload)
            impUploadLabel.classList.remove("off");
        }, 2000);

        //Enable the input
        input.disabled = false;
        //Reset selected file
        input.value = "";
        if(previewContainer) previewContainer.src = "";
        else {
            formPlaceholder.style.backgroundImage = "none";
        }
        //Reset Upload label if necessary
        vidUploadLabel.innerHTML = "Pick A Video";
        vidUploadLabel.classList.remove("off");
        //Enable submit btn
        formSubmitBtn.disabled = false;
        formSubmitBtn.classList.remove("off");
    })

    xhr.addEventListener('load', () => {
        progressBox.classList.remove("on");
        successBox.classList.add("on");

        setTimeout(() => {
            //set progress to 0
            progress.style.width = "0%";
            
            successBox.classList.remove("on");
            impUploadLabel.classList.remove("off");
        }, 2000);

        const response = JSON.parse(xhr.responseText);
        const url = response.url;
        if (!url) {
            location.reload()
            return
        }
        if(previewContainer) previewContainer.src = url;
        else {
            formPlaceholder.style.backgroundImage = `url("${url}")`
        }

        input.disabled = false;

        //Reset Upload label if nevessary
        vidUploadLabel.innerHTML = "Pick A Video";
        vidUploadLabel.classList.remove("off");
        //Enable submit btn
        formSubmitBtn.disabled = false;
        formSubmitBtn.classList.remove("off");
    });

    xhr.open("POST", "/upload");
    const formData = new FormData();
    formData.append('file', input.files[0]);

    xhr.send(formData);

    function cancelUpload() {
        if (xhr.readyState !== 4) {
            xhr.abort();
        }
        else return;
    }
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