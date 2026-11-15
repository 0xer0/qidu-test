#!/usr/bin/env python3
"""端到端：出题人 20 题 -> 生成邀请链接 -> 朋友 20 题 -> 结果 -> 出题人打开结果链接复核。"""
import asyncio, random, sys, pathlib, json
from playwright.async_api import async_playwright

BASE = "http://127.0.0.1:8765/index.html"
OUT = pathlib.Path(__file__).parent / "shots"
OUT.mkdir(exist_ok=True)
random.seed(7)
ERRORS = []


async def answer_all(page, n, tag):
    picks = []
    for i in range(n):
        await page.wait_for_selector(".opt", timeout=8000)
        opts = await page.query_selector_all(".opt")
        assert len(opts) == 4, f"{tag} 第{i+1}题选项数 {len(opts)}"
        k = random.randrange(4)
        picks.append(k)
        await opts[k].click()
        await page.wait_for_timeout(340)
    return picks


async def main():
    async with async_playwright() as pw:
        b = await pw.chromium.launch()

        def hook(page, tag):
            page.on("console", lambda m: m.type == "error" and ERRORS.append(f"[{tag}] console: {m.text}"))
            page.on("pageerror", lambda e: ERRORS.append(f"[{tag}] pageerror: {e}"))

        ctx = await b.new_context(viewport={"width": 390, "height": 844},
                                  device_scale_factor=2, locale="zh-CN")
        page = await ctx.new_page()
        hook(page, "host")
        await page.goto(BASE, wait_until="load")
        await page.wait_for_timeout(400)
        await page.screenshot(path=str(OUT / "1-home.png"))

        # 出题人：选好友局
        await page.click('[data-deck="friends"]')
        await page.wait_for_timeout(260)
        await page.fill("#nickin", "阿汤")
        await page.screenshot(path=str(OUT / "2-nick.png"))
        await page.click('[data-act="starthost"]')
        await page.wait_for_timeout(300)
        await page.screenshot(path=str(OUT / "3-question1.png"))
        a_picks = await answer_all(page, 20, "host")

        assert await page.is_visible('[data-act="copy"]'), "未进入分享页"
        link = await page.inner_text("#linktext")
        await page.wait_for_timeout(500)
        qr_ok = await page.evaluate("() => { const c=document.querySelector('#qrc'); return !!(c && c.width>20); }")
        await page.screenshot(path=str(OUT / "4-share.png"))
        print(f"[host ] 邀请链接长度 {len(link)} 字符, 二维码渲染 {qr_ok}")
        print(f"[host ] 答案 {a_picks}")

        # 朋友：新浏览器上下文（模拟另一台手机）
        c2 = await b.new_context(viewport={"width": 390, "height": 844},
                                 device_scale_factor=2, locale="zh-CN")
        p2 = await c2.new_page()
        hook(p2, "guest")
        await p2.goto(link, wait_until="load")
        await p2.wait_for_timeout(400)
        await p2.screenshot(path=str(OUT / "5-invite.png"))
        assert await p2.is_visible('[data-act="startguest"]'), "被邀请页未渲染"
        nick_shown = await p2.inner_text("h2")
        assert "阿汤" in nick_shown, f"邀请人昵称丢失: {nick_shown}"
        await p2.fill("#nickin", "小李")
        await p2.click('[data-act="startguest"]')
        await p2.wait_for_timeout(300)
        b_picks = await answer_all(p2, 20, "guest")

        await p2.wait_for_selector("#fgring", timeout=8000)
        await p2.wait_for_timeout(1500)
        score = await p2.inner_text("#scorenum")
        tier = await p2.inner_text(".tier b")
        result_link = await p2.evaluate("() => S.resultLink")
        await p2.screenshot(path=str(OUT / "6-result.png"), full_page=False)
        await p2.screenshot(path=str(OUT / "6-result-full.png"), full_page=True)
        print(f"[guest] 答案 {b_picks}")
        print(f"[guest] 默契度 {score} / 等级 {tier} / 结果链接 {len(result_link)} 字符")

        # 保存海报
        async with p2.expect_download(timeout=15000) as dl:
            await p2.click('[data-act="poster"]')
        d = await dl.value
        poster = OUT / "poster.png"
        await d.save_as(str(poster))
        print(f"[poster] {d.suggested_filename} -> {poster.stat().st_size//1024} KB")

        # 出题人打开结果链接
        p3 = await ctx.new_page()
        hook(p3, "viewer")
        await p3.goto(result_link, wait_until="load")
        await p3.wait_for_timeout(1500)
        score2 = await p3.inner_text("#scorenum")
        tier2 = await p3.inner_text(".tier b")
        print(f"[viewr] 复核 {score2} / {tier2}")
        assert score2 == score, f"两端分数不一致 {score} vs {score2}"
        await p3.screenshot(path=str(OUT / "7-viewer.png"))

        # 桌面宽屏 + 情侣局抽查
        c3 = await b.new_context(viewport={"width": 1280, "height": 900})
        p4 = await c3.new_page()
        hook(p4, "desktop")
        await p4.goto(BASE, wait_until="load")
        await p4.click('[data-deck="lovers"]')
        await p4.wait_for_timeout(200)
        await p4.fill("#nickin", "小满")
        await p4.click('[data-act="starthost"]')
        await p4.wait_for_timeout(300)
        await p4.screenshot(path=str(OUT / "8-desktop-quiz.png"))
        t = await p4.inner_text("#qtitle")
        assert len(t) > 4, "桌面端题干为空"

        await b.close()

    print("\n控制台错误:", ERRORS or "无")
    if ERRORS:
        sys.exit(1)
    print("E2E 全部通过 ✅")

asyncio.run(main())
