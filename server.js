const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
const port = 3000;

const Document = require("./models/Documents");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/hastenin", {});

app.get("/", (req, res) => {
  const code = `Welcome to pastebin;
Sharing code is a good thing, and it should be _really_ easy to do it.
A lot of times, I want to show you something I'm seeing - and that's where we
use pastebins.

Haste is the prettiest, easiest to use pastebin ever made.
    `;
  res.render("code-display", { code ,language:'plaintext'});
});

app.get("/new", (req, res) => {
  res.render("new");
});

app.post("/save", async (req, res) => {
  const value = req.body.value;
  // console.log(value);

  try {
    const document = await Document.create({ value });
    res.redirect(`/${document.id}`);
  } catch (error) {
    res.render("new", { value });
  }
});

app.get('/:id/duplicate',async (req,res)=>{
    const id =req.params.id;
    try {
        const document= await Document.findById(id)
        res.render('new',{value:document.value});
    } catch (error) {
        res.redirect(`/${id}`)
    }
})

app.get('/:id',async (req,res)=>{
    const id =req.params.id;
    try {
        const document= await Document.findById(id)
        res.render('code-display',{code:document.value, id});
    } catch (error) {
        res.redirect('/')
    }
})

app.listen(port);
