const form = document.getElementById("__link_form");
const linkInput = document.getElementById("__link_input");
const showShortLinkEl = document.getElementById("__show_short-link");
const copyShortLink = document.getElementById("__copy_short-link");
const containerLink = document.getElementById("__container-link");
const showMessage = document.getElementById("__show_message");

/**
 * @type {"NOT_STARTED" | "ON_GOING" | "COMPLETED"}
 */
let CREATING_STATUS = "NOT_STARTED";

/**
 * @param {string} link
 */
const createLink = async (link) => {
    CREATING_STATUS = "ON_GOING";
    try {
        const res = await fetch("https://be-cener.vercel.app/create", {
            method: "POST",
            body: JSON.stringify({
                originalLink: link,
            }),
            headers: {
                Authorization: "Bearer 7DcVpXqCftAbl3lFVlBW2WAN",
            },
        });

        const data = await res.json();
        if (res.status === 201) {
            return data;
        } else {
            showShortLinkEl.innerText = "An error ocurred, try again";
            showShortLinkEl.style["color"] = "red";
            return null;
        }
    } catch (err) {
        showShortLinkEl.innerText = "An error ocurred, try again";
        showShortLinkEl.style["color"] = "red";
    }
};

/**
 *
 * @param {string} link
 * @returns {boolean}
 */
const validadeLink = (link) => {
    const regex = /^(http|https):\/\/[^ "]+$/;

    return link.match(regex);
};

const addLoadAnimation = () => {
    showShortLinkEl.style["color"] = "black";
    showShortLinkEl.innerText = "creating";
    showMessage.classList.remove("hidden");
    let dots = "";

    let timer;
    timer = setInterval(() => {
        if (dots.length === 3) {
            showShortLinkEl.innerText = "creating";
            dots = "";
        }

        dots += ".";
        showShortLinkEl.innerText = `creating ${dots}`;
    }, 500);
    return timer;
};

/**
 * @param {Event} event
 * @returns {void}
 */
const handleSubmit = (event) => {
    event.preventDefault();
    containerLink.classList.remove("hidden");
    containerLink.classList.add("show-flex");

    if (CREATING_STATUS === "ON_GOING") {
        return;
    }

    const link = linkInput.value;

    const timer = addLoadAnimation();

    copyShortLink.classList.add("hidden");

    if (validadeLink(link)) {
        createLink(link).then((res) => {
            CREATING_STATUS = "COMPLETED";
            clearInterval(timer);
            if (res) {
                showMessage.classList.add("hidden");
                showShortLinkEl.innerText = res["Content"].shortened_link;
                copyShortLink.classList.remove("hidden");
                copyShortLink.classList.add("show-block");
            } else {
            }
        });
    }
};

/**
 * @param {void}
 * @returns {void}
 */
const main = () => {
    form.addEventListener("submit", handleSubmit);
    copyShortLink.addEventListener("click", () => {
        navigator.clipboard.writeText(showShortLinkEl.innerText);
    });
};

main();
