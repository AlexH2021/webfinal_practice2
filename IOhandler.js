/*
 * Project:
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

const unzipper = require("unzipper"),
  fs = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */
const unzip = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(pathIn)
    .pipe(unzipper.Extract({ path: pathOut }));

    stream.on("finish", () => {
      console.log("file unzipped");
      resolve(pathOut);
    })
  })
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, 'utf-8', (err, files) => {
      if(err) {
        reject();
      }
      else{
        console.log("get file path success");
        let png_list = files.filter(file => file.includes("png"));
        png_list = png_list.map(file => path.join(dir, file));
        resolve(png_list);
      }
    })
  })
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(pathIn)
      .pipe(
      new PNG({
        filterType: 4,
      })
    )
    .on("parsed", function () {
      for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
          var idx = (this.width * y + x) << 2;
   
          // invert color
          this.data[idx] = 0.3 * this.data[idx] + 0.59 * this.data[idx + 1] + 0.11 * this.data[idx + 2];
          this.data[idx + 1] = this.data[idx];
          this.data[idx + 2] = this.data[idx];
   
          // and reduce opacity
          // this.data[idx + 3] = this.data[idx + 3] >> 1;
        }
      }
      this.pack().pipe(fs.createWriteStream(path.join(pathOut, path.basename(pathIn))));
    });
  });
};

module.exports = {
  unzip,
  readDir,
  grayScale,
};
