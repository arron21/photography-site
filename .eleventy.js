const fg = require("fast-glob");
const mkdirp = require("mkdirp");
const sharp = require("sharp");

const galleryImagesA = fg(["**/gallery/**", "!**/_site", "!**/thumb"]).then(
  (x) => {
    console.log("--------------");
    console.log("Building Thumbnails");
    console.log("--------------");

    console.log(x);
    buildThumbnails(x);
  }
);
// Run search for images in /gallery
const galleryImages = fg.sync(["_src/gallery/**/*", "!**/_site", "!**/_thumb"]);

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("_src/gallery");
  eleventyConfig.addPassthroughCopy("_src/thumb");
  eleventyConfig.addPassthroughCopy("_src/assets");

  //Create collection of gallery images
  eleventyConfig.addCollection("_src/gallery", function (collection) {
    return galleryImages;
  });

  // Build Collections based on Folder in /gallery
  const collectionFolders = fg([
    "**/gallery/**",
    "!**/_site",
    "!**/thumb",
  ]).then((x) => {
    console.log("--------------");
    console.log("Building Collections");
    console.log("--------------");

    buildCollections(x);
  });
  function buildCollections(collectionGlob) {
    console.log("--------------");
    console.log("Building Collections");
    console.log("--------------");
    console.log(collectionGlob);
    // return;
    const collections = [];
    for (const img of collectionGlob) {
      let imgStr = img.toString();
      imgStr = imgStr.split("/");

      /**
       * '/gallery/COLLECTIONNAME/filename.jpg'
       */
      const collectionName = imgStr[1];
      collections.push(collectionName);
    }
    const finalCollectionSet = [...new Set(collections)];

    for (const collection of finalCollectionSet) {
      eleventyConfig.addCollection(collection, function (collectionVar) {
        const images = fg.sync([
          `_src/gallery/${collection}/*`,
          "!**/_site",
          "!**/_thumb",
        ]);
        return images;
      });
    }

    console.log(finalCollectionSet);

    console.log("--------------");
    console.log("Collections Built!");
    console.log("--------------");
  }

  eleventyConfig.setBrowserSyncConfig({
    files: './_site/css/**/*.css'
  });
};

function buildThumbnails(thumbnailArray) {
  for (const img of thumbnailArray) {
    let imgStr = img.toString();
    imgStr = imgStr.split("/");

    imgStr.pop();
    imgStr = imgStr.join("/");
    const made = mkdirp.sync("_src/thumb/" + imgStr);

    sharp(img)
      .resize({ width: 250 })
      .toFile("_src/thumb/" + img);
  }
  console.log("--------------");
  console.log("Thumbnails Built!");
  console.log("--------------");
}
