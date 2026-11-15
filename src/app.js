/* ============================================================
   默契度测试 · 纯前端双人互猜引擎
   零后端 / 零依赖外部请求 / 单文件可离线运行
   ============================================================ */
'use strict';

/* ---------------- 题库 ---------------- */
const DECKS = [
  {
    id: 'friends', name: '好友局', emoji: '🤝', desc: '10 题 · 看看你俩谁更懂谁',
    intro: '十年的交情，可能毁在这一套题上。',
    qs: [
      { q: '周末突然多出一天假，你最想干嘛？', o: [['睡到自然醒','😴'],['出门瞎逛','🚶'],['约人吃饭','🍜'],['在家刷剧打游戏','🎮']] },
      { q: '朋友半夜发来一句「在吗」，你的第一反应是？', o: [['秒回「怎么了」','⚡'],['装睡，明天再回','🌙'],['直接打电话过去','📞'],['回个「在」然后等下文','😐']] },
      { q: '吃火锅，最后一片毛肚该归谁？', o: [['谁夹到算谁的','🥢'],['让给对方','🎁'],['一人一半','✂️'],['再点一盘不就完了','➕']] },
      { q: '手机电量只剩 15%，你会？', o: [['立刻找充电宝','🔌'],['关掉后台省电','🔋'],['无所谓继续玩','🎮'],['直接关机保命','📴']] },
      { q: '有人当众开了个关于你的玩笑，你会？', o: [['笑着接梗','😄'],['尴尬但不说话','🫠'],['当场怼回去','😤'],['事后单独找他聊','💬']] },
      { q: '你出门旅行的行李箱长什么样？', o: [['整齐分类收纳','🧳'],['塞得下就行','🎒'],['带一堆用不上的','📦'],['只带手机和充电器','📱']] },
      { q: '你相册里最多的是？', o: [['自拍','🤳'],['风景','🏞️'],['和朋友合照','👯'],['吃的东西','🍰']] },
      { q: '约会迟到 20 分钟，你会？', o: [['提前发消息说一声','📩'],['到了再道歉','🙏'],['编个像样的理由','🎭'],['摆烂，就说堵车','🚗']] },
      { q: '心情最差的时候，你希望朋友？', o: [['陪我说话','🫂'],['别管我，让我静静','🤫'],['带我出去疯','🎉'],['给我点份外卖','🍱']] },
      { q: '十年后，你更希望自己？', o: [['有房有猫，安稳','🏠'],['到处跑，没定下来','✈️'],['事业上很能打','📈'],['身边还是这几个人','🫶']] }
    ]
  },
  {
    id: 'lovers', name: '情侣局', emoji: '💞', desc: '10 题 · 扎心预警，慎入',
    intro: '有些题，答完就该聊聊了。',
    qs: [
      { q: '吵架之后，谁先低头？', o: [['我先','🙋'],['TA 先','👉'],['看谁错了','⚖️'],['都不低，冷战到底','🧊']] },
      { q: '你心里最理想的约会是什么样？', o: [['宅家什么都不干','🛋️'],['出门好好吃一顿','🍽️'],['说走就走去旅行','🧭'],['看电影然后散场聊到半夜','🎬']] },
      { q: '对方手机响了，你会？', o: [['完全不看','🙈'],['直接问是谁','❓'],['眼神偷偷瞄一下','👀'],['随手拿起来翻','📵']] },
      { q: '纪念日你更希望怎么过？', o: [['要有仪式感和礼物','🎁'],['有心就好，别太破费','💌'],['一起吃顿饭就够','🍜'],['其实忘了也行','😅']] },
      { q: '感情里你最不能忍的是？', o: [['冷战','🧊'],['敷衍','😑'],['迟到和放鸽子','⏰'],['管太多','🔒']] },
      { q: '半夜两点饿了，你会？', o: [['点外卖','🛵'],['忍着睡','😪'],['把对方叫醒一起吃','👋'],['自己起来煮','🍳']] },
      { q: '你觉得一段关系里最重要的是？', o: [['信任','🤝'],['陪伴','🕯️'],['心动','💓'],['共同的目标','🎯']] },
      { q: '要异地三个月，你会？', o: [['每天视频','📹'],['固定时间联系','🗓️'],['各忙各的，心里有数','🌿'],['攒假直接飞过去','🛫']] },
      { q: '对方和异性朋友单独吃饭，你？', o: [['完全无所谓','😌'],['心里有点不舒服','😖'],['要求提前报备','📋'],['那就一起去','👥']] },
      { q: '你更怕哪一种结局？', o: [['不爱了','💔'],['被欺骗','🕳️'],['慢慢变平淡','🌫️'],['弄丢了自己','🪞']] }
    ]
  },
  {
    id: 'squad', name: '室友 / 同事局', emoji: '🍜', desc: '10 题 · 一起生活过的人',
    intro: '同住一个屋檐下，也能答得完全不一样。',
    qs: [
      { q: '早上闹钟响第几次你才起？', o: [['第一次就起','⏰'],['第三次','😵'],['五个以上','🛌'],['我不用闹钟','🌅']] },
      { q: '冰箱里没吃的了，你会？', o: [['点外卖','🛵'],['下楼买','🏪'],['翻箱倒柜找剩的','🔍'],['饿着，懒得动','😶']] },
      { q: '你的桌面是什么状态？', o: [['一尘不染','✨'],['堆成小山','🗻'],['乱中有序','🧩'],['已经看不见桌面了','🫥']] },
      { q: '开会的时候你通常在？', o: [['认真记笔记','📝'],['神游天外','☁️'],['偷偷摸鱼','📱'],['抢着发言','🙋']] },
      { q: '有人约饭，你的态度是？', o: [['秒答应','🙌'],['先问吃什么','🍽️'],['能推就推','🚪'],['我请客','💳']] },
      { q: '你的水杯现在？', o: [['一直满着，随时喝','💧'],['空的，懒得接','🥤'],['找不到放哪了','🫙'],['用一次性的','🗑️']] },
      { q: '公共区域多久打扫一次？', o: [['我天天扫','🧹'],['有分工，按表来','📅'],['看心情','🌀'],['脏到不能忍才动手','😷']] },
      { q: '周末工作群有人发消息，你会？', o: [['秒回','⚡'],['看一眼不回','👁️'],['开了免打扰','🔕'],['等周一再说','📆']] },
      { q: '你的通勤方式是？', o: [['挤地铁','🚇'],['自己开车','🚙'],['走路或骑车','🚲'],['不用通勤，远程','💻']] },
      { q: '公司团建你的角色是？', o: [['真心投入玩','🎯'],['礼貌性参与','🙂'],['找借口缺席','🏃'],['负责组织的那个人','📣']] }
    ]
  }
];
const DECK = id => DECKS.find(d => d.id === id) || DECKS[0];

/* ---------------- 工具 ---------------- */
const $ = s => document.querySelector(s);
const app = () => $('#app');
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const rnd = (a, b) => a + Math.random() * (b - a);

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('on'), 1800);
}

/* ---------------- 编码：链接里塞答案 ---------------- */
function crc8(bytes) {
  let c = 0;
  for (const b of bytes) {
    c ^= b;
    for (let i = 0; i < 8; i++) c = (c & 1) ? ((c >> 1) ^ 0x8C) : (c >> 1);
  }
  return c & 0xFF;
}
function b64u(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function unb64u(str) {
  const s = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = s.length % 4 ? 4 - (s.length % 4) : 0;
  const raw = atob(s + '='.repeat(pad));
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}
/* 二进制打包：type(1) ver(1) deck(1) [昵称长(1) 昵称(n) 答案(2*ceil(q/4))] * 人数 crc(1)
   每题 2 bit，10 题 = 3 字节，两人结果整体约 22 字节 -> 链接短、二维码好扫 */
const ENC_VER = 2;
const normName = x => String((x && typeof x === 'string' ? x : '') || '对方').slice(0, 14);
const packAnswers = (s, g) => {
  const all = s.concat(g);
  const out = new Uint8Array(Math.ceil(all.length / 4));
  for (let i = 0; i < all.length; i++) out[i >> 2] |= (all[i] & 3) << ((i & 3) * 2);
  return out;
};
function readAnswers(buf, off, count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const byte = i >> 2;
    if (off + byte >= buf.length) return null;
    out.push((buf[off + byte] >> ((i & 3) * 2)) & 3);
  }
  return out;
}
function seal(parts) {
  const len = parts.reduce((a, p) => a + p.length, 0);
  const out = new Uint8Array(len + 1);
  let o = 0;
  for (const p of parts) { out.set(p, o); o += p.length; }
  out[len] = crc8(out.subarray(0, len));
  return b64u(out);
}
function buildSide(deckId, side) {
  const nick = new TextEncoder().encode(normName(side.n)).subarray(0, 36);
  return [
    new Uint8Array([nick.length]), nick,
    packAnswers(side.s, side.g)
  ];
}
function encInvite(deckId, nick, s, g) {
  const dIdx = Math.max(0, DECKS.findIndex(d => d.id === deckId));
  return seal([new Uint8Array([1, ENC_VER, dIdx]), ...buildSide(deckId, { n: nick, s, g })]);
}
function encResult(deckId, host, guest) {
  const dIdx = Math.max(0, DECKS.findIndex(d => d.id === deckId));
  return seal([new Uint8Array([2, ENC_VER, dIdx]), ...buildSide(deckId, host), ...buildSide(deckId, guest)]);
}
function openSealed(str) {
  try {
    const all = unb64u(str);
    if (all.length < 5) return null;
    const body = all.subarray(0, all.length - 1);
    if (crc8(body) !== all[all.length - 1]) return null;
    if (body[1] !== ENC_VER) return null;
    const deck = DECKS[body[2]];
    if (!deck) return null;
    return { body, deck, type: body[0] };
  } catch (e) { return null; }
}
function readSide(body, off, count) {
  if (off >= body.length) return null;
  const nl = body[off++];
  if (off + nl > body.length) return null;
  const n = new TextDecoder().decode(body.subarray(off, off + nl)) || '对方';
  off += nl;
  const vals = readAnswers(body, off, count * 2);   // s 与 g 连续打包
  off += Math.ceil(count * 2 / 4);
  if (!vals) return null;
  return { side: { n, s: vals.slice(0, count), g: vals.slice(count) }, off };
}
/** 邀请：出题人的一份答案 */
function unpack(str) {
  const o = openSealed(str);
  if (!o || o.type !== 1) return null;
  const r = readSide(o.body, 3, o.deck.qs.length);
  if (!r) return null;
  return { v: ENC_VER, deck: o.deck.id, n: r.side.n, s: r.side.s, g: r.side.g };
}
/** 结果：两个人的答案 */
function unpackResult(str) {
  const o = openSealed(str);
  if (!o || o.type !== 2) return null;
  const n = o.deck.qs.length;
  const a = readSide(o.body, 3, n);
  if (!a) return null;
  const b = readSide(o.body, a.off, n);
  if (!b) return null;
  return { deck: o.deck.id, h: a.side, u: b.side };
}
const baseHref = () => location.href.split('#')[0];
function clearHash() {
  try { history.replaceState(null, '', location.pathname + location.search); }
  catch (e) { location.hash = ''; }
}

/* ---------------- 状态 ---------------- */
const S = {
  v: 'home', deckId: 'friends', nick: '', target: '',
  phase: 1, qi: 0, self: [], guess: [],
  incoming: null, result: null, role: 'host', locked: false
};
const store = {
  get(k, d) { try { const v = localStorage.getItem('qd.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('qd.' + k, JSON.stringify(v)); } catch (e) {} }
};

/* ---------------- 计分 ---------------- */
function scoreOf(host, guest, deck) {
  const n = deck.qs.length;
  let aHit = 0, bHit = 0, same = 0;
  const rows = deck.qs.map((item, i) => {
    const aReal = host.s[i], aGuess = host.g[i];
    const bReal = guest.s[i], bGuess = guest.g[i];
    const A = aGuess === bReal;   // host 猜中 guest
    const B = bGuess === aReal;   // guest 猜中 host
    if (A) aHit++;
    if (B) bHit++;
    if (aReal === bReal) same++;
    return { i, q: item.q, o: item.o, aReal, aGuess, bReal, bGuess, A, B };
  });
  const score = Math.round((aHit + bHit) / (2 * n) * 100);
  const sim = Math.round(same / n * 100);
  return { score, sim, aHit, bHit, n, rows };
}
function tierOf(score, sim) {
  if (score >= 90) return { t: '灵魂同频', d: '你们不是默契，是共用一套神经系统。', e: '🫂' };
  if (score >= 75) return { t: '老友无疑', d: '不用说话也知道对方下一步要干嘛。', e: '🔥' };
  if (score >= 60) return { t: '默契搭子', d: '大体上懂，细节上各玩各的。', e: '🙂' };
  if (score >= 40) return { t: '还在熟悉', d: '别慌，很多朋友都是从互相猜错开始的。', e: '😅' };
  return { t: '塑料情谊', d: '你们可能只是恰好认识，但这也挺好笑的。', e: '🧊' };
}

/* ---------------- 视图 ---------------- */
function go(v) { S.v = v; render(); }

function render() {
  const el = app();
  el.innerHTML = '<div class="view">' + viewOf(S.v) + '</div>';
  $('#branddeck').textContent = (S.incoming || S.v === 'quiz' || S.v === 'share' || S.v === 'result')
    ? DECK(S.deckId).name : '双人互猜';
  window.scrollTo({ top: 0, behavior: 'instant' });
  afterRender();
}

function viewOf(v) {
  switch (v) {
    case 'home': return viewHome();
    case 'invite': return viewInvite();
    case 'nick': return viewNick();
    case 'quiz': return viewQuiz();
    case 'share': return viewShare();
    case 'result': return viewResult();
    default: return viewHome();
  }
}

/* ---- 首页 ---- */
function viewHome() {
  const hist = store.get('history', []).slice(0, 3);
  return `
  <h1>你们到底<br><span class="grad">有多懂对方？</span></h1>
  <p class="lead">出 10 道题，先答自己的，再猜对方会怎么答。<br>两个人各答一次，系统告诉你默契度。</p>
  <div class="decks">
    ${DECKS.map(d => `
      <button class="deck" data-act="pickdeck" data-deck="${d.id}">
        <span class="ico">${d.emoji}</span>
        <span class="tx"><b>${d.name}</b><span>${d.desc}</span></span>
        <span class="arw">›</span>
      </button>`).join('')}
  </div>
  <div class="card flat">
    <div class="steps">
      <div class="step"><p>选一套题，<b>先答关于你自己的 10 题</b>，再猜对方会怎么选。</p></div>
      <div class="step"><p>生成一条链接，<b>发给那个朋友</b>（微信里直接点开就行）。</p></div>
      <div class="step"><p>他答完，你们俩的<b>默契度立刻出来</b>，还能生成一张战绩图。</p></div>
    </div>
  </div>
  ${hist.length ? `<div class="card flat"><h2 style="font-size:14px;color:var(--muted);margin-bottom:8px">最近战绩</h2>
    <div class="hist">${hist.map(h => `<div><span>${esc(h.a)} × ${esc(h.b)}</span><b>${h.score} 分</b></div>`).join('')}</div></div>` : ''}
  <p class="tiny">不用注册、不用登录。答案只存在于链接里，没有服务器。</p>`;
}

/* ---- 被邀请页 ---- */
function viewInvite() {
  const d = DECK(S.deckId), inv = S.incoming;
  return `
  <div class="card" style="text-align:center;padding:26px 18px">
    <div style="font-size:44px;line-height:1">${d.emoji}</div>
    <h2 style="margin-top:12px">${esc(inv.n)} 出了一套题考你</h2>
    <p class="lead" style="margin-top:8px">《${d.name}》${d.qs.length} 道题 · 答两轮：先选你自己，再猜 TA</p>
  </div>
  <div class="card">
    <div class="field">
      <label for="nickin">你的昵称（TA 会看到）</label>
      <input id="nickin" type="text" maxlength="12" placeholder="比如：小李" value="${esc(S.nick)}" autocomplete="off">
    </div>
  </div>
  <button class="btn" data-act="startguest">开始答题 →</button>
  <p class="tiny" style="text-align:center">${esc(inv.n)} 的答案已经在这条链接里，你现在答的我不会传走。</p>
  <button class="btn ghost sm" data-act="home">我也出一套题</button>`;
}

/* ---- 昵称 ---- */
function viewNick() {
  const d = DECK(S.deckId);
  return `
  <h2>${d.emoji} ${d.name}</h2>
  <p class="lead">${d.intro}</p>
  <div class="card">
    <div class="field">
      <label for="nickin">你的昵称（对方会看到）</label>
      <input id="nickin" type="text" maxlength="12" placeholder="比如：老王" value="${esc(S.nick)}" autocomplete="off">
    </div>
  </div>
  <button class="btn" data-act="starthost" id="startbtn">开始答题 →</button>
  <button class="btn ghost sm" data-act="home">返回</button>
  <p class="tiny">共 ${d.qs.length * 2} 题，第 1 段答你自己，第 2 段猜对方。约 90 秒。</p>`;
}

/* ---- 答题 ---- */
function viewQuiz() {
  const d = DECK(S.deckId);
  const total = d.qs.length * 2;
  const done = S.phase === 1 ? S.qi : d.qs.length + S.qi;
  const pct = Math.round(done / total * 100);
  return `
  <div class="quizbar">
    <span class="pill">${S.phase === 1 ? '第 1 段 · 关于你' : '第 2 段 · 猜 ' + esc(S.target || 'TA')}</span>
    <span class="bar"><i id="prog" style="width:${pct}%"></i></span>
    <span class="pill" id="cnt">${Math.min(done + 1, total)}/${total}</span>
  </div>
  <div class="qtitle" id="qtitle"></div>
  <div class="qhint" id="qhint"></div>
  <div class="opts" id="opts"></div>
  <div class="nav">
    <button class="btn ghost sm" data-act="backq">← 上一题</button>
  </div>`;
}

function paintQuestion() {
  const d = DECK(S.deckId);
  const q = d.qs[S.qi];
  const total = d.qs.length * 2;
  const done = S.phase === 1 ? S.qi : d.qs.length + S.qi;
  $('#qtitle').textContent = q.q;
  $('#qhint').innerHTML = S.phase === 1
    ? '选最像你自己的那个'
    : `你觉得 <b style="color:var(--ink)">${esc(S.target || 'TA')}</b> 会选哪个？`;
  $('#prog').style.width = Math.round(done / total * 100) + '%';
  $('#cnt').textContent = Math.min(done + 1, total) + '/' + total;
  const cur = (S.phase === 1 ? S.self : S.guess)[S.qi];
  $('#opts').innerHTML = q.o.map((o, i) => `
    <button class="opt${cur === i ? ' on' : ''}" data-act="pick" data-i="${i}">
      <span class="em">${o[1]}</span>
      <span class="tx">${esc(o[0])}</span>
      <span class="k">${i + 1}</span>
      <span class="tick">✓</span>
    </button>`).join('');
}

function afterRender() {
  if (S.v === 'quiz') paintQuestion();
  if (S.v === 'result') animateRing();
  if (S.v === 'share') drawShareQR();
}

/* ---- 分享面板（出题人） ---- */
function viewShare() {
  const d = DECK(S.deckId);
  const link = baseHref() + '#p=' + encInvite(d.id, S.nick, S.self, S.guess);
  S.shareLink = link;
  const offline = location.protocol === 'file:';
  return `
  <h2>✅ 题已经出好了</h2>
  <p class="lead">把这条链接发给你想考的那个人，TA 答完你俩就能看到默契度。</p>
  ${offline ? `<div class="card" style="border-color:rgba(255,179,71,.4);background:rgba(255,179,71,.08)">
      <p class="tiny" style="color:#ffd9a8;margin:0">你现在是本地打开的文件，这条链接只有自己能用。把这个网页发布到网上后，链接才能发给朋友（部署步骤见 README）。</p></div>` : ''}
  <div class="qr" id="qrbox"><canvas id="qrc" width="168" height="168"></canvas></div>
  <div class="linkbox" id="linktext">${esc(link)}</div>
  <button class="btn" data-act="copy" data-what="link">复制邀请链接</button>
  <div class="row">
    <button class="btn ghost sm" data-act="native">直接分享</button>
    <button class="btn ghost sm" data-act="copybait">复制话术</button>
  </div>
  <p class="tiny">链接里只有你的答案，不含任何个人信息。TA 答完之后会给你一条「结果链接」，点开就是你们的分数。</p>
  <button class="btn ghost sm" data-act="home">回首页</button>`;
}

/* ---- 结果 ---- */
function viewResult() {
  const d = DECK(S.deckId);
  const r = S.result;
  const t = tierOf(r.score, r.sim);
  const a = S.hostData, b = S.guestData;
  const better = r.aHit > r.bHit ? a.n : (r.bHit > r.aHit ? b.n : null);
  return `
  <div class="card" style="padding:22px 18px 18px">
    <div class="scorewrap">
      <svg class="ring" width="196" height="196" viewBox="0 0 196 196">
        <defs><linearGradient id="gr" x1="0" y1="0" x2="1" y2="0.35">
          <stop offset="0%" stop-color="#a58bff"/><stop offset="60%" stop-color="#ff5c8a"/><stop offset="100%" stop-color="#ffb347"/>
        </linearGradient></defs>
        <circle class="bgc" cx="98" cy="98" r="84"/>
        <circle class="fg" id="fgring" cx="98" cy="98" r="84"/>
      </svg>
      <div class="scorenum"><b id="scorenum" data-to="${r.score}">0</b><span>默契度</span></div>
    </div>
  </div>
  <div class="tier">
    <b>${t.e} ${t.t}</b>
    <p>${t.d}</p>
  </div>
  <div class="metrics">
    <div class="metric"><b>${r.sim}%</b><span>你们有多像</span></div>
    <div class="metric"><b>${r.aHit}/${r.n}</b><span>${esc(a.n)} 猜中 ${esc(b.n)}</span></div>
    <div class="metric"><b>${r.bHit}/${r.n}</b><span>${esc(b.n)} 猜中 ${esc(a.n)}</span></div>
  </div>
  ${better ? `<div class="badge">🏆 这一局 ${esc(better)} 更懂对方</div>` : `<div class="badge">🤝 猜中的题数一样多</div>`}
  <h2 style="font-size:16px;margin-top:6px">逐题对照</h2>
  <div class="qrs">
    ${r.rows.map(row => `
      <div class="qrow">
        <div class="qh"><i>${String(row.i + 1).padStart(2, '0')}</i><b>${esc(row.q)}</b></div>
        <div class="duo">
          <div class="side"><span class="who">${esc(a.n)} 真实选</span><span class="val"><em>${row.o[row.aReal][1]}</em>${esc(row.o[row.aReal][0])}</span></div>
          <div class="side"><span class="who">${esc(b.n)} 猜 TA</span><span class="val"><em>${row.o[row.bGuess][1]}</em>${esc(row.o[row.bGuess][0])}<span class="mark ${row.B ? 'y' : 'n'}">${row.B ? '中' : '错'}</span></span></div>
          <div class="side"><span class="who">${esc(b.n)} 真实选</span><span class="val"><em>${row.o[row.bReal][1]}</em>${esc(row.o[row.bReal][0])}</span></div>
          <div class="side"><span class="who">${esc(a.n)} 猜 TA</span><span class="val"><em>${row.o[row.aGuess][1]}</em>${esc(row.o[row.aGuess][0])}<span class="mark ${row.A ? 'y' : 'n'}">${row.A ? '中' : '错'}</span></span></div>
        </div>
      </div>`).join('')}
  </div>
  ${S.role === 'guest'
    ? `<button class="btn" data-act="sendresult">把结果发给 ${esc(a.n)}</button>`
    : `<button class="btn" data-act="turn">换我出一套题考 ${esc(b.n)}</button>`}
  <div class="row">
    <button class="btn ghost sm" data-act="poster">保存战绩图</button>
    <button class="btn ghost sm" data-act="again">再来一局</button>
  </div>
  <p class="tiny">${S.role === 'guest' ? '发出去的链接包含你们两人的答案，只为让他看到同一个结果。' : '这是你们这局的完整记录，链接本身就是结果，存下来随时能看。'}</p>`;
}

/* ---- 结果动画 ---- */
function animateRing() {
  const r = S.result; if (!r) return;
  const ring = $('#fgring'), num = $('#scorenum');
  if (!ring || !num) return;
  const R = 84, C = 2 * Math.PI * R;
  ring.style.strokeDasharray = `0 ${C}`;
  requestAnimationFrame(() => { ring.style.strokeDasharray = `${C * r.score / 100} ${C}`; });
  const t0 = performance.now(), dur = 1100;
  const tick = now => {
    const p = clamp((now - t0) / dur, 0, 1);
    const e = 1 - Math.pow(1 - p, 3);
    num.textContent = Math.round(r.score * e);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---------------- 二维码 ---------------- */
function drawQR(canvas, text, px) {
  try {
    if (typeof qrcode !== 'function') return false;
    const qr = qrcode(0, 'M');
    qr.addData(text);
    qr.make();
    const n = qr.getModuleCount();
    const pad = 2;
    const cell = Math.max(1, Math.floor((px - pad * 2) / n));
    const size = cell * n + pad * 2;
    canvas.width = size; canvas.height = size;
    canvas.style.width = px + 'px'; canvas.style.height = px + 'px';
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#000';
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      if (qr.isDark(r, c)) ctx.fillRect(pad + c * cell, pad + r * cell, cell, cell);
    }
    return true;
  } catch (e) { return false; }
}
function drawShareQR() {
  const box = $('#qrbox'), cv = $('#qrc');
  if (!box || !cv) return;
  if (!drawQR(cv, S.shareLink, 152)) {
    box.classList.add('fail');
    box.textContent = '二维码加载失败，用下面的链接也行';
  }
}

/* ---------------- 剪贴板 / 分享 ---------------- */
async function copyText(text, okMsg) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    toast(okMsg || '已复制');
  } catch (e) { toast('复制失败，长按手动复制'); }
}

/* ---------------- 海报 ---------------- */
function makePoster() {
  const cv = $('#poster'), ctx = cv.getContext('2d');
  const W = 1080, H = 1440;
  const r = S.result, d = DECK(S.deckId), t = tierOf(r.score, r.sim);
  const A = S.hostData, B = S.guestData;

  // 背景
  ctx.fillStyle = '#0a0912'; ctx.fillRect(0, 0, W, H);
  const g1 = ctx.createLinearGradient(0, 0, W, H);
  g1.addColorStop(0, '#141026'); g1.addColorStop(.55, '#0f0c1c'); g1.addColorStop(1, '#1a1024');
  ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);
  const blob = (x, y, rad, color, alpha) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
    g.addColorStop(0, color); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.globalAlpha = alpha; ctx.fillStyle = g;
    ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2); ctx.globalAlpha = 1;
  };
  blob(140, 60, 520, '#5b3cff', .55);
  blob(980, 430, 480, '#ff3d78', .34);
  blob(160, 1330, 460, '#ff9c2e', .2);

  // 顶部
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,.42)';
  ctx.font = '600 26px -apple-system, "PingFang SC", sans-serif';
  ctx.fillText('默 契 度 测 试', W / 2, 104);
  ctx.fillStyle = 'rgba(255,255,255,.24)';
  ctx.font = '500 26px -apple-system, "PingFang SC", sans-serif';
  ctx.fillText(`${d.emoji} ${d.name}`, W / 2, 150);

  // 分数
  const sx = W / 2;
  const g2 = ctx.createLinearGradient(sx - 250, 380, sx + 250, 600);
  g2.addColorStop(0, '#a58bff'); g2.addColorStop(.5, '#ff6f9c'); g2.addColorStop(1, '#ffc06b');
  ctx.fillStyle = g2;
  ctx.font = '800 262px -apple-system, "PingFang SC", sans-serif';
  ctx.fillText(String(r.score), sx, 586);
  ctx.fillStyle = 'rgba(255,255,255,.34)';
  ctx.font = '600 30px -apple-system, "PingFang SC", sans-serif';
  ctx.fillText('分 · 默 契 度', sx, 648);

  // 等级
  ctx.fillStyle = '#fff';
  ctx.font = '700 66px -apple-system, "PingFang SC", sans-serif';
  ctx.fillText(`${t.e} ${t.t}`, sx, 742);
  ctx.fillStyle = 'rgba(255,255,255,.5)';
  ctx.font = '400 31px -apple-system, "PingFang SC", sans-serif';
  wrap(ctx, t.d, sx, 798, W - 220, 44);

  // 两人
  ctx.fillStyle = 'rgba(255,255,255,.86)';
  ctx.font = '600 42px -apple-system, "PingFang SC", sans-serif';
  ctx.fillText(`${A.n}  ×  ${B.n}`, sx, 902);
  ctx.fillStyle = 'rgba(255,255,255,.4)';
  ctx.font = '400 27px -apple-system, "PingFang SC", sans-serif';
  ctx.fillText(`相似度 ${r.sim}%　·　${A.n} 猜中 ${r.aHit}/${r.n}　·　${B.n} 猜中 ${r.bHit}/${r.n}`, sx, 948);

  // 命中点阵：两行
  const dotRow = (label, hits, y) => {
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255,255,255,.4)';
    ctx.font = '400 26px -apple-system, "PingFang SC", sans-serif';
    ctx.fillText(label, 150, y - 18);
    for (let i = 0; i < r.n; i++) {
      const cx = 152 + i * 44, cy = y + 20;
      const on = r.rows[i][hits];
      ctx.beginPath(); ctx.arc(cx, cy, 15, 0, Math.PI * 2);
      if (on) {
        const g = ctx.createLinearGradient(cx - 15, cy - 15, cx + 15, cy + 15);
        g.addColorStop(0, '#7c5cff'); g.addColorStop(1, '#ff5c8a');
        ctx.fillStyle = g; ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(255,255,255,.10)'; ctx.fill();
      }
    }
    ctx.textAlign = 'center';
  };
  dotRow(`${A.n} 猜中`, 'A', 1046);
  dotRow(`${B.n} 猜中`, 'B', 1150);

  // 二维码
  const q = document.createElement('canvas');
  const link = S.resultLink || baseHref();
  const QS = 218;
  if (drawQR(q, link, QS)) {
    const qx = W - QS - 72, qy = H - QS - 96;
    ctx.fillStyle = '#fff';
    roundRect(ctx, qx - 16, qy - 16, QS + 32, QS + 32, 24); ctx.fill();
    ctx.drawImage(q, qx, qy, QS, QS);
  }
  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255,255,255,.55)';
  ctx.font = '600 30px -apple-system, "PingFang SC", sans-serif';
  ctx.fillText('扫码也来测一次', 78, H - 132);
  ctx.fillStyle = 'rgba(255,255,255,.3)';
  ctx.font = '400 22px ui-monospace, Menlo, monospace';
  ctx.fillText(link.replace(/^https?:\/\//, '').slice(0, 30) + '…', 78, H - 92);

  // 下载
  const name = `默契度-${A.n}x${B.n}-${r.score}分.jpg`.replace(/[\\/:*?"<>|]/g, '_');
  cv.toBlob(blob => {
    if (!blob) { toast('生成失败，试试截图'); return; }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = name; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    toast('已保存，微信里长按图片可转发');
  }, 'image/jpeg', 0.93);
}
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function wrap(ctx, text, x, y, maxW, lh) {
  let line = '', n = 0;
  for (const ch of text) {
    if (ctx.measureText(line + ch).width > maxW && line) {
      ctx.fillText(line, x, y + n * lh); line = ch; n++;
    } else line += ch;
  }
  if (line) ctx.fillText(line, x, y + n * lh);
}

/* ---------------- 流程 ---------------- */
function startHost() {
  const inp = $('#nickin');
  S.nick = (inp && inp.value.trim()).slice(0, 12) || '我';
  store.set('nick', S.nick);
  S.self = []; S.guess = []; S.phase = 1; S.qi = 0; S.role = 'host';
  S.target = '';
  go('quiz');
}
function startGuest() {
  const inp = $('#nickin');
  S.nick = (inp && inp.value.trim()).slice(0, 12) || '我';
  store.set('nick', S.nick);
  S.self = []; S.guess = []; S.phase = 1; S.qi = 0; S.role = 'guest';
  S.deckId = S.incoming.deck;
  S.target = S.incoming.n;
  go('quiz');
}
function pick(i) {
  if (S.locked) return;
  const d = DECK(S.deckId);
  if (S.phase === 1) S.self[S.qi] = i; else S.guess[S.qi] = i;
  const opts = $('#opts');
  if (opts) opts.querySelectorAll('.opt').forEach((el, k) => el.classList.toggle('on', k === i));
  S.locked = true;
  setTimeout(() => { S.locked = false; nextQ(); }, 260);
}
function nextQ() {
  const d = DECK(S.deckId), n = d.qs.length;
  if (S.phase === 1 && S.qi >= n - 1) { S.phase = 2; S.qi = 0; return paintAll(); }
  if (S.phase === 2 && S.qi >= n - 1) return finish();
  S.qi++;
  paintAll();
}
function backQ() {
  const d = DECK(S.deckId), n = d.qs.length;
  if (S.phase === 2 && S.qi === 0) { S.phase = 1; S.qi = n - 1; return paintAll(); }
  if (S.qi === 0) { go(S.role === 'guest' ? 'invite' : 'nick'); return; }
  S.qi--; paintAll();
}
function paintAll() {
  if (S.v !== 'quiz') { render(); return; }
  const d = DECK(S.deckId), n = d.qs.length, total = n * 2;
  const done = S.phase === 1 ? S.qi : n + S.qi;
  const pill = document.querySelector('.quizbar .pill');
  if (pill) pill.textContent = S.phase === 1 ? '第 1 段 · 关于你' : '第 2 段 · 猜 ' + (S.target || 'TA');
  const bar = $('#prog'); if (bar) bar.style.width = Math.round(done / total * 100) + '%';
  paintQuestion();
}
function finish() {
  const d = DECK(S.deckId);
  if (S.role === 'host') { go('share'); return; }
  // guest：本地结算
  const host = { n: S.incoming.n, s: S.incoming.s, g: S.incoming.g };
  const guest = { n: S.nick, s: S.self, g: S.guess };
  S.hostData = host; S.guestData = guest;
  S.result = scoreOf(host, guest, d);
  S.resultLink = baseHref() + '#r=' + encResult(d.id, host, guest);
  saveHistory(host.n, guest.n, S.result.score, d.id);
  go('result');
}
function saveHistory(a, b, score, deck) {
  const h = store.get('history', []);
  h.unshift({ a, b, score, deck, ts: Date.now() });
  store.set('history', h.slice(0, 12));
}

/* ---------------- 事件 ---------------- */
document.addEventListener('click', e => {
  const t = e.target.closest('[data-act]');
  if (!t) return;
  const act = t.dataset.act;
  switch (act) {
    case 'pickdeck':
      S.deckId = t.dataset.deck; S.nick = store.get('nick', '') || '';
      go('nick'); break;
    case 'starthost': startHost(); break;
    case 'startguest': startGuest(); break;
    case 'pick': pick(Number(t.dataset.i)); break;
    case 'backq': backQ(); break;
    case 'home':
      S.incoming = null; S.result = null; S.shareLink = null;
      clearHash(); go('home'); break;
    case 'copy':
      copyText(S.shareLink || '', '链接已复制，去粘给他'); break;
    case 'copybait':
      copyText(`我刚出了一套默契度测试《${DECK(S.deckId).name}》，10 道题，看看我们有多懂对方 👉 ${S.shareLink}`,
        '话术已复制，直接粘到微信'); break;
    case 'native': {
      const d = DECK(S.deckId).name;
      if (navigator.share) {
        navigator.share({ title: `默契度测试 · ${d}`, text: `${S.nick} 出了一套默契度测试，来答一下`, url: S.shareLink })
          .catch(() => {});
      } else copyText(S.shareLink, '这个浏览器不支持系统分享，链接已复制');
      break;
    }
    case 'sendresult':
      copyText(`我们测完了，默契度 ${S.result.score} 分 👉 ${S.resultLink}`, '结果链接已复制，发给他'); break;
    case 'poster': makePoster(); break;
    case 'again':
      S.result = null; S.incoming = null; S.shareLink = null; S.nick = store.get('nick', '');
      clearHash(); go('home'); break;
    case 'turn':
      S.incoming = null; S.result = null; S.nick = store.get('nick', '');
      clearHash(); go('nick'); break;
  }
});
document.addEventListener('input', e => {
  if (e.target.id === 'nickin') S.nick = e.target.value.slice(0, 12);
});
document.addEventListener('keydown', e => {
  if (S.v !== 'quiz') {
    if (e.key !== 'Enter') return;
    if (S.v === 'nick') { e.preventDefault(); startHost(); }
    if (S.v === 'invite') { e.preventDefault(); startGuest(); }
    return;
  }
  if (e.key >= '1' && e.key <= '4') { e.preventDefault(); pick(Number(e.key) - 1); }
  if (e.key === 'Backspace') { e.preventDefault(); backQ(); }
});

/* ---------------- 启动 ---------------- */
(function boot() {
  const h = location.hash || '';
  const mP = h.match(/^#p=(.+)$/), mR = h.match(/^#r=(.+)$/);
  if (mP) {
    const data = unpack(mP[1]);
    if (data) {
      S.incoming = data; S.deckId = data.deck; S.nick = store.get('nick', '');
      S.v = 'invite'; render(); return;
    }
  }
  if (mR) {
    const raw = unpackResult(mR[1]);
    if (raw) {
      S.deckId = raw.deck;
      S.hostData = raw.h; S.guestData = raw.u;
      S.result = scoreOf(raw.h, raw.u, DECK(raw.deck));
      S.resultLink = location.href;
      S.role = 'viewer';
      saveHistory(raw.h.n, raw.u.n, S.result.score, raw.deck);
      S.v = 'result'; render(); return;
    }
  }
  render();
})();
