const express = require('express');
const port = 3000;
const app = express();
const path = require('path')
const fs = require("fs");
const { stringify } = require('querystring');
let users = JSON.parse(fs.readFileSync("./users.json"));




function writeUsers(users) {
    const json = JSON.stringify(users);

    fs.writeFile("./users.json", json, (err) => { 
        if(err) {
            console.log("error");
        }
        else {
            console.log("seccess");
        }
     });
    
}

app.set( "view engine", "ejs" );
app.use("/static", express.static(path.join(__dirname, 'static')));
app.use(express.urlencoded());

app.get("/", (req, res) => {
    res.render("form", {errors: [], name: "", age: "" });
});

app.get("/users", (req, res) => {
    res.render("users", { users: users });
});

app.get("/users/delete/:id", (req, res) => {
    let uid = req.params.id;
    users = users.filter( (user) => user.id != uid );
    writeUsers(users);
    res.redirect("/users");
    
});

app.get("/users/update/:id", (req, res) => {
    let uid = req.params.id;
    let user = users.find( (element) => element.id == uid );
    
    res.render("update", { user: user });
});

app.post("/", (req, res) => {
    let errors = [];
    req.body.id = Date.now();
    // ИМЯ
    if(req.body.name.length == 0) {
        let error = {message: "Заполните имя пользователя", name: "name"};
        errors.push(error);
        
    }
    if(req.body.name.length < 4 || req.body.name.length > 20) {
        let error = {message: "Имя пользователя должно быть от 4 до 20 символов", name: "name"};
        errors.push(error);

    }
    // ВОЗРАСТ
    if(req.body.age.length == 0) {
        let error = {message: "Заполните свой возраст", name: "age"};
        errors.push(error);
        
    }
    if(req.body.age < 0 || req.body.age > 150) {
        let error = {message: "Возраст должен быть от 0 до 150", name: "age"};
        errors.push(error);
        
    }
    // ДАТА РОЖДЕНИЯ
    if(req.body.birth.length == 0) {
        let error = {message: "Заполните свою дату рождения", name: "birth"};
        errors.push(error);
        
    }
    console.log(req.body.birth)
    if(Date.now() - Date.parse(req.body.birth) < 24 * 60 * 60 * 1000 ) {
        let error = {message: "Дата рождения указана некорректно", name: "birth"};
        errors.push(error);
        
    }
    if(errors.length > 0) {
        res.render("form", {errors: JSON.stringify(errors, ), name: req.body.name, age: req.body.age});
        return
    }
    
    users.push(req.body);
    writeUsers(users);
    res.redirect("/users");
});

app.post("/users/update/:id", (req, res) => {
    let uid = req.params.id;
    let data = req.body; 
    let index = users.findIndex( (element) => element.id == uid);
    data.id = users[index].id;
    users[index] = data;
    writeUsers(users);
    res.redirect("/users");
    
});

app.listen(port, () => {console.log ("Server is running") });

