#!/usr/bin/env node

'use strict'

const fs = require('fs');
const path = require('path');
const markovTextFactory = require('./lib/markovTextFactory');
const {formatText, formatTwitterJSON} = require('./formatUtil');

const OUTPUT_SENTENCE_COUNT = process.argv.slice(2)[0];

/** Data Sources **/
const trumpTweets = require('../corpus/trumptweet.json');
const trumpCorpus = fs.readFileSync(path.join(__dirname, '../corpus/trump.txt'), 'utf-8');
const obamaCorpus = fs.readFileSync(path.join(__dirname, '../corpus/obama.txt'), 'utf-8');
const variousCorpus = fs.readFileSync(path.join(__dirname, '../corpus/various.txt'), 'utf-8');
/** Formatted corpus array. */
const formattedCorpus = [
  ...formatTwitterJSON(trumpTweets),
  ...formatText(trumpCorpus),
  ...formatText(obamaCorpus),
  ...formatText(variousCorpus),
];

const markovText = markovTextFactory(formattedCorpus, OUTPUT_SENTENCE_COUNT);

console.log(markovText);