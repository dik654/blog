import { expect, test } from "@playwright/test";

const base = process.env.QA_BASE_URL ?? "http://127.0.0.1:4175";
const slug = "robot-system-verification-validation-qualification";
const viewports = [
  { name: "mobile-360", width: 360, height: 800 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 900 },
  { name: "desktop", width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`${slug} ${viewport.name} keeps formulas and system labs readable`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.setViewportSize(viewport);
    await page.goto(`${base}/lab/blog/ai/${slug}`, {
      waitUntil: "networkidle",
    });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(220);
    await expect(
      page.getByRole("heading", {
        name: "Robot System Verification & Qualification: 요구사항에서 Release Evidence까지",
      }),
    ).toBeVisible();

    const audit = await page.evaluate(() => {
      const formulas = Array.from(
        document.querySelectorAll<HTMLElement>("[data-math-fit]"),
      );
      const notes = Array.from(
        document.querySelectorAll<HTMLElement>("[data-formula-note]"),
      );
      const labs = Array.from(
        document.querySelectorAll<HTMLElement>(
          "figure.foundation-viz-explorer",
        ),
      );
      const viewportWidth = document.documentElement.clientWidth;
      const materialOverflow = Array.from(
        document.querySelectorAll<HTMLElement>("article *"),
      ).flatMap((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        const hidden =
          rect.width < 3 ||
          rect.height < 3 ||
          style.display === "none" ||
          style.visibility === "hidden";
        const intentional = Boolean(
          element.closest(".katex, svg, [data-math-fit]"),
        );
        return !intentional &&
          !hidden &&
          (rect.left < -2 || rect.right > viewportWidth + 2)
          ? [
              {
                tag: element.tagName,
                text: (element.textContent ?? "").trim().slice(0, 100),
                left: rect.left,
                right: rect.right,
              },
            ]
          : [];
      });
      const innerScroll = Array.from(
        document.querySelectorAll<HTMLElement>(".foundation-viz-explorer *"),
      ).flatMap((element) => {
        const style = getComputedStyle(element);
        return /(auto|scroll)/.test(style.overflowX + style.overflowY)
          ? [{ tag: element.tagName, className: element.className.toString() }]
          : [];
      });
      const formulaOverflow = formulas.flatMap((formula) => {
        const rendered = formula.firstElementChild as HTMLElement | null;
        if (!rendered) return [];
        const dx = rendered.getBoundingClientRect().width - formula.clientWidth;
        return dx > 2
          ? [{ source: formula.dataset.mathSource?.slice(0, 140), dx }]
          : [];
      });
      const annotationFailures = formulas.flatMap((formula) => {
        const value = formula.textContent ?? "";
        return !/[가-힣]/.test(value) ||
          formula.dataset.mathAnnotationMissing === "true"
          ? [
              {
                source: formula.dataset.mathSource?.slice(0, 120),
                text: value.slice(0, 120),
              },
            ]
          : [];
      });
      const englishOnlyLabels = formulas.flatMap((formula) => {
        const source = formula.dataset.mathSource ?? "";
        const labels = Array.from(
          source.matchAll(/\\text\{([^}]*)\}/g),
          (match) => match[1],
        );
        return labels
          .filter((label) => !/[가-힣]/.test(label))
          .map((label) => ({ source: source.slice(0, 120), label }));
      });
      const visible = document.querySelector("article")?.cloneNode(true) as
        HTMLElement | undefined;
      visible
        ?.querySelectorAll(".katex-mathml")
        .forEach((node) => node.remove());
      const rawLatex =
        (visible?.textContent ?? "").match(
          /\\(?:theta|omega|tau|Delta|partial|underbrace|frac|lambda|varphi|mathrm|approx|sigma|sqrt|mathbf|boldsymbol)\b/g,
        ) ?? [];
      const scales = formulas.map((formula) =>
        Number(formula.dataset.mathScale ?? 1),
      );
      const svgTextSizes = labs.flatMap((lab) =>
        Array.from(lab.querySelectorAll<SVGTextElement>("svg text")).map(
          (text) => {
            const rect = text.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0
              ? Number.parseFloat(getComputedStyle(text).fontSize)
              : Number.POSITIVE_INFINITY;
          },
        ),
      );
      return {
        formulaCount: formulas.length,
        noteCount: notes.length,
        labCount: labs.length,
        materialOverflow,
        innerScroll,
        formulaOverflow,
        annotationFailures,
        englishOnlyLabels,
        rawLatex,
        minScale: Math.min(...scales),
        minSvgText: Math.min(...svgTextSizes),
        documentOverflow:
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      };
    });

    expect(audit.formulaCount).toBe(24);
    expect(audit.noteCount).toBe(24);
    expect(audit.labCount).toBe(12);
    expect(audit.materialOverflow).toEqual([]);
    expect(audit.innerScroll).toEqual([]);
    expect(audit.formulaOverflow).toEqual([]);
    expect(audit.annotationFailures).toEqual([]);
    expect(audit.englishOnlyLabels).toEqual([]);
    expect(audit.rawLatex).toEqual([]);
    expect(audit.documentOverflow).toBeLessThanOrEqual(1);
    expect(audit.minScale).toBeGreaterThanOrEqual(
      viewport.width <= 390 ? 0.78 : 0.9,
    );
    expect(audit.minSvgText).toBeGreaterThanOrEqual(
      viewport.width <= 390 ? 11 : 14,
    );
    expect(errors).toEqual([]);
  });
}

test("all twelve qualification labs expose a causal state change", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${base}/lab/blog/ai/${slug}`, { waitUntil: "networkidle" });
  const labs = page
    .locator("figure.foundation-viz-explorer")
    .filter({ hasText: "SYSTEM LAB" });
  await expect(labs).toHaveCount(12);
  for (let index = 0; index < 12; index += 1) {
    const lab = labs.nth(index);
    const before = await lab.innerText();
    const range = lab.locator('input[type="range"]').first();
    await range.focus();
    await range.press("ArrowRight");
    await expect.poll(async () => lab.innerText()).not.toBe(before);
  }
});

test("robotics listing shows the concept but keeps source reconstructions opt-in", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/lab/blog/ai?sub=ai-robotics-mechanics-qualification`, {
    waitUntil: "networkidle",
  });
  const concept = page.locator(`a[href="/lab/blog/ai/${slug}"]`).first();
  await expect(concept).toBeVisible();
  expect(
    await concept.evaluate((element) => element.closest("details") === null),
  ).toBe(true);
  const sources = page
    .locator("details")
    .filter({ hasText: "선택 원문 근거" })
    .first();
  await expect(sources.locator("summary")).toBeVisible();
  await expect(sources).not.toHaveAttribute("open", "");
  await expect(sources.locator("a").first()).toBeHidden();
});

test("surface evidence links upward into the system release case", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(
    `${base}/lab/blog/ai/robot-contact-tribology-lubrication-wear`,
    { waitUntil: "networkidle" },
  );
  await expect(
    page.locator(`a[href="/lab/blog/ai/${slug}"]`).first(),
  ).toBeVisible();
  await page.goto(`${base}/lab/blog/ai/${slug}`, { waitUntil: "networkidle" });
  await expect(
    page
      .locator(
        'a[href="/lab/blog/ai/robot-contact-tribology-lubrication-wear"]',
      )
      .first(),
  ).toBeVisible();
});
