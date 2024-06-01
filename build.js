//@ts-check

const { parse } = require("jsonc-parser");
const merge = require("deepmerge");
const fs = require("fs");

// 変換元JSONCファイルパス
const COMMON_JSONC_PATH = "./constants/common.jsonc";	// バックエンド、フロントエンドすべてで使用する定数
const ADMIN_COMMON_JSONC_PATH = "./constants/admin.jsonc";	// 管理画面のフロントエンドとバックエンドで使用する定数
const VIEW_COMMON_JSONC_PATH = "./constants/view.jsonc";	//	閲覧画面のフロントエンドとバックエンドで使用する定数
const BACKEND_ONLY_JSONC_PATH = "./constants/backend-only.jsonc";	// バックエンドのみで使用する定数
const FRONTEND_COMMON_JSONC_PATH = "./constants/frontend-common.jsonc";	// 管理画面及び閲覧画面(フロントエンド)のみで使用する定数
const FRONTEND_ADMIN_JSONC_PATH = "./constants/frontend-admin.jsonc";	// 管理画面(フロントエンド)のみで使用する定数
const FRONTEND_VIEW_JSONC_PATH = "./constants/frontend-view.jsonc";	    // 閲覧画面(フロントエンド)のみで使用する定数

// 出力先ディレクトリパス
const DIST_DIR = "./dist";
// 出力先JSONファイルパス
const BACKEND_DIST_PATH = `${DIST_DIR}/constants-backend.json`;
const FRONTEND_ADMIN_DIST_PATH = `${DIST_DIR}/constants-frontend-admin.json`;
const FRONTEND_VIEW_DIST_PATH = `${DIST_DIR}/constants-frontend-view.json`;


const main = async () => {
	// 出力先ディレクトリの再作成(出力先ディレクトリ内のファイルをすべて削除)
	await fs.promises.rm(DIST_DIR, { recursive: true, force: true });
	fs.mkdirSync(DIST_DIR, { recursive: true });

	// JSONファイル出力
	await buildJson([COMMON_JSONC_PATH, ADMIN_COMMON_JSONC_PATH, VIEW_COMMON_JSONC_PATH, BACKEND_ONLY_JSONC_PATH], BACKEND_DIST_PATH);
	await buildJson([COMMON_JSONC_PATH, ADMIN_COMMON_JSONC_PATH, FRONTEND_COMMON_JSONC_PATH, FRONTEND_ADMIN_JSONC_PATH], FRONTEND_ADMIN_DIST_PATH);
	await buildJson([COMMON_JSONC_PATH, VIEW_COMMON_JSONC_PATH, FRONTEND_COMMON_JSONC_PATH, FRONTEND_VIEW_JSONC_PATH], FRONTEND_VIEW_DIST_PATH);
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
