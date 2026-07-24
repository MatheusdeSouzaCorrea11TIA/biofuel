const socket = io("http://localhost:3000")

socket.on("sensores", (data) => {
    console.log(data)
})