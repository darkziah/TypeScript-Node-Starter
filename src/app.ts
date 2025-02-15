import express from "express";
import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import MongoStore from "connect-mongo";
import flash from "express-flash";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";
import bluebird from "bluebird";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";

// Create Express server
const app = express();

// Connect to MongoDB
const mongoUrl = "mongodb://node2754.myfcloud.com:27017/yehey";
mongoose.Promise = bluebird;


mongoose.connect(mongoUrl).then(
    () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ 
        const db = mongoose.connection; 
    db.on("error", console.error.bind(console, "connection error: "));
    db.once("open", function () {
        console.log("Connected successfully");
    });
},
).catch(err => {
    console.log(`MongoDB connection error. Please make sure MongoDB is running. ${err}`);
    // process.exit();
});
// Express configuration
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
        mongoUrl,
        mongoOptions: {
            autoReconnect: true
        }
    })
}));
//app.use(passport.initialize());
//app.use(passport.session());
app.use(flash());
//app.use(lusca.xframe("SAMEORIGIN"));
//app.use(lusca.xssProtection(true));
/**
 * app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
 */

const URLSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrlId: {
    type: String,
    required: true,
  },
  timeStamp: {
    type: Number,
    default: 0,
  },
});
const URLs = mongoose.model("shortUrl", URLSchema);

app.use(async (req, res, next) => {
    // After successful login, redirect back to the intended page
    /**
     * 
     * if (!req.user &&
    req.path !== "/login" &&
    req.path !== "/signup" &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)) {
        req.session.returnTo = req.path;
    } else if (req.user &&
    req.path == "/account") {
        req.session.returnTo = req.path;
    }
    next();
     
    const newUr = new URLs({
        originalUrl: "asd",
        shortUrlId: "asd",
        timeStamp: 0
    });

    await URLs.findOneAndUpdate({
        originalUrl: "asd3"
    },
    {shortUrlId: "asd2"},
    {
        new: true,
        upsert: true
    }
    );
    const url = await URLs.find({});

   */
    
    if (req.path === "/edit-url") {
        res.json("req.body");
    } else {

        const urlId = req.path.replace("/", "");

        const url: {
            originalUrl: string;
            shortUrlId: string;
            timestamp: number;
        }[] = await URLs.find({
            shortUrlId: urlId
        });

        if (url[0].originalUrl) {
            if(url[0].originalUrl.includes("http")) {
                res.redirect(url[0].originalUrl);
                console.log("includes");
            } else {
                res.redirect(`http://${url[0].originalUrl}`);
                console.log("not_incluse");
            }
            
        } else {
            res.json(url[0]);
        }
        
    }

});

app.use(
    express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);


/**
 * 
app.get("/", homeController.index);
app.get("/login", userController.getLogin);
app.post("/login", userController.postLogin);
app.get("/logout", userController.logout);
app.get("/forgot", userController.getForgot);
app.post("/forgot", userController.postForgot);
app.get("/reset/:token", userController.getReset);
app.post("/reset/:token", userController.postReset);
app.get("/signup", userController.getSignup);
app.post("/signup", userController.postSignup);
app.get("/contact", contactController.getContact);
app.post("/contact", contactController.postContact);
app.get("/account", passportConfig.isAuthenticated, userController.getAccount);
app.post("/account/profile", passportConfig.isAuthenticated, userController.postUpdateProfile);
app.post("/account/password", passportConfig.isAuthenticated, userController.postUpdatePassword);
app.post("/account/delete", passportConfig.isAuthenticated, userController.postDeleteAccount);
app.get("/account/unlink/:provider", passportConfig.isAuthenticated, userController.getOauthUnlink);

app.get("/api", apiController.getApi);
app.get("/api/facebook", passportConfig.isAuthenticated, passportConfig.isAuthorized, apiController.getFacebook);


app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email", "public_profile"] }));
app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
   
    res.redirect(req.session.returnTo || "/");
});
 * 
 */



export default app;
