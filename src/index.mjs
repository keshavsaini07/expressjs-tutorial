import express from "express";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}))

const PORT = process.env.PORT || 3000;

const users = [
    {
        id: 1,
        name: "adam",
        sal: 2000
    },
    {
        id: 2,
        name: "rohit",
        sal: 3000
    },
    {
        id: 3,
        name: "diamy",
        sal: 5000
    },
    {
        id: 4,
        name: "maki",
        sal: 4000
    },
    {
        id: 5,
        name: "yuji",
        sal: 2000
    },
]

app.get("/", (req, res) => { 
    res.status(201).send({msg: "Hello World"});
 
})

app.get("/api/users", (req, res) => {
    const { query: {filter, value} } = req;
    // filtering data : when filter and value are defined 
    let parsedSalary = parseInt(value);
    if(filter && value){
        return res.send(
            users.filter((user) => user[filter] === parsedSalary)
        )
    }
    // doesn't do any filtering
    return res.send(users);
})

app.get("/api/users/:id", (req, res) => { 
    console.log(req.params);
    const parsedId = parseInt(req.params.id);
    if(isNaN(parsedId)){
        return res.status(400).send({masg: "Bad Request! Invalid Id"});
    }
    const findUser = users.find((user) => user.id === parsedId);
    if(!findUser) return res.sendStatus(404);
    return res.send(findUser);
})

app.post("/api/users", (req, res) => {
  const { body } = req;
  const newUser = { id: users[users.length - 1].id + 1, ...body };
  users.push(newUser);
  console.log(newUser);
  res.status(201).send("User Created");
});

app.patch("/api/users/:id", (req, res) => {  
    const { body, params: { id } } = req;
    const parsedId = parseInt(id);
    if(isNaN(parsedId)){
        return res.status(400).send({masg: "Bad Request! Invalid Id"});
    }
    const findUserIndex = users.findIndex((user) => user.id === parsedId);

    if(findUserIndex === -1) return res.sendStatus(404);
    // taking the existing user, putting it into a new object and after this overriding the key-value pairs in this object with key-value pairs within the request body
    users[findUserIndex] = { ...users[findUserIndex], ...body };
    return res.status(200).send("User Updated");
})
  
app.put("/api/users/:id", (req, res) => { 
    const { body, params: { id } } = req;
    const parsedId = parseInt(id);
    if(isNaN(parsedId)){
        return res.status(400).send({masg: "Bad Request! Invalid Id"});
    }
    const findUserIndex = users.findIndex((user) => user.id === parsedId);

    if(findUserIndex === -1) return res.sendStatus(404);

    users[findUserIndex] = { id: parsedId, ...body };
    return res.status(200).send("User Updated");
})

app.delete("/api/users/:id", (req, res) => { 
    const { params: { id } } = req;
    const parsedId = parseInt(id);
    if(isNaN(parsedId)){
        return res.status(400).send({masg: "Bad Request! Invalid Id"});
    }
    const findUserIndex = users.findIndex((user) => user.id === parsedId);

    if(findUserIndex === -1) return res.sendStatus(404);
    users.splice(findUserIndex, 1);
    return res.status(200).send("User Deleted");
})

app.listen(PORT, () => {
    console.log(`Server started on port : ${PORT}`);
})