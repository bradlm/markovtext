#!/usr/bin/env node

'use strict'

const fs = require('fs');
const path = require('path');
let tweets = require('../corpus/trumptweet.json');

const formatText = (text) => text.replace(/'|"|https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi, '')
  .replace(/([\r\n\t]+|\.\.+)/gi, ' ').replace(/\s{2,}/gi, ' ').replace(/[–.,:]\s/gi, ' $&').split(' ');

const trumpCorpus = fs.readFileSync(path.join(__dirname, '../corpus/trump.txt'), 'utf-8');
const obamaCorpus = fs.readFileSync(path.join(__dirname, '../corpus/obama.txt'), 'utf-8');
const variousCorpus = fs.readFileSync(path.join(__dirname, '../corpus/various.txt'), 'utf-8');

const formattedCorpus = tweets.map((tweet) => formatText(tweet.text)).concat(formatText(trumpCorpus, obamaCorpus, variousCorpus));

const markovMatrix = {};
const INITIAL_STATE = '###initial_state###';
const fullStops = ['.', '!', '?'];

const createLeader = () => ({
  cumulativeCount: 0,
  followers: {}
});
markovMatrix[INITIAL_STATE] = createLeader();

let leader = INITIAL_STATE;
formattedCorpus.forEach((token) => {
  if(token) {
    if(!markovMatrix[token]) {
      markovMatrix[token] = createLeader();
    }
    const last = markovMatrix[leader];
    if(!last.followers[token]) {
      last.followers[token] = 1;
    } else {
      last.followers[token]++;
    }
    last.cumulativeCount++;
    leader = fullStops.includes(token) ? INITIAL_STATE : token;
  }
});

const weightedLimitMatrix = {};
for(const token in markovMatrix) {
  const leader = markovMatrix[token];
  const newLeader = weightedLimitMatrix[token] = {};
  let runningTotal = 0;
  for(const follower in leader.followers) {
    runningTotal += Math.round(leader.followers[follower] / leader.cumulativeCount * 100);
    newLeader[runningTotal] = follower;
  }
}

const WORD_LIMIT = 10;
const ABSOLUTE_LIMIT = 30;
const DELIMITER = ' ';
const TEXT_EDGE = '\n================\n';

let output = '';
for(let i = 0; i < (process.env.COUNT || 3); i++) {
  output += output.length ? '\n----\n' : TEXT_EDGE;
  let token = INITIAL_STATE;
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
      const randomNumber = Math.floor(Math.random() * 100);
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

console.log(output);