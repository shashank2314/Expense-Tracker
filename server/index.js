
const Expense = require("./routes/ExpensesRoutes")
const User = require("./routes/UserRoutes")
const { dbconnect }=require("./config/database");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const {urlencoded} = require("express");

dbconnect();

require("dotenv").config();
const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
    origin: process.env.URL,
    credentials: true
}
console.log(corsOptions);
app.use(cors(corsOptions));

app.use("/api/v1",Expense)
app.use("/api/v1",User)


app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});


app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})
