import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;

app.use(express.json());
app.use(express.static('public'));
app.use(cors());

const user = [];

app.get('/', (req, res)=>{
    return res.json(user);
})

app.post('/cadastro', (req, res)=>{
    const {usuario, email, senha} = req.body;

    if (!usuario || !email || !senha) {
        return res.status(400).json({
            erro: "Preencha todos os campos"
        });
    }

    if (senha.length < 6) {
        return res.status(400).json({
            erro: "A senha deve ter 6 caracteres ou mais"
        });
    }

    const emailUsado = user.find((busca) => busca.email === email);

    if (emailUsado) {
        return res.status(409).json({
            erro: "Email já está em uso"
        });
    }

    console.log(`Recebido, aguarde 5 segundo`);

    user.push({usuario, email, senha});

    setTimeout(()=>{
        console.log(`Cadastrado o ${usuario} com o Email ${email}`);

        res.json({
            mensagem: "Cadastrado com Sucesso!!",
            perfil: `Perfil ${usuario} cadastrado com o email ${email}`
        });
    }, 5000);
});

app.post('/login', (req, res)=>{
    const {email, senha} = req.body;
    
    if (!email || !senha) {
        return res.status(400).json({erro:"Preencha todos os campos"});
    }

    const emailExiste = user.find((busca)=> busca.email.toLowerCase() === email.toLowerCase());

    if (!emailExiste || emailExiste.senha != senha) {
        return res.status(400).json({erro:"Email ou senha incorretos!"});
    }

    return res.json({
        mensagem: "Login realizado com Sucesso!!",
        usuario: emailExiste.email
    });
})

app.listen(PORT, ()=>{
    console.log(`Servidor rodando na porta ${PORT}`);
});