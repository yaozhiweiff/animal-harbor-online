const {chromium}=require(process.env.HARBOR_PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const base=process.env.HARBOR_TEST_URL||'http://127.0.0.1:8766/',out=process.env.HARBOR_TEST_OUTPUT||'public-test-results',results=[],errors=[];
fs.mkdirSync(out,{recursive:true});let browser;
const check=(name,ok)=>{assert.ok(ok,name);results.push(name);console.log('PASS '+name);};
const closeBrowser=()=>browser&&Promise.race([browser.close(),new Promise(r=>setTimeout(r,1500))]);
(async()=>{
 browser=await chromium.launch({...(process.env.HARBOR_BROWSER_CHANNEL?{channel:process.env.HARBOR_BROWSER_CHANNEL}:{}),headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 const c=await browser.newContext({viewport:{width:1440,height:950}}),p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await p.goto(base,{waitUntil:'networkidle'});await p.waitForFunction(()=>window.__harbor?.scene);
 const info=key=>p.locator(`#spell-bar [data-action="spell-info"][data-id="${key}"]`),dismiss=()=>p.locator('#close-modal').click();
 check('all three skill names have independent effect buttons',await p.locator('#spell-bar .spell-info').count()===3&&await p.locator('#spell-bar button button').count()===0);
 await info('SPELL_RAIN').click();
 check('a locked skill still opens its effect explanation',await p.locator('.spell-effect-value').textContent()==='世界运行速度 ×1.25'&&(await p.locator('#modal-content').textContent()).includes('尚未解锁'));
 check('opening locked skill help cannot unlock or activate it',await p.evaluate(()=>!window.__harbor.sim.isUnlocked('SPELL_RAIN')&&window.__harbor.sim.state.spells.SPELL_RAIN.remaining===0));await dismiss();
 await p.evaluate(async()=>{const h=window.__harbor,s=h.sim,{RESEARCH}=await import('./src/content.mjs');s.state.coins=1e12;s.state.quest=10;for(const n of RESEARCH)if(n.stat==='SHOP_UNLOCK'||n.node.startsWith('SPELL_'))s.state.skills[n.id]=n.raw.LEVELS;for(const value of Object.values(s.state.spells))Object.assign(value,{stacks:2,charge:0,remaining:0});s.state.rods.forEach(r=>{r.state='waiting';r.remaining=999;});h.render();});
 for(const key of ['SPELL_ZAPS','SPELL_RAIN','SPELL_GOLDRUSH']){
  await info(key).click();const text=await p.locator('#modal-content').textContent();
  check(key+' help shows the current fully upgraded values',text.includes('250 次捕捞')&&text.includes('20 世界秒')&&text.includes('2 / 2 层'));
  check(key+' help shows all three matching upgrade curves',text.includes('500 → 450 → 400 → 350 → 300 → 250')&&text.includes('5 → 10 → 15 → 20')&&text.includes('1 → 2 层'));
  check(key+' information click never spends or activates a charge',await p.evaluate(key=>{const value=window.__harbor.sim.state.spells[key];return value.stacks===2&&value.remaining===0;},key));
  if(key==='SPELL_GOLDRUSH'){check('harvest help explicitly explains value only and world-time countdowns',text.includes('价值 ×1.25')&&text.includes('产出份数不变')&&text.includes('顺风潮期间为 ×1.25'));await p.screenshot({path:path.join(out,'skill-info-desktop.png')});}
  await dismiss();
 }
 await p.screenshot({path:path.join(out,'skill-adjustments-desktop.png')});
 await info('SPELL_RAIN').focus();await p.keyboard.press('Enter');check('effect buttons work with keyboard activation',await p.locator('.spell-effect-value').isVisible());await dismiss();
 await p.locator('#spell-1').click();await p.waitForFunction(()=>window.__harbor.sim.state.spells.SPELL_RAIN.remaining>0);
 check('the skill button still activates separately from its information button',await p.locator('#spell-1').isDisabled()&&await info('SPELL_RAIN').isEnabled());
 await info('SPELL_RAIN').click();check('active skill effects remain inspectable',await p.locator('.spell-effect-value').textContent()==='世界运行速度 ×1.25');await dismiss();
 await p.evaluate(()=>{for(const value of Object.values(window.__harbor.sim.state.spells))value.remaining=0;window.__harbor.showResearch('SPELL_RAIN');});
 await p.locator('#research-owner').selectOption('all');const researchInfo=p.locator('.category-heading [data-action="spell-info"][data-id="SPELL_RAIN"]');await researchInfo.scrollIntoViewIfNeeded();const scroll=await p.locator('.research-tree').evaluate(e=>e.scrollTop);await researchInfo.click();
 check('research category names also expose the effect explanation',await p.locator('.spell-effect-value').textContent()==='世界运行速度 ×1.25');await p.locator('[data-action="spell-info-back"]').click();
 check('returning from help preserves the research view and scroll',await p.locator('#research-owner').inputValue()==='all'&&await p.locator('.research-tree').evaluate((e,old)=>Math.abs(e.scrollTop-old)<2,scroll));await dismiss();
 await p.setViewportSize({width:390,height:844});await p.locator('#game').scrollIntoViewIfNeeded();
 check('mobile names and effect buttons stay inside the map without overlap',await p.locator('.spell-control').evaluateAll(controls=>controls.every(el=>{const info=el.querySelector('.spell-info').getBoundingClientRect(),range=document.createRange();range.selectNodeContents(el.querySelector('b'));const title=range.getBoundingClientRect();return title.right<=info.left&&info.right<=innerWidth&&info.left>=0;})));
 await p.screenshot({path:path.join(out,'skill-adjustments-mobile.png')});await info('SPELL_GOLDRUSH').click();
 check('mobile players can inspect the harvest value bonus',await p.locator('.spell-effect-value').textContent()==='新捕获渔获价值 ×1.25');
 check('mobile information dialog has no horizontal overflow',await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&document.querySelector('#modal-content').scrollWidth<=document.querySelector('#modal-content').clientWidth));await p.screenshot({path:path.join(out,'skill-info-mobile.png')});
 check('no browser runtime or console errors',errors.length===0);fs.writeFileSync(path.join(out,'skill-balance-results.json'),JSON.stringify({passed:results.length,results,errors},null,2));await closeBrowser();process.exit(0);
})().catch(async e=>{console.error(e);fs.writeFileSync(path.join(out,'skill-balance-results.json'),JSON.stringify({passed:results.length,results,errors,error:e.stack},null,2));await closeBrowser();process.exit(1);});
