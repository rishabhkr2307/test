require('dotenv').config();
const express= require('express');
const bcrypt=require('bcryptjs');
const cookieparser=require('cookie-parser')
const jwt=require('jsonwebtoken')
const db=require('./db')
const crypto=require('crypto')

const app=express();

app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({extended: true}));

app.post('/register',async(req,res)=>{
    const{username , password}=req.body;

    if(!username || !password){
        return res.status(400).json({error: "either username or password not set"});
    }

    try{
    const passh=await bcrypt.hash(password,10);
    const mquery=`insert into users (username, user_password)values($1,$2) returning username;`
    const result=await db.query(mquery,[username, passh]);
    res.status(201).json({message: 'User registered', user:result.rows[0].username});
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({error: 'server error', details: err.message});
    }
});

app.post('/login', async(req,res)=>{
    const {username,password}=req.body;

    if(!username || !password){
        res.status(400).json({Error: "either username or password not submmitted"});
    }

    try{
        const mquery=`select * from users where username=$1;`;
        const result=await db.query(mquery,[username]);

        if(result.rows.length ===0)
        {
            return res.status(401).json(({error: "invalid credentials"}));
        }
        const user=result.rows[0];
        const isvalid=await bcrypt.compare(password, user.user_password);
        if(!isvalid){
            res.status(401).json({error: "wrong password"});
        }
        const token=jwt.sign({username: user.username},process.env.JWT_SECRET)
        res.cookie('token',token);

        res.status(200).json({message: "Login success", username: user.username});
    }
   catch(err){
        console.log(err.message);
        res.status(500).json({error: 'server error', details: err.message});
    }
});

app.post('/create-room',async(req,res)=>{
    const {rpass}=req.body;
    const username=req.users.username;
    
    const roomid=crypto.randomBytes(8).toString('hex');
    const link=crypto.randomBytes(16).toString('hex');
    const ReadOnly=crypto.randomBytes(16).toString('hex');

    let rpassh=null;
    if(rpass)
    {
        rpassh=await bcrypt.hash(rpass,10);
    }
    const client = await db.pool.connect();

    try{
        await client.query('BEGIN');

        const RoomQUery = `INSERT INTO rooms (room_id, room_password, invite_link, read_link)
        values($1,$2,$3, $4);`;

        await client.query(RoomQuery,[roomid,passh,link,ReadOnly])

        await client.query('COMMIT');

        
        const spaceQuery=`insert into workspace (username, room_id, is_owner)
        values($1,$2,true);`;
        
        await client.query(spaceQuery,[username,roomid]);

        res.status(201).json({
            message:"Room created", roomid, inviteLink, ReadOnly
        });   
    }
    catch(err){
        await client.query('ROLLBACK')
        res.status(500).json({error:"failed to create room"});
    }
    finally{
        client.release();
    }
});


const port=3000;
app.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`)

});