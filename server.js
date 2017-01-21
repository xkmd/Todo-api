var express = require('express');
var bodyParser = require('body-parser');

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
    var matchedTodo;
    todos.forEach(function(todo){
        if(todoId === todo.id){
            matchedTodo = todo;
        }
    });
    if(matchedTodo)
        res.json(matchedTodo);
    else
        res.status(404).send();
    //res.send('Asking for todo with id of ' + req.params.id);
});

// POST /todos/ 
app.post('/todos', function(req, res){
    var body = req.body;
    body.id = todoNextId++;
    todos.push(body);
    //console.log('description ' + body.description);
    res.json(body);
});


app.listen(PORT, function(){
    console.log('Express listening on port ' + PORT + '!');
});