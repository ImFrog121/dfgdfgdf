const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

// Проверка существования public/index.html
const publicDir = path.join(__dirname, 'public');
const indexPath = path.join(publicDir, 'index.html');

console.log("Проверяем путь:", indexPath);

if (!fs.existsSync(publicDir)) {
  console.error("Папка public не существует!");
  fs.mkdirSync(publicDir);
}

if (!fs.existsSync(indexPath)) {
  console.error("index.html не найден! Создаем временный файл...");
  fs.writeFileSync(indexPath, '<h1>Neon Messenger работает!</h1>');
}

// Статические файлы
app.use(express.static(publicDir));

// Простой роут для проверки
app.get('/test', (req, res) => {
  res.send('Сервер работает!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

});

