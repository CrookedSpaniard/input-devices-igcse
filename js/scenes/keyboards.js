FD.add({
  id: 'keyboards',
  title: 'Keyboards',
  tab: 'Keyboards',
  icon: 'keyboards',
  color: '--c2',
  section: true,
  interactive: true,
  vocab: [
    ['keys', 'buttons that users press to input text or to interact with software'],
    ['shortcut', 'a combination of key presses used to access common software commands quickly'],
    ['touch-type', 'type without needing to look at the keys'],
    ['mapped', 'linked (keys mapped to specialist commands)'],
  ],
  mount(el) {
    const LAYOUTS = {
      uk: { n: 'QWERTY (UK English)', rows: ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'] },
      es: { n: 'QWERTY (Spanish)', rows: ['qwertyuiop', 'asdfghjklñ', 'zxcvbnm'] },
      fr: { n: 'AZERTY (French)', rows: ['azertyuiop', 'qsdfghjklm', 'wxcvbn'] },
      de: { n: 'QWERTZ (German)', rows: ['qwertzuiopü', 'asdfghjklöä', 'yxcvbnm'] },
    };
    const SC = [
      ['c', 'Copy', 'Copies the selected text.'],
      ['v', 'Paste', 'Puts the copied text where the cursor is.'],
      ['b', 'Bold', 'Makes the selected text bold.'],
      ['z', 'Undo', 'Undoes the last thing you did.'],
      ['a', 'Select all', 'Selects everything in the document.'],
      ['s', 'Save', 'Saves the document.'],
    ];
    const SENT = 'the quick brown fox jumps over the lazy dog';
    const MAP = [
      ['j', '◀◀', 'Rewind'], ['k', '❚❚', 'Pause'], ['l', '▶▶', 'Play'], ['c', '✂', 'Cut clip'], ['m', '⚑', 'Add marker'], ['x', '🗑', 'Delete clip'],
    ];
    const mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    const MOD = mac ? '⌘' : 'Ctrl';
    el.innerHTML = `
      <div class="sim kb">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="lay">⌨️ Keys and layouts</button><button data-p="sc">⚡ Shortcuts</button><button data-p="touch">👀 Touch-typing</button><button data-p="map">🎬 Mapped keys</button>
        </div>

        <div data-panel="lay" class="sim">
          <div class="ctrls">
            <span class="seg" id="lays"><span class="seg-l">Layout</span>${Object.entries(LAYOUTS).map(([k, l]) => `<button data-v="${k}">${l.n}</button>`).join('')}</span>
            <span class="seg" id="conn"><span class="seg-l">Connection</span><button data-v="wired">🔌 Wired</button><button data-v="wl">ᛒ Wireless</button></span>
          </div>
          <div class="kb-wrap" id="pad" tabindex="0" data-keys aria-label="Keyboard: click here, then type">
            <div class="kb-pc"><span class="kb-link" id="link"></span><div class="kb-out" id="out" aria-live="polite"></div></div>
            <div class="kb-keys" id="keys"></div>
          </div>
          <p class="small" id="layMsg">Click the keys, or click the keyboard and type on your own keyboard.</p>
        </div>

        <div data-panel="sc" class="sim" hidden>
          <div class="kb-doc" id="doc" tabindex="0" data-keys aria-label="Practice document: try the keyboard shortcuts here">
            <div class="kb-menu"><b>File</b><b>Edit</b><b>Format</b><span class="kb-saved" id="saved"></span></div>
            <p class="kb-text" id="docTxt"></p>
          </div>
          <div class="kb-sc">
            <div class="kb-mini">
              <button class="kb-k mod" id="mod" aria-pressed="false">${MOD}</button>
              ${SC.map(([k]) => `<button class="kb-k" data-k="${k}">${k.toUpperCase()}</button>`).join('')}
            </div>
            <ul class="kb-list" id="scList">${SC.map(([k, n]) => `<li data-k="${k}"><kbd>${MOD}</kbd>+<kbd>${k.toUpperCase()}</kbd> <span>${n}</span></li>`).join('')}</ul>
          </div>
          <p class="small" id="scMsg">Click inside the document and press <kbd>${MOD}</kbd> + a letter, or use the buttons: first <b>${MOD}</b>, then the letter.</p>
        </div>

        <div data-panel="touch" class="sim" hidden>
          <div class="sim-box kb-race">
            <p class="kb-sent"><code>${SENT}</code></p>
            <div class="meter"><span class="meter-l">👀 Looks at the keys</span><span class="bar"><i id="r1"></i></span></div>
            <div class="meter"><span class="meter-l">🙌 Touch-types</span><span class="bar"><i id="r2"></i></span></div>
            <div class="meter"><span class="meter-l">🧑 You</span><span class="bar"><i id="r3"></i></span></div>
          </div>
          <div class="ctrls"><button class="btn primary small-btn" id="race">▶ Race</button><label class="rng"><span>Type the sentence above <output id="wpm"></output></span><input type="text" id="me" autocomplete="off" spellcheck="false" placeholder="Start typing to start the clock…"></label></div>
          <div class="kb-home">${['asdf', 'jkl;'].map((h) => `<span>${[...h].map((c) => `<kbd>${c.toUpperCase()}</kbd>`).join('')}</span>`).join('<i>home row</i>')}</div>
        </div>

        <div data-panel="map" class="sim kb-mappanel" id="mapP" tabindex="0" data-keys hidden>
          <div class="kb-tl sim-box">
            <div class="kb-track" id="track"></div>
          </div>
          <div class="kb-mapkeys">${MAP.map(([k, s, n]) => `<button class="kb-k big" data-m="${k}"><b>${s}</b><small>${n}</small><i>${k.toUpperCase()}</i></button>`).join('')}</div>
          <p class="small" id="mapMsg">Each coloured key is <b>mapped</b> (linked) to a video-editing command. Click the keys, or click here and press J, K, L, C, M or X.</p>
        </div>
      </div>`;
    const root = el.querySelector('.kb'), $ = (s) => root.querySelector(s);

    // ---- layouts ----
    let lay = 'uk', typed = '';
    function layout(k) {
      lay = k;
      FD.segSet($('#lays'), k);
      $('#keys').innerHTML = LAYOUTS[k].rows.map((r, i) => `<div class="kb-row" style="--i:${i}">${[...r].map((c) => `<button class="kb-k" data-c="${c}">${c.toUpperCase()}</button>`).join('')}</div>`).join('') +
        '<div class="kb-row"><button class="kb-k space" data-c=" ">space</button><button class="kb-k" data-c="⌫">⌫</button></div>';
    }
    function conn(v) { FD.segSet($('#conn'), v); $('#link').className = 'kb-link ' + v; $('#link').textContent = v === 'wl' ? 'ᛒ wireless' : ''; }
    function press(c) {
      const b = $(`#keys [data-c="${CSS.escape(c)}"]`);
      if (b) { b.classList.remove('hit'); void b.offsetWidth; b.classList.add('hit'); }
      typed = c === '⌫' ? typed.slice(0, -1) : (typed + c).slice(-60);
      $('#out').textContent = typed;
    }
    $('#keys').addEventListener('click', (e) => { const b = e.target.closest('[data-c]'); if (b) press(b.dataset.c); });
    $('#lays').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) { layout(b.dataset.v); $('#layMsg').innerHTML = `Look at the top-left letter key: <b>${LAYOUTS[lay].rows[0][0].toUpperCase()}</b>. The same position gives a different letter in different layouts.`; } });
    $('#conn').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) conn(b.dataset.v); });
    $('#pad').addEventListener('keydown', (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.key === 'Tab') return;
      if (e.key === 'Backspace') { e.preventDefault(); press('⌫'); }
      else if (e.key.length === 1) { e.preventDefault(); press(e.key.toLowerCase()); }
    });
    $('#pad').addEventListener('pointerdown', (e) => { if (!e.target.closest('button')) $('#pad').focus(); });

    // ---- shortcuts ----
    const BASE = 'Keyboard shortcuts save time.';
    let doc = { text: BASE, sel: false, bold: false, clip: '', hist: [] };
    function drawDoc() {
      const t = FD.esc(doc.text);
      $('#docTxt').innerHTML = `<span class="${doc.sel ? 'sel' : ''} ${doc.bold ? 'bold' : ''}">${t}</span><span class="caret"></span>`;
    }
    function shortcut(k) {
      const before = JSON.stringify(doc);
      const msg = { c: '', v: '', b: '', z: '', a: '', s: '' };
      if (k === 'a') { doc.sel = true; msg.a = 'Everything is selected.'; }
      else if (k === 'c') { if (doc.sel) { doc.clip = doc.text; msg.c = 'Copied to the clipboard.'; } else msg.c = 'Nothing is selected. Select all first (' + MOD + '+A).'; }
      else if (k === 'v') { if (doc.clip) { doc.text = (doc.text + ' ' + doc.clip).slice(0, 150); doc.sel = false; msg.v = 'Pasted.'; } else msg.v = 'The clipboard is empty. Copy something first.'; }
      else if (k === 'b') { if (doc.sel) { doc.bold = !doc.bold; msg.b = doc.bold ? 'Bold on.' : 'Bold off.'; } else msg.b = 'Select the text first.'; }
      else if (k === 'z') { const p = doc.hist.pop(); if (p) { doc = { ...JSON.parse(p), hist: doc.hist }; msg.z = 'Undone.'; } else msg.z = 'Nothing to undo.'; }
      else if (k === 's') { $('#saved').textContent = '✓ Saved ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }); FD.pulse($('#saved')); msg.s = 'Saved.'; }
      if (k !== 'z' && JSON.stringify(doc) !== before) doc.hist.push(before);
      drawDoc();
      const li = $(`#scList [data-k="${k}"]`);
      li.classList.add('done'); FD.pulse(li);
      const [, n, d] = SC.find((x) => x[0] === k);
      $('#scMsg').innerHTML = `<kbd>${MOD}</kbd>+<kbd>${k.toUpperCase()}</kbd> = <b>${n}</b>. ${d} <span class="muted">${msg[k]}</span>`;
      const n6 = root.querySelectorAll('#scList .done').length;
      if (n6 === SC.length) $('#scMsg').innerHTML += ' <b class="good">🎉 You used all six shortcuts!</b>';
    }
    let modOn = false;
    const setMod = (v) => { modOn = v; $('#mod').classList.toggle('on', v); $('#mod').setAttribute('aria-pressed', v); };
    $('#mod').addEventListener('click', () => setMod(!modOn));
    root.querySelectorAll('.kb-mini [data-k]').forEach((b) => b.addEventListener('click', () => {
      if (!modOn) { FD.shake(b); $('#scMsg').innerHTML = `A shortcut is a <b>combination</b> of keys: press <b>${MOD}</b> first.`; return; }
      setMod(false); shortcut(b.dataset.k);
    }));
    $('#doc').addEventListener('keydown', (e) => {
      const k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && SC.some((s) => s[0] === k)) { e.preventDefault(); e.stopPropagation(); shortcut(k); }
    });
    function scReset() { doc = { text: BASE, sel: false, bold: false, clip: '', hist: [] }; $('#saved').textContent = ''; root.querySelectorAll('#scList li').forEach((l) => l.classList.remove('done')); drawDoc(); setMod(false); }

    // ---- touch-typing race ----
    let raceRun = 0, t0 = 0;
    async function race() {
      const id = ++raceRun;
      // 25 and 60 words per minute, sped up ×6 so it fits in a few seconds
      const words = SENT.split(' ').length, slow = (words / 25) * 60000 / 6, fast = (words / 60) * 60000 / 6;
      $('#r1').style.width = '0%'; $('#r2').style.width = '0%';
      await FD.tween(slow, (t) => {
        if (id !== raceRun) return;
        $('#r1').style.width = (100 * t) + '%';
        $('#r2').style.width = Math.min(100, (100 * t * slow) / fast) + '%';
      });
    }
    $('#race').addEventListener('click', race);
    $('#me').addEventListener('input', (e) => {
      const v = e.target.value.toLowerCase();
      if (v.length === 1 || !t0) t0 = Date.now();
      let ok = 0;
      while (ok < v.length && v[ok] === SENT[ok]) ok++;
      $('#r3').style.width = (100 * ok / SENT.length) + '%';
      e.target.classList.toggle('err', ok < v.length);
      if (ok === SENT.length) {
        const mins = (Date.now() - t0) / 60000, wpm = Math.round(SENT.split(' ').length / mins);
        $('#wpm').textContent = `${wpm} words per minute 🎉`;
      } else $('#wpm').textContent = ok < v.length ? 'typo! fix it' : '';
    });

    // ---- mapped keys ----
    let tl = { head: 10, clips: [[0, 45], [45, 100]], marks: [], play: 0 }, tlTimer = null;
    function drawTl() {
      $('#track').innerHTML = tl.clips.map(([a, b], i) => `<span class="kb-clip" style="left:${a}%;width:${b - a}%;--h:${(i * 57) % 360}">clip ${i + 1}</span>`).join('') +
        tl.marks.map((m) => `<span class="kb-mark" style="left:${m}%">⚑</span>`).join('') +
        `<span class="kb-head" style="left:${tl.head}%"></span>`;
    }
    function playDir(d) {
      clearInterval(tlTimer); tl.play = d;
      if (d) tlTimer = setInterval(() => { tl.head = FD.clamp(tl.head + d * 1.2, 0, 100); drawTl(); if (tl.head <= 0 || tl.head >= 100) playDir(0); }, 60);
    }
    function mapKey(k) {
      const b = $(`[data-m="${k}"]`);
      if (b) { b.classList.remove('hit'); void b.offsetWidth; b.classList.add('hit'); }
      const name = MAP.find((m) => m[0] === k)[2];
      if (k === 'l') playDir(1);
      if (k === 'j') playDir(-1);
      if (k === 'k') playDir(0);
      if (k === 'm') tl.marks.push(tl.head);
      if (k === 'c') {
        const i = tl.clips.findIndex(([a, z]) => tl.head > a + 2 && tl.head < z - 2);
        if (i >= 0) { const [a, z] = tl.clips[i]; tl.clips.splice(i, 1, [a, tl.head], [tl.head, z]); }
      }
      if (k === 'x') {
        const i = tl.clips.findIndex(([a, z]) => tl.head >= a && tl.head < z);
        if (i >= 0 && tl.clips.length > 1) tl.clips.splice(i, 1);
      }
      drawTl();
      $('#mapMsg').innerHTML = `<kbd>${k.toUpperCase()}</kbd> is mapped to <b>${name}</b>. One key press does a job that would need several mouse clicks.`;
    }
    root.querySelectorAll('[data-m]').forEach((b) => b.addEventListener('click', () => mapKey(b.dataset.m)));
    $('#mapP').addEventListener('keydown', (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (MAP.some((m) => m[0] === e.key.toLowerCase())) { e.preventDefault(); mapKey(e.key.toLowerCase()); }
    });
    function tlReset() { playDir(0); tl = { head: 10, clips: [[0, 45], [45, 100]], marks: [], play: 0 }; drawTl(); }

    const show = FD.panels(root, (p) => { if (p !== 'map') playDir(0); });
    layout('uk'); conn('wired'); scReset(); tlReset(); show('lay');
    return {
      show, layout, conn, press, shortcut, scReset, race, mapKey, tlReset,
      async typeOn(w, ctx) { typed = ''; $('#out').textContent = ''; for (const c of w) { press(c); if (!(await ctx.sleep(260))) return; } },
      destroy() { playDir(0); raceRun++; },
    };
  },
  steps: [
    {
      title: 'Keyboards',
      text: `<p>Keyboards use buttons known as <strong>keys</strong>, which users press to <strong>input text</strong> or to <strong>interact with software</strong>.</p>
             <p>Keyboards send data to the computer using either a <strong>wired</strong> or a <strong>wireless</strong> connection.</p>`,
      tip: 'Try it: click the keys or type on your own keyboard, then switch to wireless.',
      async on(a, ctx) { a.show('lay'); a.layout('uk'); a.conn('wired'); await a.typeOn('hello', ctx); if (!(await ctx.sleep(500))) return; a.conn('wl'); },
    },
    {
      title: 'Different layouts',
      text: `<p>Different types of keyboard are used for different <strong>operating systems</strong>, <strong>languages</strong> and <strong>functions</strong>.</p>
             <p>For example, French keyboards use <strong>AZERTY</strong>, German keyboards use <strong>QWERTZ</strong>, and Spanish keyboards add the key <strong>Ñ</strong>. Apple computers have a <strong>⌘ (command)</strong> key where Windows PCs use <strong>Ctrl</strong>.</p>`,
      async on(a, ctx) { a.show('lay'); for (const k of ['uk', 'fr', 'de', 'es']) { a.layout(k); if (!(await ctx.sleep(1100))) return; } },
    },
    {
      title: 'Shortcuts',
      text: `<p>Combinations of key presses let the user access common software commands quickly. These are called <strong>shortcuts</strong>.</p>
             <p>Menus often show the shortcut next to each command, for example <strong>${/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? '⌘' : 'Ctrl'}+S</strong> next to <em>Save</em>.</p>`,
      tip: 'Try it: select all, copy, paste, make it bold, undo and save — using only shortcuts.',
      async on(a, ctx) { a.show('sc'); a.scReset(); for (const k of ['a', 'c', 'v']) { if (!(await ctx.sleep(1100))) return; a.shortcut(k); } },
    },
    {
      title: 'Touch-typing',
      text: `<p>Some people learn to <strong>touch-type</strong>: a method of typing without needing to look at the keys. Your fingers rest on the <strong>home row</strong> and each finger has its own keys.</p>
             <p>This <strong>increases the speed</strong> at which these people can input data.</p>`,
      tip: 'Try it: race the two typists, then type the sentence yourself and see your speed.',
      async on(a) { a.show('touch'); a.race(); },
    },
    {
      title: 'Mapped keys',
      text: `<p>Some keyboards are made for <strong>specialist software</strong>, such as video editing. Their keys are <strong>mapped</strong> (linked) to specialist commands and are often coloured.</p>
             <p>Here: <kbd>L</kbd> play, <kbd>K</kbd> pause, <kbd>J</kbd> rewind, <kbd>C</kbd> cut, <kbd>M</kbd> marker, <kbd>X</kbd> delete.</p>`,
      tip: 'Did you know? The QWERTY layout comes from typewriters. The most common letters were spread out to reduce the number of times the metal hammers hit each other.',
      async on(a, ctx) { a.show('map'); a.tlReset(); if (!(await ctx.sleep(700))) return; a.mapKey('l'); if (!(await ctx.sleep(1500))) return; a.mapKey('k'); if (!(await ctx.sleep(500))) return; a.mapKey('c'); if (!(await ctx.sleep(900))) return; a.mapKey('m'); },
    },
  ],
});

FD.activities({
  section: 'keyboards',
  items: [
    {
      id: 'shortcuts3',
      title: 'Keyboard shortcuts',
      task: '<p>Choose a piece of software and look up <b>three keyboard shortcuts</b> that you could use to complete common tasks more quickly.</p>',
      fields: ['Software', 'Shortcut 1 (keys → task)', 'Shortcut 2 (keys → task)', 'Shortcut 3 (keys → task)'],
      lines: 2,
      hint: 'Anything else? e.g. which one you will use most and why…',
    },
  ],
});

FD.check({
  section: 'keyboards',
  items: [
    { type: 'mcq', q: 'What is a keyboard shortcut?', opts: ['A combination of key presses used to access common software commands quickly', 'A shorter keyboard with fewer keys', 'A cable that connects a keyboard to a computer', 'A key that types two letters at once'], why: 'For example Ctrl+C (⌘+C) copies.' },
    { type: 'tf', q: 'Touch-typing means typing without needing to look at the keys, which increases typing speed.', a: true, why: 'Touch-typists can input data faster.' },
    { type: 'mcq', q: 'On a keyboard made for video-editing software, the keys are “mapped”. What does this mean?', opts: ['They are linked to specialist commands', 'They show a map of the world', 'They only work with a wireless connection', 'They are arranged in alphabetical order'], why: 'Mapped = linked.' },
    { type: 'mcq', q: 'Why are there different keyboard layouts?', opts: ['For different operating systems, languages and functions', 'To make keyboards cheaper', 'Because wireless keyboards need fewer keys', 'To stop people from touch-typing'], why: 'E.g. AZERTY for French, ⌘ keys for Apple computers, coloured keys for video software.' },
    { type: 'multi', q: 'Which two statements about keyboards are true?', need: 2, opts: [['Keyboards can use a wired or a wireless connection', true], ['Keys are used to input text or interact with software', true], ['A keyboard is an output device', false], ['All keyboards in the world use the same layout', false]], why: 'Keyboards are input devices; layouts vary.' },
    { type: 'mcq', q: 'Why are the most common letters spread out on a QWERTY keyboard?', opts: ['It comes from typewriters, to reduce the number of times the metal hammers hit each other', 'To make touch-typing impossible', 'Because computers process those letters faster', 'To save space on laptops'], why: 'The QWERTY layout comes from the typewriter.' },
  ],
});
