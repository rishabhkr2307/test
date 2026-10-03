const express= require('express');
const bcrypt=require('bcryptjs');
const cookieparser=require('cookie-parser')
const path=require('path')
const jwt=require('jsonwebtoken')
const db=require('./db')

const app=express();

app.use(express.json());
app.use(cookieparser());

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'))
    
});

app.post('/register',async(req,res)=>{
    const{username , password}=req.body;
    if(!username || !password){
        return res.json({error: "either username or password not set"});
        console.log('registered');
    }
    try{
    const passh=bcrypt.hash(password,10);
    const query=`insert into users (username, user_password)values($1,$2)`
    const result=db.query(query,[username, passh]);
    res.status(201).json({message: 'User registered', user:result.rows[0].username});
    }
    catch(err){
        res.status(500).json({error: 'server error', details: err.message});
        console.log(err.message);
    }
});

// app.post('/login', async(req.res)=>{

// });


const port=3000;
app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`)

});