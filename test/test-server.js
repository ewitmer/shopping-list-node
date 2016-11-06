var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server.js');

var should = chai.should();
var app = server.app;
var storage = server.storage;

chai.use(chaiHttp);


describe('Shopping List', function() {
    it('should list items on GET', function(done) {
        chai.request(app)
            .get('/items')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('id');
                res.body[0].should.have.property('name');
                res.body[0].id.should.be.a('number');
                res.body[0].name.should.be.a('string');
                res.body[0].name.should.equal('Broad beans');
                res.body[1].name.should.equal('Tomatoes');
                res.body[2].name.should.equal('Peppers');
                done();
            });
    });

    it('should add an item on POST', function(done) {
        chai.request(app)
            .post('/items')
            .send({'name': 'Kale'})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('name');
                res.body.should.have.property('id');
                res.body.name.should.be.a('string');
                res.body.id.should.be.a('number');
                res.body.name.should.equal('Kale');
                storage.items.should.be.a('array');
                storage.items.should.have.length(4);
                storage.items[3].should.be.a('object');
                storage.items[3].should.have.property('id');
                storage.items[3].should.have.property('name');
                storage.items[3].id.should.be.a('number');
                storage.items[3].name.should.be.a('string');
                storage.items[3].name.should.equal('Kale');
                done();
            });
    });

    it('should delete items on DELETE', function(done) {
        chai.request(app)
            .delete('/items/1')
            .end(function(err, res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(3);
                res.body[0].name.should.not.equal('Broad beans');
                res.body[0].name.should.equal('Tomatoes');
                done();
            });

    });

    it('should return 400 error if no item to DELETE', function(done) {
        chai.request(app)
            .delete('/items/6')
            .end(function(err, res) {
                res.should.have.status(400);
                done();
            });
       
    });

    it('should return 404 error if no item to DELETE', function(done) {
        chai.request(app)
            .delete('/items')
            .end(function(err, res) {
                res.should.have.status(404);
                done();
            });
       
    });

    it('should edit an existing item on PUT ', function(done) {
        chai.request(app)
            .put('/items/:id')
            .send({'name': 'apple', id: 3})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                storage.items[3].name.should.equal('apple');
                done();
            });
    });

    it('should create a new item on PUT', function(done) {
        chai.request(app)
            .put('/items/:id')
            .send({'name': 'orange'})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(201);
                res.should.be.json;
                storage.items[4].name.should.equal('orange');
                storage.items[4].id.should.equal(6);
                done();
            });
    });



});