require('@dotenvx/dotenvx').config({path: '.env.test'});
const mocha = require('mocha');
const chai = require('chai');
const Product = require('../../../../server/models/product');
const createAgentAccount = require('../../../../server/serviceProviders/agents/createAgentAccount');
const Agent = require('../../../../server/models/agent');
const AgentAuth = require('../../../../server/models/agentAuth');
const addLostProduct = require('../../../../server/serviceProviders/lostProducts/addLostProduct');
const searchLostProducts = require('../../../../server/serviceProviders/lostProducts/searchLostProducts');

const {describe, it} = mocha;

async function resetDatabase(){
  await Agent.deleteMany({});
  await AgentAuth.deleteMany({});
  await Product.deleteMany({});

  await createAgentAccount(undefined, {
    firstName: 'Lucas',
    lastName: 'Gomes',
    email: 'lucas.bsg@hotmail.com',
    password: 'Test145*'
  });

  let agent = await Agent.findOne({});

  let rolexWatchDeepsea = new Product({
    title: 'Rolex Watch',
    description: 'Rolex deepsea. Found on airplane of flight TPP-123 in Porto',
    registeredDateTime: new Date('2024-11-26T18:21:38.904+00:00'),
    registeredBy: agent._id,
    tags: ['rolex', 'watch', 'deepsea', 'tpp-123', 'porto'],
    wasItFoundByOwner: false,
    dateTimeFoundByOnwer: null,
  });

  let thickSilverBracelet = new Product({
    title: 'Thick Silver Bracelet',
    description: 'Thick Silver Bracelet',
    registeredDateTime: new Date('2024-11-26T19:21:38.904+00:00'),
    registeredBy: agent._id,
    tags: ['thick', 'silver', 'bracelet'],
    wasItFoundByOwner: false,
    dateTimeFoundByOnwer: null,
  });

  let nintendoSwitch = new Product({
    title: 'Nintendo Switch',
    description: 'Nintendo Switch found in the middle of departures floor. It has green and purple controllers/joycons.',
    registeredDateTime: new Date('2024-11-26T20:21:38.904+00:00'),
    registeredBy: agent._id,
    tags: ['nintendo', 'switch', 'departures', 'floor', 'green', 'purple', 'controllers', 'joycons'],
    wasItFoundByOwner: false,
    dateTimeFoundByOnwer: null,
  });

  let iphone10 = new Product({
    title: 'iPhone 10',
    description: 'iPhone 10 found in the toilet on the 2nd floor.',
    registeredDateTime: new Date('2024-11-26T21:21:38.904+00:00'),
    registeredBy: agent._id,
    tags: ['iphone', 'toilet', 'floor'],
    wasItFoundByOwner: false,
    dateTimeFoundByOnwer: null,
  });

  let pinkSamsungS9 = new Product({
    title: 'Pink Samsung S9',
    description: 'Pink Samsung S9 lost in the café',
    registeredDateTime: new Date(),
    registeredBy: agent._id,
    tags: ['pink', 'samsung', 's9', 'café'],
    wasItFoundByOwner: false,
    dateTimeFoundByOnwer: null,
  });

  let blackSamsungGalaxyA2 = new Product({
    title: 'Black Samsung Galaxy A2',
    description: 'Black Samsung Galaxy A2. Scratched Glass with a brown case.',
    registeredDateTime: new Date(),
    registeredBy: agent._id,
    tags: ['black', 'samsung', 'galaxy', 'a2', 'glass', 'brown', 'case'],
    wasItFoundByOwner: false,
    dateTimeFoundByOnwer: null,
  });

  let kidBackpack = new Product({
    title: 'Kid\'s Backpack',
    description: 'Blue backpack with a spongebob pin.',
    registeredDateTime: new Date(),
    registeredBy: agent._id,
    tags: ['blue', 'backpack', 'spongebob', 'pin'],
    wasItFoundByOwner: false,
    dateTimeFoundByOnwer: null,
  });

  let macbookPro2019 = new Product({
    title: 'Macbook Pro 2019',
    description: 'Gray Macbook Pro 2019. It has a whale sticker and penguin sticker.',
    registeredDateTime: new Date('2024-11-26T20:13:00.000+00:00'),
    registeredBy: agent._id,
    tags: ['gray', 'macbook', 'pro', 'whale', 'sticker', 'penguin'],
    wasItFoundByOwner: true,
    dateTimeFoundByOnwer: new Date(),
  });

  let rolexDaytona = new Product({
    title: 'Rolex Watch Daytona',
    description: 'Rolex Watch Daytona found near restaurant.',
    registeredDateTime: new Date('2024-11-26T19:13:00.000+00:00'),
    registeredBy: agent._id,
    tags: ['rolex', 'watch', 'daytona', 'restaurant'],
    wasItFoundByOwner: false,
    dateTimeFoundByOnwer: null,
  });

  let newProducts = [
    rolexWatchDeepsea,
    thickSilverBracelet,
    nintendoSwitch,
    iphone10,
    pinkSamsungS9,
    blackSamsungGalaxyA2,
    kidBackpack,
    macbookPro2019,
    rolexDaytona
  ];

  for (let newProduct of newProducts) {
    await newProduct.save();
  }

  return {
    rolexWatchDeepsea,
    thickSilverBracelet,
    nintendoSwitch,
    iphone10,
    pinkSamsungS9,
    blackSamsungGalaxyA2,
    kidBackpack,
    macbookPro2019,
    rolexDaytona
  }

}
describe('searchLostProducts', function(){
  let documents = {};
  it('Should Return Samsung Phones', async function(){

    documents = await resetDatabase();

    let matchedProducts = await searchLostProducts({searchPrompt: 'Samsung'});

    chai.assert.isNotEmpty(matchedProducts, 'it should contain results');
    for (let foundProduct of matchedProducts) {
      chai.expect(foundProduct.tags).to.contain('samsung');
    }


  });

  it('Black Samsung should be first in the results', async function(){
    let matchedProducts = await searchLostProducts({searchPrompt: 'I lost my Samsung phone. It is black and it has a case.'});

    chai.assert.isNotEmpty(matchedProducts, 'it should contain results');

    chai.expect(matchedProducts[0].title).to.be.equal('Black Samsung Galaxy A2');

  });

  it('List all products', async function(){
    let documentsCount = Object.keys(documents).length;
    let matchedProducts = await searchLostProducts({});

    chai.assert.isNotEmpty(matchedProducts, 'it should contain results');

    chai.assert.equal(matchedProducts.length, documentsCount);

  });

  it('List products in a target time', async function(){


    const {nintendoSwitch, iphone10, macbookPro2019} = documents;

    let matchedProducts = await searchLostProducts({targetDateTime: new Date('2024-11-26T21:00:00.000+00:00')});

    chai.assert.isNotEmpty(matchedProducts, 'it should contain results');

    chai.assert.equal(matchedProducts.length, 3);
    let matchedProductIds = matchedProducts.map((e) => e._id.toString());
    let expectedIdsToBeMatched = [nintendoSwitch._id.toString(), iphone10._id.toString(), macbookPro2019._id.toString()];

    chai.expect(matchedProductIds).to.have.members(expectedIdsToBeMatched);

  });

  it('Filter by wasItFoundByOwner', async function(){

    const {macbookPro2019} = documents;


    let matchedProducts = await searchLostProducts({wasItFoundByOwner: true});

    chai.assert.equal(matchedProducts.length, 1);
    chai.assert.equal(matchedProducts[0]._id.toString(), macbookPro2019._id.toString());


    

  });

  it('Multi Parameter filtering | no prompt', async function(){
    
    const {nintendoSwitch, iphone10} = documents;


    let matchedProducts = await searchLostProducts({
      wasItFoundByOwner: false,
      targetDateTime: new Date('2024-11-26T21:00:00.000+00:00')
    });

    chai.assert.isNotEmpty(matchedProducts, 'it should contain results');
    chai.assert.equal(matchedProducts.length, 2);

    let matchedProductIds = matchedProducts.map((e) => e._id.toString());
    
    let expectedIdsToBeMatched = [nintendoSwitch._id.toString(), iphone10._id.toString()];
    chai.expect(matchedProductIds).to.have.members(expectedIdsToBeMatched, 'Products around a target time');


    const {macbookPro2019} = documents;
    
    matchedProducts = await searchLostProducts({
      wasItFoundByOwner: true,
      targetDateTime: new Date('2024-11-26T21:00:00.000+00:00')
    });    

    chai.assert.equal(matchedProducts.length, 1);
    chai.assert.equal(matchedProducts[0]._id.toString(), macbookPro2019._id.toString());

    matchedProducts = await searchLostProducts({
      wasItFoundByOwner: true,
      targetDateTime: new Date('2024-11-26T18:00:00.000+00:00')
    });
    chai.assert.equal(matchedProducts.length, 0, 'There are no products found around 2024-11-26T18:00:00');


    

  });

  it('Multi Parameter filtering | with prompt', async function(){

    const {rolexWatchDeepsea, rolexDaytona} = documents;


    let matchedProducts = await searchLostProducts({
      searchPrompt: 'I lost my rolex near a restaurant',
      wasItFoundByOwner: false,
      targetDateTime: new Date('2024-11-26T19:00:00.000+00:00')
    });


    chai.assert.isNotEmpty(matchedProducts, 'it should contain results');
    chai.assert.equal(matchedProducts.length, 2);

    let matchedProductIds = matchedProducts.map((e) => e._id.toString());
    let expectedIdsToBeMatched = [rolexWatchDeepsea._id.toString(), rolexDaytona._id.toString()];

    chai.expect(matchedProductIds).to.have.members(expectedIdsToBeMatched, 'Rolex\'s match the target time range');
    chai.assert.equal(matchedProducts[0]._id.toString(), rolexDaytona._id.toString(), 'The result on top should be the "Rolex Watch Dayton"')

    let rolexProductsOutOfTimeRange = await searchLostProducts({
      searchPrompt: 'I lost my rolex near a restaurant',
      wasItFoundByOwner: false,
      targetDateTime: new Date('2024-11-26T21:00:00.000+00:00')
    });

    chai.assert.isEmpty(rolexProductsOutOfTimeRange, 'it should not contain results because the time range does not match');

    const {macbookPro2019} = documents;
    matchedProducts = await searchLostProducts({
      searchPrompt: "Macbook Pro",
      wasItFoundByOwner: true,
      targetDateTime: new Date('2024-11-26T21:00:00.000+00:00')
    });

    chai.assert.equal(matchedProducts.length, 1);
    chai.assert.equal(matchedProducts[0]._id.toString(), macbookPro2019._id.toString());

    matchedProducts = await searchLostProducts({
      searchPrompt: "Lenovo",
      wasItFoundByOwner: true,
      targetDateTime: new Date('2024-11-26T21:00:00.000+00:00')
    });

    chai.assert.equal(matchedProducts.length, 0, 'There are no Lenovo products lost');


    

  });

})