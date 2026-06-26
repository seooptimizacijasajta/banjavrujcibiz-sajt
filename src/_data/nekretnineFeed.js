const { fetchRssItems } = require("../../utils/rss.js");

module.exports = async function () {
  return fetchRssItems("https://www.banjavrujci.info/nekretnine/feed", 12);
};
