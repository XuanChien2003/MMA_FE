const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawn } = require("node:child_process");

const projectRoot = path.resolve(__dirname, "..");
for (const name of [
  ".env.development.local",
  ".env.local",
  ".env.development",
  ".env",
]) {
  const file = path.join(projectRoot, name);
  if (fs.existsSync(file)) process.loadEnvFile(file);
}
const addresses = Object.entries(os.networkInterfaces()).flatMap(
  ([name, values]) =>
    (values || [])
      .filter(
        (item) =>
          item.family === "IPv4" &&
          !item.internal &&
          !item.address.startsWith("169.254."),
      )
      .map((item) => ({ ...item, name })),
);
const score = (item) =>
  (/wi-?fi|wlan|ethernet/i.test(item.name) ? 10 : 0) +
  (/^(192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/.test(item.address) ? 5 : 0) -
  (/vpn|vethernet|virtual|docker|wsl/i.test(item.name) ? 20 : 0);
addresses.sort((a, b) => score(b) - score(a));
const hostname = process.env.LAN_HOST || addresses[0]?.address;
if (!hostname) {
  console.error(
    "Không tìm thấy IPv4 LAN. Kết nối Wi-Fi hoặc đặt LAN_HOST rồi thử lại.",
  );
  process.exit(1);
}
const backendEnv = path.resolve(projectRoot, "../back-end/.env");
const backendPort = fs.existsSync(backendEnv)
  ? fs.readFileSync(backendEnv, "utf8").match(/^PORT\s*=\s*["']?(\d+)/m)?.[1] ||
    "9999"
  : "9999";
process.env.EXPO_PUBLIC_API_URL ||= `http://${hostname}:${backendPort}`;
process.env.REACT_NATIVE_PACKAGER_HOSTNAME = hostname;
console.log(
  `\nMáy tính: ${hostname}\nBackend: ${process.env.EXPO_PUBLIC_API_URL}\nKiểm tra trên trình duyệt điện thoại: ${process.env.EXPO_PUBLIC_API_URL}/health`,
);
console.log(
  "Điện thoại và máy tính cần cùng Wi-Fi. Mở Expo Go và quét QR bên dưới.\n",
);
const args = process.argv.slice(2);
const workers = args.some(
  (arg) => arg === "--max-workers" || arg.startsWith("--max-workers="),
)
  ? []
  : ["--max-workers", "2"];
const connection = args.includes("--tunnel") ? [] : ["--lan"];
const cli = require.resolve("expo/bin/cli");
const child = spawn(
  process.execPath,
  [cli, "start", "--go", ...connection, ...workers, ...args],
  { cwd: projectRoot, stdio: "inherit", env: process.env },
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
child.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.on("exit", (code) => {
  process.exitCode = code || 0;
});
