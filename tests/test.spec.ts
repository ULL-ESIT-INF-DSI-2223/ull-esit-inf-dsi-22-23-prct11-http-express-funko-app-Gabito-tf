import 'mocha';
import {expect} from 'chai';
import  request from 'request'

describe('Pruebas de servidor Express con punto de acceso /execmd', () => {
  it('GET /execmd sin parámetro "cmd" debe devolver código 400', (done) => {
    fetch('http://localhost:3000/execmd').then
    (response => {
      expect(response.status).to.equal(400);
      done();
    }
    );
  });

  it('GET /execmd con parámetro "cmd" debe devolver código 200', (done) => {
    fetch('http://localhost:3000/execmd?cmd=pwd').then
    (response => {
      expect(response.status).to.equal(200);
      done();
    }
    );
  });
  it('GET /execmd con parámetro "ls -l" debe devolver código 200', (done) => {
    fetch('http://localhost:3000/execmd?cmd=ls&args=-l').then
    (response => {
      expect(response.status).to.equal(200);
      done();
    }
    );
  });
  it('GET /prueba código 404', (done) => {
    fetch('http://localhost:3000/prueba').then
    (response => {
      expect(response.status).to.equal(404);
      done();
    }
    );
  });

});