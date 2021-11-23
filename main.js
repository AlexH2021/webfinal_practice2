/*
 * Project:
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author: A Ut Hong
 *
 */

const IOhandler = require("./IOhandler"),
  zipFilePath = `${__dirname}/myfile.zip`,
  pathUnzipped = `${__dirname}/unzipped`,
  pathProcessed = `${__dirname}/grayscaled`;


IOhandler.unzip(zipFilePath, pathUnzipped)
.then(data => IOhandler.readDir(data))
.then(data => data.map(file => IOhandler.grayScale(file, pathProcessed)))
.then(() => console.log('files processed'))
.catch(error => console.log(error));