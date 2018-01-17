var express  = require('express'),
    path     = require('path'),
    bodyParser = require('body-parser'),
    app = express(),
    expressValidator = require('express-validator');


/*Set EJS template Engine*/
app.set('views','./views');
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); //support x-www-form-urlencoded
app.use(bodyParser.json());
app.use(expressValidator());

/*MySql connection*/
var connection  = require('express-myconnection'),
    mysql = require('mysql');

app.use(

    connection(mysql,{
        host     : 'localhost',
        user     : 'root',
        password : 'root',
        port     : 8887,
        database : 'biodata',
        debug    : false //set true if you wanna see debug logger
    },'request')

);

app.get('/',function(req,res){
    res.send('Welcome');
});


//RESTful route
var router = express.Router();


/*------------------------------------------------------
*  This is router middleware,invoked everytime
*  we hit url /api and anything after /api
*  like /api/user , /api/user/7
*  we can use this for doing validation,authetication
*  for every route started with /api
--------------------------------------------------------*/
router.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

var jsonBiodata = router.route('/json_biodata');

jsonBiodata.get(function(req,res,next){
    req.getConnection(function(err,conn){
        var query = conn.query('SELECT * FROM biodata_karyawan',function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            res.send({title:"Biodata Karyawan",data:rows});

         });
    });
});

var biodata = router.route('/biodata');
//show the CRUD interface | GET
biodata.get(function(req,res,next){

    req.getConnection(function(err,conn){

        if (err) return next("Cannot Connect");

        var query = conn.query('SELECT * FROM biodata_karyawan',function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            res.render('biodata',{title:"Biodata Karyawan",data:rows});

         });

    });

});
//post data to DB | POST
biodata.post(function(req,res,next){

    //validation
    req.assert('nama','Masukan Nama').notEmpty();
    req.assert('jenis_kelamin','Masukan Jenis Kelamin').notEmpty();
    req.assert('alamat','Masukan Alamat').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
        nama:req.body.nama,
        jenis_kelamin:req.body.jenis_kelamin,
        alamat:req.body.alamat
     };

    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("INSERT INTO biodata_karyawan set ? ",data, function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });

     });

});


//now for Single route (GET,DELETE,PUT)
var biodata2 = router.route('/biodata/:id');

/*------------------------------------------------------
route.all is extremely useful. you can use it to do
stuffs for specific routes. for example you need to do
a validation everytime route /api/user/:user_id it hit.

remove curut2.all() if you dont want it
------------------------------------------------------*/
biodata2.all(function(req,res,next){
    console.log("You need to smth about biodata2 Route ? Do it here");
    console.log(req.params);
    next();
});

//get data to update
biodata2.get(function(req,res,next){

    var id = req.params.id;

    req.getConnection(function(err,conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("SELECT * FROM biodata_karyawan WHERE id = ? ",[id],function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            //if user not found
            if(rows.length < 1)
                return res.send("User Not found");

            res.render('edit',{title:"Edit Biodata Karyawan",data:rows});
        });

    });

});

//update data
biodata2.put(function(req,res,next){
    var id = req.params.id;

    //validation
    req.assert('nama','Name is required').notEmpty();
    req.assert('jenis_kelamin','A valid email is required').notEmpty();
    req.assert('alamat','Enter a password 6 - 20').notEmpty();

    var errors = req.validationErrors();
    if(errors){
        res.status(422).json(errors);
        return;
    }

    //get data
    var data = {
        nama:req.body.nama,
        jenis_kelamin:req.body.jenis_kelamin,
        alamat:req.body.alamat
     };

    //inserting into mysql
    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("UPDATE biodata_karyawan set ? WHERE id = ? ",[data,id], function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });

     });

});

//delete data
biodata2.delete(function(req,res,next){

    var id = req.params.id;

     req.getConnection(function (err, conn) {

        if (err) return next("Cannot Connect");

        var query = conn.query("DELETE FROM biodata_karyawan  WHERE id = ? ",[id], function(err, rows){

             if(err){
                console.log(err);
                return next("Mysql error, check your query");
             }

             res.sendStatus(200);

        });
        //console.log(query.sql);

     });
});

//now we need to apply our router here
app.use('/api',router);

//start Server
var server = app.listen(3000,function(){

   console.log("Listening to port %s",server.address().port);

});
