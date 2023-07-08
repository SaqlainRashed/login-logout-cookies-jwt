import http from "http";
// import compName, {compName1, compName2} from "./features.js";
import * as comp from "./features.js";
import { getIntoComp } from "./features1.js";
import fs from "fs";
// import path from "path";

// console.log(path.dirname("/home/rand/index.html"));

const home = fs.readFileSync("./index.html");

console.log(getIntoComp());
// console.log(comp);
console.log("I will make it to " + comp.compName1 + " " + comp.compName2 + " " + comp.default);

const server = http.createServer((req,res)=>{
    // console.log(req.url);
    // res.end("<h1>Stable</h1>");
    if (req.url === "/"){
        //asynchronous way
        // fs.readFile("./index.html", (err, home)=>{
        //     res.end(home);
        // });
        //synchronously
        res.end(home);
    }
    else if (req.url === "/about"){
        res.end("<h1>About Page.</h1>");
    }
    else if (req.url === "/contact"){
        res.end("<h1>Contact Page.</h1>");
    }
    else {
        res.end("<h1>Page Not Found</h1>");
    }
});

server.listen(5000, ()=>{
    console.log(`Server listening on port ${5000}`);
})