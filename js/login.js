const loginInput = {
    email: document.getElementById("email-login"),
    password: document.getElementById("password-login")
};
const signupInput = {
    name: document.getElementById("name-signup"),
    email: document.getElementById("email-signup"),
    password: document.getElementById("password-signup")
}

Object.values(loginInput).forEach(input => {
    input.addEventListener("input", () => {
        input.style.outline = "none";
    });
});
Object.values(signupInput).forEach(input => {
    input.addEventListener("input", () => {
        input.style.outline = "none";
    });
});

const PORT = 3000

async function Login() {
    if (!loginInput.email.value.trim() || !loginInput.password.value.trim()) {
        alert("Preencha todos os campos para continuar");

        if (!loginInput.email.value.trim()) {
            loginInput.email.style.outline = "0.1rem solid red";
        }

        if (!loginInput.password.value.trim()) {
            loginInput.password.style.outline = "0.1rem solid red";
        }

        return;
    }

    if (!loginInput.email.value.includes("@")) {
        alert("Forneça um email válido")
        return
    }
    
    try {
        const response = await fetch(`http://localhost:${PORT}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: loginInput.email.value,
                password: loginInput.password.value
            })
        })

        const data = await response.json()
        
        if (response.ok) {
            sessionStorage.setItem("User", JSON.stringify(data.user))

            alert(data.message) //Login sucesso
            console.log(data.user)
        } else {
            alert(data.message || "Email ou senha inválidos")
        }

    } catch (error) {
        console.log(error)
        alert("Não foi possível fazer login")
    }
}

async function SignUp() {
    if (!signupInput.name.value.trim() || 
        !signupInput.email.value.trim() ||
        !signupInput.password.value.trim()) {
        alert("Preencha todos os campos para continuar");

        if (!signupInput.name.value.trim()) {
            signupInput.name.style.outline = "0.1rem solid red";
        }

        if (!signupInput.email.value.trim()) {
            signupInput.email.style.outline = "0.1rem solid red";
        }

        if (!signupInput.password.value.trim()) {
            signupInput.password.style.outline = "0.1rem solid red";
        }

        return;
    }

    let characterLimit = 24
    if (signupInput.name.value.length > characterLimit) {
        alert(`Nome de usuário muito grande! Max: ${characterLimit}`)
        return
    }

    if (!signupInput.email.value.includes("@")) {
        alert("Forneça um email válido")
        return
    }

    if (signupInput.password.value.length < 8) {
        alert("A senha deve conter no mínimo 8 caracteres")
        return
    }
    
    try {
        const response = await fetch(`http://localhost:${PORT}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: signupInput.name.value,
                email: signupInput.email.value,
                password: signupInput.password.value
            })
        })

        const data = await response.json()

        if (response.ok) {
            alert(data.message) //Cadastro sucesso
        } else {
            alert(data.message || "Erro ao realizar cadastro")
        }

    } catch (error) {
        console.log(error)
        alert("Não foi possível fazer login")
    }
}

function ToggleDivisor() {
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