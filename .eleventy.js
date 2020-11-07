const fg = require("fast-glob");
const mkdirp = require('mkdirp')
const sharp = require('sharp');


const galleryImagesA = fg(["**/gallery/**", "!**/_site", "!**/thumb"]).then(x => {
  console.log(x)
  buildThumbnails(x)
});
// Run search for images in /gallery
const galleryImages = fg.sync(["gallery/**/*", "!**/_site", "!**/_thumb"]);



module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("gallery");
  eleventyConfig.addPassthroughCopy("thumb");
  eleventyConfig.addPassthroughCopy("assets");



  //Create collection of gallery images
  eleventyConfig.addCollection("gallery", function (collection) {
    return galleryImages;
  });
};


function buildThumbnails(thumnailArray) {


  for(const img of thumnailArray) {
    let imgStr = img.toString()
    imgStr = imgStr.split('/');

    imgStr.pop();
    imgStr = imgStr.join('/');
    const made = mkdirp.sync('thumb/'+imgStr)

    sharp(img)
      .resize({ width: 250 })
      .toFile('thumb/'+img)
  }
}