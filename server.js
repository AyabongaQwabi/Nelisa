//------------------------- import modules to use --------------------------------------//


            var express = require('express');
            var Exsession = require('express-session')
            var bodyParser = require('body-parser')
            var cookieParser = require('cookie-parser')
            var exphbs  = require('express-handlebars');
            var encrypt = require('bcrypt')
            var salt = encrypt.genSaltSync(10)
            var get = require('./get')
            var Spaza = require('./spaza');
            var source = require('./source')
            var mysql = require('mysql');
            var productsFunction = require('./routes/products')
            var salesFunction = require('./routes/sales')
            var usersFunction = require('./routes/users')
            var purchasesFunction = require('./routes/purchases')

//------------------ initialize objects ----------------------------------------------//


            var nelisa = new Spaza(); 
            var app = express();
            source =new source();



//------------------ set up database  ------------------------------------------------//


            myConnection = require('express-myconnection');
            //database = require('./database');
            var dbOptions = {
                host : "localhost",
                user : "root",
                password : "theaya5379",
                port : 3306,
                database : "Nelisa"

            }


//-----------------  setup middleware  -----------------------------------------------//

            app.use(myConnection(mysql, dbOptions, 'single'));
            app.use(express.static('public'))
            app.engine('handlebars', exphbs({defaultLayout: 'main'}));
            app.set('view engine', 'handlebars');
            app.use(bodyParser.urlencoded({ extended: false }))
            app.use(bodyParser.json())
            app.use(cookieParser());
            app.use(Exsession({secret:'veryfunnysecret'}));
          



            var products = nelisa.productList('./Nelisa Sales History.csv');
            var mostpop = nelisa.mostPopularPdt(products);
            var leastpop = nelisa.leastPopularPdt(products);
            var mostcat = nelisa.mostPopularCat();
            var leastcat = nelisa.leastPopularCat();



//------------------  configure routes -----------------------------------------------//

            app.get('/register',function(req,res){
                    res.sendfile('public/register.html')
            })
            app.post('/register',function(req,res){
                    var connection = mysql.createConnection(dbOptions)
                    console.log("REGISTER -->"+JSON.stringify(req.body))
                    connection.query('select * from users',function(err,results){
                        if(err){console.log("ERR : "+err)}
                        if(results.length==0){
                                    var dat={}
                                    dat['username'] = req.body.username
                                    console.log('encrypting..')
                                    var hashed = encrypt.hashSync(req.body.firstpassword,11)
                                    dat['password']= hashed;
                                    dat['entry_level']=1;
                                    console.log("original: "+req.body.firstpassword+" HASH:"+hashed)
                                    connection.query('insert into users set ?',dat,function(err,results){
                                            console.log("ERR : "+err)
                                            res.redirect('/login')
                                    })
                                    console.log('Done encrypting')
                        }
                        else{
                                var nameExist =false;
                                results.forEach(function(result){
                                    if(result.username.toLowerCase()==req.body.username.toLowerCase())
                                    {
                                        console.log(JSON.stringify(result))
                                        nameExist=!nameExist
                                        res.sendfile('public/redirect.html')
                                        
                                    }

                                })
                                if(!nameExist){
                                    var dat={}
                                    dat['username'] = req.body.username
                                    console.log('encrypting..')
                                    var hashed = encrypt.hashSync(req.body.firstpassword,11)
                                    dat['password']= hashed;
                                    console.log("original: "+req.body.firstpassword+" HASH:"+hashed)
                                    connection.query('insert into users set ?',dat,function(err,results){
                                            console.log("ERR : "+err)
                                            res.redirect('/login')
                                    })
                                    console.log('Done encrypting')
                                }
                            }
                        
                    })
                    
                    
            })



           app.get('/login',function(req,res){
                    res.render('login', {layout: false})
            });

           app.post('/login',function(req,res){
                    
                   var connection = mysql.createConnection(dbOptions)
                    connection.query('select * from users',function(err,results){
                        console.log("ERR : "+err)
                        var Found=false;
                        console.log("\n\nRESULTS:"+results);
                        console.log("LENGTH :"+results.length+'\n\n')
                        results.forEach(function(result){                             
                           
                            var hashedPassword =result.password;
                            var clientPassword =req.body.password;

                            var correctPassword = encrypt.compareSync(clientPassword,hashedPassword)
                            
                            if(result.username==req.body.name && correctPassword)
                            {                               
                                Found=!Found;
                                req.session.userEntryLevel = result.entry_level
                                var usertype ='';
                                if(req.session.userEntryLevel==1){
                                    usertype='admin'
                                }
                                else{
                                    usertype='viewer'
                                }
                                req.session.usertype=usertype;

                            }

                        })
                        if(Found){
                            req.session.username = req.body.name

                            if(req.session.userEntryLevel==1)
                            {
                               
                                res.render('usermanagement',{layout:false,users:results})
                            }
                            else{
                                connection.query("select distinct products.name from products",function(err,results){
                                    res.render('home',{
                                        products:results,
                                        username:req.session.username,
                                        userEntryLevel:req.session.userEntryLevel,
                                        usertype:req.session.usertype
                                    });
                                })   
                            }
                             
                             
                        }else{
                            res.render('login', {layout: false,correct:Found})
                           
                        }
                        
                    
                })
            })

            app.get('/logoutuser',function(req,res){
                req.session.destroy(function(){
                        res.redirect('/login')
                })
            })

           
            //user requsets home page

            app.get('/',function(req,res){
                if(req.session.username){
                    console.log('Client requests home page')   
                        var connection = mysql.createConnection(dbOptions)
                        connection.connect();
                        connection.query("select distinct products.name from products",function(err,results){
                            res.render('home',{
                                products:results,
                                username:req.session.username,
                                userEntryLevel:req.session.userEntryLevel,
                                usertype:req.session.usertype
                             }) 
                        })
                }                         
                else{
                    res.redirect('/login')
                }
                
                
            })




            //user requests spaza page

            app.get('/spaza', function (req, res) {
                res.render('spaza', {
                  title : "Nelisa's Spaza Shop",
                  image: "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQ1Yr4oqLnm2D4WzI5cu8RsWvCUefwRXrwNJwuMH8TKtR7_7MB2"
                  
                });
            });



            //user requests suppliers page

            app.get('/suppliers', function (req, res) {
               if(req.session.username){
                    if(req.session.userEntryLevel==1){
                                console.log('\n\nUser is allowed to view suppliers ')
                                var connection = mysql.createConnection(dbOptions)
                                connection.connect();
                                connection.query("select * from suppliers",function(Err,results){
                                            res.render('suppliers', {
                                                        suppliers : results,
                                                        username:req.session.username,
                                                        userEntryLevel:req.session.userEntryLevel,
                                                        usertype:req.session.usertype

                                        });
                        });
                    }
                    else{res.render('access',{ username:req.session.username,
                                userEntryLevel:req.session.userEntryLevel,
                                usertype:req.session.usertype})}
                        
                }
                else{
                    res.redirect('/login')
                }
                    
               
         });
 
 

            //user requests category list
            app.get('/api/categories', function (req, res) {
                    if(req.session.username){
                        var connection = mysql.createConnection(dbOptions)
                        connection.connect();
                        connection.query("select * from categories",function(Err,results){
                            res.send(results);
                        });
                    }
                    else{
                        res.redirect('/login')
                    }
            });






            //user requests products page

            app.get('/products', function (req, res) {
                    

                    if(req.session.username){
                            var connection = mysql.createConnection(dbOptions)
                            connection.connect();
                            connection.query("select products.name as name,categories.id as catid,categories.name as category,products.id as prodID from products,categories where products.category_id = categories.id ORDER BY  categories.id ASC ",function(Err,results){

                                var newConnection = mysql.createConnection(dbOptions);
                                newConnection.connect();
                                var products = results;
                                newConnection.query('select * from categories',function(err,results){
                                    
                                    console.log('Client requests products page')
                                    var categories = results;   
                                    var PopularityConnection = mysql.createConnection(dbOptions)
                                    PopularityConnection.connect()
                                    PopularityConnection.query("select products.name, product_id as productID , sum(quantity) as Quantity from sales , products where products.id=product_id group by product_id ORDER BY Quantity DESC ",function(err,results){

                                            var CategoriesConnection = mysql.createConnection(dbOptions)
                                            CategoriesConnection.connect()
                                            var popularProduct = results[0];
                                            var unPopularProduct = results.pop();
                                            CategoriesConnection.query("select name , sum(Quantity) as catQuantity from (select categories.name,categories.id as cat_id, sum(quantity) as Quantity from sales , products ,categories where products.id=product_id and products.category_id = categories.id group by product_id ) as catSums group by cat_id ORDER BY catQuantity DESC",function(err,results){

                                                    console.log('mostpop:'+JSON.stringify(results[0])+'\nLeastPop:'+JSON.stringify(results.pop()))
                                                    res.render('products', {
                                                                mostPopularProd : popularProduct,
                                                                leastPopularProd: unPopularProduct,
                                                                mostPop: results[0],
                                                                leastPop: results.pop(),
                                                                products:products,
                                                                categories:categories,
                                                                username:req.session.username,
                                                                userEntryLevel:req.session.userEntryLevel,
                                                                usertype:req.session.usertype
                                                            });
                                            })





                                    })

                                })
                                
                            });
                    }
                    else{
                        res.redirect('/login')
                    }
                    
            });

            //user posts from products page

            app.post('/products',function(req,res){
                if(req.session.username){
                        console.log('Client sends from products page')   
                        var connection = mysql.createConnection(dbOptions)
                        connection.connect();
                       
                        strquery ='select id from categories where name ='+'\''+req.body.cat+'\''+';'
                        connection.query(strquery,function(expressrr,results){
                            console.log("----------------------------------->"+results[0].id)
                            var newConnection = mysql.createConnection(dbOptions)
                            var newStrquery = 'update products set name='+'\''+req.body.name+'\''+' ,category_id='+'\''+results[0].id+'\''+' where id='+req.body.id+';'
                            newConnection.query(newStrquery);

                        })


                        console.log("Update Product : "+JSON.stringify(req.body))
                        res.send(req.body.prodId)
                }
                else{res.redirect('/login')}
                
            });

            //user requests sales page
            app.get('/sales', function (req, res) {
                if(req.session.username){
                     if(req.session.userEntryLevel==1)
                     {
                        var connection = mysql.createConnection(dbOptions)
                        connection.connect();

                        connection.query("select DATE_FORMAT(sales.date,'%d %b %y') as date, products.name, sales.quantity, sales.price,sales.product_id from sales,products where products.id = sales.product_id order by sales.date desc",

                            function(err,results){
                                    console.log('Client requests sales page : ' + err)   
                            
                                    res.render('sales', {
                                        sales : results,
                                        username:req.session.username,
                                        userEntryLevel:req.session.userEntryLevel,
                                        usertype:req.session.usertype
                            });
                        });
                     }
                     else
                     {
                         res.render('access',{ username:req.session.username,
                                userEntryLevel:req.session.userEntryLevel,
                                usertype:req.session.usertype})}
                     }
                        
                
                else
                {
                    res.redirect('/login')
                }
                
            });    

            //user requests purchases page 

             app.get('/purchases', function (req, res) {
                if(req.session.username){
                        if(req.session.userEntryLevel==1)
                        {
                                var connection = mysql.createConnection(dbOptions)
                                connection.connect();
                                connection.query("SELECT DATE_FORMAT(purchases.date,'%d %b %y') as date, products.name as product, purchases.price, suppliers.name as supplier FROM purchases, products, suppliers WHERE products.id = purchases.product_id AND suppliers.id = purchases.supplier_id ORDER BY date",
                                    function(err,results){


                                res.render('purchases', {
                                    purchases : results,
                                    username:req.session.username,
                                    userEntryLevel:req.session.userEntryLevel,
                                    usertype:req.session.usertype

                                });

                                
                            });
                        }
                        else
                        {
                             res.render('access',{ username:req.session.username,
                                userEntryLevel:req.session.userEntryLevel,
                                usertype:req.session.usertype})
                        }
                     
                        
                }
                else{
                    res.redirect('/login')
                }
                
        });
               



            //user requests profits page 

             app.get('/profits', function (req, res) {
                if(req.session.username){

                         if(req.session.userEntryLevel==1)
                         {
                                    console.log('Client requests profits page')   
                                res.render('profits', {
                                    username:req.session.username,
                                    userEntryLevel:req.session.userEntryLevel,
                                    usertype:req.session.usertype

                                });
                         }
                         else
                         {
                             res.render('access',{ username:req.session.username,
                                userEntryLevel:req.session.userEntryLevel,
                                usertype:req.session.usertype})
                         }
                        
                }
                else{
                    res.redirect('/login')
                }
               
            });


             //user requests others page

             app.get('/other', function (req, res) {
                if(req.session.username){
                    if(req.session.userEntryLevel==1)
                         {
                            console.log('Client requests others page')   
                            res.render('other', {
                                username:req.session.username,
                                userEntryLevel:req.session.userEntryLevel,
                                usertype:req.session.usertype
                          
                        });
                    }
                   else
                  {
                             res.render('access',{ username:req.session.username,
                                userEntryLevel:req.session.userEntryLevel,
                                usertype:req.session.usertype})
                    }
                    
                }
                else{
                    res.redirect('/login')
                }
                
            });
            app.get('/api/products/search/:keys',function(req,res){
                    var keys = req.params.keys.substring(1);
                    keys +="%"
                    console.log("Searching for :"+keys)
                    console.log('Query: '+"select * from products where name like '"+keys+"%'")
                    var connection = mysql.createConnection(dbOptions)
               
                    connection.connect();
                    connection.query("select * from products where name like ?",keys,function(err,results){
                            if(err){console.log("ERR :"+err)}
                            console.log('\n\nresults :'+JSON.stringify(results))
                            var answer = [];
                            if(results.length < 1){
                                console.log('Results length:'+results.length)
                                answer=[]
                            }
                            else{

                                results.forEach(function(result){
                                    result['type']='product';
                                    answer.push(result);
                                })
                            }
                            
                            connection.query("select * from categories where name like ?",keys,function(err,results){

                                if(results.length > 0){
                                        results.forEach(function(result){
                                         result['type']='category';
                                        answer.push(result);
                                    })
                                }
                                console.log('Sending answer:'+JSON.stringify(answer))
                                res.send(answer)

                            })
                    })

            })
            app.get('/s',function(req,res){
                res.sendFile(__dirname +'/public/searchtest.html')
            })
             //setup the products handlers
           
            app.post('/products/add', productsFunction.add);    
            app.post('/products/delete', productsFunction.delete);      
            app.get('/products/all', productsFunction.get);
            app.post('/products/update', productsFunction.update);

            //setup the sales handlers

            app.get('/sales/edit/:id', salesFunction.get);
            app.post('/sales/add', salesFunction.add);            
            app.get('/sales/delete/:id', salesFunction.delete);

            //setup the purchases handlers

            app.get('/purchases/edit/:id', purchasesFunction.get);
            app.post('/purchases/add', purchasesFunction.add);
            app.get('/purchases/delete/:id', purchasesFunction.delete);

             //setup the users handlers
            app.post('/users/add', usersFunction.add);    
            app.post('/users/delete', usersFunction.delete);      
            app.post('/users/update', usersFunction.update);



app.listen(8080)


             


