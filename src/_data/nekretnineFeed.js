const { fetchRssItems, isRealEstate } = require("../../utils/rss.js");

module.exports = async function () {
  // Banjavrujci.info nema posebnu "nekretnine" kategoriju/feed — svi postovi
  // (vesti + oglasi) idu kroz isti glavni feed, pa oglase izdvajamo po ključnim
  // rečima u naslovu/linku ("prodaju", "prodaja", "plac").
  return fetchRssItems("https://www.banjavrujci.info/feed", 12, { filter: isRealEstate });
};
