import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
const port = 3000;

// Configuration de Multer pour gérer les fichiers uploadés
const storage = multer.diskStorage({
    destination: 'public/uploads/', // Répertoire où les fichiers seront sauvegardés
    filename: (req, file, cb) => {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});// Configuration de Multer pour gérer les fichiers uploadés

const upload = multer({ storage: storage });

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");


const files = fs.readdirSync('public/uploads');
let likesCount = 0;
let inlikeCount = 0;

let posts =[];
// get to the home page

app.get("/", (req, res) =>{
    console.log(posts)
    // const images = files.filter(file => path.extname(file).toLowerCase() === '.jpg' || path.extname(file).toLowerCase() === '.png').map(file => `uploads/${file}`);

    res.render("index.ejs", {
        posts: posts,
    });
})

// get to the forme page
app.get("/form", (req, res) =>{
    res.render("form.ejs");
})

// methon to post the user infomation
app.post("/form", upload.single('image'), (req, res) =>{

    let like ={
        likes: likesCount, 
        dislike: inlikeCount,
    }

    let post = {
        photo: req.file,
        name: req.body.name,
        message: req.body.message,
    }
    let uploadImage ={
        link: files
    }
    let postRender = {post, like, uploadImage};
    posts.push(postRender);
    
    res.redirect("/"); // redirect for the home page after the user post
})

app.post('/increment-like', (req, res) => { // like the post
    likesCount++;
    res.redirect("/");
});

app.post("/decrement-like", (req, res) => { // dislake the post
    inlikeCount >= 0;
    inlikeCount ++;
    res.redirect("/");
})


app.listen(port, () =>{
    console.log(`This server is runnig on port ${port}`);
})