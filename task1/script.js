// Change nav color when scrolling
        window.onscroll = function() {
            var nav = document.getElementById("nav");
            if (window.scrollY > 100) {
                nav.classList.add("scrolled");
            } else {
                nav.classList.remove("scrolled");
            }
        };