// const express = require('express')
import express from "express"
import mongoose from "mongoose"
// import { configDotenv } from "dotenv"
// configDotenv.config
import 'dotenv/config'
const app = express()
const port = 3000

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