
function toggleDivisor() {
    const divisor = document.querySelector(".divisor")
    const isRight =  divisor.classList.contains("right")

    const p = divisor.querySelector("p")
    const btn = divisor.querySelector("button")

    if (isRight) {
        p.innerHTML = "Ja possui uma conta?"
        btn.innerHTML = "Entre agora"
        divisor.classList.remove("right")
    } else {
        p.innerHTML = "Não possui uma conta?"
        btn.innerHTML = "Cadastre-se"
        divisor.classList.add("right")
    }
}