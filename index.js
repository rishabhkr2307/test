const express= require('express');
const app=express();

app.use(express.json());

app.get('/',(req,res)=>{
    res.send("HELLO");
})


const port=3000;
app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`)
})