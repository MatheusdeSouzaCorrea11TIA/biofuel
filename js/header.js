class Header extends HTMLElement {
    connectedCallback() { //Tirar o + dps
        this.innerHTML += ` 

        `
    }
}

class Footer extends HTMLElement {
    connectedCallback() { //Tirar o + dps
        this.innerHTML += ` 

        `
    }
}

customElements.define('main-header', Header)
customElements.define('main-footer', Footer)

//Coloca cor roxa na ancora da pagina atual
document.addEventListener("DOMContentLoaded", () => {
    const currentPath = window.location.pathname.split("/").pop()
    const navLinks = document.querySelectorAll("main-header a:not(.home-anchor)")

    navLinks.forEach((link) => {
        const linkPath = link.getAttribute("href")

        if (currentPath === "" && linkPath === "index.html") {
            link.classList.add("active-page")
        } else if (currentPath === linkPath) {
            link.classList.add("active-page")
        }
    })
})