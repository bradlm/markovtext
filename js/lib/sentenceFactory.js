'use strict'

const {s0, fullStops, granularity} = require('./config');

function sentenceFactory (weightedLimitMatrix, count = 3) {
  const WORD_LIMIT = 10;
  const ABSOLUTE_LIMIT = 30;
  const DELIMITER = ' ';
  const TEXT_EDGE = '\n================\n';
  const SENTENCE_BREAK = '\n----\n';

  let output = '';
  for(let i = 0; i < count; i++) {
    output += output.length ? SENTENCE_BREAK : TEXT_EDGE;
    let token = s0;
    let sentence = '';
    let wordCount = 0;
    while(wordCount < ABSOLUTE_LIMIT && !fullStops.includes(token)) {
      const leader = weightedLimitMatrix[token];
      const stops = [];
      fullStops.forEach((stop) => {
        if(Object.values(leader).includes(stop)) {
          stops.push(stop);
        }
      })
      if(wordCount++ >= WORD_LIMIT && stops.length) {
        sentence += stops[Math.floor(Math.random() * stops.length)];
        break;
      } else {
        const randomNumber = Math.floor(Math.random() * granularity);
        const descendingKeys = Object.keys(leader).sort((a,b) => b - a);
        do {
          token = leader[descendingKeys.pop()] || token;
        } while(descendingKeys.length && descendingKeys[descendingKeys.length - 1] <= randomNumber);
        if(token) {
          sentence += sentence.length && token.match(/^[^,.!?]/) ? DELIMITER + token : token;
        }
      }
    }
    output += sentence;
  }
  output += TEXT_EDGE;
  return output;
}

module.exports = sentenceFactory;