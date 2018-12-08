const express 		= require('express');
const server 			= express();
const mysql     	= require('mysql');
//const spawn 			= require("child_process").spawn;
var fs 						= require('fs');
var bodyParser 		= require('body-parser');
var cmd 					= require('node-cmd');

server.set('port', process.env.PORT || 3001 );

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",						// put your MySQL db here
    database: "super_canvasser"				// our database
});

// connect MySQL database
connection.connect((err) => {
	if (err) console.log(err);
	else console.log('MySQL connected...');
});

server.post('/runAlgorithm', (req, res) => {
	console.log(req.body)
	var dataObj = req.body;
	// var coordList = req.body.coordData;
	// var avgSpeed = req.body.avgSpeed;
	// var dayDuration = req.body.dayDuration;

	fs.writeFile('./super_canvasser/src/data/vrp_data.json', JSON.stringify(dataObj, null, 2), 'utf8', function(err) {
    if (err) {
      console.log(err);
		} else {
			cmd.get("python ./super_canvasser/src/api/vrp.py",
				function(data, err, stderr) {
					if (!err) {
						console.log(data)
						res.send(JSON.stringify(data))
					} else {
						console.log(err)
					}
				}
			);
			res.send(JSON.stringify(dataObj));
			// var pythonProcess = spawn('python', ["./super_canvasser/src/api/vrp.py", JSON.stringify(coordList), avgSpeed, dayDuration]);
			// // Takes stdout data from script which executed
			// // with arguments and send this data to res object
			// pythonProcess.stdout.on('data', function(data) {
			// 	console.log(data.toString())	
			// 	res.send(data.toString());
			// })
			// pythonProcess.stdout.on('end', function(){
			// 	console.log('End');
			// });
			// pythonProcess.stdin.end();
		}
  });
})

// =====================================  global parameters stuff  =======================================================
server.get('/parameters', (req, res) => {
	connection.query('SELECT * FROM parameters', function (error, results, fields) {
	  if (error) console.log(error);
	  else res.send(JSON.stringify(results));
	});
})

// update global parameters
server.get('/parameters/:dayDuration/:visitDuration/:avgSpeed', (req, res) => {
	const dayDuration = req.params.dayDuration;
	const avgSpeed = req.params.avgSpeed;
	const visitDuration = req.params.visitDuration;

	connection.query('DELETE FROM parameters', function (error, results, fields) {
		if (error) console.log(error);
		else {
			var sql = "INSERT INTO parameters (dayDuration, visitDuration, avgSpeed) VALUES (";
			sql += dayDuration + "," + visitDuration + "," + avgSpeed + ")";
			connection.query(sql, function (err, result, field) {
				if (err) console.log(err);
				else res.send(JSON.stringify(results));
			});
		}
	})
})

// =====================================  USER stuff  =======================================================
// perform queries here
// fetch users data from database back-end to front-end React (GET request)
server.get('/users', (req, res) => {
	connection.query('SELECT * FROM users', function (error, results, fields) {
	  if (error) console.log(err);
	  //console.log('The solution is: ', results);
	  res.send(JSON.stringify(results));
	});
})

//delete user
server.get('/users/delete', (req, res) => {
    const {id} = req.query;
    var sql = 'DELETE FROM users WHERE id=' + id;
    connection.query(sql, function (error, results, fields) {
        if (error) console.log(err);
        //console.log('The solution is: ', results);
        res.send(JSON.stringify(results));
    });
})

// add user
server.get('/users/add', (req, res) => {
	const {firstName, lastName, username, email, phone, password, role} = req.query;
	
	var sql = 'INSERT INTO users (firstName, lastName, username, role, email, phone, password) VALUES (';
	sql += "\"" + firstName + "\"";
	sql += ",\"" + lastName + "\"";
	sql += ",\"" + username + "\"";
	sql += ",\"" + role + "\"";
	sql += ",\"" + email + "\"";
	sql += ",\"" + phone + "\"";
	sql += ",\"" + password + "\")"; 

	connection.query(sql, (err, results, fields) => {
		if (err) {
			console.log(err);
		}
		console.log('Added user successfully!');
		var currentUser = {}
		currentUser.firstName = firstName;
		currentUser.lastName = lastName;
		currentUser.username = username;
		currentUser.email = email;
		currentUser.password = password;
		currentUser.role = role;

		res.send(JSON.stringify(currentUser));
	})
})

server.get('/users/update', (req, res) => {

    const {firstName, lastName, username, email, role, phone, id} = req.query;
		var sql = 'UPDATE users SET firstName=' + "\"" + firstName+  "\"" + ", lastName=" + "\"" +lastName + "\"" + ", username=" + "\"" + username + "\"";
		sql += ", role=" + "\"" +role + "\"" + ", email=" + "\"" +email + "\"" + ", phone=" + "\"" + phone + "\"" + " WHERE id=" + id;

    console.log(sql);

    connection.query(sql,(err, results, fields) => {
        if (err) {
            console.log(err);
        }
        res.send(JSON.stringify(results));
    })
})

// get current user from GUI React and save it to JSON file
// we use this to render current log in user in other components
server.get('/users/current', (req, res) => {
	const {username} = req.query;
	
	let sql = 'SELECT * FROM users WHERE username=' + '\'' + username + '\'';
	connection.query(sql, (err, results, fields) => {
		if (err) {
			console.log(err);
		}
		res.send(JSON.stringify(results));
	})
})

// get all users whose role is specified
server.get('/users/role/:role', (req, res) => {
	var sql = 'SELECT * from users WHERE role=\'' + req.params.role + '\'';
	connection.query(sql, (err, results, fields) => {
		if (err) {
			console.log(err);
		}
		res.send(JSON.stringify(results));
	})
})

server.get('/users/canvasser/assignments/:userId', (req, res) => {
	var sql = 'SELECT * FROM assignments WHERE userId=' + req.params.userId;
	connection.query(sql, (err, results, fields) => {
		if (err) {
			console.log(err);
		}
		res.send(JSON.stringify(results));
	})
})

server.get('/users/canvasser/tasks/:taskId', (req, res) => {
	var sql = 'SELECT * FROM tasks WHERE id=' + req.params.taskId;
	connection.query(sql, (err, results, fields) => {
		if (err) {
			console.log(err);
		}
		res.send(JSON.stringify(results));
	})
})

// get current user
server.get('/users/:currentUserName', (req, res) => {
	let sql = 'SELECT * FROM users WHERE username=' + '\'' + req.params.currentUserName + '\'';
	connection.query(sql, (err, results, fields) => {
		if (err) {
			console.log(err);
		}
		res.send(JSON.stringify(results));
	});
})

// add free dates into assignments table
server.get('/users/canvasser/addFreeDate', (req, res) => {
	var {userId, date, month, year} = req.query;
	var sql = "INSERT INTO assignments (userId, date, month, year) VALUES(";
	sql += userId + "," + date + "," + month + "," + year + ")";
	connection.query(sql, (err, results, fields) => {
		if (err) {
			console.log(err);
		}
		res.send(JSON.stringify(results));
	});
})

// delete free date in assignments table
server.get('/users/canvasser/deleteFreeDate', (req, res) => {
	var {userId, date, month, year} = req.query;
	var sql = "DELETE FROM assignments WHERE userId=";
	sql += userId + " AND date=" + date + " AND month=" + month + " AND year=" + year;

	connection.query(sql, (err, results, fields) => {
		if (err) {
			console.log(err);
		}
		res.send(JSON.stringify(results));
	});
})

// =====================================  LOCATION stuff  =======================================================
// fetch locations data
server.get('/locations', (req, res) => {
	connection.query('SELECT * FROM locations', function (error, results, fields) {
	  if (error) console.log(err);
	  //console.log('The solution is: ', results);
	  res.send(JSON.stringify(results));
	});
})

server.get('/locations/searching/:id', (req, res) => {
	var sql = 'SELECT * FROM locations WHERE id=' + req.params.id;
	
	connection.query(sql, function (error, results, fields) {
	  if (error) console.log(error);
	  //console.log('The solution is: ', results);
	  res.send(JSON.stringify(results));
	});
})

// add location
server.get('/locations/add', (req, res) => {
	const {fullAddress, street, unit, city, state, zipcode, country, duration} = req.query;

	var sql = 'INSERT INTO locations (fullAddress, street, unit, city, state, zipcode, country, duration) VALUES (';
	
	sql += "\"" + fullAddress + "\"";
	sql += ",\"" + street + "\"";
	sql += ",\"" + unit + "\"";
	sql += ",\"" + city + "\"";
	sql += ",\"" + state + "\"";
	sql += "," + zipcode;
	sql += ",\"" + country + "\"" ;
	sql += "," + duration + ")";
	
	connection.query(sql, (err, results, fields) => {
		if (err) {
			console.log(err);
		}
		console.log('Added location successfully!');
		res.send(JSON.stringify(results));
	}) 
})

// delete location
server.get('/locations/delete', (req, res) => {
	const {fullAddress, street, unit, city, state, zipcode, country, duration} = req.query;

	var sql = "DELETE FROM locations WHERE street=";
	sql += "\"" + street + "\"";
	
	connection.query(sql, (err, results, fields) => {
		if (err) {
			console.log(err);
		}
		console.log('Delete location successfully!');
		res.send(JSON.stringify(results));
	})
})

// edit location
server.get('/locations/edit', (req, res) => {
	const {id, fullAddress, street, unit, city, state, zipcode, country, duration, rate, note} = req.query;

	var sql = "UPDATE locations SET ";
	sql += "fullAddress=\"" + fullAddress + "\",";
	sql += "street=\"" + street + "\", ";
	sql += "unit=\"" + unit + "\", ";
	sql += "city=\"" + city + "\", ";
	sql += "state=\"" + state + "\", ";
	sql += "zipcode=" + zipcode + ", ";
	sql += "country=\"" + country + "\", ";
	sql += "rate=" + rate + ", ";
	sql += "note=\"" + note + "\", ";
	sql += "duration=" + duration ;
	sql += " WHERE id=" + id;

	connection.query(sql, (err, results, fields) => {
		if (err) {
			console.log(err);
		}
		console.log('Update location successfully!');
		res.send(JSON.stringify(results));
	})
})

// edit location assignment (rate and note)
server.get('/locations/assignments/editRateNote/:locationId/', (req, res) => {
	const {rate, note} = req.query;
	var sql = "UPDATE locations SET ";
	sql += "rate=" + rate + ", note=\"" + note + "\"";
	sql += " WHERE id=" + req.params.locationId;

	connection.query(sql, (err, results, fields) => {
		if (err) {
			console.log(err);
		}
		res.send(JSON.stringify(results));
	})
})

// edit location assignment (QA)
server.get('/locations/assignments/editQA/:locationId/', (req, res) => {
	const {question, answer} = req.query;
	var sql = "UPDATE questions SET ";
	sql += "answer=\"" + answer + "\"";
	sql += " WHERE locationId=" + req.params.locationId;
	sql += " AND question=\"" + question + "\""; 

	connection.query(sql, (err, results, fields) => {
		if (err) {
			console.log(err);
		}
		res.send(JSON.stringify(results));
	})
})

// search location ID based on address --> yield questions and answers
server.get('/locations/search', (req,res) => {
	const {locationId} = req.query;
	var sql = 'SELECT *';
	sql += ' FROM questions, locations WHERE questions.locationId = locations.id AND questions.locationId=' + locationId;
	
	connection.query(sql, (err, results, fields) => {
		if (err) console.log(err);
		res.send(JSON.stringify(results));
	})
})

// add question to location
server.get('/locations/:locationId/questions/add', (req, res) => {
	const {question, answer} = req.query;
	var sql = "INSERT INTO questions (locationId, question, answer) VALUES(";
	sql += req.params.locationId + ",\"" + question + "\",\"" + answer + "\")";

	connection.query(sql, (err, results, fields) => {
		if (err) console.log(err);
		res.send(JSON.stringify(results));
	})
})

// update question at a location
server.get('/locations/:locationId/questions/update', (req, res) => {
	const {oldQ, newQ} = req.query;
	var sql = "UPDATE questions SET question=";
	sql += "\"" + newQ + "\"";
	sql += ", answer=" + "\"\"";
	sql += " WHERE locationId=" + req.params.locationId;
	sql += " AND question=\"" + oldQ + "\"";

	connection.query(sql, (err, results, fields) => {
		if (err) console.log(err);
		res.send(JSON.stringify(results));
	})
})

// delete question from location
server.get('/locations/:locationId/questions/delete', (req, res) => {
	const {question} = req.query;
	const locationId = req.params.locationId;
	var sql = "DELETE FROM questions WHERE locationId=";
	sql += locationId + " AND question=\"" + question + "\"";

	connection.query(sql, (err, results, fields) => {
		if (err) console.log(err);
		res.send(JSON.stringify(results));
	})
})

server.get('/locations/canvasserAssignments/:locationId', (req, res) => {
	var sql = `SELECT locations.id, locations.fullAddress, locations.duration, locations.rate, locations.note, questions.question, questions.answer FROM questions, locations WHERE questions.locationId=locations.id`;
	sql += ` AND locations.id=${req.params.locationId}`;

	connection.query(sql, (err, results, fields) => {
		if (err) console.log(err);
		res.send(JSON.stringify(results));
	})
})

// =====================================  TASKS stuff  =======================================================
// retrieve all unassigned tasks
server.get('/tasks/unassigned', (req, res) => {
	var sql = "SELECT DISTINCT id FROM tasks WHERE id NOT IN (SELECT taskId FROM assignments WHERE taskId IS NOT NULL)";
	connection.query(sql, (err, results, fields) => {
		if (err) console.log(err);
		res.send(JSON.stringify(results));
	})
})

// un-assign task to certain canvasser from assignments table (given canvasserId, taskId)
server.get('/tasks/unassign/:canvasserId/:taskId', (req, res) => {
	var sql = "UPDATE assignments SET taskId=NULL WHERE userId=" + req.params.canvasserId + " AND taskId=" + req.params.taskId;
	connection.query(sql, (err, results, fields) => {
		if (err) console.log(err);
		console.log('Unassigned task successfully!');
		res.send(JSON.stringify(results));
	})
})

// assign task to certain canvasser from assignments table (given canvasserId, taskId)
server.get('/tasks/assign/:canvasserId/:taskId/day', (req, res) => {
	const {date, month, year} = req.query;
	var sql = "UPDATE assignments SET taskId=" + req.params.taskId;
	sql += " WHERE userId=" + req.params.canvasserId + " AND date=" + date;
	sql += " AND month=" + month + " AND year=" + year;
	
	connection.query(sql, (err, results, fields) => {
		if (err) console.log(err);
		console.log('Assigned task successfully!');
		res.send(JSON.stringify(results));
	})
})

// delete all tasks
server.get('/tasks/deleteAll', (req, res) => {
	var sql = "DELETE FROM tasks";
	connection.query(sql, (err, results, fields) => {
		if (err) console.log(err);
		else res.send(JSON.stringify(results));
	})
})

// save assigned tasks after generating algorithm into tasks table
server.get('/tasks/saveAssigned/:taskId/:locationId', (req, res) => {
	var sql = "INSERT INTO tasks (id, locationId) VALUES (";
	sql += req.params.taskId + ", " + req.params.locationId + ")";
	connection.query(sql, (err, results, fields) => {
		if (err) console.log(err);
		else res.send(JSON.stringify(results));
	})
})

// load all distinct task id
server.get('/tasks/uniqueTaskId', (req, res) => {
	var sql = "SELECT DISTINCT id FROM tasks";
	connection.query(sql, (err, results, fields) => {
		if (err) console.log(err);
		else res.send(JSON.stringify(results));
	})
})

// load all info of task id
server.get('/tasks/:taskId', (req, res) => {
	var sql = "SELECT tasks.id AS taskId, locations.id AS locationId, locations.fullAddress, locations.duration FROM tasks, locations";
	sql += " WHERE tasks.locationId = locations.id AND tasks.id=" + req.params.taskId;
	connection.query(sql, (err, results, fields) => {
		if (err) console.log(err);
		else res.send(JSON.stringify(results));
	})
})


server.listen(server.get('port'), () => {
	console.log('Listening on port ' + server.get('port'));
});