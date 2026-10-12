// server.js —— Node.js 原生 HTTP 服务器（无需安装任何第三方依赖）
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// 获取服务器当前时间的辅助函数（使用东八区时区）
function getServerTime() {
  return new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
}

const server = http.createServer((req, res) => {
  const url = req.url;

  // 接口：返回服务器当前时间（JSON）
  if (url === '/time') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ time: getServerTime(), timestamp: Date.now() }));
    return;
  }

  // 静态首页
  if (url === '/' || url === '/index.html') {
    const filePath = path.join(PUBLIC_DIR, 'index.html');
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('服务器读取页面出错：' + err.message);
        return;
      }
      // 首次渲染时把服务器时间注入到页面占位符中
      content = content.replace('{{SERVER_TIME}}', getServerTime());
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(content);
    });
    return;
  }

  // 其他路径统一返回 404
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('404 Not Found');
});

server.listen(PORT, () => {
  console.log(`服务器已启动，请在浏览器访问：http://localhost:${PORT}`);
  console.log(`当前服务器时间：${getServerTime()}`);
});
