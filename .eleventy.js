const fg = require("fast-glob");
const mkdirp = require("mkdirp");
const sharp = require("sharp");

const galleryImagesA = fg(["**/gallery/**", "!**/_site", "!**/thumb"]).then(
  (x) => {
    console.log("--------------");
    console.log("Building Thumbnails");
    console.log("--------------");
    buildThumbnails(x);
  }
);
// Run search for images in /_src/gallery
const galleryImages = fg.sync(["_src/gallery/**/*", "!**/_site", "!**/_thumb"]);

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("_src/gallery");
  eleventyConfig.addPassthroughCopy("_src/thumb");
  eleventyConfig.addPassthroughCopy("_src/assets");

  //Create collection of gallery images
  eleventyConfig.addCollection("gallery", function (collection) {
    return galleryImages;
  });

  // Build Collections based on Folder in /gallery
  const collectionFolders = fg([
    "/_src/gallery/**",
    "!**/_site",
    "!**/thumb",
  ]).then((x) => {
    console.log("--------------");
    console.log("Building " + collectionFolders + " Collections");
    console.log("--------------");

    buildCollections(x);
  });
  function buildCollections(collectionGlob) {
    console.log("--------------");
    console.log("Building Collections");
    console.log("--------------");
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
          `gallery/${collection}/*`,
          "!**/_site",
          "!**/_thumb",
        ]);
        return images;
      });
    }

    console.log("--------------");
    console.log("Collections Built!");
    console.log("--------------");
  }

  eleventyConfig.setBrowserSyncConfig({
    files: './_site/css/**/*.css'
  });

  return {
    dir: {
      input: "_src",
      output: "_site"
    }
  }
};

function buildThumbnails(thumbnailArray) {
  for (const img of thumbnailArray) {
    let imgStr = img.toString();
    imgStr = imgStr.split("/");

    imgStr.pop();
    imgStr = imgStr.join("/");
    let shorterThumbStr = img.replace('_src/', '');

    // remove the actual file name from the shorterThumbStr
    const THUMB_PATH = `_src/thumb/_src/${shorterThumbStr.split('/').slice(0, 2).join('/')}`
    mkdirp.sync(THUMB_PATH);

    const shorterImg = img.replace('_src/', '');
    sharp(img)
      .resize({ width: 768 })
      .toFile("_src/thumb/_src/" + shorterImg);
  }
  console.log("--------------");
  console.log("Thumbnails Built!");
  console.log("--------------");
}
