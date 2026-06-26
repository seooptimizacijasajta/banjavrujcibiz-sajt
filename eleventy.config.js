module.exports = function (eleventyConfig) {
  eleventyConfig.addGlobalData("currentYear", () => new Date().getFullYear());
  eleventyConfig.addFilter("urlencode", (str) => encodeURIComponent(str || ""));
  eleventyConfig.addFilter("noslash", (url) => {
    if (!url || url === "/") return url;
    return url.endsWith("/") ? url.slice(0, -1) : url;
  });
  eleventyConfig.addFilter("toBreadcrumbList", (breadcrumbs) =>
    breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.label,
      item: b.url ? `https://www.banjavrujci.biz${b.url}` : undefined,
    }))
  );

  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/llms.txt");
  eleventyConfig.addPassthroughCopy("src/uploads");

  eleventyConfig.addCollection("vile", (api) =>
    api.getFilteredByGlob("src/smestaj/vile/*.md").filter((i) => i.data.published !== false)
  );
  eleventyConfig.addCollection("apartmani", (api) =>
    api.getFilteredByGlob("src/smestaj/apartmani-banja-vrujci/*.md").filter((i) => i.data.published !== false)
  );
  eleventyConfig.addCollection("privatni", (api) =>
    api.getFilteredByGlob("src/smestaj/privatni/*.md").filter((i) => i.data.published !== false)
  );
  eleventyConfig.addCollection("hoteli", (api) =>
    api.getFilteredByGlob("src/smestaj/hoteli/*.md").filter((i) => i.data.published !== false)
  );
  eleventyConfig.addCollection("sobe", (api) =>
    api.getFilteredByGlob("src/smestaj/sobe/*.md").filter((i) => i.data.published !== false)
  );
  eleventyConfig.addCollection("vesti", (api) =>
    api.getFilteredByGlob("src/vesti/*.md").filter((i) => i.data.published !== false)
  );
  eleventyConfig.addCollection("nekretnine", (api) =>
    api.getFilteredByGlob("src/nekretnine/*.md").filter((i) => i.data.published !== false)
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
