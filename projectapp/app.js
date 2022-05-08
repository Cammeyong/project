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

//view engine setup
app.set('views', path.join(__dirname, 'views'));
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

router.get('/projectnotes', function(req,res) {
    res.render('../views/project-notes')
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

//POST Router to Add notes from the form to projectapp notes
app.post('/project-notes/add', (req, res) => {
    let data = {    project_id:           req.body.project_id,
                    project_journal:      req.body.project_journal,
                    active_date:          req.body.active_date,
                      
                };

    let sqlQuery = "INSERT INTO Notes SET ?";
    
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

router.get('/project-view-notes', function(req, res, next) {
    
    conn.query('SELECT * FROM notes', function(err,row)     {
    
        if(err){ 
            res.render('../views/project-view-notes',
            {
                page_title: "Project Listings",
                notes: ''
            });   
        }
        else{ 
            res.render('../views/project-view-notes',
            {
                page_title: "Project Listings",
                notes: row
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

// /* GET projects edit page. */
router.get('/project-edit-notes/edit/:id', function(req, res, next) {
      
    conn.query('SELECT * FROM notes WHERE id='+ req.params.id, function(err,row)     {
    
        if(err){
            //req.flash('error', err); 
            res.render('../views/project-edit-notes',
            {
                page_title: "Project Listings",
                edit_notes: ''
            });   
        }
        else{ 
            res.render('../views/project-edit-notes',
            {
                page_title: "Project Listings",
                edit_notes: row
            });
        }
                            
        });
           
    });

// EDIT USER POST ACTION
// router.post('projects-edit/update/:id', function(req, res, next) {
//     req.assert('title', 'Title is required').notEmpty()           //Validate title field           
//     // req.assert('email', 'A valid email is required').isEmail()  //Validate email
  
//     var errors = req.validationErrors()
     
//     if( !errors ) {   
 
         
// connection.query('UPDATE projects SET ? WHERE id = ' + req.params.id, function(err, result) {
//                 //if(err) throw err
//                 if (err) {
//                     req.flash('error', err)
                     
//                     // render to views/user/add.ejs
//                     res.render('projects-edit/edit', {
//                         title: 'req.body.title',
//                         id: req.params.id,
//                         description: req.body.description,
//                         start_date: req.body.start_date,
//                         due_date: req.body.due_date
//                     })
//                 } else {
//                     req.flash('success', 'Project updated successfully!');
//                     res.redirect('/projects-page');
//                 }
//             })
         
//     }
//     else {   //Display errors to user
//         var error_msg = ''
//         errors.forEach(function(error) {
//             error_msg += error.msg + '<br>'
//         })
//         req.flash('error', error_msg)
         
//         /**
//          * Using req.body.name 
//          * because req.param('name') is deprecated
//          */ 
//         res.render('projects-edit/edit', { 
//             title: req.body.title,            
//             id: req.params.id, 
//             description: req.body.description,
//             start_date: req.body.start_date,
//             due_date: req.body.due_date
//         })
//     }
// })

     /* POST projects edit page. used to post data to database */
app.post('/projects-update/:id/update',(req, res) => {

    const id = req.params.id;
      
    let sqlQuery = "UPDATE projectapp.projects SET title ='" + req.body.title + 
    "', description ='" + req.body.description + 
    "', start_date ='" +  req.body.start_date + 
    "', due_date ='" + req.body.due_date + 
    "'WHERE id =" + req.body.id;

    let query = conn.query(sqlQuery,(err,rows) => {
            if(err) throw err;
            console.log(err)
            //req.flash('error', err); 
            res.redirect('/projects-page');                  
        });
        
    });

    app.post('/project-edit-notes/:id/update',(req, res) => {

        const id = req.params.id;
          
        let sqlQuery = "UPDATE projectapp.notes SET project_journal ='" + req.body.project_journal + 
        "', active_date ='" + req.body.active_date + 
        "'WHERE id =" + req.body.id;
    
        let query = conn.query(sqlQuery,(err,rows) => {
                if(err) throw err;
                console.log(err)
                //req.flash('error', err); 
                res.redirect('/project-edit-notes');                  
            });
            
        });
    // router.post('/projects-update/update/:id', function(req, res, next) {
    //     var id= req.params.id;
    //     var updateData=req.body;
    //     let sqlQuery = `UPDATE projects SET ? WHERE id= ?`;

    //     conn.query(sqlQuery, [updateData, id], function (err, project) {
    //       if (err) throw err;
    //       console.log(project.affectedRows + " record(s) updated");
    //     });
    //     res.redirect('/projects-page');
    // });


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

    router.get('/project-delete-notes/delete/:id', function(req, res, next){
        conn.query('DELETE FROM notes WHERE id =' + req.params.id, function(err, row){
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