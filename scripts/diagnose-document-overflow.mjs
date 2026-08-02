import { chromium } from 'playwright';

const base = process.env.BASE_URL ?? 'http://127.0.0.1:4181';
const routes = process.argv.slice(2);

if (routes.length === 0) {
  throw new Error('Pass one or more article routes.');
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 360, height: 900 } });

for (const route of routes) {
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const report = await page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const selectorFor = (element) => {
      const parts = [];
      let current = element;

      while (current && current !== document.body && parts.length < 5) {
        let part = current.tagName.toLowerCase();
        if (current.id) part += `#${current.id}`;
        const classes = Array.from(current.classList).slice(0, 3);
        if (classes.length > 0) part += `.${classes.join('.')}`;
        parts.unshift(part);
        current = current.parentElement;
      }

      return parts.join(' > ');
    };

    const offenders = Array.from(document.querySelectorAll('body *'))
      .filter((element) => element instanceof HTMLElement)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          selector: selectorFor(element),
          text: element.textContent?.replace(/\s+/g, ' ').trim().slice(0, 120) ?? '',
          left: Math.round(rect.left * 10) / 10,
          right: Math.round(rect.right * 10) / 10,
          width: Math.round(rect.width * 10) / 10,
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth,
          ownOverflow: element.scrollWidth - element.clientWidth,
          position: style.position,
          display: style.display,
          minWidth: style.minWidth,
          overflowX: style.overflowX,
        };
      })
      .filter((item) => (
        item.right > viewportWidth + 1
        || item.left < -1
        || item.ownOverflow > 1
      ))
      .sort((a, b) => {
        const aOutside = Math.max(0, a.right - viewportWidth, -a.left);
        const bOutside = Math.max(0, b.right - viewportWidth, -b.left);
        return bOutside - aOutside || b.ownOverflow - a.ownOverflow;
      })
      .slice(0, 40);

    return {
      viewportWidth,
      documentWidth: document.documentElement.scrollWidth,
      overflow: document.documentElement.scrollWidth - viewportWidth,
      offenders,
    };
  });

  console.log(JSON.stringify({ route, ...report }, null, 2));
}

await browser.close();
