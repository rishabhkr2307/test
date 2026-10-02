const express= require('express');
const bcrypt=require('bcrypt');
const cookieparser=require('cookie-parser')

const app=express();

app.use(express.json());
app.use(cookieparser());

app.post('/register',async(req,res)=>{
    const{username , password}=req.body;
    if(!username || !password){
        return res.json({error: "either username or password not set"});
    }
    const passh=bcrypt.hash(password,10);
    
});


const port=3000;
app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`)

});