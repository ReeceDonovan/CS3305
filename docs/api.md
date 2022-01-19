# UI Quickstart

You can run the dev server using 
>```sh
>npm i
>npm run start
>```

The following are required enviroment variables:
- Sample 1
- Sample 2

Ensure to fill out the config.json with the credentials found in the `#credentials` channel

# Techstack

Using:
- Express
- PostgreSQL

# Creating a new Endpoint

If you want to add a new endpoint, make a new router such as in the `User` Router

```tsx
import express from "express";
import User from "../models/user";

const userRouter = express.Router();

userRouter.get("/users/:id", (req, res) => {
    var user = new User()
    user.id = parseInt(req.params.id)
    res.send(user.getFromId())
})

export default userRouter
```

Once you produce a router, and export it, make sure to add it to `app.tsx` in a similar vein as other routes

There are auxiliary json helpers in the `util/respond` file