import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { chromium } from 'playwright';

const baseUrl = (process.env.QA_BASE_URL ?? 'http://127.0.0.1:4173').replace(/\/$/, '');
const reportPath = process.env.QA_REPORT_PATH
  ?? '.codex-tmp/ai-information-architecture-qa.json';

const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
];

const categoryContracts = [
  {
    id: 'robot-entry',
    subcategory: 'ai-robotics',
    expected: { research: 1, branches: 1, sequences: 0, directory: 0, sources: 1 },
  },
  {
    id: 'robot-child',
    subcategory: 'ai-robotics-perception-state',
    expected: { research: 0, branches: 0, sequences: 1, directory: 0, sources: 1 },
  },
  {
    id: 'llm-entry',
    subcategory: 'ai-llm',
    expected: { research: 0, branches: 1, sequences: 0, directory: 0, sources: 0 },
  },
  {
    id: 'llm-model-building',
    subcategory: 'ai-llm-model-building',
    expected: { research: 0, branches: 1, sequences: 0, directory: 0, sources: 0 },
  },
  {
    id: 'llm-architectures',
    subcategory: 'ai-llm-architectures',
    expected: { research: 1, branches: 1, sequences: 0, directory: 0, sources: 0 },
  },
  {
    id: 'llm-architecture-overview-expanded-path',
    subcategory: 'ai-llm-architectures-overview',
    expected: { research: 0, branches: 0, sequences: 1, directory: 0, sources: 0 },
  },
  {
    id: 'llm-post-training-expanded-path',
    subcategory: 'ai-llm-post-training-current',
    expected: { research: 0, branches: 0, sequences: 1, directory: 0, sources: 0 },
  },
  {
    id: 'practical-pipeline-expanded-path',
    subcategory: 'ai-practical-pipeline',
    expected: { research: 0, branches: 0, sequences: 1, directory: 0, sources: 0 },
  },
  {
    id: 'generative-no-children-track',
    subcategory: 'ai-generative',
    expected: { research: 1, branches: 0, sequences: 0, directory: 1, sources: 0 },
  },
];

function categoryUrl(subcategory) {
  return `${baseUrl}/lab/blog/ai?sub=${encodeURIComponent(subcategory)}`;
}

async function hasHorizontalOverflow(page) {
  return page.evaluate(() => (
    document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
  ));
}

async function readCategoryContract(page, contract) {
  await page.goto(categoryUrl(contract.subcategory), {
    waitUntil: 'domcontentloaded',
    timeout: 30_000,
  });
  await page.locator('h1').first().waitFor({ timeout: 30_000 });

  const actual = {
    research: await page.locator('[data-topdown-research-route]').count(),
    branches: await page.locator('[data-subcategory-branches]').count(),
    sequences: await page.locator('[data-authored-article-sequences]').count(),
    directory: await page.locator('[data-learning-path-directory]').count(),
    sources: await page.locator('[data-source-article-disclosure]').count(),
  };
  const articleCardSlugs = await page.locator('[data-article-card]').evaluateAll((nodes) => (
    nodes.map((node) => node.getAttribute('data-article-card')).filter(Boolean)
  ));
  const duplicateArticleCards = [
    ...new Set(articleCardSlugs.filter((slug, index) => articleCardSlugs.indexOf(slug) !== index)),
  ];

  return {
    id: contract.id,
    subcategory: contract.subcategory,
    expected: contract.expected,
    actual,
    duplicateArticleCards,
    overflow: await hasHorizontalOverflow(page),
  };
}

async function readMapContract(page) {
  await page.goto(`${baseUrl}/lab/blog/map`, {
    waitUntil: 'domcontentloaded',
    timeout: 30_000,
  });
  await page.locator('[data-research-track-card]').first().waitFor({ timeout: 30_000 });
  const ids = await page.locator('[data-research-track-card]').evaluateAll((nodes) => (
    nodes.map((node) => node.getAttribute('data-research-track-card')).filter(Boolean)
  ));

  return {
    count: ids.length,
    unique: new Set(ids).size,
    duplicateIds: [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))],
    overflow: await hasHorizontalOverflow(page),
  };
}

async function readResearchReturnContract(page) {
  await page.goto(categoryUrl('ai-robotics'), {
    waitUntil: 'domcontentloaded',
    timeout: 30_000,
  });
  const route = page.locator('[data-topdown-research-route="robot-ai"]');
  await route.waitFor({ timeout: 30_000 });
  const dependency = route.locator(
    'a[href="/lab/blog/ai/robot-ai-top-down?track=robot-ai"]',
  );
  const dependencyHref = await dependency.getAttribute('href');

  await dependency.click();
  await page.waitForURL(/\/robot-ai-top-down\?track=robot-ai$/, { timeout: 30_000 });
  await page.locator('[data-article-slug="robot-ai-top-down"]').waitFor({ timeout: 30_000 });
  const context = page.locator('[data-research-track-context="robot-ai"]');
  await context.waitFor({ timeout: 30_000 });

  return {
    dependencyHref,
    url: page.url(),
    contextCount: await context.count(),
    returnHref: await context.locator('a').getAttribute('href'),
    overflow: await hasHorizontalOverflow(page),
  };
}

async function readCrossCategoryResearchContract(page) {
  await page.goto(
    `${baseUrl}/lab/blog/gpu/gpu-hpc-from-scratch?track=llm-disaggregated-serving`,
    { waitUntil: 'domcontentloaded', timeout: 30_000 },
  );
  await page.locator('[data-article-slug="gpu-hpc-from-scratch"]').waitFor({ timeout: 30_000 });
  const context = page.locator('[data-research-track-context="llm-disaggregated-serving"]');
  await context.waitFor({ timeout: 30_000 });
  const positive = {
    contextCount: await context.count(),
    returnHref: await context.locator('a').getAttribute('href'),
  };

  await page.goto(
    `${baseUrl}/lab/blog/ai/perceptron?track=llm-disaggregated-serving`,
    { waitUntil: 'domcontentloaded', timeout: 30_000 },
  );
  await page.locator('[data-article-slug="perceptron"]').waitFor({ timeout: 30_000 });

  return {
    positive,
    unrelatedContextCount: await page.locator('[data-research-track-context]').count(),
    overflow: await hasHorizontalOverflow(page),
  };
}

function collectFailures(result) {
  const failures = [];
  if (result.map.count !== 20 || result.map.unique !== 20 || result.map.duplicateIds.length) {
    failures.push(`${result.viewport}: research-track cards ${JSON.stringify(result.map)}`);
  }
  if (result.map.overflow) failures.push(`${result.viewport}: map horizontal overflow`);

  for (const contract of result.categories) {
    for (const [key, expected] of Object.entries(contract.expected)) {
      if (contract.actual[key] !== expected) {
        failures.push(
          `${result.viewport}: ${contract.id}.${key} expected ${expected}, got ${contract.actual[key]}`,
        );
      }
    }
    if (contract.duplicateArticleCards.length) {
      failures.push(
        `${result.viewport}: ${contract.id} duplicate article cards ${contract.duplicateArticleCards.join(', ')}`,
      );
    }
    if (contract.overflow) failures.push(`${result.viewport}: ${contract.id} horizontal overflow`);
  }

  const researchReturn = result.researchReturn;
  if (researchReturn.contextCount !== 1) {
    failures.push(`${result.viewport}: research return context count ${researchReturn.contextCount}`);
  }
  if (researchReturn.returnHref !== '/lab/blog/ai?sub=ai-robotics') {
    failures.push(`${result.viewport}: research return href ${researchReturn.returnHref}`);
  }
  if (researchReturn.overflow) failures.push(`${result.viewport}: research article horizontal overflow`);

  const crossCategory = result.crossCategory;
  if (crossCategory.positive.contextCount !== 1) {
    failures.push(
      `${result.viewport}: cross-category context count ${crossCategory.positive.contextCount}`,
    );
  }
  if (crossCategory.positive.returnHref !== '/lab/blog/ai?sub=ai-llm-serving') {
    failures.push(
      `${result.viewport}: cross-category return href ${crossCategory.positive.returnHref}`,
    );
  }
  if (crossCategory.unrelatedContextCount !== 0) {
    failures.push(
      `${result.viewport}: unrelated article context count ${crossCategory.unrelatedContextCount}`,
    );
  }
  if (crossCategory.overflow) failures.push(`${result.viewport}: cross-category horizontal overflow`);
  return failures;
}

const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport });
    const runtimeErrors = [];
    page.on('pageerror', (error) => runtimeErrors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') runtimeErrors.push(message.text());
    });

    const map = await readMapContract(page);
    const categories = [];
    for (const contract of categoryContracts) {
      categories.push(await readCategoryContract(page, contract));
    }
    const researchReturn = await readResearchReturnContract(page);
    const crossCategory = await readCrossCategoryResearchContract(page);

    results.push({
      viewport: viewport.name,
      map,
      categories,
      researchReturn,
      crossCategory,
      runtimeErrors,
    });
    await page.close();
  }
} finally {
  await browser.close();
}

const failures = results.flatMap((result) => [
  ...collectFailures(result),
  ...result.runtimeErrors.map((error) => `${result.viewport}: runtime error: ${error}`),
]);
const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  results,
  failures,
};

await fs.mkdir(path.dirname(reportPath), { recursive: true });
await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  reportPath,
  viewports: results.length,
  failures: failures.length,
}, null, 2));

if (failures.length) {
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
}
