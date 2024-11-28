require('@dotenvx/dotenvx').config({path: '.env.test'});
const mocha = require('mocha');
const chai = require('chai');
let chaiHttp = require('chai-http');
const server = require('../../../app');
const Agent = require('../../../server/models/agent');
const AgentAuth = require('../../../server/models/agentAuth');


const {it, describe} = mocha;

chai.use(chaiHttp);


describe('Signup', function(){
  it('Should signup', async function(){
    await Agent.deleteMany({});
    await AgentAuth.deleteMany({});

    let res = await chai.request(server)
    .post('/signup')
    .send({email: 'lucas.bsg@hotmail.com', firstName: 'Lucas', lastName: 'Gomes', password: 'Test1234*-'}); 
    
    chai.expect(res).to.have.status(200);
    
    chai.assert.isOk(res.body.result._id);

    

  })

  it('Should complain about password', async function(){
    

    await Agent.deleteMany({});
    await AgentAuth.deleteMany({});

    let weakPassRes = await chai.request(server)
    .post('/signup')
    .send({email: 'lucas.bsg@hotmail.com', firstName: 'Lucas', lastName: 'Gomes', password: 'weakPass'});  

    chai.expect(weakPassRes).to.have.status(400);

    chai.expect(weakPassRes.body).to.be.a('object');
    chai.expect(weakPassRes.body).to.have.property('error');
    chai.expect(weakPassRes.body.error).to.have.property('message');
    chai.expect(weakPassRes.body.error.message).to.be.equal('Password is weak. It needs to have at least one Uppercase, one special character, and have 8 or more characters.');
    
    
    
  })
})


