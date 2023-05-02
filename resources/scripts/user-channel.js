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

if (vidUpload && imgUpload) {
    //MaxSize
    const maxSizes = document.body.dataset;

    vidUpload.addEventListener("change", (e) => {
        let input = e.target;
        input.disabled = true;
        let vidContainer = document.getElementById('vid-preview');
        let fileSize = e.target?.files[0]?.size;
        if (fileSize > (maxSizes.maxvidsize * 1024 * 1024)) {
            //Enable the input
            input.disabled = false;
            //Reset selected file
            input.value = "";
            vidContainer.src = ""
            return attachAlertBox({ type: "warning", msg: `File is larger than ${maxSizes.maxvidsize}MB` })
        }
        let progressBox = formVideo.querySelector(".form-progress-box");
        let successBox = formVideo.querySelector(".form-success-box");
        let cancelBox = formVideo.querySelector(".form-cancel-box");
        let cancelUploadBtn = formVideo.querySelector("#cancal-upload");
        uploadFile(input, progressBox, successBox, cancelBox, vidContainer, cancelUploadBtn, true);
        vidUploadLabel.innerHTML = "Uploading..."
        vidUploadLabel.classList.add("off")
    })

    imgUpload.addEventListener("change", (e) => {
        let input = e.target;
        input.disabled = true;
        let fileSize = e.target?.files[0]?.size;
        if (fileSize > (maxSizes.maximgsize * 1024 * 1024)) {
            //Enable the input
            input.disabled = false;
            //Reset selected file
            input.value = "";
            formPlaceholder.style.backgroundImage = "none"
            return attachAlertBox({ type: "warning", msg: `File is larger than ${maxSizes.maximgsize}MB` })
        }
        let progressBox = formPlaceholder.querySelector(".form-progress-box");
        let successBox = formPlaceholder.querySelector(".form-success-box");
        let cancelBox = formPlaceholder.querySelector(".form-cancel-box");
        let vidContainer = false;
        let cancelUploadBtn = formPlaceholder.querySelector("#cancal-upload");
        uploadFile(input, progressBox, successBox, cancelBox, vidContainer, cancelUploadBtn, false);
        impUploadLabel.classList.add("off");
    })

    function uploadFile(input, progressBox, successBox, cancelBox, previewContainer, cancelUploadBtn, hasLabel) {
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
                if (!hasLabel) impUploadLabel.classList.remove("off");
            }, 2000);

            resetElements();
        })

        xhr.addEventListener('load', () => {
            const response = JSON.parse(xhr.responseText);
            const url = response.url;
            if (!url) {
                attachAlertBox({ type: response?.type || "error", msg: response.msg });

                //Reset elements
                progressBox.classList.remove("on");
                progress.style.width = "0%";
                cancelUploadBtn.removeEventListener("click", cancelUpload)
                if (!hasLabel) impUploadLabel.classList.remove("off");

                resetElements();

                return
            }

            progressBox.classList.remove("on");
            successBox.classList.add("on");

            setTimeout(() => {
                //set progress to 0
                progress.style.width = "0%";

                successBox.classList.remove("on");
                if (!hasLabel) impUploadLabel.classList.remove("off");
            }, 2000);
            //check if video url is the same as previous one
            if (previewContainer) previewContainer.src = url;
            else {
                formPlaceholder.style.backgroundImage = `url("${url}")`
            }

            input.disabled = false;

            if (hasLabel) {
                //Reset Upload label if nevessary
                vidUploadLabel.innerHTML = "Pick A Video";
                vidUploadLabel.classList.remove("off");
            }
            //Enable submit btn
            formSubmitBtn.disabled = false;
            formSubmitBtn.classList.remove("off");
        });

        xhr.open("POST", "/upload");
        const formData = new FormData();
        formData.append(input.name, input.files[0]);

        xhr.send(formData);

        function cancelUpload() {
            if (xhr.readyState !== 4) {
                xhr.abort();
            }
            else return;
        }

        function resetElements() {
            //Enable the input
            input.disabled = false;
            //Reset selected file
            input.value = "";
            if (previewContainer) previewContainer.src = "";
            else {
                formPlaceholder.style.backgroundImage = "none";
            }

            if (hasLabel) {
                //Reset Upload label if nevessary
                vidUploadLabel.innerHTML = "Pick A Video";
                vidUploadLabel.classList.remove("off");
            }
            //Enable submit btn
            formSubmitBtn.disabled = false;
            formSubmitBtn.classList.remove("off");
        }
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