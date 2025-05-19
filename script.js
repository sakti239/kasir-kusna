// script.js

let daftarNota = [];

const formBarang = document.getElementById("form-barang");
const namaBarang = document.getElementById("nama-barang");
const hargaBarang = document.getElementById("harga-barang");
const daftarNotaEl = document.getElementById("daftar-nota");
const totalHargaEl = document.getElementById("total-harga");
const simpanUtangBtn = document.getElementById("simpan-utang");
const daftarUtangEl = document.getElementById("daftar-utang");
const cariUtangInput = document.getElementById("cari-utang");
const cetakNotaBtn = document.getElementById("cetak-nota");

formBarang.addEventListener("submit", (e) => {
  e.preventDefault();
  const nama = namaBarang.value.trim();
  const harga = parseInt(hargaBarang.value);

  if (nama && !isNaN(harga)) {
    daftarNota.push({ nama, harga });
    renderNota();
    namaBarang.value = "";
    hargaBarang.value = "";
  }
});

function renderNota() {
  daftarNotaEl.innerHTML = "";
  let total = 0;
  daftarNota.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.nama} - Rp ${item.harga.toLocaleString()}</span>
      <button onclick="hapusItem(${index})">Hapus</button>
    `;
    daftarNotaEl.appendChild(li);
    total += item.harga;
  });
  totalHargaEl.textContent = total.toLocaleString();
}

function hapusItem(index) {
  daftarNota.splice(index, 1);
  renderNota();
}

simpanUtangBtn.addEventListener("click", () => {
  if (daftarNota.length === 0) return alert("Nota kosong!");
  const timestamp = new Date().toLocaleString();
  const total = daftarNota.reduce((sum, item) => sum + item.harga, 0);
  const utang = { id: Date.now(), waktu: timestamp, daftar: [...daftarNota], total };

  const utangTersimpan = JSON.parse(localStorage.getItem("utangKios") || "[]");
  utangTersimpan.push(utang);
  localStorage.setItem("utangKios", JSON.stringify(utangTersimpan));

  daftarNota = [];
  renderNota();
  tampilkanUtang();
});

function tampilkanUtang() {
  const dataUtang = JSON.parse(localStorage.getItem("utangKios") || "[]");
  const keyword = cariUtangInput.value.toLowerCase();
  daftarUtangEl.innerHTML = "";

  dataUtang
    .filter((item) =>
      item.daftar.some((b) => b.nama.toLowerCase().includes(keyword)) ||
      item.waktu.toLowerCase().includes(keyword)
    )
    .forEach((utang) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <div>
          <strong>${utang.waktu}</strong><br>
          ${utang.daftar.map(b => `- ${b.nama} (Rp ${b.harga.toLocaleString()})`).join("<br>")}
          <br><strong>Total: Rp ${utang.total.toLocaleString()}</strong>
        </div>
        <button onclick="hapusUtang(${utang.id})" style="background: var(--danger-color)">Hapus</button>
      `;
      daftarUtangEl.appendChild(li);
    });
}

function hapusUtang(id) {
  if (!confirm("Yakin ingin menghapus utang ini?")) return;
  const dataUtang = JSON.parse(localStorage.getItem("utangKios") || "[]");
  const baru = dataUtang.filter((item) => item.id !== id);
  localStorage.setItem("utangKios", JSON.stringify(baru));
  tampilkanUtang();
}

cariUtangInput.addEventListener("input", tampilkanUtang);
cetakNotaBtn.addEventListener("click", () => window.print());

window.addEventListener("load", tampilkanUtang);
