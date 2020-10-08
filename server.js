//importing
import express from 'express'
import mongoose from 'mongoose'
import Message from './dbMessages.js'
import Pusher from 'pusher'
import cors from 'cors'
//appconfig
const app = express()
const port = process.env.PORT || 9000

//middleware
app.use(express.json())
app.use(cors())


const pusher = new Pusher({
  appId: '1072673',
  key: '66d0ccfe6c10a93db5c1',
  secret: '20953c5cf3e054e53a45',
  cluster: 'ap2',
  encrypted: true
});

const db = mongoose.connection

db.once('open',()=>{
    console.log("DB connected")
    
    const msgCollection = db.collection("messagecontents")
    const changeStream = msgCollection.watch()
    
    changeStream.on("change",(change) =>{
        if(change.operationType=='insert'){
            const messageDetails = change.fullDocument
            pusher.trigger("messages","inserted", {
                name: messageDetails.name,
                message : messageDetails.message,
                timestamp : messageDetails.timestampd
            })
        } else {
            console.log("Error")
        }
    })
})

//db config
const mongoose_url="mongodb+srv://sivakcr8:CLhh86YdxEnLi6X@cluster0.l7orr.mongodb.net/brain?retryWrites=true&w=majority"
mongoose.connect(mongoose_url,{
    useCreateIndex:true,
    useNewUrlParser: true,
    useUnifiedTopology:true
})




app.get('/',(req, res) =>{
    res.status(200).send('hi hello miili mellow')
})

app.post('/messages/new' , (req, res) => {
    const dbMessage = req.body

    Message.create(dbMessage,(err,data)=>{
        if (err){
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
        }
    })
})

app.get('/messages/sync' ,(req,res) => {

    Message.find((err, data) => {
        if (err){
            res.status(500).send(err)
        }
        else{
            res.status(200).send(data)
        }
    })
})

app.listen(port,()=>console.log(`Hello Sir runnning at ${port}`))