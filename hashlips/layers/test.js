const fs = require("fs");
const glob = require("glob");

glob(`${ process.cwd() }/Hand Drawn/*.png`, (err, files) => {
    const regex = /([\w\sа-яёa-z_-]+).png$/i;

    for (const oldPath of files) {
        const [_, oldFilename] = oldPath.match(regex);
        const newFilename = 'Hand Drawn ' + (files.indexOf(oldPath) + 1) + '#1';
        const newPath = oldPath.replace(oldFilename, newFilename);

        if (oldFilename !== newFilename) {
            console.log('rename from ', oldFilename, ' to ', newFilename);

            fs.renameSync(oldPath, newPath);
        }
    }
})
