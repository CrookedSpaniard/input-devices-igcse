FD.add({
  id: 'cards',
  title: 'Card readers',
  tab: 'Card readers',
  icon: 'cards',
  color: '--c8',
  section: true,
  interactive: true,
  vocab: [
    ['magnetic strip', 'a dark stripe on a card that stores data magnetically'],
    ['chip and PIN', 'a card with a programmable chip that can only be read when the correct PIN is entered'],
    ['RFID', 'Radio Frequency Identification: a short-range wireless method; tags contain a unique ID'],
    ['NFC', 'Near Field Communication: a branch of RFID'],
    ['fraud', 'deceiving other people for criminal reasons'],
  ],
  mount(el) {
    const PIN = '4071';
    const TAGS = [
      { k: 'travel', e: '🎫', n: 'Prepaid travel card', id: '04:A2:19:7C', who: 'J. Patel', what: 'Travel balance', val: 12.4, act: 'Fare £1.75 paid', d: -1.75 },
      { k: 'fob', e: '🔑', n: 'Key fob', id: '04:5B:E0:13', who: 'Ms Romero (staff)', what: 'Door access', val: 'Lab 3, Staff room', act: 'Door unlocked' },
      { k: 'phone', e: '📱', n: 'Smartphone (NFC)', id: '04:9F:33:D8', who: 'L. Okafor', what: 'Bank account', val: 230.15, act: 'Paid £3.20 for lunch', d: -3.2 },
      { k: 'pet', e: '🐶', n: 'Dog (microchip)', id: '985 112 004', who: 'Biscuit · owner A. Silva', what: 'Owner phone', val: '07700 900123', act: 'Owner found' },
    ];
    el.innerHTML = `
      <div class="sim cr">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="strip">🏨 Magnetic strip</button><button data-p="chip">💳 Chip and PIN</button><button data-p="rfid">📶 RFID and NFC</button>
        </div>

        <div data-panel="strip" class="sim">
          <div class="cr-door sim-box">
            <div class="cr-unit">
              <div class="cr-card mag" id="magCard"><span class="cr-stripe"></span><small>Room 214</small></div>
              <div class="cr-lock"><span class="cr-slot"></span><span class="cr-led" id="led"></span></div>
              <div class="cr-skim" id="skim" hidden><b>😈</b><small>hidden skimmer</small></div>
            </div>
            <span class="cr-doorpic" id="doorPic">🚪</span>
          </div>
          <div class="ctrls">
            <button class="btn primary small-btn" id="swipe">▶ Swipe the card</button>
            <label class="tgl"><input type="checkbox" id="skimOn"> A criminal has fitted a skimmer</label>
            <button class="btn small-btn" id="clone" disabled>😈 Use the copied card</button>
          </div>
          <div class="cli" id="magLog" aria-live="polite"></div>
        </div>

        <div data-panel="chip" class="sim" hidden>
          <div class="cr-pos">
            <div class="cr-term">
              <div class="cr-screen" id="posScr">Insert card</div>
              <div class="cr-keys">${['1', '2', '3', '4', '5', '6', '7', '8', '9', '✗', '0', '✓'].map((k) => `<button data-k="${k}" class="${k === '✗' ? 'no' : k === '✓' ? 'ok' : ''}">${k}</button>`).join('')}</div>
              <span class="cr-mouth"></span>
              <div class="cr-card chip" id="chipCard"><span class="cr-chip"></span><small>•••• 4973</small></div>
            </div>
            <div class="cr-info">
              <p class="strong">🧾 Café Aurora · £4.80</p>
              <p class="small">Your (made-up) PIN is <b>${PIN}</b>. Try a wrong PIN too.</p>
              <p class="small muted">The chip only gives up its data when the correct PIN is entered. After three wrong PINs, the card is blocked.</p>
              <div class="ctrls"><button class="btn small-btn" id="insert">💳 Insert card</button><button class="mini-btn" id="posReset">↺ New payment</button></div>
              <div class="cr-stat"><b>67%</b><span>less of certain types of fraud after the UK introduced chip and PIN in 2005</span></div>
            </div>
          </div>
        </div>

        <div data-panel="rfid" class="sim" hidden>
          <div class="cr-rf">
            <div class="cr-tags" id="tags">${TAGS.map((t) => `<button class="cr-tag" data-k="${t.k}"><span>${t.e}</span><small>${t.n}</small></button>`).join('')}</div>
            <div class="cr-reader" id="rfReader"><span class="cr-waves"></span><b>📶 Reader</b><small id="rfId">waiting…</small></div>
          </div>
          <div class="tbl-wrap"><table class="tbl cr-db"><caption class="small muted">Database: each unique ID is linked to a record</caption>
            <thead><tr><th>Unique ID</th><th>Linked to</th><th>Data</th></tr></thead>
            <tbody>${TAGS.map((t) => `<tr data-k="${t.k}"><td><code>${t.id}</code></td><td>${t.who}</td><td><span class="muted">${t.what}:</span> <b class="cr-val">${typeof t.val === 'number' ? '£' + t.val.toFixed(2) : t.val}</b></td></tr>`).join('')}</tbody></table></div>
          <p class="small" id="rfMsg">Tap an object on the reader. RFID tags are cheap and small: they can be put in cards, key fobs, smartphones… and even pets.</p>
        </div>
      </div>`;
    const root = el.querySelector('.cr'), $ = (s) => root.querySelector(s);
    let dead = false;
    const sleep = (ms) => FD.wait(ms).then(() => !dead);

    // ---- magnetic strip ----
    let copied = false;
    function magReset() { copied = false; $('#clone').disabled = true; $('#magLog').innerHTML = '<span class="p">$</span> ready'; $('#led').className = 'cr-led'; $('#doorPic').textContent = '🚪'; }
    async function swipe(clone) {
      const c = $('#magCard');
      c.classList.toggle('fake', !!clone);
      c.classList.remove('go'); void c.offsetWidth; c.classList.add('go');
      const skim = $('#skimOn').checked && !clone;
      if (!(await sleep(800))) return;
      const log = $('#magLog');
      log.innerHTML = `<span class="p">1</span> read magnetic strip → guest 1182, room 214, valid until 18/10`;
      if (skim) { log.innerHTML += `\n<span class="e">!</span> the skimmer has <b>secretly copied</b> the same data`; copied = true; $('#clone').disabled = false; }
      if (clone) log.innerHTML += `\n<span class="e">!</span> a copied card: the strip holds exactly the same data…`;
      $('#led').className = 'cr-led on';
      $('#doorPic').textContent = '🔓';
      log.innerHTML += `\n<span class="p">2</span> data matches → door opens${clone ? ' for the criminal 😈' : ''}`;
      if (!(await sleep(1500))) return;
      $('#led').className = 'cr-led'; $('#doorPic').textContent = '🚪';
    }
    $('#swipe').addEventListener('click', () => swipe(false));
    $('#clone').addEventListener('click', () => { if (copied) swipe(true); });
    $('#skimOn').addEventListener('change', (e) => { $('#skim').hidden = !e.target.checked; });

    // ---- chip and PIN ----
    let inserted = false, entry = '', tries = 0, blocked = false, paid = false;
    const scr = (t) => { $('#posScr').innerHTML = t; };
    function posReset() { inserted = false; entry = ''; paid = false; $('#chipCard').classList.remove('in'); scr(blocked ? 'Card blocked<br><small>contact your bank</small>' : 'Insert card'); }
    function insert() { if (paid || inserted) return; inserted = true; $('#chipCard').classList.add('in'); scr(blocked ? 'Card blocked<br><small>contact your bank</small>' : '£4.80<br><small>Enter PIN</small>'); }
    async function key(k) {
      if (!inserted || paid || blocked) { FD.shake($('#posScr')); return; }
      if (k === '✗') { entry = entry.slice(0, -1); }
      else if (k === '✓') {
        if (entry.length < 4) { FD.shake($('#posScr')); return; }
        scr('Checking PIN with the chip…');
        if (!(await sleep(800))) return;
        if (entry === PIN) { paid = true; tries = 0; scr('✓ Approved<br><small>Remove card</small>'); $('#posScr').className = 'cr-screen ok'; }
        else {
          tries++; entry = '';
          if (tries >= 3) { blocked = true; scr('✗ Card blocked<br><small>3 wrong PINs</small>'); $('#posScr').className = 'cr-screen bad'; }
          else { scr(`✗ Wrong PIN<br><small>${3 - tries} tr${3 - tries === 1 ? 'y' : 'ies'} left</small>`); $('#posScr').className = 'cr-screen bad'; }
          if (!(await sleep(1200))) return;
          $('#posScr').className = 'cr-screen';
          if (!blocked) scr('£4.80<br><small>Enter PIN</small>');
        }
        return;
      } else if (entry.length < 4) entry += k;
      scr(`£4.80<br><b class="cr-dots">${'●'.repeat(entry.length)}${'○'.repeat(4 - entry.length)}</b>`);
    }
    root.querySelectorAll('.cr-keys button').forEach((b) => b.addEventListener('click', () => key(b.dataset.k)));
    $('#insert').addEventListener('click', insert);
    $('#posReset').addEventListener('click', () => { blocked = false; tries = 0; $('#posScr').className = 'cr-screen'; posReset(); });
    async function payDemo(ctx) {
      blocked = false; tries = 0; $('#posScr').className = 'cr-screen'; posReset();
      if (!(await ctx.sleep(600))) return; insert();
      for (const k of [...PIN, '✓']) { if (!(await ctx.sleep(450))) return; await key(k); }
    }

    // ---- RFID ----
    const vals = Object.fromEntries(TAGS.map((t) => [t.k, t.val]));
    async function tap(k) {
      const t = TAGS.find((x) => x.k === k);
      root.querySelectorAll('.cr-tag').forEach((b) => b.classList.toggle('on', b.dataset.k === k));
      $('#rfReader').classList.remove('read'); void $('#rfReader').offsetWidth; $('#rfReader').classList.add('read');
      $('#rfId').innerHTML = `ID <code>${t.id}</code>`;
      root.querySelectorAll('.cr-db tbody tr').forEach((r) => r.classList.toggle('hit', r.dataset.k === k));
      if (!(await sleep(600))) return;
      if (t.d) {
        vals[k] = Math.round((vals[k] + t.d) * 100) / 100;
        const cell = root.querySelector(`.cr-db tr[data-k="${k}"] .cr-val`);
        cell.textContent = '£' + vals[k].toFixed(2); FD.pulse(cell);
      }
      $('#rfMsg').innerHTML = `${t.e} The tag only holds its <b>unique ID</b> (${t.id}). The ID is looked up in the <b>database</b> → ${t.act}.`;
    }
    root.querySelectorAll('.cr-tag').forEach((b) => b.addEventListener('click', () => tap(b.dataset.k)));

    const show = FD.panels(root);
    magReset(); posReset(); show('strip');
    return {
      show, swipe, payDemo, tap,
      skimmer(on) { $('#skimOn').checked = on; $('#skim').hidden = !on; },
      magReset,
      destroy() { dead = true; },
    };
  },
  steps: [
    {
      title: 'Card readers',
      text: `<p><strong>Card readers</strong> read data stored on a card that is carried by a user. The data can be used to unlock doors, access secure areas, make payments, or track people, parcels and even pets.</p>
             <p>Cards can carry data using <strong>three methods</strong>. Each method needs a <strong>specialist type of reader</strong>.</p>`,
      async on(a, ctx) { a.show('strip'); a.skimmer(false); a.magReset(); if (!(await ctx.sleep(700))) return; await a.swipe(false); },
    },
    {
      title: 'Magnetic strip',
      text: `<p>A <strong>magnetic strip</strong> is the <strong>least secure</strong> method. The data on the strip can easily be stolen by criminals who put the card through a card reader without the card owner’s knowledge.</p>`,
      tip: 'Try it: fit a skimmer, swipe the card, then use the copied card.',
      async on(a, ctx) { a.show('strip'); a.magReset(); a.skimmer(true); if (!(await ctx.sleep(800))) return; await a.swipe(false); if (!(await ctx.sleep(1800))) return; await a.swipe(true); },
    },
    {
      title: 'Programmable chip',
      text: `<p>Data on a <strong>programmable chip</strong> is only readable when the correct <strong>PIN</strong> is entered into the reader.</p>
             <p>In 2005, the UK introduced the <strong>chip and PIN</strong> system, which reduced certain types of <strong>fraud</strong> by 67%.</p>`,
      tip: 'Try it: insert the card and enter the PIN. What happens after three wrong PINs?',
      async on(a, ctx) { a.show('chip'); await a.payDemo(ctx); },
    },
    {
      title: 'RFID and NFC',
      text: `<p><strong>Radio Frequency Identification (RFID)</strong> is a short-range wireless communication method. <strong>Near Field Communication (NFC)</strong> is a branch of RFID.</p>
             <p>RFID tags are <strong>cheap</strong> and <strong>small</strong>, so they can be put in cards, key fobs and smartphones. They contain a <strong>unique ID</strong> that is linked to records in a <strong>database</strong>, for example the account of a prepaid travel card.</p>`,
      tip: 'Try it: tap each object on the reader and watch the database.',
      async on(a, ctx) { a.show('rfid'); for (const k of ['travel', 'fob', 'phone']) { if (!(await ctx.sleep(900))) return; await a.tap(k); if (!(await ctx.sleep(900))) return; } },
    },
  ],
});

FD.activities({
  section: 'cards',
  items: [
    {
      id: 'fraud',
      title: 'Fraud',
      task: '<p>In the UK, online fraud rose <b>79%</b> in the first three years after the country switched to the chip and PIN system. <b>Discuss why this may have happened.</b></p>',
      lines: 5,
      hint: 'Think: what do you need to pay online? Is a PIN or the chip used when you shop on a website?',
    },
  ],
});

FD.check({
  section: 'cards',
  items: [
    { type: 'mcq', q: 'Which method of storing data on a card is the least secure?', opts: ['Magnetic strip', 'Programmable chip', 'Chip and PIN', 'Iris scan'], why: 'Criminals can copy the strip by putting the card through a reader without the owner knowing.' },
    { type: 'mcq', q: 'When can the data on a programmable chip be read?', opts: ['Only when the correct PIN is entered into the reader', 'Whenever the card is near any phone', 'Only when the card is swiped quickly', 'Only at night'], why: 'Chip and PIN reduced certain types of fraud by 67% in the UK.' },
    { type: 'mcq', q: 'What does an RFID tag in a travel card contain?', opts: ['A unique ID that is linked to records in a database', 'The whole travel history and a photo', 'A password typed by the user', 'A barcode printed in ink'], why: 'The ID is looked up in the database, which holds the account information.' },
    { type: 'tf', q: 'NFC is a branch of RFID.', a: true, why: 'Both are short-range wireless methods; NFC is used by smartphones and contactless cards.' },
    { type: 'multi', q: 'Which two are uses of card readers given in the book?', need: 2, opts: [['Unlocking doors and accessing secure areas', true], ['Making payments', true], ['Printing photos', false], ['Recording sound', false]], why: 'Also tracking people, parcels and pets.' },
  ],
});
