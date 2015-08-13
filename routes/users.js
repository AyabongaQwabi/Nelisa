
/***
 * A very basic CRUD example using MySQL
 */	

//todo - fix the error handling



exports.add = function (req, res, next) {
	req.getConnection(function(err, connection){
		if (err){ 
			return next(err);
		}
		
		var input = JSON.parse(JSON.stringify(req.body));
		var data = {name : input.name,category_id:input.cat};
       	var queryStr ='insert into users set ?'
		console.log	(JSON.stringify(data))
		connection.query(queryStr, data, function(err,results){
			res.send({});
			console.log("-------ERR:"+err)
			console.log("-------results:"+results)
		})
	});
};



exports.update = function(req, res, next){
   console.log("\n\n------UPDATING USER")
	var data =req.body;
	console.log("DATA :"+JSON.stringify(data))
    	var id = req.body.id;
    	console.log("############# ID:"+id)
    	req.getConnection(function(err, connection){
    		connection.query('UPDATE users SET ? WHERE id = ?', [data, id], function(err, rows){
    			if (err){
              			console.log("Error Updating : %s ",err );
    			}
          		res.redirect('/login');
    		});
    		
    });
};

exports.delete = function(req, res, next){
	var id = req.body.id;
	console.log(JSON.stringify(req.body))
	console.log('\n\n\n\ndeleting from users table id :'+id)
	req.getConnection(function(err, connection){
		connection.query('DELETE FROM users WHERE id = ?', [id], function(err,rows){
			if(err){
    				console.log("Error Selecting : %s ",err );
			}
			res.redirect('/login');
		});
	});
};

