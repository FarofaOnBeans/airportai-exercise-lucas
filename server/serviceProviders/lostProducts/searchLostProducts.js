const keywordsUtils = require('../../../utils/keywords-utils');
const Product = require('../../models/product');
const moment = require("moment");
/**
 * 
 * @param {object} searchParams 
 * @param {string} searchParams.searchPrompt
 * @param {boolean} [searchParams.wasItFoundByOwner]
 * @param {Date} [searchParams.targetDateTime] Target Date time to query results based on the "registeredDateTime" field. It will fetch records one hour before and after said date.b 
 */
async function searchLostProducts(searchParams){
  
  if (typeof searchParams !== 'object') {
    throw new Error('"searchParams" needs to be an object');
  }

  let findFilter = {};
  if (typeof searchParams.wasItFoundByOwner !== 'undefined') {
    findFilter['wasItFoundByOwner'] = !!(searchParams.wasItFoundByOwner);
  }
  if (searchParams.targetDateTime instanceof Date) {
    let beforeTargetTime = moment(searchParams.targetDateTime).subtract(1, 'hours').toDate();
    let afterTargetTime = moment(searchParams.targetDateTime).add(1, 'hours').toDate();
    findFilter['registeredDateTime'] = {$gte: beforeTargetTime, $lte: afterTargetTime};
  }
  
  if (typeof searchParams.searchPrompt === 'string' && searchParams.searchPrompt !== '') {
    let keywords = keywordsUtils.getProductKeywordsFromDescription(searchParams.searchPrompt);

    let nounTags = {
      'NN': 1,
      'NNP': 1
    }
    let nounWords = keywords.filter((e) => (e.tag in nounTags)).map((e) => e.word.toLowerCase());
    let allWords = keywords.map((e) => e.word.toLowerCase());

    let matchFilter = {...findFilter};

    matchFilter["tags"] = {$in:nounWords};

    let aggregateQuery = [
      {$match:matchFilter}, // first filter by the main words
      {
        $project: {
          tagsCopy: "$tags",
          tags: 1,
          title: 1,
          description: 1,
          registeredBy: 1,
          registeredDateTime: 1,
          wasItFoundByOwner: 1,
          dateTimeFoundByOnwer: 1
        }
      },
      {$unwind:"$tags"},
      {$match:{tags:{$in:allWords}}},
      {$group:{"_id":"$_id","noOfTagMatches":{$sum:1},
        tags: {
          $first: "$tagsCopy"
        },
        title: {
          $first: "$title"
        },
        description: {
          $first: "$description"
        },
        registeredBy: {
          $first: "$registeredBy"
        },
        registeredDateTime: {
          $first: "$registeredDateTime"
        },
        wasItFoundByOwner: {
          $first: "$wasItFoundByOwner"
        },
        dateTimeFoundByOnwer: {
          $first: "$dateTimeFoundByOnwer"
        }
      }},
      {$sort:{noOfTagMatches:-1, registeredDateTime: -1, title: -1}},
      {$project:{
        "_id":1,"noOfTagMatches":1,
        tags: 1,
        title: 1,
        description: 1,
        registeredBy: 1,
        registeredDateTime: 1,
        wasItFoundByOwner: 1,
        dateTimeFoundByOnwer: 1
      }}
    ];

    let res = await Product.aggregate(
      aggregateQuery
    ).exec();

    return res;
  }

  
  let products = await Product.find(findFilter).sort({registeredDateTime: -1});
  return products;

  
}

module.exports = searchLostProducts;