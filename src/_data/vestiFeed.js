const { fetchRssItems, isRealEstate } = require("../../utils/rss.js");

module.exports = async function () {
  // isključujemo oglase nekretnina iz vesti (idu na /nekretnine/ umesto)
  return fetchRssItems("https://www.banjavrujci.info/feed", 9, {
    filter: (item) => !isRealEstate(item),
  });
};
