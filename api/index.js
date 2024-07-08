// const express = require('express')
import express from "express"
import mongoose from "mongoose"
import userRouter from "./routes/user.router.js"
import authRouter from "./routes/auth.router.js"
import 'dotenv/config'
const app = express()
const port = 3000
app.use(express.json())
mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log('Connected to mongo')
})
.catch((err)=>{
    console.log(err);
})
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

app.use("/api/user",userRouter)
app.use("/api/auth",authRouter)