(function(){
'use strict';
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const PUBLIC_URL = 'https://kames003.github.io/steelheart-esports/';
const fmt = n => Math.round(n).toLocaleString('cs-CZ').replace(/ /g,' ') + ' Kč';
const fmtK = n => { const a=Math.abs(n); const s = a>=1e6 ? (a/1e6).toLocaleString('cs-CZ',{maximumFractionDigits:2})+' mil.' : Math.round(a/1000)+' tis.'; return (n<0?'−':'')+s; };
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------- scroll progress + scrollspy ---------- */
const prog = $('#progress');
const links = $$('.nav a.l');
const secs = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
function onScroll(){
  const h = document.documentElement;
  prog.style.width = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight) * 100) + '%';
  let cur = null;
  secs.forEach(s => { if (s.getBoundingClientRect().top < 120) cur = s.id; });
  links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + cur));
  storyFill();
}
addEventListener('scroll', onScroll, {passive:true});

/* ---------- hero: živá tavba (canvas iskry) ---------- */
(function forge(){
  const c = $('#forge'); if (!c) return;
  const ctx = c.getContext('2d');
  let W, H, dpr, parts = [], running = true, raf;
  function size(){ dpr = Math.min(devicePixelRatio || 1, 2); W = c.clientWidth; H = c.clientHeight; c.width = W*dpr; c.height = H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); }
  function spawn(){
    const x = W*(.15 + Math.random()*.7);
    return {x, y:H + 10, vx:(Math.random()-.5)*.6, vy:-(1.2 + Math.random()*2.6), life:0, max:120 + Math.random()*160, r:.6 + Math.random()*1.8};
  }
  function frame(){
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(15,16,18,.22)'; ctx.fillRect(0,0,W,H);
    ctx.globalCompositeOperation = 'lighter';
    const target = Math.min(160, W/7);
    while (parts.length < target) parts.push(spawn());
    parts.forEach(p => {
      p.life++; p.x += p.vx + Math.sin((p.life + p.max)*.05)*.35; p.y += p.vy; p.vy *= .996;
      const t = p.life/p.max;
      const hue = 48 - t*38, light = 62 - t*22, a = (1 - t) * .9;
      ctx.beginPath(); ctx.fillStyle = `hsla(${hue},100%,${light}%,${a})`;
      ctx.arc(p.x, p.y, p.r*(1 - t*.5), 0, 6.283); ctx.fill();
      if (p.r > 1.8){ ctx.fillStyle = `hsla(${hue},100%,60%,${a*.15})`; ctx.beginPath(); ctx.arc(p.x,p.y,p.r*4,0,6.283); ctx.fill(); }
    });
    parts = parts.filter(p => p.life < p.max && p.y > -20);
    if (running) raf = requestAnimationFrame(frame);
  }
  size(); addEventListener('resize', size);
  if (reduce){ for(let i=0;i<220;i++){ const p=spawn(); p.y=H*(.3+Math.random()*.7); p.life=Math.random()*p.max; parts.push(p);} running=false; frame(); return; }
  new IntersectionObserver(es => { const vis = es[0].isIntersecting; if (vis && !running){ running = true; frame(); } else if (!vis) { running = false; cancelAnimationFrame(raf); } }).observe(c);
  frame();
})();

/* ---------- reveal + timeline fill ---------- */
if (!reduce && 'IntersectionObserver' in window){
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting){ e.target.classList.remove('pre'); io.unobserve(e.target); } }), {rootMargin:'0px 0px -8% 0px'});
  $$('.reveal').forEach(el => { if (el.getBoundingClientRect().top > innerHeight){ el.classList.add('pre'); io.observe(el); } });
}
function storyFill(){
  const st = $('#story'), f = $('#story-fill'); if (!st) return;
  const r = st.getBoundingClientRect();
  const p = Math.max(0, Math.min(1, (innerHeight*.6 - r.top) / r.height));
  f.style.height = (p*100) + '%';
}

/* ---------- divízie a súpiska ---------- */
const DIV = [
  {id:'cs', name:'CS2', code:'SHE.CS', pri:'priorita 1', desc:'Najväčšia scéna v ČR a na Slovensku s tradíciou LAN turnajov. Sinners v roku 2026 ukázali, že český tím sa vie dostať až na Major.', path:['FACEIT','Tipsport Conquest','MČR + RUSH:Brno','ESL Challenger League'], goal:'top 8 MČR 2027', comp:'Tipsport CS 2026: 2,5 mil. Kč', src:4,
    stats:['RTG','ADR','KAST'], players:[['Koks','IGL · štajgr',78,[1.08,79,'74%'],1],['Halda','AWP',84,[1.21,82,'72%']],['Fajrunt','Entry',80,[1.02,88,'68%']],['Vengel','Support',75,[0.97,71,'77%']],['Klec','Lurker',79,[1.11,76,'73%']]]},
  {id:'lol', name:'League of Legends', code:'SHE.LOL', pri:'priorita 2', desc:'Oficiálna národná liga ERL pre CZ a SK (Hitpoint Masters) s priamou cestou na EMEA Masters a silnou študentskou základňou.', path:['3E univ. liga','HM Winter (20 tímov)','HM Spring/Summer','EMEA Masters'], goal:'HM Spring 2028', comp:'Hitpoint Masters = CZ/SK ERL', src:7,
    stats:['KDA','CS/m','KP'], players:[['Landek','Top',77,[3.1,8.4,'58%']],['Šachta','Jungle · štajgr',79,[4.2,5.9,'71%'],1],['Bolt','Mid',83,[4.8,9.1,'66%']],['Ema','ADC',81,[5.3,9.6,'69%']],['Gong','Support',76,[3.9,1.2,'74%']]]},
  {id:'val', name:'Valorant', code:'SHE.VAL', pri:'priorita 3', desc:'Najmladšie publikum a najlepší obsah na TikTok. Enterprise Esports v roku 2026 dokázali, že cesta z Challengers NORTH//EAST vedie až do VCT EMEA.', path:['Premier','Challengers N//E kvaly','Challengers N//E','EMEA Clash'], goal:'Challengers N//E 2028', comp:'Challengers 2026 N//E Stage 1: 20 000 €', src:8,
    stats:['ACS','KAST','FK'], players:[['Iskra','Duelist',82,[248,'71%',41]],['Odpich','Initiator',78,[201,'76%',22]],['Troska','Controller · štajgr',77,[188,'79%',14],1],['Pec','Sentinel',76,[179,'78%',11]],['Šichta','Flex',79,[215,'74%',27]]]},
  {id:'dota', name:'Dota 2', code:'SHE.DOTA', pri:'priorita 4', desc:'Domácu CZ/SK ligu ani významnú Dota organizáciu sa nám nepodarilo nájsť. Je to nika s najslávnejšou históriou prize poolov, TI 2021 mal 40 mil. $.', path:['online cupy EU','open kvalifikácie','EU kvalifikácia TI','The International'], goal:'top 16 EU open kvalifikácie', comp:'EU kvalifikácia TI 2026: 16 tímov, 4 sloty', src:9,
    stats:['GPM','KDA','WR'], players:[['Kladivo','Carry',80,[672,5.4,'57%']],['Výheň','Mid',82,[611,4.9,'59%']],['Kovadlina','Offlane',77,[498,3.8,'55%']],['Oceľ','Soft support · štajgr',76,[341,3.5,'56%'],1],['Zdař','Hard support',74,[288,3.1,'58%']]]}
];
function renderDiv(i){
  const d = DIV[i];
  $$('#div-tabs button').forEach((b,j) => b.setAttribute('aria-pressed', j===i ? 'true':'false'));
  $('#div-info').innerHTML = `
    <div class="panel rivets"><span class="mono" style="font-size:.72rem;color:var(--melt);letter-spacing:.12em">${d.code} · ${d.pri}</span>
      <h3 style="font-size:2.2rem;margin:.4rem 0 .6rem">${d.name}</h3><p class="muted">${d.desc}</p>
      <div class="path">${d.path.map((p,k)=>`<span class="${k===d.path.length-1?'goal':''}">${esc(p)}</span>`).join('<i>→</i>')}</div></div>
    <div class="panel"><dl class="kv"><dt>Zostava</dt><dd>5 + 1 + tréner</dd><dt>Cieľ</dt><dd>${d.goal}</dd><dt>Súťaž</dt><dd>${d.comp}<sup class="src"><a href="#z${d.src}">${d.src}</a></sup></dd><dt>Tréningy</dt><dd>EB317 VŠB · 4× týždenne</dd><dt>Forma odmeny</dt><dd>DPP, štipendium podľa scenára</dd></dl></div>`;
  $('#roster').innerHTML = d.players.map(([nick,role,r,s,cap]) => `
    <article class="pcard${cap?' cap':''}" tabindex="0">
      <svg class="sil" style="color:var(--steel)"><use href="#sil"/></svg>
      <div><div class="rating">${r}</div><div class="role">${esc(role)}</div></div>
      <div><div class="nick">${esc(nick)}</div><div class="real">SHE.${d.id.toUpperCase()} · ilustračný hráč</div>
      <div class="stats">${d.stats.map((k,j)=>`<span><b>${s[j]}</b>${k}</span>`).join('')}</div></div>
    </article>`).join('');
  $$('.pcard').forEach(tilt);
}
function tilt(el){
  if (reduce) return;
  el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width, y=(e.clientY-r.top)/r.height;
    el.style.transform = `perspective(700px) rotateY(${(x-.5)*14}deg) rotateX(${(.5-y)*14}deg)`; el.style.setProperty('--gx', x*100+'%'); el.style.setProperty('--gy', y*100+'%'); });
  el.addEventListener('pointerleave', () => { el.style.transform = ''; });
}
$('#div-tabs').innerHTML = DIV.map((d,i)=>`<button type="button" aria-pressed="${i===0}" data-i="${i}">${d.name}</button>`).join('');
$$('#div-tabs button').forEach(b => b.addEventListener('click', () => renderDiv(+b.dataset.i)));
renderDiv(0);

/* ---------- 3D dres ---------- */
const SHIRT = 'M30 10 L45 5 Q60 16 75 5 L90 10 L116 32 L102 50 L90 42 L90 118 L30 118 L30 42 L18 50 L4 32 Z';
const KITS = {
  tavba:{base:'#1d1f23', ink:'#d8dce1', num:'url(#gHeat)', collar:'#ff6b1a',
    deco:(s)=> s==='f' ? '<polygon points="0,96 120,40 120,58 0,114" fill="url(#gHeat)"/><polygon points="0,88 120,32 120,35 0,91" fill="#d8dce1" opacity=".5"/>' : '<polygon points="0,40 120,96 120,114 0,58" fill="url(#gHeat)" opacity=".9"/>'},
  ocel:{base:'#d6dadf', ink:'#111214', num:'#111214', collar:'#111214',
    deco:(s)=> `<rect x="${s==='f'?60:0}" width="60" height="124" fill="#b6bcc3"/><polyline points="60,5 55,40 66,62 56,86 63,104 60,124" fill="none" stroke="url(#gHeat)" stroke-width="5"/>`},
  sichta:{base:'#0b0b0c', ink:'#d8dce1', num:'url(#gHeat)', collar:'#ffc857',
    deco:(s)=> `<rect y="104" width="120" height="3" fill="url(#gHeatH)"/><text x="60" y="114" text-anchor="middle" font-family="JetBrains Mono,monospace" font-size="4.2" fill="#8f959d">49°49′N 18°15′E · ZDAŘ BŮH</text>${s==='f'?'<path d="M30 60 L90 60" stroke="#30343a" stroke-width=".6"/>':''}`}
};
let kit = 'tavba';
function shirtSVG(side){
  const k = KITS[kit], id = 'cp-'+side;
  const name = esc(($('#kit-name').value || 'STEELHEART').toUpperCase().slice(0,10));
  const num = esc(String(Math.max(0, Math.min(99, parseInt($('#kit-num').value)||0))));
  const front = `<use href="#logo" x="64" y="22" width="16" height="16"/><text x="${kit==='ocel'?36:43}" y="33" font-family="Big Shoulders Display,Impact,sans-serif" font-weight="800" font-size="7" fill="${kit==='ocel'?'#30343a':'#8f959d'}">PARTNER</text>${kit==='sichta'?'<text x="60" y="80" text-anchor="middle" font-family="Big Shoulders Display,Impact,sans-serif" font-weight="900" font-size="15" fill="#d8dce1">ŠICHTA</text>':''}`;
  const back = `<text x="60" y="34" text-anchor="middle" font-family="Big Shoulders Display,Impact,sans-serif" font-weight="800" font-size="${name.length>8?9:11}" letter-spacing="1" fill="${k.ink}">${name}</text>
    <text x="60" y="84" text-anchor="middle" font-family="Big Shoulders Display,Impact,sans-serif" font-weight="900" font-size="46" fill="${k.num}" stroke="${kit==='ocel'?'none':'#0b0b0c'}" stroke-width=".6">${num}</text>
    <use href="#logo" x="55" y="92" width="10" height="10"/>`;
  return `<svg viewBox="0 0 120 124" role="img" aria-label="Dres ${kit}, ${side==='f'?'predok':'chrbát'}"><defs><clipPath id="${id}"><path d="${SHIRT}"/></clipPath></defs>
    <g clip-path="url(#${id})"><rect width="120" height="124" fill="${k.base}"/>${k.deco(side)}
    <rect x="0" width="30" height="124" fill="#000" opacity=".22"/><rect x="90" width="30" height="124" fill="#000" opacity=".22"/>
    <path d="M30 42 L30 118" stroke="#000" stroke-opacity=".25"/><path d="M90 42 L90 118" stroke="#000" stroke-opacity=".25"/></g>
    <path d="${side==='f'?'M45 5 Q60 16 75 5':'M45 5 Q60 9 75 5'}" fill="none" stroke="${k.collar}" stroke-width="2.5"/>
    ${side==='f'?front:back}</svg>`;
}
function drawShirt(){ $('#shirt-front').innerHTML = shirtSVG('f'); $('#shirt-back').innerHTML = shirtSVG('b'); }
let rotY = -18, spin = false, spinRaf;
const shirt = $('#shirt');
function applyRot(anim){ shirt.style.transition = anim ? '' : 'none'; shirt.style.transform = `rotateY(${rotY}deg) rotateX(4deg)`; }
function setSide(back){ rotY = back ? 180 : 0; applyRot(true); $('#kit-front').setAttribute('aria-pressed', !back); $('#kit-back').setAttribute('aria-pressed', !!back); }
(function drag(){
  let sx = null, base = 0;
  shirt.addEventListener('pointerdown', e => { sx = e.clientX; base = rotY; shirt.setPointerCapture(e.pointerId); shirt.style.cursor='grabbing'; stopSpin(); });
  shirt.addEventListener('pointermove', e => { if (sx === null) return; rotY = base + (e.clientX - sx)*.7; applyRot(false); });
  const up = () => { if (sx === null) return; sx = null; shirt.style.cursor=''; };
  shirt.addEventListener('pointerup', up); shirt.addEventListener('pointercancel', up);
})();
function stopSpin(){ spin = false; cancelAnimationFrame(spinRaf); $('#kit-spin').setAttribute('aria-pressed','false'); }
$('#kit-spin').addEventListener('click', () => {
  if (spin || reduce) return stopSpin();
  spin = true; $('#kit-spin').setAttribute('aria-pressed','true');
  const step = () => { rotY += .8; applyRot(false); if (spin) spinRaf = requestAnimationFrame(step); }; step();
});
$('#kit-front').addEventListener('click', () => { stopSpin(); setSide(false); });
$('#kit-back').addEventListener('click', () => { stopSpin(); setSide(true); });
$$('[data-kit]').forEach(b => b.addEventListener('click', () => { kit = b.dataset.kit; $$('[data-kit]').forEach(x => x.setAttribute('aria-pressed', x===b)); drawShirt(); }));
['input','change'].forEach(ev => { $('#kit-name').addEventListener(ev, drawShirt); $('#kit-num').addEventListener(ev, drawShirt); });
drawShirt(); applyRot(true);

/* ---------- ekonomický model ---------- */
const SCHEMA = [
  {g:'Hráči a tréneri', f:[['st_cs','CS2: štipendium / hráč'],['st_lol','LoL: štipendium / hráč'],['st_val','Valorant: štipendium / hráč'],['st_dota','Dota 2: štipendium / hráč'],['co_cs','CS2: tréner'],['co_lol','LoL: tréner'],['co_val','Valorant: tréner'],['co_dota','Dota 2: tréner'],['subs','Platiť náhradníkov (50 %)','bool']]},
  {g:'Štáb', f:[['s_mgr','Manažér divízií'],['s_content','Content / strih'],['s_social','Sociálne siete'],['s_design','Dizajnér'],['s_acc','Účtovníctvo']]},
  {g:'Propagácia', f:[['p_amb','Ambasádor (fix)'],['p_micro_n','Spolupráce s tvorcami / mes'],['p_micro_price','Cena jednej spolupráce'],['p_ads','Platená reklama']]},
  {g:'Prevádzka', f:[['o_soft','Softvér, hosting / mes'],['o_boot_n','Bootcampy / rok'],['o_boot_price','Cena bootcampu'],['o_travel','Cestovné na LAN / rok'],['o_fees','Štartovné líg / rok']]},
  {g:'Založenie (jednorazovo)', f:[['t_found','Založenie (spolok 0 Kč / s.r.o. ~10 tis.)'],['t_legal','Právnik: zmluvy hráčov'],['t_tm','Ochranná známka ÚPV'],['t_brand','Branding, brandbook'],['t_web','Web, domény'],['t_jersey_n','Počet dresov (tím + štáb)'],['t_jersey_price','Cena dresu / ks'],['t_stream','Stream setup, kamera, PC'],['t_gear','Periférie pre hráčov']]},
  {g:'Príjmy', f:[['r_main','Hlavný partner / rok'],['r_part_n','Počet menších partnerov'],['r_part_avg','Priem. partner / rok'],['r_merch_n','Predané kusy merchu / rok'],['r_merch_margin','Marža / kus (bez DPH)'],['r_prize','Prize money tímov / rok (org. 25 %)'],['r_grant','Granty / rok'],['r_creator','Stream, YouTube / mes'],['r_tourn','Forge Cup: čistý zisk'],['r_shichta','Šichta: platiaci členovia']]},
  {g:'Kapitál', f:[['c_cap','Počiatočný kapitál (vklady, investor)']]}
];
const P = {
  garaz:{st_cs:0,st_lol:0,st_val:0,st_dota:0,co_cs:4000,co_lol:3000,co_val:3000,co_dota:2000,subs:false,
    s_mgr:0,s_content:6000,s_social:0,s_design:0,s_acc:2500,
    p_amb:0,p_micro_n:2,p_micro_price:2000,p_ads:3000,
    o_soft:2800,o_boot_n:1,o_boot_price:25000,o_travel:30000,o_fees:15000,
    t_found:500,t_legal:10000,t_tm:5000,t_brand:0,t_web:3000,t_jersey_n:30,t_jersey_price:1030,t_stream:25000,t_gear:0,
    r_main:120000,r_part_n:5,r_part_avg:25000,r_merch_n:250,r_merch_margin:300,r_prize:60000,r_grant:0,r_creator:1500,r_tourn:20000,r_shichta:40,
    c_cap:200000},
  semi:{st_cs:6000,st_lol:5000,st_val:4000,st_dota:3000,co_cs:6000,co_lol:5000,co_val:5000,co_dota:4000,subs:false,
    s_mgr:11999,s_content:8000,s_social:6000,s_design:4000,s_acc:3500,
    p_amb:10000,p_micro_n:3,p_micro_price:6000,p_ads:8000,
    o_soft:4000,o_boot_n:2,o_boot_price:30000,o_travel:60000,o_fees:30000,
    t_found:10000,t_legal:30000,t_tm:5000,t_brand:20000,t_web:15000,t_jersey_n:40,t_jersey_price:900,t_stream:60000,t_gear:72000,
    r_main:850000,r_part_n:6,r_part_avg:100000,r_merch_n:600,r_merch_margin:350,r_prize:400000,r_grant:250000,r_creator:10000,r_tourn:80000,r_shichta:200,
    c_cap:600000},
  pro:{st_cs:30000,st_lol:25000,st_val:22000,st_dota:18000,co_cs:30000,co_lol:25000,co_val:22000,co_dota:18000,subs:true,
    s_mgr:45000,s_content:30000,s_social:28000,s_design:25000,s_acc:8000,
    p_amb:40000,p_micro_n:6,p_micro_price:20000,p_ads:40000,
    o_soft:15000,o_boot_n:3,o_boot_price:120000,o_travel:300000,o_fees:100000,
    t_found:10000,t_legal:80000,t_tm:25400,t_brand:80000,t_web:60000,t_jersey_n:60,t_jersey_price:900,t_stream:200000,t_gear:150000,
    r_main:5000000,r_part_n:8,r_part_avg:400000,r_merch_n:3000,r_merch_margin:450,r_prize:2000000,r_grant:300000,r_creator:60000,r_tourn:600000,r_shichta:1200,
    c_cap:3500000}
};
const SHICHTA_AVG = 80, ORG_PRIZE = .25;
let V = {...P.garaz};
function buildForm(){
  const form = $('#form'); form.innerHTML = '';
  SCHEMA.forEach((grp,gi) => {
    const d = document.createElement('details'); d.className = 'grp'; if (gi===0) d.open = true;
    d.innerHTML = `<summary><span class="t">${grp.g}</span><span class="v" id="sum-${gi}"></span></summary><div class="fields"></div>`;
    const box = d.querySelector('.fields');
    grp.f.forEach(([id,label,type]) => {
      const row = document.createElement('div'); row.className = 'f';
      if (type === 'bool'){
        row.innerHTML = `<label for="in-${id}">${label}</label><input type="checkbox" id="in-${id}">`;
        const inp = row.querySelector('input'); inp.checked = !!V[id]; inp.addEventListener('change', () => { V[id] = inp.checked; recalc(); });
      } else {
        row.innerHTML = `<label for="in-${id}">${label}</label><input type="number" min="0" step="any" inputmode="numeric" id="in-${id}">`;
        const inp = row.querySelector('input'); inp.value = V[id]; inp.addEventListener('input', () => { V[id] = Math.max(0, parseFloat(inp.value)||0); recalc(); });
      }
      box.appendChild(row);
    });
    form.appendChild(d);
  });
}
function model(v){
  const subF = v.subs ? 5.5 : 5;
  const players = (v.st_cs+v.st_lol+v.st_val+v.st_dota)*subF;
  const coaches = v.co_cs+v.co_lol+v.co_val+v.co_dota;
  const staff = v.s_mgr+v.s_content+v.s_social+v.s_design+v.s_acc;
  const promo = v.p_amb + v.p_micro_n*v.p_micro_price + v.p_ads;
  const ops = v.o_soft + (v.o_boot_n*v.o_boot_price + v.o_travel + v.o_fees)/12;
  const monthly = players+coaches+staff+promo+ops;
  const one = (v.t_found+v.t_legal+v.t_tm+v.t_brand+v.t_web+v.t_jersey_n*v.t_jersey_price+v.t_stream+v.t_gear)*1.1;
  const rev = {'Partneri':v.r_main+v.r_part_n*v.r_part_avg,'Merch':v.r_merch_n*v.r_merch_margin,'Granty':v.r_grant,'Stream, video':v.r_creator*12,'Forge Cup':v.r_tourn,'Šichta':v.r_shichta*SHICHTA_AVG*12,'Prize (25 %)':v.r_prize*ORG_PRIZE};
  const revTotal = Object.values(rev).reduce((a,b)=>a+b,0);
  const seas = [0,0,3,1,1,1,1,1,1,1,2,3], sS = 15;
  const cash = []; let c = v.c_cap - one, low = c, lowM = 0;
  for (let m=0;m<24;m++){
    const y2 = m>=12, mi = m%12, g = y2?1.3:1, cg = y2?1.08:1;
    let r = y2 ? rev['Partneri']/12*g : (mi>=2 ? rev['Partneri']/10 : 0);
    r += rev['Merch']*seas[mi]/sS*g;
    r += (mi===5 ? rev['Granty'] : 0) * (y2 ? g : 1);
    r += y2 && mi===5 && v.r_grant===0 ? 250000 : 0; // grant Volný čas od roku 2 aj v scenári Garáž
    r += rev['Stream, video']/12*g;
    r += mi===8 ? rev['Forge Cup']*g : 0;
    r += y2 ? rev['Šichta']/12*g : (mi>=3 ? rev['Šichta']/9 : 0);
    r += y2 ? rev['Prize (25 %)']/12*g : (mi>=3 ? rev['Prize (25 %)']/9 : 0);
    c += r - monthly*cg; cash.push(c); if (c<low){ low=c; lowM=m+1; }
  }
  return {players,coaches,staff,promo,ops,monthly,one,rev,revTotal,result:revTotal-monthly*12,cash,low,lowM,year1:monthly*12+one};
}
function bars(el, entries, cls){
  const max = Math.max(1, ...entries.map(e=>e[1]));
  el.innerHTML = entries.map(([k,v]) => `<div class="hbar ${cls}" title="${k}: ${fmt(v)}"><span>${k}</span><div class="track"><i class="fill" style="width:${v>0?Math.max(1.5,v/max*100):0}%"></i></div><span class="val">${fmt(v)}</span></div>`).join('');
}
function drawCash(m){
  const svg = $('#cash'), W=560, H=240, pl=58, pr=12, pt=14, pb=28, data = m.cash, last = data.length-1;
  let lo = Math.min(...data, 0), hi = Math.max(...data, 0); const pad = (hi-lo)*.08 || 1; lo -= pad; hi += pad;
  const x = i => pl + (W-pl-pr)*i/last, y = v => pt + (H-pt-pb)*(1-(v-lo)/(hi-lo)), zero = y(0);
  let g = '';
  for (let t=0;t<=4;t++){ const v = lo+(hi-lo)*t/4; g += `<line x1="${pl}" x2="${W-pr}" y1="${y(v)}" y2="${y(v)}" stroke="#30343a" stroke-dasharray="2 4"/><text x="${pl-8}" y="${y(v)+4}" text-anchor="end" font-size="10" font-family="JetBrains Mono,monospace" fill="#8f959d">${fmtK(v)}</text>`; }
  [1,6,12,18,24].forEach(mo => g += `<text x="${x(mo-1)}" y="${H-8}" text-anchor="middle" font-size="10" font-family="JetBrains Mono,monospace" fill="#8f959d">m${mo}</text>`);
  g += `<line x1="${x(11.5)}" x2="${x(11.5)}" y1="${pt}" y2="${H-pb}" stroke="#30343a"/><text x="${x(11.5)+4}" y="${pt+10}" font-size="10" fill="#8f959d" font-family="JetBrains Mono,monospace">rok 2</text>`;
  g += `<line x1="${pl}" x2="${W-pr}" y1="${zero}" y2="${zero}" stroke="#8f959d"/>`;
  const pts = data.map((v,i)=>`${x(i)},${y(v)}`).join(' ');
  g += `<defs><linearGradient id="cf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6b1a" stop-opacity=".35"/><stop offset="1" stop-color="#ff6b1a" stop-opacity="0"/></linearGradient><clipPath id="ab"><rect width="${W}" height="${zero}"/></clipPath><clipPath id="be"><rect y="${zero}" width="${W}" height="${H}"/></clipPath></defs>`;
  g += `<polygon points="${x(0)},${zero} ${pts} ${x(last)},${zero}" fill="url(#cf)" clip-path="url(#ab)"/><polygon points="${x(0)},${zero} ${pts} ${x(last)},${zero}" fill="#ff5a4f" opacity=".2" clip-path="url(#be)"/>`;
  g += `<polyline points="${pts}" fill="none" stroke="#ff6b1a" stroke-width="2" stroke-linejoin="round"/><circle cx="${x(last)}" cy="${y(data[last])}" r="4" fill="#ffc857" stroke="#17191c" stroke-width="2"/>`;
  g += `<line id="xh" y1="${pt}" y2="${H-pb}" stroke="#d8dce1" stroke-opacity=".4" visibility="hidden"/><circle id="xd" r="4" fill="#ffc857" stroke="#17191c" stroke-width="2" visibility="hidden"/><rect id="hit" x="${pl}" y="${pt}" width="${W-pl-pr}" height="${H-pt-pb}" fill="transparent"/>`;
  svg.innerHTML = g;
  const tip = $('#tip'), box = $('#cashbox'), hit = svg.querySelector('#hit'), xh = svg.querySelector('#xh'), xd = svg.querySelector('#xd');
  hit.addEventListener('pointermove', ev => {
    const r = svg.getBoundingClientRect(), px = (ev.clientX-r.left)/r.width*W;
    const i = Math.max(0, Math.min(last, Math.round((px-pl)/(W-pl-pr)*last)));
    xh.setAttribute('x1',x(i)); xh.setAttribute('x2',x(i)); xh.setAttribute('visibility','visible');
    xd.setAttribute('cx',x(i)); xd.setAttribute('cy',y(data[i])); xd.setAttribute('visibility','visible');
    const br = box.getBoundingClientRect();
    tip.style.left = (r.left-br.left + x(i)/W*r.width)+'px'; tip.style.top = (r.top-br.top + y(data[i])/H*r.height)+'px';
    tip.innerHTML = `Mesiac ${i+1} · <b class="${data[i]<0?'neg':''}">${fmt(data[i])}</b>`; tip.style.opacity = 1;
  });
  hit.addEventListener('pointerleave', () => { tip.style.opacity = 0; xh.setAttribute('visibility','hidden'); xd.setAttribute('visibility','hidden'); });
  $('#cash-sub').innerHTML = m.low < 0
    ? `<span class="warn neg">Kapitál nestačí</span>Najnižší bod je ${fmt(m.low)} v mesiaci ${m.lowM}. Treba navýšiť kapitál alebo príjmy.`
    : `Najnižší stav je ${fmt(m.low)} v mesiaci ${m.lowM}. Kapitál pokryje rozbeh.`;
}
function recalc(){
  const m = model(V);
  $('#k-one').textContent = fmt(m.one); $('#k-mon').textContent = fmt(m.monthly); $('#k-rev').textContent = fmt(m.revTotal);
  const kr = $('#k-res'); kr.textContent = (m.result>=0?'+':'−') + fmt(Math.abs(m.result)); kr.className = m.result>=0 ? 'pos':'neg';
  const kn = $('#k-res-n'); kn.textContent = m.result>=0 ? 'prevádzka sa sama uživí' : 'treba dofinancovať'; kn.className = m.result>=0 ? 'pos':'neg';
  bars($('#costbars'), [['Hráči',m.players],['Tréneri',m.coaches],['Štáb',m.staff],['Propagácia',m.promo],['Prevádzka',m.ops]], '');
  bars($('#revbars'), Object.entries(m.rev).sort((a,b)=>b[1]-a[1]), 'rev');
  drawCash(m);
  const sums = [m.players+m.coaches, m.staff, m.promo, m.ops, m.one, m.revTotal, V.c_cap], unit = ['/ mes','/ mes','/ mes','/ mes','','/ rok',''];
  sums.forEach((s,i) => { const el = $('#sum-'+i); if (el) el.textContent = fmt(s) + (unit[i] ? ' '+unit[i] : ''); });
}
$$('.tab').forEach(b => b.addEventListener('click', () => {
  $$('.tab').forEach(t => t.setAttribute('aria-pressed', t===b ? 'true':'false'));
  V = {...P[b.dataset.sc]}; buildForm(); recalc();
}));
$$('#whatif button').forEach(b => b.addEventListener('click', () => {
  const w = b.dataset.w;
  if (w==='main') V.r_main += 500000;
  if (w==='sichta') V.r_shichta += 300;
  if (w==='lose') V.r_main = 0;
  buildForm(); recalc();
  const k = $('.kpis'); k.animate && !reduce && k.animate([{boxShadow:'0 0 0 2px #ff6b1a'},{boxShadow:'0 0 0 0 transparent'}],{duration:900});
}));
buildForm(); recalc();

/* ---------- marketing mockupy ---------- */
const IG = [
  ['radial-gradient(circle at 50% 120%,#ff6b1a,#1d1f23 70%)','Matchday<br><small style="font-size:.6em;color:#ffc857">vs eSuba</small>'],
  ['#d8dce1','<span style="color:#111">13:9<br>WIN</span>'],
  ['#17191c','<svg viewBox="0 0 100 100" style="width:60%"><use href="#logo"/></svg>'],
  ['linear-gradient(135deg,#c4321b,#ffc857)','<span style="color:#1a0b02">Nový<br>dres</span>'],
  ['#0b0b0c','Forge<br><span class="hot-text">Cup</span>'],
  ['#7ea6c4','<span style="color:#0f1012">Šichta<br>ep. 1</span>'],
  ['#1f2226','„Fajrunt"<br><small style="font-size:.55em;color:#8f959d">meme</small>'],
  ['repeating-linear-gradient(45deg,#17191c 0 6px,#1f2226 6px 12px)','Halda<br><small style="font-size:.6em;color:#ffc857">AWP</small>'],
  ['#ff6b1a','<span style="color:#1a0b02">Zdař<br>Bůh</span>']
];
$('#ig-grid').innerHTML = IG.map(([bg,t]) => `<div style="background:${bg}">${t}</div>`).join('');
const CAL = {1:[['c1','Teaser: pec sa rozpaľuje']],2:[['c4','Discord otvorený']],4:[['c1','Teaser: šev']],7:[['c2','Odliatie: CS2']],9:[['c4','Q&A s Koksom']],11:[['c3','FACEIT liga']],14:[['c2','Odliatie: LoL']],16:[['c4','Watch party']],18:[['c3','HM Winter']],21:[['c2','Odliatie: Valorant']],23:[['c3','Premier']],24:[['c4','Šichta ep. 1']],26:[['c2','Odliatie: Dota 2']],28:[['c1','Dres + Forge Cup + Šichta']]};
$('#cal').innerHTML = Array.from({length:28},(_,i)=>i+1).map(d => `<div><b>${d}</b>${(CAL[d]||[]).map(([c,t])=>`<i class="${c}">${t}</i>`).join('')}</div>`).join('');

/* ---------- živé hlasovanie (verejný počítadlový API, funguje na GitHub Pages) ---------- */
const API = 'https://abacus.jasoncameron.dev', NS = 'steelheart-vsb-2026';
const OPTS = [['tavba','Tavba'],['ocel','Studená oceľ'],['sichta','Šichta']];
const counts = {tavba:0, ocel:0, sichta:0, join:0};
let online = true;
const store = { get(k){ try { return localStorage.getItem(k); } catch(e){ return null; } }, set(k,v){ try { localStorage.setItem(k,v); } catch(e){} } };
$('#opts').innerHTML = OPTS.map(([k,n]) => `<button type="button" class="opt" data-v="${k}" aria-pressed="false"><span class="on">${n}</span><span class="pc" id="pc-${k}">–</span><span class="cnt" id="ct-${k}">0 hlasov</span><span class="ob" id="ob-${k}"></span></button>`).join('');
async function get(key){
  const r = await fetch(`${API}/get/${NS}/${key}`, {cache:'no-store'});
  if (r.status === 404) return 0;
  if (!r.ok) throw new Error(r.status);
  return (await r.json()).value || 0;
}
async function hit(key){ const r = await fetch(`${API}/hit/${NS}/${key}`, {cache:'no-store'}); if (!r.ok) throw new Error(r.status); return (await r.json()).value; }
function renderVotes(){
  const tot = counts.tavba + counts.ocel + counts.sichta, mine = store.get('she-vote');
  OPTS.forEach(([k]) => {
    const p = tot ? Math.round(counts[k]/tot*100) : 0;
    $('#pc-'+k).textContent = online ? p + ' %' : '–';
    $('#ct-'+k).textContent = counts[k] + (counts[k]===1 ? ' hlas' : counts[k]>=2 && counts[k]<=4 ? ' hlasy' : ' hlasov');
    $('#ob-'+k).style.width = p + '%';
    document.querySelector(`.opt[data-v="${k}"]`).setAttribute('aria-pressed', mine===k ? 'true':'false');
    const pb = $('#pb-'+k); if (pb){ pb.style.width = p + '%'; $('#pn-'+k).textContent = counts[k]; }
  });
  $('#vote-total').textContent = online ? `${tot} hlasov · aktualizuje sa každé 4 s` : 'offline';
  $('#join-n').textContent = online ? counts.join : '–';
  if (store.get('she-join')) { $('#join-btn').textContent = 'Si v Šichte ✓'; $('#join-btn').disabled = true; }
}
async function refresh(){
  try {
    const [a,b,c,d] = await Promise.all(['tavba','ocel','sichta','join'].map(get));
    Object.assign(counts, {tavba:a, ocel:b, sichta:c, join:d}); online = true; $('#vote-status').textContent = '';
  } catch(e){
    online = false;
    $('#vote-status').innerHTML = `Živé hlasovanie beží na verejnej verzii webu: <a href="${PUBLIC_URL}#hlasuj" target="_blank" rel="noopener">${PUBLIC_URL.replace('https://','')}</a>`;
  }
  renderVotes();
}
$$('.opt').forEach(b => b.addEventListener('click', async () => {
  const k = b.dataset.v;
  if (store.get('she-vote')) { $('#vote-status').textContent = 'Z tohto zariadenia už hlas odišiel. Ďakujeme!'; return; }
  try { counts[k] = await hit('' + k); store.set('she-vote', k); renderVotes(); $('#vote-status').textContent = 'Hlas započítaný. Zdař Bůh!'; }
  catch(e){ $('#vote-status').innerHTML = `Hlasovať sa dá na <a href="${PUBLIC_URL}#hlasuj" target="_blank" rel="noopener">verejnej verzii webu</a>.`; }
}));
$('#join-btn').addEventListener('click', async () => {
  if (store.get('she-join')) return;
  try { counts.join = await hit('join'); store.set('she-join','1'); renderVotes(); }
  catch(e){ $('#vote-status').innerHTML = `Pridať sa dá na <a href="${PUBLIC_URL}#hlasuj" target="_blank" rel="noopener">verejnej verzii webu</a>.`; }
});
refresh();
setInterval(() => { if (!document.hidden) refresh(); }, 4000);

/* ---------- QR + režim prezentácie ---------- */
function qr(el, size){
  el.innerHTML = '';
  if (window.QRCode) new QRCode(el, {text: PUBLIC_URL + '#hlasuj', width:size, height:size, colorDark:'#0f1012', colorLight:'#ffffff', correctLevel: QRCode.CorrectLevel.M});
  else el.innerHTML = `<p style="color:#0f1012;font:12px monospace;line-height:1.4;padding:8px">${PUBLIC_URL}</p>`;
}
qr($('#qr'), 200);
function present(on){
  document.body.classList.toggle('present', on);
  if (on){ qr($('#qr-big'), Math.round(Math.min(innerHeight*.55, innerWidth*.3, 560))); refresh(); }
}
$('#present-btn').addEventListener('click', () => { present(true); try { history.replaceState(null,'','#live'); } catch(e){} });
$('#present-close').addEventListener('click', () => { present(false); try { history.replaceState(null,'','#hlasuj'); } catch(e){} });
addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('present')) present(false); });
if (location.hash === '#live') present(true);
addEventListener('hashchange', () => present(location.hash === '#live'));

onScroll();
})();
