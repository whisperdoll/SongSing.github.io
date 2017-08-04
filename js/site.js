function init() {
    randomize();
    buildPanes();
    handleResize();
}

function randomize() {
    var wallpapers = 21;
    var wp = Math.floor(Math.random() * wallpapers);

    var quotes = [
        "what do you want.",
        "professional website",
        "it hurts",
        "don't click anything please",
        "80 billion dead cops",
        "lightning mcqueen's dead dad on the racetrack",
        ":~)"
    ];
    var q = quotes[Math.floor(Math.random() * quotes.length)];

    var img = new Image();

    img.onload = function() {
        document.getElementById("background").style["background-image"] = "url('" + this.src + "')";
        document.getElementById("container").style["background-color"] = "rgba(0,0,0,0.8)";
    };

    img.src = "images/backgrounds/" + wp + ".png";
    document.getElementById("title").textContent = q;
};

function buildPanes() {
    var panes = document.querySelectorAll(".pane");

    Array.prototype.forEach.call(panes, function(pane) {
        pane.setAttribute("target", "_blank");
        let d = pane;
        d.className += " pane-built";
        console.log(pane);

        var dt = document.createElement("div");
        dt.className = "pane-built-title";
        dt.textContent = pane.title;

        var dd = document.createElement("div");
        dd.className = "pane-built-desc";
        dd.innerHTML = pane.innerHTML;
        pane.textContent = "";

        var img = new Image();

        img.onload = function() {
            d.style["background-image"] = "url('" + this.src + "')";
            d.style.opacity = "1";
        };

        img.src = pane.getAttribute("src");

        d.appendChild(dt);
        dt.appendChild(dd);

        d.onmouseenter = function() {
            dt.style.top = "0";
            dt.style.height = "100%";
            dd.style.display = "block";
        };

        d.onmouseleave = function() {
            dt.style.top = "auto";
            dt.style.height = "auto";
            dd.style.display = "none";
        };
    });
}

function handleResize() {
    var panes = document.querySelectorAll(".pane-built");
    var w, h;

    if (window.innerWidth < 512 + 44) {
        w = window.innerWidth - 44;
        h = Math.max(192, (600) - w);
    } else {
        var per = Math.floor(window.innerWidth / (512 + 32));
        w = (window.innerWidth - 32 * (per + 1)) / per;
        h = 192;
    }

    Array.prototype.forEach.call(panes, function(pane) {
        pane.style.width = w + "px";
        pane.style.height = h + "px";
    });
}

window.addEventListener("load", init);

window.addEventListener("resize", handleResize);