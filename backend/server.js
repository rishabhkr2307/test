require('dotenv').config();
const express= require('express');
const bcrypt=require('bcryptjs');
const cookieParser=require('cookie-parser')
const jwt=require('jsonwebtoken')
const db=require('./db')
const crypto=require('crypto')
const path=require('path')
const http=require('http')
const setupWebSocket=require('./websocket')

const app=express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,"index.html"));
});

app.get('/register', (req,res)=>{
    res.sendFile(path.join(__dirname,"register.html"));
});


app.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,"login.html"))
})


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
        const token=jwt.sign({username: user.username},process.env.JWT_SECRET,{expiresIn: '24h'});
       
        res.cookie('token',token);

        res.status(200).json({token, message: "Login success", username: user.username,});
    }
   catch(err){
        console.log(err.message);
        res.status(500).json({error: 'server error', details: err.message});
    }
});

const authtoken=(req,res,next)=>{
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({error:"Access Denied"});
    }
    try{
    const verified=jwt.verify(token, process.env.JWT_SECRET);
    req.user=verified;
    next();
    }
    catch(err)
    {
        return res.status(403).json({error: "Invalid token"});
    }
}

app.post('/create-room',authtoken, async(req,res)=>{
    console.log(req.body)
    const rpass=req.body.roomPassword;
    console.log(rpass)
    const username=req.user.username;
    const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let roomid=''
    const random=crypto.randomBytes(6);
    const link=crypto.randomBytes(16).toString('hex');
    const ReadOnly=crypto.randomBytes(16).toString('hex');
    for (let i=0;i<6;i++){
        roomid+=chars[random[i] % chars.length];
    }
    let rpassh=null;
    if(rpass)
    {
        rpassh=await bcrypt.hash(rpass,10);
    }
    const client = await db.pool.connect();

    try{
        await client.query('BEGIN');

        const roomQuery = `INSERT INTO rooms (room_id, room_password, invite_link, read_link)
        values($1,$2,$3,$4);`;

        await client.query(roomQuery,[roomid,rpassh,link,ReadOnly])
        
        const spaceQuery=`INSERT INTO workspace (username, room_id, is_owner)
        values($1,$2,true);`;
        
        await client.query(spaceQuery,[username,roomid]);

        await client.query('COMMIT');
        res.status(201).json({
            message:"Room created", roomid, inviteLink:link, ReadOnly
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

app.post('/join-room', authtoken, async(req,res)=>{
    const {roomId, roomPass, invite}=req.body;
    try{
        const r=await db.query(
            `select room_password, invite_link from rooms where room_id=$1;`,[roomId]);
            if(!r.rows.length) return res.status(404).json({error:'Room not found'})
                const viainvite=invite && invite ===roomId.invite_Link;
            if(!viainvite && roomId.room_Password){
                const ok=roomPass && await bcrypt.compare(roomPass, roomId.room_Password);
                if(!ok) return res.status(401).json({error:"Incorrect password"});
            }
            await db.query(
                `inser into workspace (username, room_id, is_owner)
                select $1, $2, false
                where not exist(select 1 from workspace where username=$1 and room_id=$2);`,
                [req.user.username, roomId]
            );
        res.json({message:`Joined room ${roomId}`})
    }
    catch(err){
        res.status(500).json({error: "Server Error"});
    }
})

const server=http.createServer(app);

setupWebSocket(server);

const port=process.env.PORT || 8080;
server.listen(port, ()=>{
    console.log(`Server is running at http://localhost:${port}`)
});

