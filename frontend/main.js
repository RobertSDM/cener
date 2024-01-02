import "./style.css";

const app = document.querySelector("#app");

const form = `
    <form action="" id="__link_form">
        <input
            id="__link_input"
            type="text"
            placeholder="Digit or paste your link"
            minlength="35"
            required
        />
        <button type="submit" class="__default_button">Short</button>
    </form>`;

const containerShowLinks = `
    <div id="__container-show-short-link">
        <span id="__show_short-link"></span>
        <button
        id="__copy_short-link"
        class="__transparent_bg_button hidden"
        >
        <i class="fa-regular fa-copy"></i>
        </button>
    </div>`;

app.innerHTML = `
  <div class="__bubble __b-red"></div>
        <div class="__bubble __b-blue"></div>
        <h1>Short your link</h1>
        ${form}
        <div id="__container-link" class="hidden">
            ${containerShowLinks}
            <div id="__show_message">This can take some seconds</div>
        </div>
`;
