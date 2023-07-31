const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")

const app = express();

mongoose.connect("mongodb://localhost:27017/eventdata",{useNewUrlParser:true, useUnifiedTopology:true}).then(()=> {
    console.log("connected with mongodb")
}).catch((err)=>{
    console.log(err)
})

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json())

const eventSchema = mongoose.Schema({
    session:String,
    language:String,
    description:String,
    samay:Date,
    linkk:String,

})

const EventsCollection = new mongoose.model("EventsCollection", eventSchema)


//create event
app.post("/api/v1/event/new",async(req,res)=>{
 const event = await  EventsCollection.create(req.body)

  res.status(201).json({
    success:true,
    event
  })
})

//read event
app.get("/api/v1/event/getall",async(req,res)=>{
 const event = await EventsCollection.find();

 res.status(200).json({
    success:true,
    event
 })

})


//update event
app.put("/api/v1/event/:id",async(req,res)=>{
    let event = await EventsCollection.findById(req.params.id);

    if(!event){
        return res.status(500).json({
            success:false,
            message:"event not found"
        })
    }
    event = await EventsCollection.findByIdAndUpdate(req.params.id,req.body,{new:true,useFindAndModify:false,runValidators:true})
   
    res.status(200).json({
       success:true,
       event
    })


})

//delete event

app.delete("/api/v1/event/:id",async(req,res)=>{
    const event = await EventsCollection.findById(req.params.id);

    if(!event){
        return res.status(500).json({
            success:false,
            message:"event not found"
        })
    }

     await event.deleteOne()
  
    res.status(200).json({
       success:true,
       message:"event has been removed"
    })


})


app.listen(4500,()=>{
    console.log("server is working port",process.env.Port)
})
