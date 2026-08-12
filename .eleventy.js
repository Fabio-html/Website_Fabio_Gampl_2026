const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
    eleventyConfig.addShortcode("inlineSvg", (assetPath, options = {}) => {
        const filePath = path.join("src", assetPath);
        let content = fs.readFileSync(filePath, "utf8");
        content = content.replace(/<\?xml[^?]*\?>\s*/i, "");
        content = content.replace(/<defs>[\s\S]*?<\/defs>\s*/gi, "");
        content = content.replace(/\s*class="cls-1"/g, "");

        const viewBox = options.viewBox ?? content.match(/viewBox="([^"]+)"/)?.[1];
        const attrs = {
            xmlns: "http://www.w3.org/2000/svg",
            viewBox,
            ...options,
        };
        const attrString = Object.entries(attrs)
            .filter(([, value]) => value != null && value !== "")
            .map(([key, value]) => `${key}="${value}"`)
            .join(" ");

        const inner = content.replace(/^<svg[^>]*>/i, "").replace(/<\/svg>\s*$/i, "");
        return `<svg ${attrString}>${inner}</svg>`;
    });

    // Copy-through (keine Verarbeitung)
    eleventyConfig.addPassthroughCopy({ "src/css": "css" });
    eleventyConfig.addPassthroughCopy({ "src/js": "js" });
    eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

    // Collection: projects
    eleventyConfig.addCollection("projects", (collectionApi) => {
        return collectionApi.getFilteredByGlob("src/projects/*.md").sort((a, b) => {
            const ay = Number(a.data.year || 0);
            const by = Number(b.data.year || 0);
            if (by !== ay) return by - ay;

            const ad = new Date(a.data.date || `${ay || 0}-01-01`).getTime();
            const bd = new Date(b.data.date || `${by || 0}-01-01`).getTime();
            return bd - ad;
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