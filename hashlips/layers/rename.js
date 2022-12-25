const fs = require("fs");
const glob = require("glob");

const rarityMap = {
    // '10': '1', // legendary
    // '3': '3', // mythical
    // '30': '5', // super-rare
    // 'super_rare': '5', // super-rare
    // '100': '7', // rare
    // '300': '9', // uncommon
    // '1000': '10', // common
};

const nameMap = {

};

const capitalize = (str) => {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
}

glob(`${ process.cwd() }/**/*#*.png`, (err, files) => {
    const regex = /([\w\s_-]+)#([\w_-]+)\.png$/i;

    for (const oldPath of files) {
        const [oldFilename, name, rarity] = oldPath.match(regex);

        const newFilename = `${ name.split(' ').map(str => capitalize(str)).join(' ') }#${ rarityMap[rarity] || rarity }.png`;
        const newPath = oldPath.replace(oldFilename, newFilename);

        if (oldFilename !== newFilename) {
            console.log('rename from ', oldFilename, ' to ', newFilename);

            fs.renameSync(oldPath, newPath);
        }
    }
})
