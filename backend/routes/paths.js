const Path = require("../models/Path")
const router = require("express").Router()

router.post("/add", async (req, res) => {
    const newPath = new Path(req.body);
    try {
        const savedPath = await newPath.save();
        res.status(200).json(savedPath);
    } catch (err) {
        res.status(500).json(err);
        console.log(err)
    }
});

router.post("/", async (req, res) => {
    try {
        let timeStamp1 = performance.now()
        const path = await Path.findOne({x1: req.body.x1, x2: req.body.x2, y1: req.body.y1, y2: req.body.y2,matrixKey:req.body.matrixKey});
        let timeStamp2 = performance.now()
        res.status(200).json(path);
    } catch (err) {
        res.status(500).json(err)
        console.log(err)
    }
});

module.exports = router;