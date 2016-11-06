var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = {
  add: function(name) {
    var item = {name: name, id: this.setId};
    this.items.push(item);
    this.setId += 1;
    return item;
  },
};

var createStorage = function() {
  var storage = Object.create(Storage);
  storage.items = [];
  storage.setId = 1;
  return storage;
}

var storage = createStorage();

storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(request, response) {
    response.json(storage.items);
});

app.post('/items', jsonParser, function(request, response) {
    if (!('name' in request.body)) {
        return response.sendStatus(400);
    }

    var item = storage.add(request.body.name);
    response.status(201).json(item);
});


app.delete('/items/:id', jsonParser, function(request, response) {

    var previousStorage = storage.items

    storage.items = storage.items.filter(function(entry) {
      return entry.id.toString() !== request.params.id.toString(); 
    });

    if (previousStorage === storage.items) {
      return response.sendStatus(400);
    } else {
      response.status(201).json(storage.items);
    }
});

app.put('/items/:id', jsonParser, function(request, response) {

    var findIndex = storage.items.findIndex(function(element){
      return element.id.toString() === request.params.id.toString();
    })
    
    if (findIndex === -1) {
    
      if (!('name' in request.body)) {
        return response.sendStatus(400);
    
    }
    
      var item = storage.add(request.body.name);
      response.status(201).json(item);        
    
    } else {

      storage.items[findIndex].name = request.body.name;

    }

});

app.listen(process.env.PORT || 8080, process.env.IP);
