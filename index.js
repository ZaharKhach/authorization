const express = require("express");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());

const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://root:root@cluster0.fwvgiqf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
        app.listen(PORT, () => console.log(`sever started on port ${PORT}`))
    } catch (e) {
        console.log(e, 'sad')
    }

}

start();