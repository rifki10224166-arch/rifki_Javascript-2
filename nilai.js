
// =============================================================
// LAB 2 - nilai.js
// LOGIKA PERHITUNGAN NILAI MAHASISWA
// =============================================================

// TUGAS 1: Menghitung nilai akhir
function hitungNilaiAkhir(tugas, uts, uas) {
  const nilai = (0.3 * tugas) + (0.3 * uts) + (0.4 * uas);
  return Math.round(nilai * 10) / 10;
}

// TUGAS 2: Menentukan grade
function tentukanGrade(nilai) {
  if (nilai >= 85) return 'A';
  if (nilai >= 70) return 'B';
  if (nilai >= 55) return 'C';
  if (nilai >= 40) return 'D';
  return 'E';
}

// TUGAS 3: Membuat rekap mahasiswa
function buatRekap(daftar) {
  return daftar.map((m) => {
    const nilaiAkhir = hitungNilaiAkhir(
      m.tugas,
      m.uts,
      m.uas
    );

    const grade = tentukanGrade(nilaiAkhir);
    const lulus = nilaiAkhir >= 55;

    return {
      ...m,
      nilaiAkhir,
      grade,
      lulus
    };
  });
}

// TUGAS 4: Menghitung rata-rata
function hitungRataRata(rekap) {
  if (rekap.length === 0) return 0;

  const total = rekap.reduce(
    (acc, m) => acc + m.nilaiAkhir,
    0
  );

  return Math.round((total / rekap.length) * 10) / 10;
}

// TUGAS 5: Mencari mahasiswa dengan nilai tertinggi
function cariTertinggi(rekap) {
  if (rekap.length === 0) return null;

  return rekap.reduce((terbaik, m) =>
    m.nilaiAkhir > terbaik.nilaiAkhir ? m : terbaik
  );
}

// TUGAS 6: Menghitung distribusi grade
function hitungDistribusiGrade(rekap) {
  const distribusi = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0
  };

  for (const m of rekap) {
    distribusi[m.grade]++;
  }

  return distribusi;
}

// TUGAS 7: Mencari mahasiswa berdasarkan nama
function cariMahasiswa(rekap, kataKunci) {
  const keyword = kataKunci.trim().toLowerCase();

  return rekap.filter((m) =>
    m.nama.toLowerCase().includes(keyword)
  );
}

// =============================================================
// VALIDASI INPUT MAHASISWA
// =============================================================
function validasiMahasiswa(input) {
  const errors = [];

  if (
    typeof input.nim !== 'string' ||
    !/^\d{7}$/.test(input.nim)
  ) {
    errors.push('NIM harus 7 digit angka');
  }

  if (
    typeof input.nama !== 'string' ||
    input.nama.trim().length < 3
  ) {
    errors.push('Nama minimal 3 karakter');
  }

  for (const kolom of ['tugas', 'uts', 'uas']) {
    const n = input[kolom];

    if (
      typeof n !== 'number' ||
      !Number.isFinite(n) ||
      n < 0 ||
      n > 100
    ) {
      errors.push(`Nilai ${kolom} harus angka 0-100`);
    }
  }

  return errors;
}
