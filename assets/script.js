document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("navbar-toggle");
  const menu = document.getElementById("navbar-menu");

  toggle.addEventListener("click", () => {
    menu.classList.toggle("show");
  });
});

document.getElementById('toggle-dark').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("scanner-form");
  const input = document.getElementById("symbol-input");
  const resultDiv = document.getElementById("signal-result");

  const TAAPI_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbHVlIjoiNjg2Y2Y2OWY4MDZmZjE2NTFlMjhiMGVmIiwiaWF0IjoxNzUyMDAwMzM3LCJleHAiOjMzMjU2NDY0MzM3fQ.h3k1aNwBiVSED1ccLNvA4np6fl7ymNplf0JjI_-VkWU"; // Ganti dengan API key milikmu dari taapi.io

  // Mapping symbol user ke ID CoinGecko
  const coinIdMap = {
    btc: "bitcoin",
    eth: "ethereum",
    wld: "worldcoin",
    bonk: "bonk",
    sol: "solana",
    ada: "cardano",
    doge: "dogecoin",
    avax: "avalanche-2"
    // Tambahkan coin lainnya di sini
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const coinInput = input.value.trim().toLowerCase();
    const coinId = coinIdMap[coinInput];

    if (!coinId) {
      resultDiv.innerHTML = `<p class="bad">❌ Coin <strong>${coinInput.toUpperCase()}</strong> belum tersedia di sistem.</p>`;
      return;
    }

    resultDiv.innerHTML = "🔄 Mengambil data...";

    try {
      // Ambil harga dari CoinGecko
      const cgRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
      const cgData = await cgRes.json();
      const price = cgData[coinId]?.usd;

      if (!price) throw new Error("Coin tidak ditemukan di CoinGecko");

      // Ambil RSI dari TAAPI.io
      const symbol = `${coinInput.toUpperCase()}/USDT`;
      const taapiRes = await fetch(`https://api.taapi.io/rsi?secret=${TAAPI_KEY}&exchange=binance&symbol=${symbol}&interval=1h`);
      const taapiData = await taapiRes.json();

      if (taapiData.error || taapiData.message) throw new Error("Symbol tidak dikenali TAAPI.io");

      const rsi = taapiData.value;

      // Simulasi Unlock Token (sementara)
      const unlockToday = Math.random() > 0.5;

      // Analisis visual
      const rsiColor = rsi < 30 ? "green" : rsi > 70 ? "red" : "orange";
      const recommendation =
        rsi < 30 && !unlockToday
          ? "✅ Entry Ringan (RSI rendah & tidak ada unlock)"
          : rsi > 70
          ? "❌ Hindari Entry (RSI tinggi)"
          : "⚠️ Netral / Tunggu Konfirmasi";

      const scoreClass = rsi < 30 && !unlockToday ? "good" : rsi > 70 ? "bad" : "";

      resultDiv.innerHTML = `
        <div class="scalp-card">
          <h3>📊 ${coinInput.toUpperCase()} / USDT</h3>
          <p>💰 <strong>$${price}</strong></p>

          <div class="indicator">
            <span>📉 RSI:</span>
            <div class="rsi-bar">
              <div style="width: ${Math.min(rsi, 100)}%; background: ${rsiColor};"></div>
            </div>
            <span>${rsi.toFixed(1)}</span>
          </div>

          <p>🔓 Unlock Today: ${unlockToday ? "<span class='bad'>Yes</span>" : "<span class='good'>No</span>"}</p>

          <div class="result ${scoreClass}">${recommendation}</div>
        </div>
      `;
    } catch (err) {
      resultDiv.innerHTML = `<p class="bad">❌ Error: ${err.message}</p>`;
    }
  });
});

const searchInput = document.getElementById('search');
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  document.querySelectorAll('section').forEach(section => {
    const links = section.querySelectorAll('a');
    let visible = false;
    links.forEach(link => {
      const text = link.textContent.toLowerCase();
      const desc = link.dataset.desc.toLowerCase();
      const match = text.includes(query) || desc.includes(query);
      link.style.display = match ? 'inline-block' : 'none';
      if (match) visible = true;
    });
    section.style.display = visible ? 'block' : 'none';
  });
});

// fungsi di mobile
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js")
    .then(reg => console.log("✅ Service Worker registered"))
    .catch(err => console.error("❌ SW failed:", err));
}