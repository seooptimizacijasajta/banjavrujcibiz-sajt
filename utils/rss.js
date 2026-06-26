function decodeEntities(str) {
  return str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(code))
    .trim();
}

function extractTag(block, tag) {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return m ? decodeEntities(m[1]) : "";
}

function extractFirstImage(html) {
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

async function fetchRssItems(url, limit = 12, options = {}) {
  const { filter, fetchLimit = 100 } = options;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (BanjaVrujciBuild)" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    const rawItems = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, fetchLimit);
    let items = rawItems.map(([, block]) => {
      const description = extractTag(block, "description") || extractTag(block, "content:encoded");
      const rawDate = extractTag(block, "pubDate");
      const parsed = rawDate ? new Date(rawDate) : null;
      return {
        title: extractTag(block, "title"),
        link: extractTag(block, "link"),
        pubDate: parsed && !isNaN(parsed) ? parsed.toLocaleDateString("sr-RS") : "",
        description: description.replace(/<[^>]+>/g, "").slice(0, 220),
        image: extractFirstImage(description),
      };
    });
    if (typeof filter === "function") {
      items = items.filter(filter);
    }
    return items.slice(0, limit);
  } catch (err) {
    console.warn(`[rss] Nije moguće učitati feed ${url}: ${err.message}`);
    return [];
  }
}

const REAL_ESTATE_PATTERN = /prodaju|prodaja|plac/i;
const isRealEstate = (item) => REAL_ESTATE_PATTERN.test(item.title) || REAL_ESTATE_PATTERN.test(item.link);

module.exports = { fetchRssItems, isRealEstate };
