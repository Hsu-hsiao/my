const { getOpeningStatusForCurrentView } = require("./script"); // 引入你的判斷函數

function renderStores(filteredStores, selectedDay) {
  const storeList = document.getElementById('store-list');

  if (filteredStores.length === 0) {
    storeList.innerHTML = "<p class='no-result'>找不到符合條件的店家</p>";
    return;
  }

  // 依照營業中排序：true → -1, false → 1
  filteredStores.sort((a, b) => {
    const aOpen = getOpeningStatusForCurrentView(a.opening_hours, selectedDay).open ? -1 : 1;
    const bOpen = getOpeningStatusForCurrentView(b.opening_hours, selectedDay).open ? -1 : 1;
    return aOpen - bOpen;
  });

  storeList.innerHTML = filteredStores.map(store => {
    const { label, timeText } = getOpeningStatusForCurrentView(store.opening_hours, selectedDay);

    return `
      <div class="store-card">
        <h3>${store.name}</h3>
        <p>📍 ${store.address || "地址未提供"}<br>
           ⏰ 營業時段：${timeText}<br>
           ${label}<br>
           ${store.note ? `💬 備註：${store.note}` : ""}
        </p>
        <div class="map">${store.mapEmbed || ""}</div>
      </div>
    `;
  }).join('');
}

module.exports = { renderStores };

