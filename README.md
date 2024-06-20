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

17. Cookies ->  Cookies are a very simple concept but a lot of people don't quite understand their purpose. `Http Cookies` are a `small piece of data` that your `web server` sends to the `web browser`. Now you are wondering well why is it important, so by default the `HTTP` is a `stateless protocol` (whenever you make a request to the server it doesn't who the user is). A Cookie is an `unique value` so that the server can distinguish whom does this belong to when recieved.
    Purpose: 
    1. When the web browser recieves any cookie it can be stored on the browser and later sent by the browser back to the server on any request. 
    2. The main objective is to `identify and verify users` who have already logged/signed in.  
    3. It also help `maintain and track user sessions.`
    4. Most of times in realistic large applications where authentication is present, you use cookies alongside with sessions but we will for now focus primarily on cookies  and continue about sessions later on.
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
    6. `Actually once the browser has recieved the cookie sent by the web server then until the satisfying conditions are met the browser will sent the cookies attached with every request.` Its basically saying like when I send the cookie back to you then you need to send it back to me in order for you to access data. The server will always check for the valid cookie value in order to verify the user. <br/> This is where you can see how authentication and authorisation can be worked. for  example -
    ```
        router.get("/api/products", (req, res) => {
            console.log(req.headers.cookie);
            console.log(req.cookies)
            if (req.cookies.cookkie && req.cookies.cookkie === "hello world")
                return res.send([{ id: 101, name: "Dosa", price: 60 }]);

            return res.status(403).send({msg: "Sorry! Please retry with a correct cookie."})
        });
    ```
    7. Also you can use signed cookies by using `signed option` and `passing a secret to cookieParser()`, while using signedCookies instead of cookies in the above mentioned example, you cna also visit my commits history to check for signed commits.

19. Sessions -> Sessions represent the duration of a user on a website or application. As Http is stateless, we don't know who is making requests to our server so we need to track these requests and know where they are coming from. One common usage of sessions is `user authentication`. Sessions are created on server by generating an object by a `session id` (like abc123). 
    1. When an http request is sent to  the server form the web browser the response can return instructions to set a cookie with the session id so that they can be saved in the browser.
    2. This allows the browser to send the same cookie on the subsequent requests to the server.
    3. The server can then parse the cookie from text to json, then verify the session id which was sent form the client, and determine who sent the request. 
    4. Whenever the browser sends the cookie on each request, the server can then lookup which user pertains to the corresponding session as it maintains a `mapping` of each `session id` to the `user`.
    5. We will use the `express-session` library to implement sessions which is a third party package.

20. Usage Of Sessions - express-session library
    1. options
        - `secret`: you need to set it a string, ideally it should be sophisticated that is not guessable and complicated,
        - `saveUninitialized`: this property along with next one called resave is related to session stores. We currently don't have any session storage configured, but express does use `inmemory storage by default`. this property forces a session that is `uninitialized` to be saved to the store. A session is `uninitialized` when it is `new` but not `modified`. The main part is you want `saveUninitialized` set to `false` when you dont want it to save an unmodified session data to the session stores.
        for example- by default if every single user visits the website and they are not doing anything, they are just visiting it, and if you have `saveUninitialized` set to true it will actually save the session object to the session store even if it doesn't have anything at all and this can actually take up the memory of the session storage. Ideally you want `saveUninitialized` to be set to false when building user authentication, or managing user sessions.
        - `resave`: it forces the session to be saved back to the session store, even if the session was never modified during the request. Set above both properties to be false for now and don't worry.
        - `cookie`: it has same properties that we talked about in cookies above like maxAge.
    2. session object 
        when you will modify the session data object then express-session will create a cookie or it will set a cookie and then it will be sent to the client side or browser where it will be stored and then on subsequent requests that coookie will be sent to the server assuming it has not been expired. Now, the server will go through the whole express-session middleware and validate the recieved cookie making sure it's not invalid or expired, then express session will actually wont generate a new session or session id. By modifying this session data object can help us in tracking users using our websites and api, and if we don't we will be having brand new sessions all the time for every requests.
    3. Here is an example for dummy authentication system that can be implemented using sessions and cookies. for example -
    ```
        app.post("/api/auth", (req, res) => {
            const { body: { username, password } } = req;
            const findUser = users.find( (user) => user.username === username);
            if(!findUser || findUser.password !== password){
                return res.status(401).send({msg: "BAD CREDENTAILS!"})
            }

            req.session.user = findUser;

            res.status(200).send(findUser);
        });
    ```
    4. Here is a an example of a status api that can be accessed when you are authenticated. 
    ```
        app.get("/api/auth/status", (req, res) => {
            req.sessionStore.get(req.sessionID, (err, sessionData) => {
                console.log(sessionData);
            });
            return req.session.user 
                ? res.status(200).send(req.session.user) 
                : res.status(401).send({msg: "UNAUTHORIZED ACTION"});
        });
    ```
    5. In the previous example you can also see via different clients like thunderclient and postman to login as different users, you can see the `mapping` between the `sessionID` with its `user`. <br/>
    for example you will have something like this - 
    ```
        {
            cookie: {
                originalMaxAge: 3600000,
                expires: '2024-06-06T19:29:10.989Z',
                httpOnly: true,
            },
            user: { id: 5, username: 'yuji', sal: 2000, password: 'himank123' }
        }
        {
            cookie: {
                originalMaxAge: 3600000,
                expires: '2024-06-06T19:28:27.733Z',
                httpOnly: true,
                path: '/'
            },
            user: { id: 1, username: 'adam', sal: 2000, password: 'himank123' }
        }
    ```
    6. Added a cart based functionality where a specified user can add items to their cart, only the users who are authenticated. Each `user` will have their own cart which is `mapped` to their `sessionID`. <br/>
    for example - 
    ```
        // adding an item to a cart
        app.post("/api/cart", (req, res) => {
            if (!req.session.user) {
                return res.status(401).send({ msg: "UNAUTHORIZED ACTION " });
            }
            // assuming all values in request body are valid
            const { body: item } = req;

            const { cart } = req.session;
            
            if(cart){
                cart.push(item);
            }
            else{
                req.session.cart = [item];
            }

            res.status(200).send(item);
        });

        // retrieving all the items of cart
        app.get("/api/cart", (req, res) => {
            return req.session.user
                ? res.status(200).send(req.session.cart ?? []) 
                : res.status(401).send({ msg: "UNAUTHORIZED ACTION" });
        });
    ```

21. `Authentication with PassportJS` -> In this part, we will be using a local strategy for authentication instead of handling it via `third party` providers like `google`, `facebook`, or `twitter`, the credentials will be stored on our local array (in memmory storage) instead of database because we don't have the database. We will use `local authentication` and later on use `OAuth2` to integrate third party services for authentication.
    1. Install `passport` and `passport-local` : <br/> 
    Note - `Passport` integrates well with `express-session` and many times you will use passport with express-session or vice-versa, but you don't need to do it but it is highly `recommended` use both of them together because passport will take care of the `mapping` that user who is `logging in` with its `session id`.
    ```
        npm i passport passport-local
    ``` 
    2. Use the below given middlewares:
        - `app.use(passport.initialize());` : Initializes Passport for incoming requests, allowing authentication strategies to be applied.
        - `app.use(passport.session());` : Middleware that will restore login state from a session. Web applications typically use sessions to maintain login state between requests. If sessions are being utilized, and a login session has been established, this middleware will `populate` (attaching a dynamic property) `req.user` with the `current user`.
    3. Now create a file named `local-strategy.mjs` in the directory - `utils/strategy/`. Now we will use the strategy object as the middleware to verify the user. After finding the user we will serialize the user using `serializeUser` method.
        - `serializeUser` : Registers a function used to serialize user objects into the session.
        - `deserializeUser` : Registers a function used to deserialize user objects out of the session. In other words, it kind of reveals who the actual user. It takes that user object via the id and stores it into the request object itself.
    4. `Setup login and logout routes` :
        - `login` : Setup a login routes for users
        ```
            app.post("/api/auth", passport.authenticate('local'), (req, res) => {
                res.status(200).send({msg: "User Login Success"})
            } )
        ```
        - `logout` : setup a logout route for users using post
        ```
            app.post("/api/auth/logout", (req, res) => {
                return req.user ? req.logout((err)  => {
                    if(err) return res.sendStatus(400);
                    res.status(200).send("User Logged Out")
                    }) : res.status(401).send({msg: "UNAUTHORIZED ACTION"})
            } )
        ```
        - `status check` : this routes is to check if user is able to access the functions which they cannot if they are logged out
        ```
            app.get("/api/auth/status", (req, res) => {
                console.log("Inside auth status");
                console.log(req.user);
                return req.user ? res.send(req.user) : res.status(401).send({msg: "UNAUT HORIZED ACTION"})
            })
        ```
22. Databases -> In this part, we will connect to mongodb database using mongoose. For this install both mongodb and mongoose. Use the given below code to connect to the database :   
    ```
    mongoose.connect('mongodb://127.0.0.1/express-tutorial').then(() => {
        console.log("Database Connected")
    }).catch((err) => console.log(`Error: ${err}`))
    ```
    - `Mongoose` : It is a very popular ORM which helps in creating, querying and structuring mongodb databases, they are safe and efficient to use as in development ORMs are used for interacting with databases.
    - `schema` : a way for defining your database collections, shaping up data. define schemas for your models and you're good to go

23. Hash Passwords -> Firstly install the bcrypt library for hashing the passwords so that it is safe from others and maintain user privacy.
    1. `saltRounds` : The saltRounds are basically how much time is needed to calculate the hash for bcrypt, so more number of rounds means more complexity for it and the docs recommend for atleast 10 rounds.
    2. `genSalt` : It generates salt round for the given value of saltRounds. `genSaltSync` works similarly as this function but does all things synchronously where you donot need to use async-await.
    3. `hash` : It takes two arguments - <b> password</b> and <b>salt</b>. It generates hashed value for the given password. The `hashSync` works similarly as this function but does all things synchronously where you donot need to use async-await.
    4. `compare` : It takes two passwords as arguments, which are to be compared. This fucntion returns a <b>boolean</b> valued based on the comparison of two given passwords. The `compareSync` works similarly as this function but does all things synchronously where you donot need to use async-await. <br>
    5. `helpers.mjs`: Create a helpers.mjs file in utils folder and paste the following code:-
        ```
        import bcrypt from 'bcrypt'

        const saltRounds = 10;

        // generates hashed version of a password
        export const hashPassword = (password) => {
            const salt = bcrypt.genSaltSync(saltRounds);
            console.log(salt)
            return bcrypt.hashSync(password, salt);
        };

        // compares two given passwords
        export const comparePassword = (plainPassword, hashedPassword) => {
            return bcrypt.compareSync(plainPassword, hashedPassword);
        }
        ```
24. Session Store -> This is something that you  very likely will need especially when you want to persist session data for the user. 
    1. <b>So the problem we have now is that if our server goes down for unknown reasons and they might restart, when that happens all of your `session data` will also be `erased` as express stores it in memory by default i.e. `current user session gets terminated whenever server goes down`. </b>
    2. <b> To resolve this you need to store it in the database to maintain a `persistent system` so that whenever the server goes down and if it goes back up, then the `session store` will have the session data there and `express-session` will look in that session store in the database to grab the session data and `restore` it for `user`. </b>
    3. We will store this session data in the database which was getting erased whenever our server goes down for whatever reasons to restore user sessions and session data.
    4. `connect-mongo` : It is a express package, pretty much is a session store for mongodb. Packages with same fucntionality are available for almost every other type of dbs.
    5. We will use an <b>option</b> - `store`, to make a connection with the client and store it in mongo sessions store. What happens underneath the hood is when we send request to the server (remember we are sending the cookie back to the server) it gets parsed on the server, express-session will now look for the session id in the mongo sessions. 
    6. The whole `req.session object` after stringifying gets attached to the <b>session</b> property in the mongo sessions and its session id is paired to the id property..