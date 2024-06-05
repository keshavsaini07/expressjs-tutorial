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

13. Express-Validation -> Sometimes the data that you expect is not the data you recieve, in this case we want to make sure let's say if the username is less than or equal to 32 characters or less. The api in your express app doesn't know where that data is coming from, therefore server side validation is most important than the client side validation because it is where you are going to process the dat a, post it to the database or pass it to another external api.

14. ValidationSchema -> Create a file named validationSchema in the utils folder - `src\utils\validationSchema.js`. This will help us in writing clean code in the middlewares when doing validation where we can use a schema for the same purpose. For this you will have to create an object, here is an example below:
    ```
        export const createUserValidationSchema = {
            name: {
                isLength: {
                    options: {
                        min: 3,
                        max: 32,
                    },
                    errorMessage: {
                        "name must be atleast 3 characters with a max of 32 characters",
                    },
                },
                notEmpty: {
                    errorMessage: "name cannot be empty",
                },
                isString: {
                    errorMessage: "name must be a string",
                },
            },
            sal: {
                notEmpty: {
                    errorMessage: "sal cannot be empty"
                }
            }
        };
    ```

15. Routers -> Now we will study about how can we organize all of our requests using express routes. The problem right now is that even though we have only few routes defined as our app gorws we can have 50, 100, a whole bunch and you obviously dont want them all together in a single file. Now we want to group together your api endpoints based on domains, domains are the keywords (paths) which will help the api to route themselves based on these keywords. for e.g. the api can differentiate between `users` and `products` using these domains eventually it will act as a path for the api. 
    1. `Router` will be used to create routes which actually has all the properties and methods that the express instance has. It is pretty much like a mini-application in the entire express app that can group together your requests.
    2. Feature: One can register their requests on the router instead of the express app, while the router should also be registered to the entire express app.

16. Routes -> Create a folder named routes in the src folder and organize all of your routes in the routes folder and use a common index.mjs file for importing all of your routes into one single file so that to write clean and efficient code. 
    for e.g. Now simply import this single `index.mjs` file into your main index.mjs in the src folder to implement clean code.
    ```
        import { Router } from "express";

        import usersRouter from "./user-routes.mjs";
        import productsRouter from "./product-routes.mjs";

        const router = Router();

        router.use(usersRouter);
        router.use(productsRouter);

        export default router;

    ```

17. Cookies ->  Cookies are a very simple concept but a lot of people don't quite understand their purpose. Http Cookies are a small piece of data that your web server sends to the web browser. Now you are wondering well why is it important, so by default the HTTP is a stateless protocol (whenever you make a request to the server it doesn't who the user is). A Cookie is an unique value so that the server can distinguish whom does this belong to when recieved.
    Purpose: 
    1. When the web browser recieves any cookie it can be stored on the browser and later sent by the browser back to the server on any request. 2. The main objective is to identify and verify users who have already logged/signed in.  
    3. It also help maintain and track user sessions.
    4. Most of times in realistic large applications where authentication is present, you use cookies alongside with sessions but we will for now focus primarily on cookies and continue about sessions later on.
    for e.g. To develop a cart like system in an e-commerce application you can use something like cookies to maintain user session even after the user closes the app window and returns back to the application so that user can continue from where they left previously i.e. session resuming.

18. Usage of Cookies through requests: 
    1. `cookie()` -> it has three parameters: `name`, `value` and `options`
    2. Options:- 
    - `maxAge`: cookie expire time limit,  
    - `signed`: true if you ever need to set a  signed cookie,
    - `Note`- But in order to actually parse a signed cookie you will need a `secret`, and if you try accessing the cookie the cookiParser will throw you an error like - `Error: cookieParser("secret") required for signed cookies`
    2. A cookie is accessed through `headers` but the problem here is that it's not parsed, we need to have it in a string format.
    3. We now have two options to parse it manually or use a third party package called cookie-parser to do the job for us.
    4. Just to confirm that the cookies are being sent to the server but they are not being parsed in the way as expected.
    5. After installing the `cookie-parser` package, you also need to import and enable it using the middlewares. Also you can pass some additional values like a `secret key` into this cookieParser function to parse for example a signed key which realy is a key that has a signature. Note- Most of the third party packages in express are to be used as middlewares.
    6. `Actually once the browser has recieved the cookie sent by the web server then until the satisfying conditions are met the browser will sent the cookies attached with every request.` Its basically saying like when I send the cookie back to you the you need to send it back to me in order for you to access data. The server will always check for the valid cookie value in order to verify the user. <br/> This is where you can see how authentication and authorisation can be worked. for example -
    ```
        router.get("/api/products", (req, res) => {
        console.log(req.headers.cookie);
        console.log(req.cookies)
        if (req.cookies.cookkie && req.cookies.cookkie === "hello world")
            return res.send([{ id: 101, name: "Dosa", price: 60 }]);

        return res.status(403).send({msg: "Sorry! Please retry with a correct cookie."})
        });
    ```