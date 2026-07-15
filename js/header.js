class Header extends HTMLElement {
    connectedCallback() { //Tirar o + dps
        this.innerHTML = ` 
            <nav>
                <ul>
                    <li>
                        <a href="">Instruções</a>
                    </li>

                    <li>
                        <a href="">Referências</a>
                    </li>

                    <li>
                        <a href="./projeto.html">Projeto</a>
                    </li>
                </ul>

                <a href="./index.html" class="home-anchor">Bio<span class="purple">Fuel</span></a>

                <ul>
                    <li>
                        <a href="">Produto</a>
                    </li>

                    <li>
                        <a href="">Sobre nós</a>
                    </li>

                    <li>
                        <a href="">Jogo</a>
                    </li>
                </ul>

                <button onclick="toggleModes()">
                    <i class="bi bi-moon"></i>
                </button>
            </nav>
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