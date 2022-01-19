# UI Quickstart

You can run the dev server using 
```sh
yarn
yarn start
```

The following are required enviroment variables:
- Sample 1
- Sample 2

Ensure to fill out the config.json with the credentials found in the `#credentials` channel

# Techstack

Using:
- Express
- PostgreSQL

# Creating a new Endpoint

If you want to add a new endpoint, make a new router such as in the `User` Router. [Examples.](https://github.com/ReeceDonovan/CS3305/tree/api/api/src/router)


Sample code:
```tsx
import express from "express";
import User from "../models/user";

const userRouter = express.Router();

userRouter.get("/users/:id", (req, res) => {
    const user = new User; 
    user.id = req.params.id; 
    user.getById(); 
    res.send(user);
})

export default userRouter
```

Once you produce a router, and export it, make sure to add it to `app.tsx` in a similar vein as other routes

There are auxiliary json helpers in the `util/respond` file
