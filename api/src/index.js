import express from "express";
import cors from "cors";
import mysql from "mysql2";
import dotenv from "dotenv"
import { Server } from "socket.io"
import { createServer } from "http"
dotenv.config()

const connection = mysql.createPool({
    host: process.env.SERVER_HOST,
    user: process.env.SERVER_USER,
    password: process.env.SERVER_PASSWORD,
    database: process.env.SERVER_DATABASE
})

const app = express()
app.use(cors())
app.use(express.json())

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.get("/", async (req, res) => {
    res.json({ message: "This is the main page, nothing important here" })
})

app.post("/login", async (req,res) => {
    const { email, password } = req.body

    const selectCommand = "SELECT * FROM users WHERE email = ?"
    connection.query(selectCommand, [email], (err, users) => {
        if (err) {
            console.log(err)
            return res.status(500).json({
                message: "Erro interno do servidor."
            });
        }

        if (users.length === 0) {
            return res.status(401).json({
                message: "Usuário ou senha incorretos!"
            });
        }

        const user = users[0]

        if (user.password != password) {
            return res.status(401).json({
                message: "Usuário ou senha incorretos!"
            });
        }

        res.status(200).json({
            message: "Login realizado com sucesso!",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })
    })
})

app.post("/signup", async (req,res) => {
    const { name, email, password } = req.body

    const selectCommand = "SELECT * FROM users WHERE email = ?"
    connection.query(selectCommand, [email], (err, users) => {
        if (err) {
            console.log(err)
            return res.status(500).json({
                message: "Erro interno do servidor."
            });
        }

        if (users.length > 0) {
            return res.json({
                message: "Já existe um usuário conectado à este email"
            })
        }

        const insertCommand = `INSERT INTO users(name, email, password)
                            VALUES(?,?,?)`
        connection.query(insertCommand, [name,email,password], (err) => {
            if (err) {
                console.log(err)
                return res.status(500).json({
                    message: "Erro interno do servidor."
                });
            }

            res.status(200).json({
                message: "Cadastro realizado com sucesso!",
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            })
        })
    })
})

app.post("/api/sensores", async (req, res) => {
    const data = req.body;

    console.log(data)
    
    io.emit("dashboard:update", data)

    // io.to(`user_${usuario_id}`).emit("sensores", dados);
    // Usar esse quando tiver sistema de autenticação

    res.send("Recebido")
})

httpServer.listen(process.env.PORT, () => {
    console.log(`Servidor rodando em http://localhost:${process.env.PORT}`)
})

let processState = { operando: false, startedAt: null };

io.on('connection', (socket) => {

    // ------- Ligar e desligar o projeto todo -------- //
    socket.on('equipamento:iniciar', () => {
        processState.operando = true;
        processState.startedAt = Date.now(); // timestamp em ms, UTC

        io.emit('dashboard:update', {
            operando: true,
            startedAt: processState.startedAt
        })
    })

    socket.on('equipamento:desligar', () => {
        console.log('Recebido: desligar');
        io.emit('dashboard:update', { operando: false, startedAt: null });
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });

    // ------ Módulo Relé ------- //
    socket.on('aquecimento:pausar', () => {
        // pausa só o aquecimento, mantém resfriamento rodando se estiver ativo
        io.emit('dashboard:update', { aquecimento: false });
    });

    socket.on('aquecimento:retomar', () => {
        io.emit('dashboard:update', { aquecimento: true });
    });

    socket.on('resfriamento:pausar', () => {
        io.emit('dashboard:update', { resfriamento: false });
    });

    socket.on('resfriamento:retomar', () => {
        io.emit('dashboard:update', { resfriamento: true });
    });
})






/* == Table users ==
CREATE TABLE users(
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

   == Table ESP32 ==
CREATE TABLE ESP32(
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    mac VARCHAR(17) UNIQUE NOT NULL,
    nome VARCHAR(100),

    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
*/