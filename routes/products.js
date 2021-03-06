
/***
 * A very basic CRUD example using MySQL
 */	

//todo - fix the error handling

exports.show = function (req, res, next) {
	req.getConnection(function(err, connection){
		if (err) 
			return next(err);
		connection.query('SELECT * from products', [], function(err, results) {
        	if (err) return next(err);

    		res.render( 'home', {
    			products : results
    		});
      });
	});
};

exports.add = function (req, res, next) {
	req.getConnection(function(err, connection){
		if (err){ 
			return next(err);
		}
		
		var input = JSON.parse(JSON.stringify(req.body));
		var data = {name : input.name,category_id:input.cat};
       	var queryStr ='insert into products set ?'
		console.log	(JSON.stringify(data))
		connection.query(queryStr, data, function(err,results){
			res.send({});
			console.log("-------ERR:"+err)
			console.log("-------results:"+results)
		})
	});
};

exports.get = function(req, res, next){
	var id = req.params.id;
	req.getConnection(function(err, connection){
		connection.query('select products.name as name,categories.id as catid,categories.name as category,products.id as prodID from products,categories where products.category_id = categories.id ORDER BY  categories.id ASC', function(err,rows){
			
			res.send(rows);      
		}); 
	});
};

exports.update = function(req, res, next){
   console.log("------UPDATING")
	var data =req.body;
	console.log("DATA :"+JSON.stringify(data))
    	var id = req.body.id;
    	console.log("############# ID:"+id)
    	req.getConnection(function(err, connection){
    		connection.query('UPDATE products SET ? WHERE id = ?', [data, id], function(err, rows){
    			if (err){
              			console.log("Error Updating : %s ",err );
    			}
          		res.redirect('/products');
    		});
    		
    });
};

exports.delete = function(req, res, next){
	var id = req.body.id;
	console.log('deleting from products table id :'+id)
	req.getConnection(function(err, connection){
		connection.query('DELETE FROM products WHERE id = ?', [id], function(err,rows){
			if(err){
    				console.log("Error Selecting : %s ",err );
			}
			res.redirect('/products');
		});
	});
};

