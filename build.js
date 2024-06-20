//@ts-check

const { parse } = require("jsonc-parser");
const merge = require("deepmerge");
const fs = require("fs");

const SRC_FILE = "./src/constants.jsonc";
const DIST_DIR = "./dist";

/**
 * This is the main function.
 * @returns {Promise<void>}
 */
const main = async () => {
    const json = parse(fs.readFileSync(SRC_FILE).toString());
    
    // keysに設定されている値を全て取得
    /** @type any[] */
    const constants = json["constants"];
    /** @type string[] */
    const allKeys = Array.from(constants.reduce((acc, c) => {
        /** @type string[] */
        const keys = c["keys"];
        for(const key of keys) {
            acc.add(key);
        }
        return acc;
    }, new Set()));


    // 各キーに対してconstants.jsonを生成する
    for(const key of allKeys) {
        const json = constants.reduce((acc, c) => {
            if(c["keys"].includes(key)) {
                return merge(acc, c["data"]);
            }
            return acc;
        }, {});

        const dir = `${DIST_DIR}/${key}`;
        // ディレクトリが存在しなければ作成
        if(!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(`./dist/${key}/constants.json`, JSON.stringify(json, null, "\t"));
    }
    
};



main().catch((error) => {
    console.error(error);
    process.exit(1);
});