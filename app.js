
// =============================================================
// LAB 2 - app.js
// DOM + EVENT + ASYNC/AWAIT
// =============================================================

// Mengambil elemen HTML
const tbody = document.querySelector('#tabel-body');
const form = document.querySelector('#form-mahasiswa');
const inputCari = document.querySelector('#cari');
const pesan = document.querySelector('#pesan');

let semuaData = [];

// =============================================================
// LANGKAH 3A: MENGAMBIL DATA DARI API
// =============================================================
async function muatData() {
  try {
    const daftar = await ambilMahasiswa();

    semuaData = buatRekap(daftar);

    tampilkan();

  } catch (err) {
    tampilkanPesan(
      `Gagal memuat data: ${err.message}`,
      'error'
    );
  }
}

// Menampilkan data
function tampilkan() {
  const hasilCari = cariMahasiswa(
    semuaData,
    inputCari.value
  );

  renderTabel(hasilCari);
  renderStatistik(semuaData);
}

// =============================================================
// LANGKAH 3B: MENAMPILKAN DATA KE TABEL
// =============================================================
function renderTabel(data) {
  tbody.replaceChildren();

  for (const m of data) {

    // Membuat baris tabel
    const tr = document.createElement('tr');

    // Memberikan class lulus atau tidak-lulus
    tr.classList.add(
      m.lulus ? 'lulus' : 'tidak-lulus'
    );

    // Membuat kolom data mahasiswa
    const nilai = [
      m.nim,
      m.nama,
      m.tugas,
      m.uts,
      m.uas,
      m.nilaiAkhir,
      m.grade
    ];

    // Memasukkan data ke dalam kolom
    for (const item of nilai) {
      const td = document.createElement('td');

      td.textContent = item;

      tr.appendChild(td);
    }

    // Tombol hapus
    const tdAksi = document.createElement('td');

    const tombol = document.createElement('button');

    tombol.classList.add('btn-hapus');
    tombol.dataset.nim = m.nim;
    tombol.textContent = 'Hapus';

    tdAksi.appendChild(tombol);
    tr.appendChild(tdAksi);

    // Memasukkan baris ke tabel
    tbody.appendChild(tr);
  }

  // Jika data kosong
  if (data.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');

    td.colSpan = 8;
    td.textContent = 'Tidak ada data';

    tr.appendChild(td);
    tbody.appendChild(tr);
  }
}

// =============================================================
// LANGKAH 4: STATISTIK
// =============================================================
function renderStatistik(data) {

  // Jumlah mahasiswa
  document.querySelector('#stat-jumlah').textContent =
    data.length;

  // Jumlah mahasiswa lulus
  const jumlahLulus = data.filter(
    (m) => m.lulus
  ).length;

  document.querySelector('#stat-lulus').textContent =
    `${jumlahLulus}/${data.length}`;

  // Rata-rata nilai
  document.querySelector('#stat-rata').textContent =
    hitungRataRata(data);

  // Nilai tertinggi
  const tertinggi = cariTertinggi(data);

  document.querySelector('#stat-tertinggi').textContent =
    tertinggi
      ? `${tertinggi.nama} (${tertinggi.nilaiAkhir})`
      : '-';

  // Distribusi grade
  const distribusi = hitungDistribusiGrade(data);

  document.querySelector('#stat-distribusi').textContent =
    Object.entries(distribusi)
      .map(([grade, jumlah]) => `${grade}: ${jumlah}`)
      .join(' · ');
}

// =============================================================
// MENAMPILKAN PESAN
// =============================================================
function tampilkanPesan(teks, jenis) {
  pesan.textContent = teks;
  pesan.className = jenis;
}

// =============================================================
// LANGKAH 5: PENCARIAN MAHASISWA
// =============================================================
inputCari.addEventListener('input', () => {
  tampilkan();
});

// =============================================================
// LANGKAH 6: TAMBAH MAHASISWA
// =============================================================
form.addEventListener('submit', async (event) => {

  event.preventDefault();

  const f = new FormData(form);

  const baru = {
    nim: f.get('nim').trim(),
    nama: f.get('nama').trim(),

    tugas: f.get('tugas') === ''
      ? NaN
      : Number(f.get('tugas')),

    uts: f.get('uts') === ''
      ? NaN
      : Number(f.get('uts')),

    uas: f.get('uas') === ''
      ? NaN
      : Number(f.get('uas'))
  };

  // Validasi mahasiswa
  const errors = validasiMahasiswa(baru);

  if (errors.length > 0) {
    tampilkanPesan(
      errors.join(', '),
      'error'
    );

    return;
  }

  // Menyimpan mahasiswa ke API
  try {

    const hasil = await tambahMahasiswa(baru);

    const [r] = buatRekap([hasil]);

    tampilkanPesan(
      `${r.nama} tersimpan: nilai ${r.nilaiAkhir} (${r.grade})`,
      'sukses'
    );

    // Mengosongkan form
    form.reset();

    // Memuat ulang data
    await muatData();

  } catch (err) {

    tampilkanPesan(
      `Gagal menyimpan: ${err.message}`,
      'error'
    );

  }
});

// =============================================================
// LANGKAH 7: HAPUS MAHASISWA
// EVENT DELEGATION
// =============================================================
tbody.addEventListener('click', async (event) => {

  // Mencari tombol hapus
  const tombol = event.target.closest('.btn-hapus');

  if (!tombol) return;

  // Mengambil NIM
  const nim = tombol.dataset.nim;

  // Konfirmasi hapus
  if (!confirm(`Yakin ingin menghapus mahasiswa ${nim}?`)) {
    return;
  }

  try {

    // Menghapus mahasiswa melalui API
    const teks = await hapusMahasiswa(nim);

    tampilkanPesan(teks, 'sukses');

    // Memuat ulang data
    await muatData();

  } catch (err) {

    tampilkanPesan(
      `Gagal menghapus: ${err.message}`,
      'error'
    );

  }
});

// =============================================================
// MULAI PROGRAM
// =============================================================
muatData();
