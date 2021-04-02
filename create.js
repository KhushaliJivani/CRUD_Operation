const mongoose = require("mongoose");
var express = require("express");
var dotenv = require("dotenv");
var bodyParser = require("body-parser");
dotenv.config();
app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/database2', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("connection sucessfull...")).catch((err) => console.log(err));
//create schema
const student = new mongoose.Schema({
    fname: {
        type: String,
    },
    lname: {
        type: String,
    },
    address: String,
    active: Boolean,
    date: {
        type: Date,
        default: Date.now
    }

})
//collection creation
const Student_class = new mongoose.model("Student", student)

app.post('/create_collection', function (req, res) {
    for (i = 0; i < req.body.length; i++) {


        if (!req.body[i].fname || !req.body[i].lname || !req.body[i].address || !req.body[i].active) {
            res.status(422).json({
                "message": "required field missing",
                "status": "requires param missing"
            })
        }
    }
    for (var i = 0; i < req.body.length; i++) {
        const newStudent = new Student_class({
            fname: `${req.body[i].fname}`,
            lname: `${req.body[i].lname}`,
            address: `${req.body[i].address}`,
            active: `${req.body[i].active}`,
        })
        //create a document or insert
        newStudent.save();
    }
    //read data
    res.send("success");
})
app.get('/getData', function (req, res) {
    const getdata = async () => {
        const data = await Student_class.find({
            fname: "khushali"
        });
        res.json(data);
    }
    getdata();
})
//update data
app.post('/updateData', function (req, res) {
    const fname = req.body.fname;
    console.log(fname);
    const updatedata = async (fname) => {
        try {
            const updatedData = await Student_class.updateMany({
                fname
            }, {
                $set: {
                    fname: "KHUSHALI"
                }
            });
            res.send(updatedData);
        } catch (err) {
            console.log(err);
        }
    }

    updatedata(fname);
})


//delete data
app.post('/deleteData', function (req, res) {
    const fname = req.body.fname;
    const deleteDocument = async (fname) => {
        try {
            const deletedData = await Student_class.deleteMany({
                fname
            });
            res.send(deletedData);
        } catch (err) {
            console.log(err);
        }
    }
    deleteDocument(fname);
})
app.listen(8000, function (err) {
    if (err) {
        throw err
    }
})