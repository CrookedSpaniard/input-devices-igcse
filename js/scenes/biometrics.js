FD.add({
  id: 'biometrics',
  title: 'Biometric scanners',
  tab: 'Biometrics',
  icon: 'biometrics',
  color: '--c6',
  section: true,
  interactive: true,
  vocab: [
    ['biometric', 'measuring part of the unique physical characteristics of a person, e.g. a fingerprint'],
    ['iris', 'the round, coloured part of an eye'],
    ['authorised user', 'a person who is allowed to use the device or enter the area'],
  ],
  mount(el) {
    // A fingerprint drawn from curves, clipped to the shape of a fingertip.
    const print = (type, id) => {
      let d = '';
      if (type === 'arch') for (let k = -3; k < 14; k++) { const y = 20 + k * 9; d += `M0 ${y + 18}Q60 ${y - 22 + Math.abs(k - 5) * 1.5} 120 ${y + 18}`; }
      if (type === 'loop') {
        for (let k = 0; k < 9; k++) { const w = 6 + k * 6, top = 52 - k * 6; d += `M${58 - w} 150V${top + w}A${w} ${w} 0 0 1 ${58 + w} ${top + w}L${70 + w} 150`; }
        for (let k = 0; k < 5; k++) d += `M0 ${12 + k * 8}Q60 ${-10 + k * 8} 120 ${12 + k * 8}`;
      }
      if (type === 'whorl') {
        for (let k = 0; k < 11; k++) d += `M${60 + 4 + k * 6} 72a${4 + k * 6} ${5 + k * 6.6} 0 1 0 0 .1`;
      }
      return `<svg class="fp" viewBox="0 0 120 150" aria-hidden="true"><defs><clipPath id="${id}"><ellipse cx="60" cy="78" rx="52" ry="68"/></clipPath></defs><ellipse class="fp-skin" cx="60" cy="78" rx="52" ry="68"/><path class="fp-ridge" clip-path="url(#${id})" d="${d}"/><path class="fp-cut" d="M20 60L100 96"/></svg>`;
    };
    el.innerHTML = `
      <div class="sim bio">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="enrol">🧬 Enrol and check</button><button data-p="fp">👆 Fingerprints</button><button data-p="meth">👤 Face · voice · iris</button><button data-p="tbl">⚖️ Pros and cons</button>
        </div>

        <div data-panel="enrol" class="sim">
          <div class="bio-grid">
            <div class="sim-box bio-dev">
              <div class="bio-reader" id="reader"><div id="rdPrint">${print('loop', 'c1')}</div><span class="bio-scan" id="scanLine"></span></div>
              <p class="bio-who" id="who">Alex</p>
            </div>
            <div class="bio-data">
              <p class="strong">Samples measured</p>
              <div class="bio-rows" id="rows"></div>
              <p class="strong mt0">Stored template (average)</p>
              <div class="bio-row tpl" id="tpl"><span class="muted">nothing stored yet</span></div>
            </div>
          </div>
          <div class="ctrls">
            <button class="btn primary small-btn" id="enrol">1 · Enrol Alex (scan 3 times)</button>
            <span class="seg" id="person"><span class="seg-l">2 · Who is at the door?</span><button data-v="alex">🙂 Alex</button><button data-v="sam">😐 Sam</button></span>
            <button class="btn small-btn" id="verify">🔓 Scan to open</button>
            <button class="mini-btn" id="bioReset">↺ Reset</button>
          </div>
          <div class="readout"><span class="ro" id="matchRo"><small>Match</small><b id="match">–</b></span><span class="ro" id="doorRo"><small>Door</small><b id="door">🔒 locked</b></span><span class="note" id="bioMsg">First, enrol the authorised user.</span></div>
        </div>

        <div data-panel="fp" class="sim" hidden>
          <div class="bio-types">${['arch', 'loop', 'whorl'].map((t, i) => `<figure class="bio-fig" data-t="${t}">${print(t, 'c' + (i + 2))}<figcaption>${t[0].toUpperCase() + t.slice(1)}</figcaption></figure>`).join('')}</div>
          <div class="sim-box bio-quiz">
            <div class="bio-mystery" id="mys"></div>
            <div><p class="strong">Which pattern is this?</p><span class="seg" id="guess"><button data-v="arch">Arch</button><button data-v="loop">Loop</button><button data-v="whorl">Whorl</button></span>
            <p class="small" id="gMsg"></p><button class="mini-btn" id="another">Another print ▶</button>
            <label class="tgl mt-s"><input type="checkbox" id="injury"> The finger has a cut (injury)</label></div>
          </div>
        </div>

        <div data-panel="meth" class="sim" hidden>
          <span class="seg" id="meth"><button data-v="face">👤 Facial</button><button data-v="voice">🗣️ Voice</button><button data-v="iris">👁️ Iris</button></span>
          <div class="sim-box bio-m" data-m="face">
            <svg viewBox="0 0 300 200" aria-label="A face with measured points">
              <ellipse class="bio-face" cx="150" cy="102" rx="62" ry="80"/>
              <ellipse class="bio-eye" cx="125" cy="88" rx="11" ry="6"/><ellipse class="bio-eye" cx="175" cy="88" rx="11" ry="6"/>
              <path class="bio-feat" d="M150 92v30l-8 6h16M130 150q20 12 40 0"/>
              <g id="lm">${[[125, 88], [175, 88], [150, 122], [130, 150], [170, 150], [150, 180], [92, 100], [208, 100]].map(([x, y]) => `<circle class="bio-lm" cx="${x}" cy="${y}" r="4"/>`).join('')}
                <path class="bio-mesh" d="M125 88L175 88L150 122Z M125 88L130 150L170 150L175 88 M150 122L150 180 M92 100L125 88 M208 100L175 88 M92 100L130 150 M208 100L170 150"/></g>
            </svg>
            <p class="small">The scanner measures the <b>structure</b> of the face: the distances between the eyes, nose, mouth and jaw.</p>
          </div>
          <div class="sim-box bio-m" data-m="voice" hidden>
            <svg viewBox="0 0 300 150" aria-label="Two voice prints compared">
              <text class="mc-cap" x="8" y="14">stored voice print</text><path class="bio-v" id="vA" d=""/>
              <text class="mc-cap" x="8" y="84">new sample</text><path class="bio-v b" id="vB" d=""/>
            </svg>
            <div class="ctrls"><span class="seg" id="spk"><button data-v="same">🙂 Alex says the phrase</button><button data-v="cold">🤧 Alex with a cold</button><button data-v="other">😐 Someone else</button></span></div>
          </div>
          <div class="sim-box bio-m" data-m="iris" hidden>
            <svg viewBox="0 0 300 160" aria-label="An eye with a detailed iris pattern">
              <path class="bio-white" d="M30 80Q150 -10 270 80Q150 170 30 80Z"/>
              <circle class="bio-iris" cx="150" cy="80" r="46"/>
              <g id="irisLines"></g>
              <circle class="bio-pupil" cx="150" cy="80" r="17"/>
              <circle class="bio-ring" cx="150" cy="80" r="50"/>
            </svg>
            <p class="small">The iris has a unique pattern. An iris scan is about <b>120 times more detailed</b> than a fingerprint, so iris recognition is 120 times more reliable for identifying people.</p>
          </div>
          <div class="readout"><button class="btn primary small-btn" id="mScan">▶ Scan</button><span class="ro" id="mRo"><small>Match with stored sample</small><b id="mOut">–</b></span></div>
        </div>

        <div data-panel="tbl" class="sim" hidden>
          <div class="tbl-wrap"><table class="tbl"><caption class="small muted">Table 1.2 Advantages and disadvantages of using biometric scanners</caption>
            <thead><tr><th>Advantages</th><th>Disadvantages</th></tr></thead><tbody>
            <tr data-zone="r1"><td>Easier for users than passwords, because biometric data cannot be forgotten</td><td>Cause privacy and security concerns, because detailed personal information is stored electronically</td></tr>
            <tr data-zone="r2"><td>More difficult to trick or confuse than some other methods</td><td>Possible to trick or confuse them</td></tr>
            <tr data-zone="r3"><td>Can speed up transactions</td><td>Expensive to make and buy</td></tr>
            <tr data-zone="r4"><td>Are not restricted by language barriers</td><td>Make some people feel uncomfortable</td></tr>
          </tbody></table></div>
          <p class="small">Some passports contain a chip with biometric data about the holder. At airports it is compared with the results of a biometric scan.</p>
        </div>
      </div>`;
    const root = el.querySelector('.bio'), $ = (s) => root.querySelector(s);
    let dead = false;
    const sleep = (ms) => FD.wait(ms).then(() => !dead);

    // ---- enrol and verify ----
    const ALEX = [42, 17, 63, 28, 51], SAM = [25, 39, 44, 57, 20];
    let tpl = null, person = 'alex', busy = false;
    const noisy = (base, n) => base.map((v) => Math.round(v + (Math.random() - 0.5) * n));
    const row = (vals, cls = '') => `<div class="bio-row ${cls}">${vals.map((v) => `<span>${v}</span>`).join('')}</div>`;
    function bioReset() { tpl = null; $('#rows').innerHTML = ''; $('#tpl').innerHTML = '<span class="muted">nothing stored yet</span>'; $('#match').textContent = '–'; $('#matchRo').className = 'ro'; door(false); $('#bioMsg').textContent = 'First, enrol the authorised user.'; }
    function door(open) { $('#door').textContent = open ? '🔓 open' : '🔒 locked'; $('#doorRo').className = 'ro ' + (open ? 'good' : ''); }
    async function scanAnim() { const l = $('#scanLine'); l.classList.remove('go'); void l.offsetWidth; l.classList.add('go'); return sleep(700); }
    async function enrol() {
      if (busy) return; busy = true;
      bioReset(); setPerson('alex');
      const samples = [];
      for (let i = 0; i < 3; i++) {
        $('#bioMsg').textContent = `Scanning sample ${i + 1} of 3…`;
        if (!(await scanAnim())) return;
        const s = noisy(ALEX, 8);
        samples.push(s);
        $('#rows').insertAdjacentHTML('beforeend', row(s));
      }
      tpl = ALEX.map((_, k) => Math.round(samples.reduce((a, s) => a + s[k], 0) / 3));
      $('#tpl').innerHTML = tpl.map((v) => `<span>${v}</span>`).join('');
      FD.pulse($('#tpl'));
      $('#bioMsg').innerHTML = 'The <b>average</b> of the samples is stored as Alex’s template.';
      busy = false;
    }
    function setPerson(p) { person = p; FD.segSet($('#person'), p); $('#who').textContent = p === 'alex' ? 'Alex' : 'Sam'; $('#rdPrint').innerHTML = print(p === 'alex' ? 'loop' : 'whorl', 'c1'); }
    async function verify() {
      if (busy) return;
      if (!tpl) { FD.shake($('#enrol')); $('#bioMsg').textContent = 'Nothing to compare with: enrol Alex first.'; return; }
      busy = true;
      if (!(await scanAnim())) return;
      const s = noisy(person === 'alex' ? ALEX : SAM, 8);
      const diff = s.reduce((a, v, k) => a + Math.abs(v - tpl[k]), 0);
      const pct = Math.round(100 * Math.exp(-diff / 120));
      const ok = pct >= 75;
      $('#rows').insertAdjacentHTML('beforeend', row(s, ok ? 'ok' : 'no'));
      $('#match').textContent = pct + '%';
      $('#matchRo').className = 'ro ' + (ok ? 'good' : 'bad');
      door(ok);
      if (ok) {
        tpl = tpl.map((v, k) => Math.round((v * 3 + s[k]) / 4));
        $('#tpl').innerHTML = tpl.map((v) => `<span>${v}</span>`).join('');
        FD.pulse($('#tpl'));
        $('#bioMsg').innerHTML = '✓ Close to the template: this is the <b>authorised user</b>. The template is updated with the new sample, so it gets better.';
      } else $('#bioMsg').innerHTML = '✗ Too different from the stored template: access denied.';
      busy = false;
    }
    $('#enrol').addEventListener('click', enrol);
    $('#verify').addEventListener('click', verify);
    $('#bioReset').addEventListener('click', bioReset);
    $('#person').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) setPerson(b.dataset.v); });

    // ---- fingerprint types ----
    let mys = 'loop';
    function another() {
      mys = ['arch', 'loop', 'whorl'][Math.floor(Math.random() * 3)];
      $('#mys').innerHTML = print(mys, 'cm');
      $('#mys').style.transform = `rotate(${Math.round((Math.random() - 0.5) * 30)}deg)`;
      $('#mys').classList.toggle('hurt', $('#injury').checked);
      $('#gMsg').textContent = '';
      FD.segSet($('#guess'), '');
    }
    $('#guess').addEventListener('click', (e) => {
      const b = e.target.closest('[data-v]'); if (!b) return;
      FD.segSet($('#guess'), b.dataset.v);
      const ok = b.dataset.v === mys;
      $('#gMsg').innerHTML = ok ? `✓ Yes, a <b>${mys}</b>.` : `✗ Look again: ${mys === 'arch' ? 'the ridges go from one side to the other, like a hill' : mys === 'loop' ? 'the ridges curve back on themselves, like a hairpin' : 'the ridges make circles or a spiral'}.`;
      $('#gMsg').className = 'small ' + (ok ? 'good' : 'bad');
    });
    $('#another').addEventListener('click', another);
    $('#injury').addEventListener('change', (e) => {
      $('#mys').classList.toggle('hurt', e.target.checked);
      $('#gMsg').innerHTML = e.target.checked ? 'Fingerprints can be <b>obscured, damaged or changed</b>, for example by injury or disease. Then the scanner may not recognise the authorised user.' : '';
      $('#gMsg').className = 'small';
    });

    // ---- face, voice, iris ----
    let meth = 'face', spk = 'same';
    const wave = (seed, amp) => { let d = ''; for (let x = 0; x <= 290; x += 3) { const y = Math.sin(x / 9 + seed) * Math.sin(x / 37 + seed * 2) * amp * (0.4 + 0.6 * Math.abs(Math.sin(x / 70 + seed))); d += (x ? 'L' : 'M') + (x + 5) + ' ' + y.toFixed(1); } return d; };
    function voice(v) {
      spk = v; FD.segSet($('#spk'), v);
      $('#vA').setAttribute('d', wave(1, 22)); $('#vA').setAttribute('transform', 'translate(0 45)');
      const seed = v === 'other' ? 2.7 : v === 'cold' ? 1.25 : 1.05;
      $('#vB').setAttribute('d', wave(seed, v === 'cold' ? 15 : 22)); $('#vB').setAttribute('transform', 'translate(0 115)');
      $('#mOut').textContent = '–'; $('#mRo').className = 'ro';
    }
    $('#spk').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) voice(b.dataset.v); });
    let ir = 7;
    const rnd = () => { ir = (ir * 16807) % 2147483647; return ir / 2147483647; };
    $('#irisLines').innerHTML = Array.from({ length: 90 }, (_, i) => { const a = (i / 90) * Math.PI * 2 + rnd() * 0.05, r1 = 19 + rnd() * 6, r2 = 34 + rnd() * 12; return `<path class="bio-fib" d="M${150 + Math.cos(a) * r1} ${80 + Math.sin(a) * r1}L${150 + Math.cos(a + rnd() * 0.2) * r2} ${80 + Math.sin(a + rnd() * 0.2) * r2}"/>`; }).join('');
    function method(m) {
      meth = m; FD.segSet($('#meth'), m);
      root.querySelectorAll('.bio-m').forEach((x) => { x.hidden = x.dataset.m !== m; });
      $('#mOut').textContent = '–'; $('#mRo').className = 'ro';
      root.querySelector('.bio-m[data-m="face"]').classList.remove('scanned');
      root.querySelector('.bio-m[data-m="iris"]').classList.remove('scanned');
    }
    $('#meth').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) method(b.dataset.v); });
    async function mScan() {
      const box = root.querySelector(`.bio-m[data-m="${meth}"]`);
      box.classList.remove('scanned'); void box.offsetWidth; box.classList.add('scanned');
      if (!(await sleep(1000))) return;
      const pct = meth === 'voice' ? { same: 94, cold: 71, other: 23 }[spk] : meth === 'iris' ? 99 : 91;
      $('#mOut').textContent = `${pct}% ${pct >= 80 ? '✓ match' : '✗ no match'}`;
      $('#mRo').className = 'ro ' + (pct >= 80 ? 'good' : 'bad');
    }
    $('#mScan').addEventListener('click', mScan);

    const show = FD.panels(root);
    bioReset(); setPerson('alex'); another(); voice('same'); method('face');
    show('enrol');
    return {
      show, enrol, verify, setPerson, method, voice, mScan, another,
      hasTpl: () => !!tpl,
      rows: (z) => FD.focus(root.querySelector('[data-panel="tbl"] table'), z),
      destroy() { dead = true; },
    };
  },
  steps: [
    {
      title: 'Biometric scanners',
      text: `<p><strong>Biometric scanners</strong> measure part of the <strong>unique physical characteristics</strong> of a user.</p>
             <p>They often measure it <strong>several times</strong>, until a suitable <strong>average</strong> result is produced. This average result is then stored.</p>`,
      tip: 'Try it: enrol Alex, then try to open the door as Alex and as Sam.',
      async on(a) { a.show('enrol'); await a.enrol(); },
    },
    {
      title: 'Checking a new sample',
      text: `<p>Future samples are <strong>compared</strong> against the stored average to check whether the person being scanned is the <strong>authorised user</strong>.</p>
             <p>This also allows the stored information to be <strong>updated</strong>, so that the saved sample is perfected.</p>`,
      async on(a, ctx) { a.show('enrol'); if (!a.hasTpl()) await a.enrol(); if (!ctx.alive()) return; a.setPerson('alex'); if (!(await ctx.sleep(500))) return; await a.verify(); if (!(await ctx.sleep(1800))) return; a.setPerson('sam'); if (!(await ctx.sleep(400))) return; await a.verify(); },
    },
    {
      title: 'Fingerprint recognition',
      text: `<p>Fingerprint scanners read the patterns of <strong>arches</strong>, <strong>loops</strong> and <strong>whorls</strong> in a human fingerprint.</p>
             <p>Fingerprints are unique to each person, which makes them a useful method of identification. But fingerprints can be <strong>obscured, damaged or changed</strong>, for example by injury or disease.</p>`,
      tip: 'Try it: identify the mystery print. Look at your own fingertips too!',
      on: (a) => { a.show('fp'); a.another(); },
    },
    {
      title: 'Facial recognition',
      text: `<p><strong>Facial recognition</strong> scanners identify the <strong>structure</strong> of a human face in order to identify a person.</p>
             <p>Surveillance scanners are also used by some government agencies to recognise vehicle number plates, models and colours.</p>`,
      async on(a, ctx) { a.show('meth'); a.method('face'); if (!(await ctx.sleep(600))) return; await a.mScan(); },
    },
    {
      title: 'Voice recognition',
      text: `<p><strong>Voice recognition</strong> scanners need a <strong>microphone</strong> to capture the voice.</p>
             <p>They then compare the <strong>voice print</strong> against a saved original and check whether the two prints match.</p>`,
      tip: 'Try it: what happens to the match when Alex has a cold?',
      async on(a, ctx) { a.show('meth'); a.method('voice'); a.voice('same'); if (!(await ctx.sleep(600))) return; await a.mScan(); if (!(await ctx.sleep(1500))) return; a.voice('other'); await a.mScan(); },
    },
    {
      title: 'Iris recognition',
      text: `<p>Like fingerprints, the human <strong>iris</strong> has a unique pattern. An iris scan is approximately <strong>120 times more detailed</strong> than a fingerprint.</p>
             <p>This means that iris recognition is <strong>120 times more reliable</strong> when identifying people. Some passports contain a chip with biometric data, which is compared with biometric scans at airports.</p>`,
      async on(a, ctx) { a.show('meth'); a.method('iris'); if (!(await ctx.sleep(600))) return; await a.mScan(); },
    },
    {
      title: 'Advantages and disadvantages',
      text: `<p>Biometric data <strong>cannot be forgotten</strong>, can <strong>speed up transactions</strong> and is not restricted by language barriers.</p>
             <p>But detailed <strong>personal information</strong> is stored electronically, the scanners are <strong>expensive</strong>, they can still be tricked, and some people feel <strong>uncomfortable</strong> using them.</p>`,
      async on(a, ctx) { a.show('tbl'); for (const r of ['r1', 'r2', 'r3', 'r4']) { a.rows([r]); if (!(await ctx.sleep(1500))) return; } a.rows([]); },
    },
  ],
});

FD.activities({
  section: 'biometrics',
  items: [
    {
      id: 'biotable',
      title: 'Using biometric scanners',
      task: `<ol><li>Research and create a table that compares the advantages and disadvantages of each method of biometric scanning (fingerprint, face, voice, iris).</li>
             <li>Create a survey to ask other people how they would feel about using each type of biometric scanner. What are their concerns?</li>
             <li>What affects the reliability of each type of biometric scanner? Discuss your findings with your teacher and the rest of your class.</li>
             <li>What other factors could be considered when choosing a biometric security system?</li></ol>`,
      fields: ['1. Fingerprint: + / −', '1. Face: + / −', '1. Voice: + / −', '1. Iris: + / −', '2. People’s main concerns', '3. What affects reliability'],
      lines: 3,
      hint: '4. Other factors to consider (cost, speed, number of users…)',
    },
  ],
});

FD.check({
  section: 'biometrics',
  items: [
    { type: 'mcq', q: 'How does a biometric scanner create the sample it stores?', opts: ['It measures the characteristic several times and stores an average result', 'It takes one photo and prints it', 'It asks the user to type a password', 'It downloads the sample from the internet'], why: 'Future samples are compared with this stored average.' },
    { type: 'multi', q: 'Which three patterns are read by fingerprint scanners?', need: 3, opts: [['Arches', true], ['Loops', true], ['Whorls', true], ['Pixels', false], ['Barcodes', false]], why: 'Figure 1.52: arch, loop and whorl.' },
    { type: 'mcq', q: 'Why is iris recognition more reliable than fingerprint recognition?', opts: ['An iris scan is about 120 times more detailed', 'Irises change every day', 'It uses a microphone', 'It does not need a computer'], why: 'More detail means it is 120 times more reliable when identifying people.' },
    {
      type: 'sort',
      q: 'Advantage or disadvantage of biometric scanners? (Table 1.2)',
      bins: ['Advantage', 'Disadvantage'],
      rows: [['Biometric data cannot be forgotten', 0], ['Detailed personal information is stored electronically', 1], ['Can speed up transactions', 0], ['Expensive to make and buy', 1], ['Not restricted by language barriers', 0], ['Make some people feel uncomfortable', 1]],
      why: 'Table 1.2.',
    },
    { type: 'tf', q: 'A fingerprint scanner may not recognise someone whose finger has been injured.', a: true, why: 'Fingerprints can be obscured, damaged or changed by injury or disease.' },
    { type: 'mcq', q: 'Which input device does a voice recognition scanner need?', opts: ['A microphone', 'A webcam', 'A graphics tablet', 'A barcode scanner'], why: 'It compares the voice print with a saved original.' },
  ],
});
