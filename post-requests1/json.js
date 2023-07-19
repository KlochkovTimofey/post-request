const fs = require('fs');
const user = { id: 1, name: "John", course: "JavaScript" };
const users = [user, user, user];
const json = JSON.stringify(users);


// fs.writeFileSync('./users.json', json);
fs.writeFile("./users.json", json, (err) => { 
    if(err) {
        console.log("error");
    }
    else {
        console.log("seccess");
    }
 });
 console.log("Hello!");
