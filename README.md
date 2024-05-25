1. express -> it is actually a top level function and we need to call/invoke this function to use it.

2. listen(PORT, () => {}) -> this callback performs post processing operations once the server has started up, so maybe if you want to send an event to the centralized logging system so that way they know that the server was just started and this time you can do that inside it

3. route -> it is a path in your express application <br/>
    for ex: but in productions these ports are hidden
    `localhost:3000/users`
    `localhost:3000/products`

4. GET Requests -> The GET request is used for fetching data and it is a read-only method. Request handler is a callback function with request and response as the arguments
    1. request -> passing headers, send data using request body, accessing cookies or IP address 
    2. response -> used to modify the response and send back text, html, data, json responses
    <br/> for example:- 
    ```
        app.get("/api/users", (req, res) => {
            res.status(201).send(users);
            // res.status(201).send({msg: "Hello World"});
        })
    ```

5. route params -> used to retrieve data based on a unique or a particular type like id or username.
    You can have more than one type but typically you only need one.
     `localhost:3000/users/:id`,
     `localhost:3000/products/:id`,
     `localhost:3000/products/:id/:username`
    <br/> for example:
    ```
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
    ```


6. Query params -> it starts with a '?' symbol and some queries added after it to filter and sort using a get request. One can have as many filters as you want like this : `localhost:3000/products/?key=val&key2=val2` <br/>
    for example:-
    ```
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
    ```

7. POST Request -> The clients filled information will be requested to the backend using an HTTP POST request. This data is sent via a request-body/payload to the backend(database). It will return a CREATED-201 status code on a successful POST request to the backend.
    <br/> for example: 
    ```
        app.post("/api/users", (req, res) => {
            const { body } = req;
            const newUser = {id: users[users.length - 1].id + 1, ...body };
            users.push(newUser);
            console.log(newUser)
            res.status(201).send("User Created");
        })
    ```

8. json -> By default, express is not parsing the request body that is coming in. So whenever you are sending json to express server the headers serves the type to application/json. Express doesn't parse the json by default so we need to tell it by using middlewares. A middleware is nothing just like a function that is invoked before any API request being handled or before the controller of any API.
    

9. PATCH requests (partial update) -> A patch req updates the record but partially. This means that it doesnt updates the entire record instead only one or two columns. <br/>
    for example:
    ```
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
    ```

10. PUT requests (updates the entire record) -> A put req updates the entire record. This means including every single field in that record even if not updating it and if you don't include that field those fields will ne null or removed in sql databases but added in the no-sql databases. <br/>
    for example:
    ```
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
    ```

11. DELETE requests -> A delete request is used to delete records from a database. <br/> for example:
    ```
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

    ```

12. Middlewares -> A middleware is nothing just like a function that can have logic and also have request-repsonse headers for validations that is invoked before any API request being handled or before the controller of any API. It has one more argument called `next` to pass on the control from middleware functions to controller functions. You can enable these middlewares globally or locally for a particular route. You can also send back responses in case the incoming request doesn't have proper types or json web tokens for authorization in the request body i.e. rejecting the request hereby. One can add as many middlewares as per their requirements.
    <br/> for example: Consider the given middleware which prints the request method and request url:
    ```
        const loggingMiddleware = (req, res, next) => {
            console.log(`${req.method} - ${req.url}`)
            next();
        }
    ```

    - Declaring it globally with `app.use()` method and called before any of the routes declared in the index.js file:
    ```
        app.use(loggingMiddleware);
    ```

    - Declaring it locally for particular route:
    ```
        app.get("/", loggingMiddleware, (req, res) => { 
            res.status(201).send({msg: "Hello World"});
        })
    ```
