const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // 引入cors中间件

const app = express();
const port = 3000;

// 使用cors中间件
app.use(cors());

// 读取当前的访客量
function readVisitorCount() {
    const filePath = path.join(__dirname, 'record.txt');
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return parseInt(data, 10) || 0;
    } catch (err) {
        console.error('Error reading visitor count:', err);
        return 0;
    }
}

// 写入访客量
function writeVisitorCount(count) {
    const filePath = path.join(__dirname, 'record.txt');
    fs.writeFileSync(filePath, count.toString(), 'utf8');
}

// 初始化访客量
let visitorCount = readVisitorCount();

// 中间件，每次请求时增加访客量
app.use((req, res, next) => {
    visitorCount += 1;
    writeVisitorCount(visitorCount);
    console.log(`Visitor count updated to: ${visitorCount}`);
    next();
});

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 返回访客量的路由
app.get('/visit', (req, res) => {
    res.json({ visitorCount });
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});