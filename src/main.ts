import Express, {Request, Response} from "express";
import {createConnection} from "mysql";
import fs from "fs"

type Person = {
	forename: string
}

type Names = {
	data: Person[]
}

const connection = createConnection({
	multipleStatements: true,
	host: "db",
	user: "root",
	password: "password",
	database: "db"
});

const app = Express();

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.get("/", (req: Request, res: Response) => {
	connection.query("SELECT * FROM names", (err, data) => {
		res.send({
			response: data
		})
	})
});

app.listen(9001, () => {
	connection.query('CREATE TABLE IF NOT EXISTS names (forename VARCHAR(255) NOT NULL) ENGINE=INNODB', function (error, results) {
		if (error) throw error;
	});

	fs.readFile('./src/names.json', 'utf8', (err, data) => {
		if (err) throw err;
		const names: Names = JSON.parse(data);
		const myQuery = names.data.reduce((acc, person) => {
			return acc + `INSERT INTO names (forename) VALUES ("${person.forename}"); `
		}, "");

		connection.query(myQuery, function (error, results) {
			if (error) throw error;
			console.log('The solution is: ', results);
		})
	});


});



