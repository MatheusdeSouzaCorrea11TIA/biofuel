import express from "express";
import cors from "cors";
import mysql from "mysql2";
import dotenv from "dotenv"
dotenv.config()

const connection = mysql.createPool({
    host: process.env.SERVER_HOST,
    user: process.env.SERVER_USER,
    password: process.env.SERVER_PASSWORD,
    database: process.env.SERVER_DATABASE
})

/* == Table users ==
CREATE TABLE users(
    id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);
*/

const app = express()
app.use(cors())
app.use(express.json())

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
            })
        })
    })
})



app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando em http://localhost:${process.env.PORT}`)
})