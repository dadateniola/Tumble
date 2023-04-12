let video = document.querySelector("video");
let shortControls = document.querySelector(".short-controls");
let showState = document.querySelector(".show-state");
let showLike = document.querySelector(".show-like");
let clicked = false;
let isPlaying = false;


shortControls.addEventListener("click", () => {
    if (!clicked) {
        clicked = true;
        setTimeout(() => {
            if (clicked) {
                if (isPlaying) {
                    video.pause();
                    isPlaying = false;
                    showState.classList.add("active");
                    showState.classList.add("pause");
                    setTimeout(() => {
                        showState.classList.remove("active");
                        showState.classList.remove("pause");
                    }, 500)
                } else {
                    video.play();
                    isPlaying = true;
                    showState.classList.add("active");
                    showState.classList.add("play");
                    setTimeout(() => {
                        showState.classList.remove("active");
                        showState.classList.remove("play");
                    }, 500)
                }
            }
            clicked = false;
        }, 300);
    }
})

shortControls.addEventListener("dblclick", () => {
    console.log("double-clicked")
    clicked = false;
    showLike.classList.add("active");
})