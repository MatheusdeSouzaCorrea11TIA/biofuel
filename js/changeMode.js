document.addEventListener("DOMContentLoaded", () => {
    const body = document.body
    body.classList.add("darkmode")

    //Darkmode : bool
    const darkModeValue = JSON.parse(sessionStorage.getItem("darkmode"))
    changeColors(darkModeValue)
    const isDarkmode = body.classList.contains("darkmode")
    sessionStorage.setItem("darkmode", JSON.stringify(isDarkmode))
})

function toggleModes() {
    const body = document.body
    body.classList.toggle("darkmode")
    changeColors()
}

function changeColors(darkmode) {

}
