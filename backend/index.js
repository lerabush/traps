const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const pathRoute = require("./routes/paths")
dotenv.config();
// мы создаем парсер для данных в формате json и говорим приложению использовать его
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("MongoDB connected!"))
    .catch(err => console.log(err));


app.use("/api", pathRoute);//назначем обработчика заданному маршруту
app.listen(8800, () => {
    console.log("Backend server is running on port 8800!");
});

