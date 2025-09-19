const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const app = express();
const port = 8000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const todoRoutes = require('./routes/todo');
app.use('/todo', todoRoutes);

// Default redirect
app.use((req, res) => {
  res.redirect('/todo');
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(port, () => {
  console.log(`Todolist running on http://0.0.0.0:${port}`);
});

module.exports = app;
