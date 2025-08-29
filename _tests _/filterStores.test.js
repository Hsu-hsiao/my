/*篩選時段*/
const { filterStores } = require("../filterStores");

const mockStores = [
  {
    name: "阿村牛肉湯",
    opening_hours: {
      mon: ["06:00-12:00", "18:00-22:00"],
      tue: ["00:00-24:00"],
    },
  },
  {
    name: "文章牛肉湯",
    opening_hours: {
      mon: ["22:00-02:00"], // 跨夜
      tue: [],
    },
  },
  {
    name: "永記牛肉湯",
    opening_hours: {
      mon: [],
      tue: [],
    },
  }
];

describe("filterStores", () => {
  test("關鍵字過濾：只顯示包含 '阿村' 的店", () => {
    const result = filterStores(mockStores, "阿村", ["mon"], "All");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("阿村牛肉湯");
  });

  test("24小時過濾：只顯示有 '00:00-24:00'", () => {
    const result = filterStores(mockStores, "", ["tue"], "24hr");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("阿村牛肉湯");
  });

  test("時間區間過濾：06:00~12:00", () => {
    const result = filterStores(mockStores, "", ["mon"], "06-12");
    expect(result.map(s => s.name)).toContain("阿村牛肉湯");
    expect(result.map(s => s.name)).not.toContain("文章牛肉湯");
  });

  test("時間區間過濾：00:00~06:00（應含跨夜）", () => {
    const result = filterStores(mockStores, "", ["mon"], "00-06");
    expect(result.map(s => s.name)).toContain("文章牛肉湯");
  });

  test("無符合資料應回傳空陣列", () => {
    const result = filterStores(mockStores, "找不到", ["mon"], "All");
    expect(result).toEqual([]);
  });
});
