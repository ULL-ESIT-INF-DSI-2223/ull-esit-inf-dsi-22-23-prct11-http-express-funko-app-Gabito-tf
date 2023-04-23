import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../dist/server.js'; // Asegúrese de exportar su aplicación Express en app.js
import { FunkoPop } from '../dist/models/FunkoPop.js';
import {expect} from 'chai';

chai.use(chaiHttp);

describe('Funko routes', () => {
  const testUser = 'funkos/Gabi';
  const testFunko: FunkoPop = {
    id: 1,
    name: 'Test Funko',
    description: 'Test description',
    type: 'Test type',
    genre: 'Test genre',
    franchise: 'Test franchise',
    number: 1,
    exclusive: true,
    specialFeatures: 'Test special features',
    marketValue: 80
  };

  describe('POST /:user', () => {
    it('should add a new Funko Pop', (done) => {
      chai
        .request(app)
        .post(`/${testUser}`)
        .set('Content-Type', 'application/json')
        .send({id: testFunko.id, name : testFunko.name, description : testFunko.description, type : testFunko.type, genre : testFunko.genre, franchise : testFunko.franchise, number : testFunko.number, exclusive : testFunko.exclusive, specialFeatures : testFunko.specialFeatures, marketValue : testFunko.marketValue })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('success', true);
          expect(res.body).to.have.property('message', 'Funko Pop added successfully.');
          done();
        });
    });

    it('should fail if required fields are missing', (done) => {
      const incompleteFunko = { ...testFunko, name: '' };

      chai
        .request(app)
        .post(`/${testUser}`)
        .send(incompleteFunko)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('success', false);
          expect(res.body).to.have.property('message', 'All fields are required.');
          done();
        });
    });
  });

  describe('GET /:user', () => {
    it('should list all Funko Pops for a user', (done) => {
      chai
        .request(app)
        .get(`/${testUser}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success', true);
          expect(res.body).to.have.property('funkoPops');
          expect(res.body.funkoPops).to.be.an('array');
          done();
        });
    });
  });

  describe('GET /:user/:funkoId', () => {
    it('should return a single Funko Pop', (done) => {
      chai
        .request(app)
        .get(`/${testUser}/${testFunko.id}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success', true);
          expect(res.body).to.have.property('funkoPops');
          expect(res.body.funkoPops).to.be.an('array');
          expect(res.body.funkoPops.length).to.equal(1);
          expect(res.body.funkoPops[0]).to.deep.equal(testFunko);
          done();
        });
    });

    it('should fail if Funko Pop does not exist', (done) => {
      const nonExistentFunkoId = 999;

      chai
        .request(app)
        .get(`/${testUser}/${nonExistentFunkoId}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('success', false);
          expect(res.body).to.have.property('message', 'Funko Pop with the specified ID not found.');
          done();
        });
    });
  });

  describe('PATCH /:user/:funkoId', () => {
    it('should update an existing Funko Pop', (done) => {
      const updatedFunko = {...testFunko, name: 'Updated Test Funko' };

      chai
        .request(app)
        .patch(`/${testUser}/${testFunko.id}`)
        .set('Content-Type', 'application/json')
        .send( {name: updatedFunko.name} )
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success', true);
          expect(res.body).to.have.property('message', 'Funko Pop updated successfully.');
          done();
        });
    });

    it('should fail if Funko Pop does not exist', (done) => {
      const nonExistentFunkoId = 999;
      const updatedFunko = { name: 'Updated Test Funko' };

      chai
        .request(app)
        .patch(`/${testUser}/${nonExistentFunkoId}`)
        .send(updatedFunko)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('success', false);
          expect(res.body).to.have.property('message', 'Funko Pop with the specified ID not found.');
          done();
        });
    });
  });

  describe('DELETE /:user/:funkoId', () => {
    it('should delete an existing Funko Pop', (done) => {
      chai
        .request(app)
        .delete(`/${testUser}/${testFunko.id}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('success', true);
          expect(res.body).to.have.property('message', 'Funko Pop deleted successfully.');
          done();
        });
    });

    it('should fail if Funko Pop does not exist', (done) => {
      const nonExistentFunkoId = 999;

      chai
        .request(app)
        .delete(`/${testUser}/${nonExistentFunkoId}`)
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('success', false);
          expect(res.body).to.have.property('message', 'Funko Pop with the specified ID not found.');
          done();
        });
    });
  });

});

