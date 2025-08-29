function filterStores(stores, keyword, targetKeys, selectedTime) {
  return stores.filter(store => {
    if (keyword && !store.name.toLowerCase().includes(keyword)) return false;

    const allHours = targetKeys.map(day => store.opening_hours?.[day] || []).flat();
    if (allHours.length === 0) return false;

    if (selectedTime === "All") return true;

    if (selectedTime === "24hr") {
      return allHours.some(h => h.trim() === "00:00-24:00");
    }

    let [selStart, selEnd] = selectedTime.split("-").map(Number);
    if (selEnd <= selStart) selEnd += 24;

    return allHours.some(range => {
      if (typeof range !== "string" || !range.includes("-")) return false;

      const [startStr, endStr] = range.split("-");
      const [sHour, sMin] = startStr.split(":").map(Number);
      const [eHour, eMin] = endStr.split(":").map(Number);
      let start = sHour + (sMin || 0) / 60;
      let end = eHour + (eMin || 0) / 60;

      if (end <= start) end += 24;

      return (start < selEnd && end > selStart) ||
         (start < selEnd + 24 && end > selStart + 24);
    });
  });
}

module.exports = { filterStores };
