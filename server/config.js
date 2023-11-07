import express from "express";
import https from "https";
import path from "path";
import * as fs from 'fs'
import { fileURLToPath } from 'url'
import { Server as IO } from "socket.io";
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 初始化 express
 * @param app
 * @returns
 */
export default function initApp() {
  //https证书
const options = {
  cert: fs.readFileSync(path.join(__dirname, './assets/example.pem')),
  key: fs.readFileSync(path.join(__dirname, './assets/example-key.pem')),
}
  let app = express();
  let http_server = https.createServer(options, app);
  http_server.listen(3333, () => {
    console.log('Https server up and running...')
  })
  let io = new IO(http_server, {
    path: "/rtc",
    // 允许跨域访问
    cors: {
      origin: "*"
    }
  });
  http_server.on("listening", () => {
    let addr = http_server.address();
    if (addr) {
      let port = typeof addr === "string" ? addr : addr.port;
      console.log(`Listening on ${port}`);
    }
  });
  return io;
}
