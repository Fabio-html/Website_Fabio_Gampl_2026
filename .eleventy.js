module.exports = function (eleventyConfig) {
    // Copy-through (keine Verarbeitung)
    eleventyConfig.addPassthroughCopy({ "src/css": "css" });
    eleventyConfig.addPassthroughCopy({ "src/js": "js" });
    eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

    // Collection: projects
    eleventyConfig.addCollection("projects", (collectionApi) => {
        return collectionApi.getFilteredByGlob("src/projects/*.md").sort((a, b) => {
            // sort newest first (year desc). fallback 0
            const ay = Number(a.data.year || 0);
            const by = Number(b.data.year || 0);
            return by - ay;
        });
    });

    return {
        dir: {
            input: "src",
            output: "_site",
            includes: "_includes",
        },
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
        templateFormats: ["njk", "md", "html"],
    };
};