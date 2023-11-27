const express = require("express")
const path = require("path")
const app = express()
const LogInCollection = require("./mongo")
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

const templatePath = path.join(__dirname, '../templates')
const publicPath = path.join(__dirname, '../public')
console.log(publicPath);

app.set('view engine', 'hbs')
app.set('views', templatePath)
app.use(express.static(publicPath))


app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('login')
})



app.post('/signup', async (req, res) => {

    const data = {
        name: req.body.name,
        password: req.body.password
    }
    
    const checking = await LogInCollection.findOne({ name: req.body.name })
    
   try{
    if (checking?.name === req.body.name && checking?.password===req.body.password) {
        res.send("user details already exists")
    }
    else{
        
        const user = new LogInCollection(data);
        await user.save();
        res.status(201).render("home", { naming: `${req.body.name}` })
    }
   }
   catch{
    res.send("wrong inputs")
   }
})


app.post('/login', async (req, res) => {

    try {
        const check = await LogInCollection.findOne({ name: req.body.name })

        if (check?.password === req.body.password) {
            res.status(201).render("home", { naming: `${req.body.name}` })
        }

        else {
            res.send("incorrect password")
        }


    } 
    
    catch (e) {

        res.send("wrong details")
        

    }


})



app.listen(3000, () => {
    console.log('port connected');
})