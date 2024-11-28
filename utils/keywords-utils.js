const pos = require('pos');
const _ = require('lodash');


/**
 * Object contain a word and its POS tag
 * @typedef {Object} WordTag
 * @property {string} word - Important word.
 * @property {string} tag - The POS(Proof-of-Speech) tag assigned to the word (e.g NN, JJ, CC, CD e.t.c)
 */
/**
 * Extract releavent keywords from a sentence.
 * @param {string} prompt A simple input. E.g (A Samsung S4 phone with a yellow case)
 * @returns {WordTag[]}
 */
function getProductKeywordsFromDescription(prompt){

  let typesOfIds = [/[a-zA-Z0-9]*[a-zA-Z]\d[a-zA-Z0-9]*/ig, /[a-zA-Z0-9]*\d[a-zA-Z][a-zA-Z0-9]*/ig, /[a-zA-Z0-9]+[\-_][a-zA-Z0-9]+/gi];

  // This aims to match for example the S9 in "Samsung S4" or "4S" or "AS2-1311"

  let lexer = new pos.Lexer();

  let updatedRegexs = typesOfIds.concat(lexer.regexs);
  lexer.regexs = updatedRegexs;
  let words = lexer.lex(prompt);
  var tagger = new pos.Tagger();
  var taggedWords = tagger.tag(words);
  
  let chosenKeywords = [];
  for (let i=0; i < taggedWords.length; i++) {
    var taggedWord = taggedWords[i];
    var word = taggedWord[0];
    var tag = taggedWord[1];


    let importantPosTags = {
      'NN': 1,
      'JJ': 1,
      'NNP': 1
    };

    if (tag in importantPosTags) {
      chosenKeywords.push({word: word, tag: tag});
    }
  }
  return chosenKeywords;

   
}

function getProductKeywordsFromDescriptionAsTags(prompt){
  let keywords = getProductKeywordsFromDescription(prompt);
  return _.uniq(keywords.map((e) => e.word.toLowerCase()));
  
}

module.exports = {
  getProductKeywordsFromDescription: getProductKeywordsFromDescription,
  getProductKeywordsFromDescriptionAsTags: getProductKeywordsFromDescriptionAsTags
}