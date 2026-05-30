const express=require('express');
const mongoose=require('mongoose');
const cors=require('cors');
const app=express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://mongodb:27017/whackamole');
const Score=mongoose.model('Score', new mongoose.Schema({
 username:String, score:Number, created:{type:Date, default:Date.now}
}));

app.post('/api/score', async (req,res)=>{
  await Score.create(req.body);
  res.json({ok:true});
});

app.get('/api/leaderboard', async (req,res)=>{
  const data=await Score.find().sort({score:-1}).limit(10);
  res.json(data);
});

app.listen(5000, ()=>console.log('Backend running on 5000'));