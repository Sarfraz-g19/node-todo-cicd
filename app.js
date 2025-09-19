const express = require('express'),
    bodyParser = require('body-parser'),
    // In order to use PUT HTTP verb to edit item
    methodOverride = require('method-override'),
    // Mitigate XSS using sanitizer
    sanitizer = require('sanitizer'),
    app = express(),
    port = 8000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Override with POST having ?_method=DELETE or from form
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

// Set EJS as view engine
app.set('view engine', 'ejs');

// In-memory todo list
let todolist = [];

/* Display the to-do list and form */
app.get('/todo', function (req, res) {
    res.render('todo.ejs', {
        todos: todolist,             // ✅ send todos instead of todolist
        clickHandler: "func1();"
    });
});

/* Add item to the list */
app.post('/todo/add/', function (req, res) {
    let newTodo = sanitizer.escape(req.body.newtodo);
    if (req.body.newtodo !== '') {
        todolist.push(newTodo);
    }
    res.redirect('/todo');
});

/* Delete item by index */
app.get('/todo/delete/:id', function (req, res) {
    if (req.params.id !== '') {
        todolist.splice(req.params.id, 1);
    }
    res.redirect('/todo');
});

/* Get a single todo item and render edit page */
app.get('/todo/:id', function (req, res) {
    let todoIdx = req.params.id;
    let todo = todolist[todoIdx];

    if (todo) {
        res.render('edititem.ejs', {
            todoIdx,
            todo,
            clickHandler: "func1();"
        });
    } else {
        res.redirect('/todo');
    }
});

/* Edit item */
app.put('/todo/edit/:id', function (req, res) {
    let todoIdx = req.params.id;
    let editTodo = sanitizer.escape(req.body.editTodo);
    if (todoIdx !== '' && editTodo !== '') {
        todolist[todoIdx] = editTodo;
    }
    res.redirect('/todo');
});

/* Catch-all redirect to /todo */
app.use(function (req, res) {
    res.redirect('/todo');
});

/* Start server */
app.listen(port, function () {
    console.log(`Todolist running on http://0.0.0.0:${port}`);
});

// Export app
module.exports = app;
