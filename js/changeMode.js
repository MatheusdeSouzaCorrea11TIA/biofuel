document.addEventListener("DOMContentLoaded", () => {
    const body = document.body
    
    //Darkmode : bool
    const darkModeValue = JSON.parse(sessionStorage.getItem("darkmode"))
    changeColors(darkModeValue)
    
    if (darkModeValue) body.classList.add("darkmode")
    else body.classList.remove("darkmode")
})

function toggleModes() {
    const body = document.body
    body.classList.toggle("darkmode")
    
    const isDarkmode = body.classList.contains("darkmode")
    sessionStorage.setItem("darkmode", JSON.stringify(isDarkmode))
    console.log(isDarkmode)
    changeColors(isDarkmode)
}

function changeColors(darkmode) {
    const root = document.documentElement

    //Ta preto
    if (darkmode) {
        root.style.setProperty('--white', '#FFFFFF')
        root.style.setProperty('--gray', '#A8A8A8')
        root.style.setProperty('--dark-gray', '#131212')
        root.style.setProperty('--black', '#000000')
        root.style.setProperty('--input-bg', '#181818')
    //Ta branco
    } else {
        root.style.setProperty('--white', '#000000')
        root.style.setProperty('--gray', '#585858')
        root.style.setProperty('--dark-gray', '#cfcece')
        root.style.setProperty('--black', '#FFFFFF')
        root.style.setProperty('--input-bg', '#c5c5c5')
    }
}
