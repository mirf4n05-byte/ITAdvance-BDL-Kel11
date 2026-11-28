# API Contract

## 1. Informasi Umum

| Keterangan | Detail |
|---|---|
| Base URL | `http://localhost:3000` |
| Backend | Node.js + Express.js |
| Format Data | JSON |
| Database | Belum menggunakan database (data disimpan sementara di memori) |

## 2. Daftar Endpoint

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/ping` | Memeriksa apakah server berjalan |
| GET | `/api/items` | Mengambil seluruh data item |
| POST | `/api/items` | Menambahkan item baru |

## 3. Detail Endpoint

### 3.1 GET `/api/ping`

Memeriksa koneksi dan status server.

**Response — 200 OK**
```json
{
  "pesan": "pong"
}
```

### 3.2 GET `/api/items`

Mengambil seluruh data item yang tersedia.

**Response — 200 OK**
```json
[
  {
    "id": 1,
    "name": "Buku"
  },
  {
    "id": 2,
    "name": "Pulpen"
  }
]
```

### 3.3 POST `/api/items`

Menambahkan item baru ke dalam daftar.

**Request Body**
```json
{
  "name": "Pensil"
}
```

**Response — 201 Created**
```json
{
  "id": 3,
  "name": "Pensil"
}
```

**Response — 400 Bad Request**

Dikembalikan apabila `name` tidak diisi.

```json
{
  "error": "name wajib diisi"
}
```

## 4. Catatan

- Semua request dan response menggunakan format JSON.
- Endpoint POST `/api/items` membutuhkan properti `name` pada request body.
- Data item disimpan sementara dalam array di memori.
- Data akan kembali ke kondisi awal ketika server dihentikan atau dijalankan ulang.
- Server berjalan pada port `3000`.

