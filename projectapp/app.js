const mysql = require('mysql');
 const express = require('express');
 const bodyparser = require('body-parser');

 const path = require('path');
 const router = express.Router();

 var app = express();

 //Configuring express server
 app.use(bodyparser.json());
 app.use('/', router);
 app.use(express.urlencoded());
 app.use(express.json());
 app.use('/public', express.static('public'))//where the stylesheet is stored
 app.set('view engine', 'ejs');

 var conn = mysql.createConnection({
    host: "localhost",   
    user: "root",    
    password: "2018@Camelious2",   
    database: "projectapp"  
  });

  conn.connect((err)=> {
    if(!err)
        console.log('Connected to database Successfully');
    else
        console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
    });

    const port = process.env.PORT || 8080;

    app.listen(port, () => console.log(`Listening on port ${port}..`));


//route setup
router.get('/', function(req,res){
    res.render('../views/index');
});


//
router.get('/userprojects', function(req,res){
    res.render('../views/projects')
});

//POST Router to Add projects from the form
app.post('/projects/add', (req, res) => {
    let data = {    title:      req.body.title,
                    description:   req.body.description, 
                    start_date:    req.body.start_date,
                    due_date:    req.body.due_date,  
                };

    let sqlQuery = "INSERT INTO Projects SET ?";
    
    let vQuery = conn.query(sqlQuery, data,(err, results) => {
        if(err) throw err;
          res.send(JSONResponse(results));
    });
}); 


// //Create GET Router to fetch all the projects from the projectapp Database
// app.get('/projects-page', (req, res) => {
//     conn.query('SELECT * FROM projectapp.projects', (err, rows) => {
//         if (!err)
//             res.send(rows);
//         else
//             console.log(err);
//     })
// });
/* Get Router for all projects-page// the actual route to the ejs file connected in the route.get() function */

router.get('/projects-page', function(req, res, next) {
      
    conn.query('SELECT * FROM projects', function(err,row)     {
    
        if(err){
            //req.flash('error', err); 
            res.render('../views/projects-page',
            {
                page_title: "Project Listings",
                projects: ''
            });   
        }
        else{ 
            res.render('../views/projects-page',
            {
                page_title: "Project Listings",
                projects: row
            });
        }
                            
        });
           
    });


// /* GET projects edit page. */
router.get('/projects-edit/edit/:id', function(req, res, next) {
      
    conn.query('SELECT * FROM projects WHERE id='+ req.params.id, function(err,row)     {
    
        if(err){
            //req.flash('error', err); 
            res.render('../views/projects-edit',
            {
                page_title: "Project Listings",
                project: ''
            });   
        }
        else{ 
            res.render('../views/projects-edit',
            {
                page_title: "Project Listings",
                project: row
            });
        }
                            
        });
           
    });

     /* POST projects edit page. used to post data to database */
router.post('/projects-update/update/', function(req, res, next) {
      
    let sqlQuery = "UPDATE projects SET title ='" + req.body.title + "', description ='" + req.body.description + "', start_date ='" +  req.body.start_date + "', due_date ='" + req.body.due_date + "'WHERE id =" + req.body.id;

        conn.query(sqlQuery, function(err,rows)     {
            if(err) throw err;
            console.log(err)
            //req.flash('error', err); 
            res.redirect('/projects-page');   
            next();                
        });
        
    });

       router.get('/projects-delete/delete/:id', function(req, res, next){
        conn.query('DELETE FROM projects WHERE id =' + req.params.id, function(err, row){
            if(err)  throw err;
            //req.flash('error', err); //must install additionals 'flash messages and others from to do list for these to work;
   
           //req.flash('success', 'Deleted Successfully') ///must install additionals 'flash messages and others from to do list for these to work;
                alert('Delete Successful');
                res.redirect('/existing_Recs');
                next();
        });
    });

// //Default Route
// app.get('/' , (req, res) => {
    
//     res.send('Invalid Routing!!');
        
// }); 