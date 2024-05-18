//@ts-check

const { parse } = require("jsonc-parser");
const merge = require("deepmerge");
const fs = require("fs");

// 変換元JSONCファイルパス
const COMMON_JSONC_PATH = "./constants/common.jsonc";
const BACKEND_JSONC_PATH = "./constants/backend-only.jsonc";
const FRONTEND_JSONC_PATH = "./constants/frontend-only.jsonc";

// 出力先ディレクトリパス
const DIST_DIR = "./dist";
// 出力先JSONファイルパス
const BACKEND_DIST_PATH = `${DIST_DIR}/constants-backend.json`;
const FRONTEND_DIST_PATH = `${DIST_DIR}/constants-frontend.json`;


const main = async () => {
	// 出力先ディレクトリの再作成(出力先ディレクトリ内のファイルをすべて削除)
	await fs.promises.rm(DIST_DIR, { recursive: true, force: true });
	fs.mkdirSync(DIST_DIR, { recursive: true });

	// JSONファイル出力
	await buildJson([COMMON_JSONC_PATH, BACKEND_JSONC_PATH], BACKEND_DIST_PATH);
	await buildJson([COMMON_JSONC_PATH, FRONTEND_JSONC_PATH], FRONTEND_DIST_PATH);
};


const buildJson = (srcJsoncPaths, distJsonPath) => {

	// JSONファイル出力
	const json = srcJsoncPaths.reduce((acc, path) => {
		return merge(acc, parse(fs.readFileSync(path).toString()));
	}, {});
	fs.writeFileSync(distJsonPath, JSON.stringify(json, null, "\t"));
}


main().catch((error) => {
	console.error(error);
	process.exit(1);
});
