// 404 - not found
// 400 - bad syntax
// 500 - server error
// 204 - OK but nothing to send back
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var app = express();
var PORT = process.env.PORT || 3000;


//var todos = [{
//    id: 1,
//    description: 'Meet mom for lunch',
//    completed: false
//    
//},{
//    id: 2,
//    description: 'Go to the market',
//    completed: false
//},{
//    id: 3,
//    description: 'my mansion sittin on fourty acres',
//    completed: true
//}];
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(req, res){
    res.send('TODO API Root');
});
// GET /todos?key=value&q=word
app.get('/todos', function(req, res){
    var query = req.query;
    var where = {};
    //with db
    if(query.hasOwnProperty('completed') && query.completed === 'true'){
        where.completed = true;
    }else if(query.hasOwnProperty('completed') && query.completed === 'false'){
        where.completed = false;
    }
    if(query.hasOwnProperty('q') && query.q.length > 0){
        where.description = {
            $like: '%' + query.q + '%'
        }
    }
    db.todo.findAll({where: where}).then(function(todos){
        res.json(todos);
    }, function(e){
        res.status(500).send();
    });
    //without db
//    var filteredTodos = todos;
//    
//    if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
//        filteredTodos = _.where(filteredTodos, {completed: true});
//    }else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
//        filteredTodos = _.where(filteredTodos, {completed: false});
//    }
//    if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0){
//        filteredTodos = _.filter(filteredTodos, function(todo){
//            return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) >= 0;
//        });
//    }
//    
//    res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id);
    //with db
    db.todo.findById(todoId).then(function(todo){
        if(todo){
            res.json(todo.toJSON());
        }else{
            res.status(404).send();
        }
    }, function(e){
        res.status(500).send();
    });
    
    //without db
//    var matchedTodo = _.findWhere(todos, {id:todoId});
//    
//    if(matchedTodo)
//        res.json(matchedTodo);
//    else
//        res.status(404).send();
//    //res.send('Asking for todo with id of ' + req.params.id);
});

// POST /todos    with db
app.post('/todos', function(req, res){
    var body = _.pick(req.body, 'description', 'completed');
    
    db.todo.create(body).then(function(todo){
        res.json(todo.toJSON());
    }, function (e){
        res.status(400).json(e);
    })
});

// POST /todos/     without db
//app.post('/todos', function(req, res){
//    var body = _.pick(req.body, 'description', 'completed');
//    
//    body.description = body.description.trim();
//    
//    if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.length === 0){
//        return res.status(400).send();
//    }
//    body.id = todoNextId++;
//    todos.push(body);
//    //console.log('description ' + body.description);
//    res.json(body);
//});

// DELETE /todos/:id

app.delete('/todos/:id', function(req,res){
    var todoId = parseInt(req.params.id, 10);
    //with db
    var where = {};
    if(todoId > 0){
        where.id = todoId;
    }
    db.todo.destroy({where: where}).then(function(rowsDeleted){
        if(rowsDeleted === 0){
            res.status(404).json({
                error: "no todo with id"
            });
        }
        else{
            res.status(204).send();
        }
    }, function(e){
        res.status(500).send();
    });
    //without db
//    var matchedTodo = _.findWhere(todos,{id: todoId});
//    if(!matchedTodo)
//        res.status(404).json({"error":"no todo find with that id"});
//    else{
//        todos = _.without(todos, matchedTodo);
//        res.json(matchedTodo);
//    }
    
});

// PUT /todos/:id

app.put('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10);
    var body = _.pick(req.body, 'description', 'completed');
    var attributes = {};
    //with db
    
    if(body.hasOwnProperty('completed')){
        attributes.completed = body.completed;
    }
    
    if(body.hasOwnProperty('description')){
        attributes.description = body.description;
    }
    console.log(attributes.description);
    db.todo.findById(todoId).then(function(todo){
        if(todo){
            todo.update(attributes).then(function(todo){
                console.log(todo.description);
                res.json(todo.toJSON());
            },function(e){
                res.status(400).json(e);
            });
        }else{
            res.status(404).send();
        }
    },function(){
        res.status(500).send();
    });
    
    //without db
//    var matchedTodo = _.findWhere(todos,{id: todoId});
//    
//    if(!matchedTodo)
//        return res.status(404).send();
//    
//    
//    if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
//        validAttributes.completed = body.completed;
//    }else if(body.hasOwnProperty('completed')){
//        return res.status(400).send();
//    }
//    if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
//        validAttributes.description = body.description.trim();
//    }else if(body.hasOwnProperty('description')){
//        return res.status(400).send();
//    }
//    
//    _.extend(matchedTodo, validAttributes);
//    res.json(matchedTodo);
});

app.post('/users', function(req, res){
    var body = _.pick(req.body, 'email', 'password');
    
    db.user.create(body).then(function(user){
        res.json(user.toJSON());
    }, function (e){
        res.status(400).json(e);
    });
});

//with db
db.sequelize.sync().then(function(){
    app.listen(PORT, function(){
        console.log('Express listening on port ' + PORT + '!');
    });
});

// without db
//app.listen(PORT, function(){
//    console.log('Express listening on port ' + PORT + '!');
//});
