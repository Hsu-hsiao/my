/**
 * @jest-environment jsdom
 */
const { renderStores } = require("../renderstores");

describe("renderstores", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="store-list"></div>`;
  });

  it("顯示無結果文字", () => {
    renderStores([], "1");
    const html = document.getElementById("store-list").innerHTML;
    expect(html).toContain("找不到符合條件的店家");
  });

  it("正常渲染一家店家", () => {
    const stores = [{
      name: "阿湯牛肉湯",
      address: "台南市中西區",
      note: "推薦肉燥飯",
      mapEmbed: "<iframe></iframe>",
      opening_hours: {
        mon: ["00:00-23:59"]
      }
    }];

    renderStores(stores, "1"); // 星期一
    const html = document.getElementById("store-list").innerHTML;
    expect(html).toContain("阿湯牛肉湯");
    expect(html).toContain("✅");
    expect(html).toContain("⏰");
    expect(html).toContain("💬");
    expect(html).toContain("<iframe>");
  });

  it("營業中店家應排前面", () => {
    const stores = [
      {
        name: "A 公休牛肉湯",
        opening_hours: { mon: [] }
      },
      {
        name: "B 24小時牛肉湯",
        opening_hours: { mon: ["00:00-23:59"] }
      }
    ];

    renderStores(stores, "1");
    const html = document.getElementById("store-list").innerHTML;
    expect(html.indexOf("B 24小時牛肉湯")).toBeLessThan(html.indexOf("A 公休牛肉湯"));
  });
});
