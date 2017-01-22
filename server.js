// 404 - not found
// 400 - bad syntax
var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

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
    var queryParams = req.query;
    var filteredTodos = todos;
    
    if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'true'){
        filteredTodos = _.where(filteredTodos, {completed: true});
    }else if(queryParams.hasOwnProperty('completed') && queryParams.completed === 'false'){
        filteredTodos = _.where(filteredTodos, {completed: false});
    }
    if(queryParams.hasOwnProperty('q') && queryParams.q.length > 0){
        filteredTodos = _.filter(filteredTodos, function(todo){
            return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) >= 0;
        });
    }
    
    res.json(filteredTodos);
});
// GET /todos/:id
app.get('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id);
    var matchedTodo = _.findWhere(todos, {id:todoId});
//    var matchedTodo;
//    todos.forEach(function(todo){
//        if(todoId === todo.id){
//            matchedTodo = todo;
//        }
//    });
    if(matchedTodo)
        res.json(matchedTodo);
    else
        res.status(404).send();
    //res.send('Asking for todo with id of ' + req.params.id);
});

// POST /todos/ 
app.post('/todos', function(req, res){
    var body = _.pick(req.body, 'description', 'completed');
    
    body.description = body.description.trim();
    
    if(!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.length === 0){
        return res.status(400).send();
    }
    body.id = todoNextId++;
    todos.push(body);
    //console.log('description ' + body.description);
    res.json(body);
});

// DELETE /todos/:id

app.delete('/todos/:id', function(req,res){
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos,{id: todoId});
    if(!matchedTodo)
        res.status(404).json({"error":"no todo find with that id"});
    else{
        todos = _.without(todos, matchedTodo);
        res.json(matchedTodo);
    }
    
});

// PUT /todos/:id

app.put('/todos/:id', function(req, res){
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos,{id: todoId});
    
    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};
    
    if(!matchedTodo)
        return res.status(404).send();
    
    
    if(body.hasOwnProperty('completed') && _.isBoolean(body.completed)){
        validAttributes.completed = body.completed;
    }else if(body.hasOwnProperty('completed')){
        return res.status(400).send();
    }
    if(body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0){
        validAttributes.description = body.description.trim();
    }else if(body.hasOwnProperty('description')){
        return res.status(400).send();
    }
    
    _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo);
});

app.listen(PORT, function(){
    console.log('Express listening on port ' + PORT + '!');
});