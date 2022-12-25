const basePath = process.cwd();
const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const buildDir = `${basePath}/build`;

const { preview } = require(`${basePath}/src/config.js`);

// read json data
const rawdata = fs.readFileSync(`${basePath}/build/json/_metadata.json`);
const metadataList = JSON.parse(rawdata);

const saveProjectPreviewImage = async (_data) => {
  // Extract from preview config
  const { thumbWidth, thumbPerRow, thumbPerColumn, imageRatio, imageName } = preview;
  const thumbsCount = Math.min(thumbPerColumn * thumbPerRow, _data.length);

  // Calculate height on the fly
  const thumbHeight = thumbWidth * imageRatio;
  // Prepare canvas
  const previewCanvasWidth = thumbWidth * thumbPerRow;
  const previewCanvasHeight = thumbHeight * Math.ceil(thumbsCount / thumbPerRow);
  // Shout from the mountain tops
  console.log(
    `Preparing a ${previewCanvasWidth}x${previewCanvasHeight} project preview with ${thumbsCount} thumbnails.`
  );

  // Initiate the canvas now that we have calculated everything
  const previewPath = `${buildDir}/${imageName}`;
  const previewCanvas = createCanvas(previewCanvasWidth, previewCanvasHeight);
  const previewCtx = previewCanvas.getContext("2d");

  // Iterate all NFTs and insert thumbnail into preview image
  // Don't want to rely on "edition" for assuming index
  for (let index = 0; index < thumbsCount; index++) {
    const nft = _data[index];
    await loadImage(`${buildDir}/images/${nft.edition}.png`).then((image) => {
      previewCtx.drawImage(
        image,
        thumbWidth * (index % thumbPerRow),
        thumbHeight * Math.trunc(index / thumbPerRow),
        thumbWidth,
        thumbHeight
      );
    });
  }

  // Write Project Preview to file
  fs.writeFileSync(previewPath, previewCanvas.toBuffer("image/png"));
  console.log(`Project preview image located at: ${previewPath}`);
};

saveProjectPreviewImage(metadataList);
