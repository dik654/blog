import { expect, test } from '@playwright/test';

const base=process.env.QA_BASE_URL??'http://127.0.0.1:4175';
const articles=[
  {slug:'robot-composite-structures-joints-damage',formulas:24,notes:24,labs:12},
  {slug:'paper-tsai-strength-characteristics-composites-1965',formulas:6,notes:6,labs:2},
  {slug:'reference-nasa-composite-fracture-control-handbook-2024',formulas:6,notes:6,labs:2},
];
const viewports=[
  {name:'mobile-360',width:360,height:800},
  {name:'mobile-390',width:390,height:844},
  {name:'tablet',width:768,height:900},
  {name:'desktop',width:1440,height:900},
];

for(const article of articles){
  for(const viewport of viewports){
    test(`${article.slug} ${viewport.name} keeps composite formulas and labs readable`,async({page})=>{
      const errors:string[]=[];page.on('console',message=>{if(message.type()==='error')errors.push(message.text())});
      await page.setViewportSize(viewport);await page.goto(`${base}/lab/blog/ai/${article.slug}`,{waitUntil:'networkidle'});await expect(page.locator('article')).toBeVisible();await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(180);
      const audit=await page.evaluate(()=>{
        const formulas=Array.from(document.querySelectorAll<HTMLElement>('[data-math-fit]'));const notes=Array.from(document.querySelectorAll<HTMLElement>('[data-formula-note]'));const viewportWidth=document.documentElement.clientWidth;
        const materialOverflow=Array.from(document.querySelectorAll<HTMLElement>('article *')).flatMap(element=>{const rect=element.getBoundingClientRect();const style=getComputedStyle(element);const hidden=rect.width<3||rect.height<3||style.display==='none'||style.visibility==='hidden';const intentional=Boolean(element.closest('.katex, svg, [data-math-fit]'));return !intentional&&!hidden&&(rect.left < -2||rect.right>viewportWidth+2)?[{tag:element.tagName,text:(element.textContent??'').trim().slice(0,100),left:rect.left,right:rect.right,viewportWidth}]:[]});
        const innerScroll=Array.from(document.querySelectorAll<HTMLElement>('.foundation-viz-explorer *')).flatMap(element=>{const style=getComputedStyle(element);return /(auto|scroll)/.test(style.overflowX+style.overflowY)?[{tag:element.tagName,className:element.className.toString()}]:[]});
        const annotationFailures=formulas.flatMap(formula=>{const value=formula.textContent??'';return !/[가-힣]/.test(value)||formula.dataset.mathAnnotationMissing==='true'?[{source:formula.dataset.mathSource?.slice(0,120),text:value.slice(0,120)}]:[]});
        const sourceAnnotationFailures=formulas.flatMap(formula=>{const source=formula.dataset.mathSource??'';const labels=Array.from(source.matchAll(/\\text\{([^}]*)\}/g),match=>match[1]);return labels.filter(label=>!/[가-힣]/.test(label)).map(label=>({source:source.slice(0,120),label}))});
        const formulaOverflow=formulas.flatMap(formula=>{const rendered=formula.firstElementChild as HTMLElement|null;if(!rendered)return[];const dx=rendered.getBoundingClientRect().width-formula.clientWidth;return dx>2?[{source:formula.dataset.mathSource?.slice(0,120),dx}]:[]});
        const visible=document.querySelector('article')?.cloneNode(true) as HTMLElement|undefined;visible?.querySelectorAll('.katex-mathml').forEach(node=>node.remove());const rawLatex=(visible?.textContent??'').match(/\\(?:theta|omega|tau|Delta|partial|underbrace|frac|lambda|varphi|mathrm|approx|sigma|sqrt|mathbf|boldsymbol)\b/g)??[];
        const scales=formulas.map(formula=>Number(formula.dataset.mathScale??1));return {formulaCount:formulas.length,noteCount:notes.length,labCount:document.querySelectorAll('.foundation-viz-explorer').length,materialOverflow,innerScroll,annotationFailures,sourceAnnotationFailures,formulaOverflow,rawLatex,minScale:Math.min(...scales),documentOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth};
      });
      expect(audit.formulaCount).toBe(article.formulas);expect(audit.noteCount).toBe(article.notes);expect(audit.labCount).toBe(article.labs);expect(audit.materialOverflow).toEqual([]);expect(audit.innerScroll).toEqual([]);expect(audit.annotationFailures).toEqual([]);expect(audit.sourceAnnotationFailures).toEqual([]);expect(audit.formulaOverflow).toEqual([]);expect(audit.rawLatex).toEqual([]);expect(audit.documentOverflow).toBeLessThanOrEqual(1);expect(audit.minScale).toBeGreaterThanOrEqual(viewport.width===360?.82:viewport.width===390?.86:.99);expect(errors).toEqual([]);
    });
  }
}

test('all twelve composite labs expose a causal state change',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await page.goto(`${base}/lab/blog/ai/robot-composite-structures-joints-damage`,{waitUntil:'networkidle'});const labs=page.locator('figure.foundation-viz-explorer').filter({hasText:'COMPOSITE LAB'});await expect(labs).toHaveCount(12);
  for(let index=0;index<12;index+=1){const lab=labs.nth(index);const before=await lab.innerText();const range=lab.locator('input[type="range"]').first();if(await range.count()){const current=Number(await range.inputValue());const maximum=Number(await range.getAttribute('max'));await range.focus();await range.press(current<maximum?'ArrowRight':'ArrowLeft')}else{await lab.locator('button').last().click()}await expect.poll(async()=>lab.innerText()).not.toBe(before)}
});

test('composite source reconstructions preserve bounded evidence and interactive mechanisms',async({page})=>{
  await page.setViewportSize({width:1440,height:900});await page.goto(`${base}/lab/blog/ai/paper-tsai-strength-characteristics-composites-1965`,{waitUntil:'networkidle'});const tsai=page.locator('figure.foundation-viz-explorer').filter({hasText:'NASA CR-224'});await expect(tsai).toHaveCount(1);const tb=await tsai.innerText();await tsai.getByRole('button',{name:'Thermal warp',exact:true}).click();await expect.poll(async()=>tsai.innerText()).not.toBe(tb);const te=page.getByRole('group',{name:'Paper evidence slice'});for(const label of ['Program scope','Off-axis tests','Netting rejection','Cross-ply knee','Thermal warp','Angle-ply data','Author limits']){await te.getByRole('button',{name:label,exact:true}).click();await expect(te.getByRole('button',{name:label,exact:true})).toHaveAttribute('aria-pressed','true')}
  await page.goto(`${base}/lab/blog/ai/reference-nasa-composite-fracture-control-handbook-2024`,{waitUntil:'networkidle'});const nasa=page.locator('figure.foundation-viz-explorer').filter({hasText:'NASA HDBK 5010'});await expect(nasa).toHaveCount(1);const nb=await nasa.innerText();await nasa.getByRole('button',{name:'Delamination',exact:true}).click();await expect.poll(async()=>nasa.innerText()).not.toBe(nb);const ne=page.getByRole('group',{name:'Paper evidence slice'});for(const label of ['BBA criteria','Threat chain','Test-verified flaw','COPV delamination','Impact evidence','VCCT joint','CZM boundary']){await ne.getByRole('button',{name:label,exact:true}).click();await expect(ne.getByRole('button',{name:label,exact:true})).toHaveAttribute('aria-pressed','true')}
});

for(const viewport of [{width:390,height:844},{width:1440,height:900}])test(`robotics listing keeps composite sources opt-in at ${viewport.width}px`,async({page})=>{await page.setViewportSize(viewport);await page.goto(`${base}/lab/blog/ai?sub=ai-robotics-mechanics-qualification`,{waitUntil:'networkidle'});const details=page.locator('details').filter({hasText:'선택 원문 근거'}).first();await expect(page.locator(`a[href="/lab/blog/ai/${articles[0].slug}"]`).first()).toBeVisible();for(const article of articles.slice(1))await expect(page.locator(`a[href="/lab/blog/ai/${article.slug}"]`).first()).toBeHidden();await details.locator('summary').click();for(const article of articles.slice(1))await expect(page.locator(`a[href="/lab/blog/ai/${article.slug}"]`).first()).toBeVisible()});

test('fracture article links into composite concept and composite sources are linked back',async({page})=>{await page.setViewportSize({width:390,height:844});await page.goto(`${base}/lab/blog/ai/robot-fracture-mechanics-damage-tolerance`,{waitUntil:'networkidle'});await expect(page.locator('a[href="/lab/blog/ai/robot-composite-structures-joints-damage"]').first()).toBeVisible();await page.goto(`${base}/lab/blog/ai/robot-composite-structures-joints-damage`,{waitUntil:'networkidle'});await expect(page.locator('a[href="/lab/blog/ai/paper-tsai-strength-characteristics-composites-1965"]').first()).toBeVisible();await expect(page.locator('a[href="/lab/blog/ai/reference-nasa-composite-fracture-control-handbook-2024"]').first()).toBeVisible()});
