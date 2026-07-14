class Header extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `

        `
    }
}

class Footer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `

        `
    }
}

customElements.define('main-header', Header)
customElements.define('main-footer', Footer)

const head = document.head
head.innerHTML += `<link rel="stylesheet" href="./css/header.css">`

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