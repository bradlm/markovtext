'use strict'

const {matrixFactory, weightedLimitMatrixFactory} = require('./matrixFactory.js');
const sentenceFactory = require('./sentenceFactory');

function markovTextFactory(corpus, count) {
  /** Markov matrix with occurance counts instead of probabilities. */
  const markovMatrix = matrixFactory(corpus);

  /** Matrix with weights, shown as limits, to roll RNG against. */
  const weightedMatrix = weightedLimitMatrixFactory(markovMatrix);

  const output = sentenceFactory(weightedMatrix, count);

  return output;
}

module.exports = markovTextFactory;