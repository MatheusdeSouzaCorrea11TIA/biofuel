class Header extends HTMLElement {
    connectedCallback() { //Tirar o + dps
        this.innerHTML = ` 
            <nav>
                <ul>
                    <li>
                        <a href="./instrucoes.html">Instruções</a>
                    </li>

                    <li>
                        <a href="./referencias.html">Referências</a>
                    </li>

                    <li>
                        <a href="./projeto.html">Projeto</a>
                    </li>
                </ul>

                <div class="main-link">
                    <a href="index.html" class="home-anchor">
                        Bio<span class="purple">Fuel</span>
                    </a>
                    <div class="login-btn-container">
                        <a href="./login.html" class="login-btn">
                            <i class="bi bi-person-circle"></i>
                            <span class="login-name">Login</span>
                        </a>
                        <a href="./dashboard.html" class="dash-btn hidden">
                            Dashboard
                        </a>
                    </div>
                    <span class="login-ask">
                        Faça login para acessar a dashboard
                    </span>
                </div>

                <ul>
                    <li>
                        <a href="./produto.html">Produto</a>
                    </li>

                    <li>
                        <a href="./sobrenos.html">Sobre nós</a>
                    </li>

                    <li>
                        <a href="./jogo.html">Jogo</a>
                    </li>
                </ul>

            </nav>
            
            <button id="changeTheme" onclick="toggleModes()">
                <i class="bi bi-moon"></i>
            </button>
        `
    }
}

class DashHeader extends HTMLElement {
    connectedCallback() { //Tirar o + dps
        this.innerHTML = ` 
            <div class="top">
                <div class="head">
                    <button id="changeTheme" onclick="toggleModes()">
                        <i class="bi bi-moon"></i>
                    </button>
                    
                    <div class="main-link">
                        <a href="index.html" class="home-anchor">
                            Bio<span class="purple">Fuel</span>
                        </a>
                    </div>
                </div>

                <nav>
                    <ul>
                        <li>
                            <a href="./instrucoes.html">Instruções</a>
                        </li>

                        <li>
                            <a href="./referencias.html">Referências</a>
                        </li>

                        <li>
                            <a href="./projeto.html">Projeto</a>
                        </li>

                        <li>
                            <a href="./produto.html">Produto</a>
                        </li>

                        <li>
                            <a href="./sobrenos.html">Sobre nós</a>
                        </li>

                        <li>
                            <a href="./jogo.html">Jogo</a>
                        </li>
                    </ul>

                </nav>
            </div>

            <div class="bottom">
                <div class="user-box">
                    <div class="user-img">
                        <p></p>
                    </div>

                    <p class="user-name-label"></p>
                </div>

                <div class="logo-box">
                    <img src="./assets/icons/vortex-logo.png" class="logo">
                    <p>Vortex Horizon</p>
                </div>
            </div>
        `
    }
}

class Footer extends HTMLElement {
    connectedCallback() { //Tirar o + dps
        this.innerHTML = ` 
            <div class="info-container">
                <p>2026 — Projeto de TCC: Sistema Inteligente de Reaproveitamento Energético da Vinhaça</p>
                <div>
                    <p>Desenvolvido pela equipe Vortex ©</p>
                    <img src="./assets/icons/vortex-logo.png" alt="Logo do Vortex Horizon">
                </div>
            </div>

            <div class="tecnologies-container">
                <p>Tecnologias utilizadas: Unity, VS Code, Blender, Clip Studio, Photoshop</p>
                <div class="img-container">
                    <img src="./assets/icons/unity-logo.png" alt="Logo da Unity">
                    <img src="./assets/icons/vscode-logo.png" alt="Logo do VS Code">
                    <img src="./assets/icons/blender-logo.png" alt="Logo do Blender">
                    <img src="./assets/icons/clipstudio-logo.png" alt="Logo do Clip Studio">
                    <img src="./assets/icons/photoshop-logo.png" alt="Logo do Photoshop">
                </div>
            </div>
        `
    }
}

customElements.define('main-header', Header)
customElements.define('main-footer', Footer)
customElements.define('dashboard-header', DashHeader)


//Coloca cor roxa na ancora da pagina atual
document.addEventListener("DOMContentLoaded", () => {
    const currentPath = window.location.pathname.split("/").pop()
    const navLinks = document.querySelectorAll("main-header a:not(.home-anchor)")
    const header = document.querySelector("main-header")
    const loginText = document.querySelector("main-header .login-name")
    const loginButton = document.querySelector("main-header .login-btn")
    const loginAsk = document.querySelector("main-header .login-ask")
    const dashboard = document.querySelector("main-header .dash-btn")
    
    const dashHeader = document.querySelector("dashboard-header")

    navLinks.forEach((link) => {
        const linkPath = link.getAttribute("href").slice(2) //Remove o ./

        if (currentPath === "" && linkPath === "./index.html") {
            link.classList.add("active-page")
        } else if (currentPath === linkPath) {
            link.classList.add("active-page")
        }

        if (currentPath === "login.html") {
            loginButton.classList.add("hidden")
            loginAsk.classList.add("hidden")
        }
    })

    const user = JSON.parse(localStorage.getItem("User"))
    //Auto Login
    if (user) {
        if (loginText) loginText.innerHTML = user.name
        if (loginAsk) loginAsk.classList.add("hidden")
        if (dashboard) dashboard.classList.remove("hidden")
    }

    if (dashHeader) {
        const userLabelDashboard = dashHeader.querySelector(".user-box")
        const userImgLabel = userLabelDashboard.querySelector(".user-img p")
        const usernameLabel = userLabelDashboard.querySelector(".user-name-label")
    
        userImgLabel.innerHTML = user.name.charAt(0)
        usernameLabel.innerHTML = user.name
    }
})