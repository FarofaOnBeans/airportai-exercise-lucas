const mocha = require('mocha');
const chai = require('chai');
const keywordsUtils = require('../../utils/keywords-utils');

const {describe, it} = mocha;

describe('Keywords Utils', () => {
  describe('Get product Keywords from a prompt(English)', () => {
    let samsungBlackSentence = 'I lost my Samsung S9. It is black with a yellow case.';
    it(`it should extract "Samsung", "S9", "black", "yellow", "case" from the sentence "${samsungBlackSentence}" `, () => {

      let prompt = samsungBlackSentence;


      /**
       * @type {import('../../utils/keywords-utils').WordTag[]}
       */
      let expectedResponse = [
        {
          word: 'Samsung',
          tag: 'NNP',
        },
        {
          word: 'S9',
          tag: 'NN',
        },
        {
          word: 'black',
          tag: 'JJ',
        },
        {
          word: 'yellow',
          tag: 'JJ',
        },
        {
          word: 'case',
          tag: 'NN',
        },
      ];

      let keywords = keywordsUtils.getProductKeywordsFromDescription(prompt);
      
      chai.assert.deepEqual(expectedResponse, keywords);

    });

    let lostChildBackpackSentence = 'I left my son\'s backpack at the airport. It is blue and it has a spongebob pin';

    it(`it should extract "backpack", "airport", "blue", "spongebob", "pin" from the sentence "${lostChildBackpackSentence}"`, () => {

      let prompt = lostChildBackpackSentence;


      /**
       * @type {import('../../utils/keywords-utils').WordTag[]}
       */
      let expectedResponse = [
        {
          word: 'son',
          tag: 'NN',
        },
        {
          word: 'backpack',
          tag: 'NN',
        },
        {
          word: 'airport',
          tag: 'NN',
        },
        {
          word: 'blue',
          tag: 'JJ',
        },
        {
          word: 'spongebob',
          tag: 'NN',
        },
        {
          word: 'pin',
          tag: 'NN',
        },
      ];

      let keywords = keywordsUtils.getProductKeywordsFromDescription(prompt);
      
      chai.assert.deepEqual(expectedResponse, keywords);

    });


  })
})