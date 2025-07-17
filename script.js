function getOpeningStatusForCurrentView(opening_hours, dayIndex) {
  const dayKeys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const key = dayKeys[Number(dayIndex)];
  const slots = opening_hours?.[key];

  // 沒有時間資料時，回傳公休
  if (!Array.isArray(slots) || slots.length === 0) {
    return {
      open: false,
      label: "❌ 公休",
      timeText: "無營業時段"
    };
  }

  const now = new Date();
  const nowDecimal = now.getHours() + now.getMinutes() / 60;

  const isOpen = slots.some(range => {
    const [startStr, endStr] = range.split("-");
    const [sh, sm] = startStr.split(":").map(Number);
    const [eh, em] = endStr.split(":").map(Number);
    const start = sh + sm / 60;
    const end = eh + em / 60;

    // 跨日情況（例如 22:00-02:00）
    if (end < start) {
      return nowDecimal >= start || nowDecimal <= end;
    } else {
      return nowDecimal >= start && nowDecimal <= end;
    }
  });

  return {
    open: isOpen,
    label: isOpen ? "✅ 目前營業中" : "❌ 現在休息中",
    timeText: slots.join(" / ")
  };
}

module.exports = { getOpeningStatusForCurrentView };
