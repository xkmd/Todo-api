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
// GET /todos
app.get('/todos', function(req, res){
    res.json(todos);
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

app.listen(PORT, function(){
    console.log('Express listening on port ' + PORT + '!');
});