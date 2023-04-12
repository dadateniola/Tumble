//Close alert
let messageClose = document.querySelectorAll(".message-close");

if (messageClose) {
    for (let i = 0; i < messageClose.length; i++) {
        messageClose[i].addEventListener("click", () => {
            let parent = messageClose[i].parentNode;
            parent.classList.add("collapsed");
        })
    }
}

//Close menu
var menuExpand = document.querySelector(".tumble-menu-expand");
var menuBoxOverlay = document.querySelector(".tumble-menu-box-overlay");

if (menuExpand && menuBoxOverlay) {
    menuBoxOverlay.addEventListener("click", (e) => {
        let val = e.target.classList;
        if (!Object.values(val).includes("tumble-menu-box-overlay")) return;
        menuBoxOverlay.classList.remove("active");
        menuBoxOverlay.classList.remove("on");
    })

    menuExpand.addEventListener("click", () => {
        menuExpand.disabled = true;
        menuBoxOverlay.classList.add("active");
        menuBoxOverlay.classList.add("on");
        setTimeout(() => menuExpand.disabled = false, 500);
    })
}

//Subscribe Button 
let subscribeBtn = document.getElementById("subscribe");
let alertBox = document.querySelector(".alert-box");
let subsLength = document.getElementById("subsLength");

if(subscribeBtn) {
    function subscribe(user) {
        subscribeBtn.disabled = true;
        subscribeBtn.innerHTML = "<span class='spinner'></span>";
        fetch(`/subscribe/${user}`)
            .then(res => res.text())
            .then(response => {
                if (response == "error") location.reload();
                else if (response == "subscribed") {
                    setTimeout(() => {
                        attachAlert(user, "Subscribed");
                        subscribeBtn.classList.add("subscribed")
                        subscribeBtn.innerHTML = "Unsubscribe<i class='fa-solid fa-thumbs-up'></i>";
                        if(subsLength) subsLength.innerHTML = Number(subsLength.innerHTML) + 1;
                        subscribeBtn.disabled = false;
                    }, 2000)
                } else {
                    setTimeout(() => {
                        attachAlert(user, "Unsubscribed");
                        subscribeBtn.classList.remove("subscribed")
                        subscribeBtn.innerHTML = "Subscribe";
                        if(subsLength) subsLength.innerHTML = Number(subsLength.innerHTML) - 1;
                        subscribeBtn.disabled = false;
                    }, 2000)
                }
            })
    }
    
    function attachAlert(user, action) {
        let massage = document.createElement("div");
        let massageClose = document.createElement("div");
        let massageCloseI = document.createElement("i");
        let massageicon = document.createElement("i");
        massage.classList.add("message", "success");
        massageClose.classList.add("message-close");
        massageCloseI.classList.add("fa-solid", "fa-xmark");
        massageicon.classList.add("fa-solid", "fa-check");
    
        massageClose.addEventListener("click", () => {
            let parent = massageClose.parentNode;
            parent.classList.add("collapsed");
            setTimeout(() => {
                parent.style.display = "none";
            }, 800)
        })
    
        massageClose.appendChild(massageCloseI);
        massage.append(massageClose, massageicon, `${action} to ${user}`)
        alertBox.appendChild(massage);
    }
}
