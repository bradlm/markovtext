'use strict'

const {s0, fullStops, granularity} = require('./config');

function matrixFactory(corpus) {
  const markovMatrix = {};

  const createLeader = () => ({
    cumulativeCount: 0,
    followers: {}
  });
  markovMatrix[s0] = createLeader();

  let leader = s0;
  corpus.forEach((token) => {
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
      leader = fullStops.includes(token) ? s0 : token;
    }
  });
  return markovMatrix;
}

function weightedLimitMatrixFactory(matrix) {
  const weightedLimitMatrix = {};
  for(const token in matrix) {
    const leader = matrix[token];
    const newLeader = weightedLimitMatrix[token] = {};
    let runningTotal = 0;
    for(const follower in leader.followers) {
      const limitIncrease = Math.round(leader.followers[follower] / leader.cumulativeCount * granularity);
      runningTotal += limitIncrease;
      newLeader[runningTotal] = follower;
    }
  }
  return weightedLimitMatrix;
}

module.exports = {
  matrixFactory,
  weightedLimitMatrixFactory,
};