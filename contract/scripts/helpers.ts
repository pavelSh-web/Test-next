/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
export function execShellCommand(cmd) {
    const exec = require('child_process').exec;
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error || (!stdout && stderr)) {
                console.warn(error);
                return reject(stderr);
            }

            resolve(stdout);
        });
    });
}

/**
 * formatBigint(150000000) -> 1.5
 *
 * @param num - BigInt value
 * @param decimals - Decimals
 */
export function formatBigint(num: bigint|string|number, decimals = 8): string {
    num = BigInt(num);

    let str = [];

    for (let i = 1; i <= decimals; i++) {
        str.unshift(num % 10n);

        num = num / 10n;
    }

    return (num.toString() + '.' + str.join('')).replace(/\.?0+$/, '');
}
