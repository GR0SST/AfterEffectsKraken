const express = require("express");
const app = express();
const request = require('request');
const http = require('http');
const path = require("path");
const bodyParser = require("body-parser");
const fs = require('fs');
const httpServer = http.Server(app);
module.exports = () =>{
	var port = 3200;
	var hostname = "localhost"

	/* Start the server */
	httpServer.listen(port);

	/* Middlewares */
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ limit: '50mb',extended: true }));
	app.use(express.static(path.join(__dirname, "../client")));

	/* /import route that can be hit from the client side */
	app.get("/import", (req, res, next) => {
		res.status(200).send("Ку")
		
	});
}