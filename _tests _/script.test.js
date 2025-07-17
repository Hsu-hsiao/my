const { getOpeningStatusForCurrentView } = require('../script');

describe('getOpeningStatusForCurrentView()', () => {
  const mockHours = {
    mon: ["08:00-12:00", "13:00-18:00"],//1
    tue: ["00:00-23:59"],//2
    wed: [], //3
    thu: ["22:00-02:00"], // 跨日
  };

  it('應回傳公休 (空陣列)', () => {
    const result = getOpeningStatusForCurrentView(mockHours, "3"); // wed
    expect(result.open).toBe(false);
    expect(result.label).toBe("❌ 公休");
    expect(result.timeText).toBe("無營業時段");
  });

  it('應正確判斷 24 小時營業為營業中', () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-07-15T12:00:00')); // Tue
    const result = getOpeningStatusForCurrentView(mockHours, "");
    expect(result.open).toBe(true);
    expect(result.label).toBe("✅ 目前營業中");
    jest.useRealTimers();
  });

  it('應正確判斷休息中 (尚未營業)', () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-07-14T07:00:00')); // Mon 07:00
    const result = getOpeningStatusForCurrentView(mockHours, "1");
    expect(result.open).toBe(false);
    expect(result.label).toBe("❌ 現在休息中");
    jest.useRealTimers();
  });

  it('應正確判斷營業中 (白天時段)', () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-07-14T10:00:00')); // Mon 10:00
    const result = getOpeningStatusForCurrentView(mockHours, "1");
    expect(result.open).toBe(true);
    expect(result.label).toBe("✅ 目前營業中");
    jest.useRealTimers();
  });

  it('應判斷跨日營業時間為營業中', () => {
    jest.useFakeTimers().setSystemTime(new Date('2025-07-18T01:00:00')); // Fri 01:00
    const result = getOpeningStatusForCurrentView(mockHours, "4"); // thu (22:00-02:00)
    expect(result.open).toBe(true);
    expect(result.label).toBe("✅ 目前營業中");
    jest.useRealTimers();
  });
});
