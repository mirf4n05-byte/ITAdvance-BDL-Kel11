const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));
let items = [
    { id: 1, name: 'Buku' },
    { id: 2, name: 'Pulpen' }
];
let nextId = 3;
app.get('/api/ping', (req, res) => {
    res.json({ pesan: 'pong' });
});
app.get('/api/items', (req, res) => {
    res.json(items);
});
app.post('/api/items', (req, res) => {
    const name = req.body?.name;
    if (!name) {
        return res
            .status(400)
            .json({ error: 'name wajib diisi' });
    }
    const item = { id: nextId++, name: name };
    items.push(item);
    res.status(201).json(item);
});
app.listen(3000, () => {
    console.log('Server jalan di http://localhost:3000');
});