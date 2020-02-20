'use strict'

function formatText(text) {
  const URLS_AND_QUOTES = /'|"|(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))|(\S+?\.com)/gi;
  const BREAKS_AND_TABS = /([\r\n\t]+|\.\.+)/gi;
  const MULTISPACE = /\s{2,}/gi;
  const SPECIAL_CHARS = /[–.,:]\s/gi;
  
  const output = text.replace(URLS_AND_QUOTES, '').replace(BREAKS_AND_TABS, ' ').replace(MULTISPACE, ' ').replace(SPECIAL_CHARS, ' $&').split(' ');
  
  return output;
}

function formatTwitterJSON(tweets) {
  const output = tweets.map((tweet) => formatText(tweet.text).filter((word) => !['@', '#']
    .reduce((bool = false, token) => bool || word.includes(token))));

  return [].concat.apply([], output);;
}

module.exports = {
  formatText,
  formatTwitterJSON,
};