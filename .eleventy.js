const fg = require("fast-glob");
// Run search for images in /gallery
const galleryImages = fg.sync(["**/gallery/*", "!**/_site"]);

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("gallery");



  //Create collection of gallery images
  eleventyConfig.addCollection("gallery", function (collection) {
    return galleryImages;
  });
};