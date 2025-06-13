const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = 3000;

// Servir les fichiers statiques
app.use(express.static('.'));

// Proxy pour les APIs externes
app.use('/api', createProxyMiddleware({
    target: 'https://satisfactory-calculator.com',
    changeOrigin: true,
    secure: true
}));

// Route pour les données JSON
app.use('/en/interactive-map/index/json', createProxyMiddleware({
    target: 'https://satisfactory-calculator.com',
    changeOrigin: true,
    secure: true
}));

app.use('/en/api', createProxyMiddleware({
    target: 'https://satisfactory-calculator.com',
    changeOrigin: true,
    secure: true
}));

app.use('/en/mods/index/json', createProxyMiddleware({
    target: 'https://satisfactory-calculator.com',
    changeOrigin: true,
    secure: true
}));

// Assets statiques du CDN
app.use('/static', createProxyMiddleware({
    target: 'https://satisfactory-calculator.com',
    changeOrigin: true,
    secure: true,
    pathRewrite: {
        '^/static': ''
    }
}));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});