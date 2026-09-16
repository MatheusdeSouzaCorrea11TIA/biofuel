document.addEventListener("DOMContentLoaded", () => {
    const body = document.body
    
    //Darkmode : bool
    const darkModeValue = JSON.parse(localStorage.getItem("darkmode"))
    changeColors(darkModeValue)
    
    if (darkModeValue) body.classList.add("darkmode")
    else body.classList.remove("darkmode")
})

function toggleModes() {
    const body = document.body
    body.classList.toggle("darkmode")
    
    const isDarkmode = body.classList.contains("darkmode")
    localStorage.setItem("darkmode", JSON.stringify(isDarkmode))
    console.log(isDarkmode)
    changeColors(isDarkmode)
    window.location.reload()
    
}

function changeColors(darkmode) {
    const root = document.documentElement

    const changeThemeIcon = document.querySelector("#changeTheme i")
    if (!darkmode && changeThemeIcon) {
        changeThemeIcon.classList.remove("bi-moon")
        changeThemeIcon.classList.add("bi-brightness-high")
    }

    //Ta preto
    if (darkmode) {
        root.style.setProperty('--white', '#FFFFFF')
        root.style.setProperty('--gray', '#A8A8A8')
        root.style.setProperty('--dark-gray', '#131212')
        root.style.setProperty('--black', '#000000')
        root.style.setProperty('--input-bg', '#181818')

        // dashboard
        root.style.setProperty('--dash-bg', '#080813')
        root.style.setProperty('--purple', '#804BCF')
        root.style.setProperty('--mid-purple', '#37285D')
        root.style.setProperty('--dark-purple', '#221D35')
        root.style.setProperty('--orange', '#FF9500')
        root.style.setProperty('--green', '#48F2C2')
        root.style.setProperty('--purple-hover', '#6433a3')

        root.style.setProperty('--card-bg', 'rgba(255,255,255,0.035)')
        root.style.setProperty('--card-border', 'rgba(255,255,255,0.06)')

        root.style.setProperty('--agent-bg', 'rgba(0,0,0,0.5)')
    //Ta branco
    } else {
        root.style.setProperty('--white', '#000000')
        root.style.setProperty('--gray', '#5C5C66')
        root.style.setProperty('--dark-gray', '#E4E2ED')
        root.style.setProperty('--black', '#FFFFFF')
        root.style.setProperty('--input-bg', '#E9E7F2')

        // dashboard
        root.style.setProperty('--dash-bg', '#cbc6da')
        root.style.setProperty('--purple', '#5A2FA0')
        root.style.setProperty('--mid-purple', '#9B7FCB')
        root.style.setProperty('--dark-purple', '#bfafdb')
        root.style.setProperty('--orange', '#B8600A')
        root.style.setProperty('--green', '#0A7A5C')
        root.style.setProperty('--purple-hover', '#3F1E75')

        root.style.setProperty('--card-bg', '#FFFFFF')
        root.style.setProperty('--card-border', 'rgba(90, 47, 160, 0.3)')

        root.style.setProperty('--agent-bg', 'rgba(255,255,255,0.5)')
    }
}