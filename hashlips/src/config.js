const basePath = process.cwd();
const { MODE } = require(`${basePath}/constants/blend_mode.js`);
const { NETWORK } = require(`${basePath}/constants/network.js`);

const network = NETWORK.eth;

// General metadata for Ethereum
const namePrefix = "ALLinONE";
const description = "ALLinONE NFTPass. The project with a lot of features that you haven't seen ever. These NFTs are imbued with our sleepless nights, concepts and ideas. Follow our project on Twitter: twitter.com/ALLinONE_Aptos";
const baseUri = "ipfs://QmUKBPhUGiAFGHEZ9yWC5bgiZPPM9SThs1j8gFdeyF7tRB";

const solanaMetadata = {
  symbol: "YC",
  seller_fee_basis_points: 1000, // Define how much % you want from secondary market sales 1000 = 10%
  external_url: "https://www.youtube.com/c/hashlipsnft",
  creators: [
    {
      address: "7fXNuer5sbZtaTEPhtJ5g5gNtuyRoKkvxdjEjEnPN4mC",
      share: 100,
  ],
};

const growEditionSizeTo = 4396;
const growEditionSizeOnePercent = parseInt(growEditionSizeTo / 100, 10);

// If you have selected Solana then the collection starts from 0 automatically
const layerConfigurations = [
  { // No piercing, special particles (Angel_nimbus, Asshole, Devils, Ocean_nimbus, once_in_month_nimbus, White_but_same, Cat_ears, Kukold)
    growEditionSizeTo: growEditionSizeOnePercent * 20,
    layersOrder: [
      {
        name: "Background",
        options: {
          bypassDNA: true
        }
      },
      {
        name: "BackgroundParticlesGen2",
        options: {
          displayName: "BackgroundParticles",
          bypassDNA: true
        }
      },
      { name: "Makeup" },
      { name: "Tiote" },
      { name: "Pupil" },
      { name: "Eyelashes" },
      { name: "Mucosa" }
    ]
  },
  { // No piercing (+20%), common particles
    growEditionSizeTo: growEditionSizeOnePercent * 20 + growEditionSizeOnePercent * 20,
    layersOrder: [
      {
        name: "Background",
        options: {
          bypassDNA: true
        }
      },
      {
        name: "BackgroundParticlesGen1",
        options: {
          displayName: "BackgroundParticles",
          bypassDNA: true
        }
      },
      { name: "Makeup" },
      { name: "Eyebrow" },
      { name: "Tiote" },
      { name: "Pupil" },
      { name: "Eyelashes" },
      { name: "Mucosa" }
    ]
  },
  { // Any others (60%)
    growEditionSizeTo,
    layersOrder: [
      {
        name: "Background",
        options: {
          bypassDNA: true
        }
      },
      {
        name: "BackgroundParticlesGen1",
        options: {
          displayName: "BackgroundParticles",
          bypassDNA: true
        }
      },
      { name: "Makeup" },
      { name: "Eyebrow" },
      { name: "Piercing" },
      { name: "Tiote" },
      { name: "Pupil" },
      { name: "Eyelashes" },
      { name: "Mucosa" }
    ]
  },
  { // Specials
    growEditionSizeTo: growEditionSizeTo + 51,
    layersOrder: [
      {
        name: "50",
        options: {
          displayName: "Special",
        }
      }
    ]
  }
];

const shuffleLayerConfigurations = true;

const debugLogs = false;

const format = {
  width: 150,
  height: 150,
  smoothing: false,
};

const gif = {
  export: false,
  repeat: 0,
  quality: 100,
  delay: 500,
};

const text = {
  only: false,
  color: "#ffffff",
  size: 20,
  xGap: 40,
  yGap: 40,
  align: "left",
  baseline: "top",
  weight: "regular",
  family: "Courier",
  spacer: " => ",
};

const pixelFormat = {
  ratio: 30 / 150,
};

const background = {
  generate: false,
  brightness: "80%",
  static: false,
  default: "#000000",
};

const extraMetadata = {};

const rarityDelimiter = "#";

const uniqueDnaTorrance = 10000;

const preview = {
  thumbPerRow: 5,
  thumbPerColumn: 5,
  thumbWidth: 150,
  imageRatio: format.height / format.width,
  imageName: "preview.png",
};

const preview_gif = {
  numberOfImages: 25,
  order: "ASC", // ASC, DESC, MIXED
  repeat: 0,
  quality: 100,
  delay: 500,
  imageName: "preview.gif",
};

module.exports = {
  format,
  baseUri,
  description,
  background,
  uniqueDnaTorrance,
  layerConfigurations,
  rarityDelimiter,
  preview,
  shuffleLayerConfigurations,
  debugLogs,
  extraMetadata,
  pixelFormat,
  text,
  namePrefix,
  network,
  solanaMetadata,
  gif,
  preview_gif,
};
