#!/usr/bin/env node
// 批量生成 prototype-builder 激活码
//
// 用法：
//   node scripts/gen-license.mjs CODE1 CODE2 ...       # 为指定码生成（永久）
//   node scripts/gen-license.mjs --expire 30 CODE1      # 为指定码生成 30 天卡
//   node scripts/gen-license.mjs --random 10            # 随机生成 10 个（永久）
//   node scripts/gen-license.mjs --random 10 --expire 90   # 随机生成 10 个 90 天卡
//   node scripts/gen-license.mjs --file codes.txt       # 从文件读取码（每行一个）
//   node scripts/gen-license.mjs --random 10 --csv      # CSV 输出：code,license
//
// 常用时长：月卡 30 天 / 季卡 90 天 / 年卡 365 天
// 注意：SECRET 必须与 src/stores/member.ts 中保持一致。

import fs from "node:fs";

const SECRET = "PROTO-BUILDER-2026";

function hash(input) {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h + input.charCodeAt(i)) >>> 0;
  }
  return h.toString(36);
}

function signature(code, exp) {
  return hash(SECRET + code + exp).slice(0, 6).padStart(6, "0");
}

function normalizeCode(input) {
  return String(input)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .padEnd(8, "0")
    .slice(0, 8);
}

function expiryDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

function genLicense(code, days = 0) {
  const c = normalizeCode(code);
  const exp = days > 0 ? expiryDate(days) : "";
  const sig = signature(c, exp).toUpperCase();
  const license = exp ? `PB-${c}-${sig}-${exp}` : `PB-${c}-${sig}`;
  return { code: c, license, expireDays: days };
}

function randomCode(len = 8) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function parseArgs(argv) {
  const args = { codes: [], count: 0, file: null, csv: false, expire: 0 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--random") {
      args.count = Number(argv[++i]) || 0;
    } else if (a === "--file") {
      args.file = argv[++i];
    } else if (a === "--expire") {
      args.expire = Number(argv[++i]) || 0;
    } else if (a === "--csv") {
      args.csv = true;
    } else if (!a.startsWith("--")) {
      args.codes.push(a);
    }
  }
  return args;
}

function printUsage() {
  console.log(
    [
      "用法：",
      "  node scripts/gen-license.mjs CODE1 CODE2 ...",
      "  node scripts/gen-license.mjs --expire 30 CODE1",
      "  node scripts/gen-license.mjs --random 10",
      "  node scripts/gen-license.mjs --random 10 --expire 90",
      "  node scripts/gen-license.mjs --file codes.txt",
      "  node scripts/gen-license.mjs --random 10 --csv",
      "",
      "常用时长：月卡 30 天 / 季卡 90 天 / 年卡 365 天",
    ].join("\n")
  );
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 0) {
    printUsage();
    process.exit(0);
  }

  const args = parseArgs(argv);
  const results = [];
  const seen = new Set();

  const add = (code) => {
    const r = genLicense(code, args.expire);
    if (!seen.has(r.code)) {
      seen.add(r.code);
      results.push(r);
    }
  };

  args.codes.forEach(add);

  if (args.file) {
    const text = fs.readFileSync(args.file, "utf8");
    text
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach(add);
  }

  for (let i = 0; i < args.count; i++) {
    let code = randomCode(8);
    let guard = 0;
    while (seen.has(code) && guard < 100) {
      code = randomCode(8);
      guard++;
    }
    seen.add(code);
    results.push(genLicense(code, args.expire));
  }

  if (results.length === 0) {
    console.error("没有生成任何激活码。");
    process.exit(1);
  }

  for (const r of results) {
    console.log(args.csv ? `${r.code},${r.license}` : r.license);
  }
}

main();
