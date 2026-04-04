const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(
        "mongodb://localhost:27017/climateDB",
    )
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.log("MongoDB Error:", err);
    });


const climateSchema = new mongoose.Schema({
    city: String,
    temperature: Number,
    date: Date
});

const Climate = mongoose.model("Climate", climateSchema);


/* Store Data */

app.post("/add", async(req, res) => {

    try {

        const data = new Climate(req.body);
        await data.save();

        res.json({ message: "Data Stored Successfully" });

    } catch (err) {

        console.log(err);
        res.status(500).json({ message: "Error storing data" });

    }

});


app.get("/data/:city", async(req, res) => {

    try {

        const data = await Climate.find({ city: req.params.city });
        res.json(data);

    } catch (err) {

        console.log(err);
        res.status(500).json({ message: "Error fetching data" });

    }

});


app.listen(3000, () => {
    console.log("Server running on port 3000");
});
