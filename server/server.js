var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

const {ObjectID} = require('mongodb');
var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  })

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e)
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
      res.send({todos});
  }, (e) => {
      res.status(400).send(e);
  })
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    res.status(404).send('Id not valid');
  }else{
    Todo.findById(id).then((todo) => {
      if(!todo) {
        res.send('Todo not found');
      }
      res.send({todo});
    }).catch((e) => res.status(400).send());
  }
});

app.delete('/todos/:id', (req, res) => {
   var id = req.params.id;
   if(!ObjectID.isValid(id)) {
     res.status(404).send('Id is not valid');
   }else {
     Todo.findByIdAndRemove(id).then((todo) => {
       if(!todo){
         res.status(404).send('Todo not found');
       }
       res.status(200).send({todo});
     }).catch((e) => res.stats(400).send());
   }
});

module.exports = {app};

app.listen(3000, () => {
  console.log('Started on port 3000');
});
