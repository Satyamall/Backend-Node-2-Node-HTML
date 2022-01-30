
// path module
const path=require('path');
const fs = require('fs');
const http=require('http');
const https= require('https');

// * create a server
// * serve on html page
// * take the page from a template
// * we will dynamically insert value into it

const server=http.createServer((req,res)=>{
    if(req.url==="/" && req.method==="GET")
    {
        handleHomePage(req,res);
    }
    if(req.method==="GET" && req.url === '/users/1'){
        handleUserPage(req,res,1);
    }
    if(req.method==="GET" && req.url === '/users/2'){
        handleUserPage(req,res,2);
    }
    if(req.method==="GET" && req.url === '/users/3'){
        handleUserPage(req,res,3);
    }
})

const handleHomePage=(req,res)=>{
    // * read the html file
    fs.readFile(path.join(__dirname,"template","index.html"),"utf8",(err,data)=>{
        
        let template=data;

        const options={
              title: "Home Page",
              description: "Welcome to my home page"
          }
          
          for( let key in options)
          {
              let value=options[key];
              template=template.replace(`{${key}}`,value)
          }
          console.log(template)
          res.writeHead(200);
          res.end(template);
    })
    
}


const handleUserPage=(req,res,id)=>{
    fs.readFile(path.join(__dirname,"template","user.html"),"utf8",(err,data)=>{
        if(err){
            res.writeHead(404);
            res.send("Something went wrong")
            return;
        }
        let template = data;
        https.get("https://reqres.in/api/users/" + id,(httpResponse)=>{
             console.log(httpResponse.statusCode)
             let data = '';
             httpResponse.on('data',(chunk)=>{
                 data += chunk;
             })
             httpResponse.on('end',()=>{
                 const response= JSON.parse(data);
                 console.log(response);
                 const options={
                     title: "User Page",
                     name: response.data.first_name + response.data.last_name,
                     img_src: response.data.avatar,
                     email: response.data.email
                 }
                 for( let key in options)
                 {
                     let value=options[key];
                     template=template.replace(`{${key}}`,value)
                 }
                 res.writeHead(200);
                 res.end(template);
             })
        })
    })
}

server.listen(3000,()=>{
    console.log("Listen on port 3000")
})