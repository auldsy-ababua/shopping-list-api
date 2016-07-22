var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {
        name: name,
        id: this.id
    };
    this.items.push(item);
    this.id += 1;
    return item;
};

/**
 * [function description]
 * items - [ {id: 1 , name: "mario"} , {id: 10 , name: "colin"} , {id: 7 , name: "aulds"}]
 * 				 [  0                      ,           1              ,         2               ]
 * id: 10
 * {id: 10 , name: "colin"} -> index=1
 * @param  {[type]} id [description]
 * @return {[type]}    [description]
 */
Storage.prototype.remove = function(id) {
    for (index in this.items) {
        var element = this.items[index];
        if (id == element.id) {
            this.items.splice(index, 1);
            return true;
        }
    }
    return false;
};

/**
 * update()
 * If id match found, replaces storage item with passed in item
 * @param: item (Object) { id: Number, name: String }
 * @return: item (Object) or undefined
 */
Storage.prototype.update = function(item) {
    for (index in this.items) {
        var element = this.items[index];
        console.log(item);
        console.log(element);
        if (parseInt(item.id) == element.id) {
            element.name = item.name;
            return element;
        }
    }
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(req, res) {
    res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }

    var item = storage.add(req.body.name); //{id: 10 , name: "mario"}

    res.status(201).json(item);
});

app.put('/items/:id', jsonParser, function(req, res) {
    if (!req.params.id) {
        return res.sendStatus(404);
    }

    var item = storage.update({
        id: req.params.id,
        name: req.body.name
    });
    storage.update(item);

    res.status(200).json(item);
});

/**
 * [delete description]
 *  path / ? querystring
 *  items/10 -> id=10
 *  items/10? -> id=10
 *  items/10?blblabla -> id=10
 * /items/id?name=mario  - req.params.id , req.params.name ,
 * @param  {[type]} '/items/:id'  [description]
 * @param  {[type]} function(req, res           [description]
 * @return {[type]}               [description]
 */
app.delete('/items/:id', function(req, res) {
    if (!req.params.id) {
        return res.sendStatus(404);
    }

    var isRemoved = storage.remove(req.params.id);
    if (isRemoved) {
      return res.sendStatus(204);
    } else {
      return res.sendStatus(404);
    }
});



app.listen(process.env.PORT || 8080);
exports.app = app;
exports.storage = storage;
