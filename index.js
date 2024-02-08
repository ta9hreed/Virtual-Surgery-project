const express= require("express");
const pathpatient=require('./routes/pateint');
const mriscanpath=require('./routes/MRiScan');
const LogUserPath =require("./routes/LogUser");
const UsersPath =require("./routes/updateUser");
const password=require("./routes/password");
const logger= require("./middlewares/logger");
const upload=require("./routes/upload");
const { notFound,errorHandler } = require("./middlewares/error");
require("dotenv").config();
const path= require('path');
const helmet =require("helmet");
const connectToDB =require("./config/db")
const cors =require("cors");
//connection ToDB
connectToDB();


//init App
const app = express();

//static folder
app.use(express.static(path.join(__dirname,"images")));

//apply middleware 
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(logger);
//Helmet
app.use(helmet());

//cors policy 
app.use (cors());

//set view engine 
app.set('view engine','ejs');


app.use("/api/patients",pathpatient);
app.use("/api/mriscan",mriscanpath);
app.use("/api/LogUser",LogUserPath);
app.use("/api/Users",UsersPath);
app.use('/password',password);//mvc
app.use('/api/upload',upload);

//error hanlder middleware
app.use(notFound );
app.use(errorHandler);







//running server
const PORT = process.env.PORT||8000;
app.listen(PORT,() => console.log(`server is running in ${process.env.NODE_ENV} on port ${PORT}`));
