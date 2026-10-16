FD.add({
  id: 'peripherals',
  title: 'Types of peripheral devices',
  tab: 'Peripherals',
  icon: 'peripherals',
  color: '--c4',
  section: true,
  interactive: true,
  vocab: [
    ['peripheral', 'a device that can be connected to a computer, such as a PC or tablet, inside or outside it'],
    ['input', 'a peripheral that sends data to the computer'],
    ['output', 'a peripheral that presents the results of the computer’s processing'],
    ['storage', 'a peripheral that keeps data so it can be used again later'],
  ],
  mount(el) {
    const DEV = [
      ['⌨️', 'Keyboard', 0, 'You press keys to send text and commands to the computer.'],
      ['🖱️', 'Mouse', 0, 'It sends movements and clicks to the computer.'],
      ['🖥️', 'Monitor', 1, 'It shows the results of processing on an electronic display.'],
      ['🖨️', 'Printer', 1, 'It outputs printed text and images.'],
      ['💾', 'USB flash drive', 2, 'It stores files so they can be used later or on another computer.'],
      ['🎤', 'Microphone', 0, 'It captures sound and sends it to the computer.'],
      ['🔊', 'Speakers', 1, 'They output audio.'],
      ['📷', 'Webcam', 0, 'It captures images and video.'],
      ['🗄️', 'External hard drive', 2, 'It stores large amounts of data, e.g. backups.'],
      ['🌡️', 'Temperature sensor', 0, 'It inputs data about the physical environment automatically.'],
      ['🕹️', 'Joystick', 0, 'It sends movements to control sprites in a game.'],
      ['📠', 'Scanner', 0, 'It records a physical document as an image file.'],
    ];
    const BIN = ['Input', 'Output', 'Storage'];
    el.innerHTML = `
      <div class="sim pf">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="flow">🔁 Input → process → output</button><button data-p="sort">🗂️ Sort the peripherals</button><button data-p="jobs">🎯 What input devices do</button>
        </div>

        <div data-panel="flow" class="sim">
          <div class="sim-box">
            <svg viewBox="0 0 560 250" role="img" aria-label="A keyboard sends data to a computer, which sends results to a monitor and can save to a USB flash drive">
              <defs><marker id="pfA" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="var(--red-ui)"/></marker></defs>
              <g data-zone="in">
                <rect class="dv-body" x="20" y="168" width="180" height="46" rx="6"/>
                ${[0, 1, 2].map((r) => Array.from({ length: 12 }, (_, c) => `<rect class="dv-screen" x="${28 + c * 14 + (r === 2 ? 7 : 0)}" y="${174 + r * 12}" width="11" height="9" rx="2"/>`).join('')).join('')}
                <text class="svg-lbl" x="110" y="236">Keyboard</text>
              </g>
              <path class="pf-arrow" id="aIn" d="M190 160L246 128" marker-end="url(#pfA)"/>
              <text class="pf-tag" x="196" y="128">Input</text>
              <g data-zone="cpu">
                <rect class="dv-body" x="250" y="40" width="66" height="168" rx="6"/>
                <rect class="dv-detail" x="260" y="56" width="46" height="8" rx="2"/>
                <rect class="dv-detail" x="260" y="72" width="46" height="8" rx="2"/>
                <circle class="pf-led" id="cpuLed" cx="283" cy="190" r="5"/>
                <text class="svg-lbl" x="283" y="232">Computer</text>
                <text class="svg-sm" x="283" y="246">processes the data</text>
              </g>
              <path class="pf-arrow" d="M322 150L398 176" marker-end="url(#pfA)"/>
              <text class="pf-tag" x="356" y="190">Output</text>
              <g data-zone="out">
                <rect class="dv-body" x="400" y="128" width="146" height="90" rx="6"/>
                <rect class="dv-screen" x="408" y="136" width="130" height="72" rx="2"/>
                <text class="pf-screen" id="scr" x="414" y="158"></text>
                <text class="pf-screen sm" id="scr2" x="414" y="196"></text>
                <rect class="dv-body" x="462" y="218" width="22" height="10"/>
                <rect class="dv-body" x="446" y="226" width="54" height="6" rx="3"/>
                <text class="svg-lbl" x="473" y="248">Monitor</text>
              </g>
              <path class="pf-arrow" d="M322 80L420 52" marker-start="url(#pfA)" marker-end="url(#pfA)"/>
              <text class="pf-tag" x="356" y="50">Storage</text>
              <g data-zone="store">
                <rect class="dv-detail" x="424" y="36" width="20" height="26" rx="2"/>
                <rect class="dv-body" x="442" y="30" width="80" height="38" rx="8"/>
                <text class="pf-usb" id="usb" x="482" y="54">0 files</text>
                <text class="svg-lbl" x="482" y="90">USB flash drive</text>
              </g>
              <g id="pkt" opacity="0"><circle class="pkt" r="13"/><text class="pkt-t" id="pktT" y="4">A</text></g>
            </svg>
          </div>
          <div class="ctrls">
            <label class="rng pf-type"><span>Type on the keyboard</span><input id="typeIn" maxlength="24" placeholder="Type here…" autocomplete="off"></label>
            <button class="btn small-btn" id="save">💾 Save to the USB drive</button>
            <button class="btn small-btn" id="open">📂 Open the file</button>
            <button class="mini-btn" id="clr">↺ Clear</button>
          </div>
          <p class="small" id="flowMsg">Each key press is <b>input</b>. The computer <b>processes</b> it and the monitor <b>outputs</b> the result.</p>
        </div>

        <div data-panel="sort" class="sim" hidden>
          <p class="ui-hint">Is each peripheral an <b>input</b>, an <b>output</b> or a <b>storage</b> device? Choose for each one.</p>
          <div class="pf-grid" id="grid">${DEV.map(([e, n], i) => `
            <div class="pf-dev" data-i="${i}"><span class="pf-e">${e}</span><b>${n}</b>
              <span class="pf-bins">${BIN.map((b, k) => `<button data-k="${k}">${b}</button>`).join('')}</span>
              <small class="pf-why"></small></div>`).join('')}</div>
          <div class="readout"><span class="ro" id="sortRo"><small>Correct</small><b id="sortN">0 / ${DEV.length}</b></span><button class="mini-btn" id="sortReset">↺ Start again</button></div>
        </div>

        <div data-panel="jobs" class="sim" hidden>
          <div class="cards3 pf-jobs">
            <div class="mini" data-zone="ctrl" style="--c:var(--c4)"><h5>🎮 Control the computer</h5><p>The user tells the computer what to do.</p>
              <div class="chips">${['⌨️ keyboard', '🖱️ mouse', '☝️ touch screen', '🕹️ joystick', '🗣️ voice commands'].map((x) => `<span class="pill">${x}</span>`).join('')}</div></div>
            <div class="mini" data-zone="cap" style="--c:var(--c1)"><h5>📥 Capture data from outside the system</h5><p>Data from the real world is turned into data the computer can store.</p>
              <div class="chips">${['📠 scanner', '📷 webcam', '🎤 microphone', '▮▯▮ barcode scanner', '🌡️ sensors'].map((x) => `<span class="pill">${x}</span>`).join('')}</div></div>
          </div>
          <div class="sim-box pf-in">
            <p class="strong">Inside or outside?</p>
            <p class="small">Peripherals can be connected <b>inside</b> or <b>outside</b> the computer. A laptop’s built-in webcam and track pad are inside; a USB keyboard or a Bluetooth mouse is outside.</p>
          </div>
        </div>
      </div>`;
    const root = el.querySelector('.pf'), $ = (s) => root.querySelector(s);
    const svg = root.querySelector('svg');

    const P = { kbd: [110, 168], cpu: [283, 120], mon: [473, 172], usb: [482, 49] };
    let text = '', files = 0;
    const draw = () => {
      $('#scr').textContent = text.slice(-16) + '▌';
      $('#usb').textContent = files === 1 ? '1 file' : files + ' files';
    };
    let busy = Promise.resolve(), dead = false;
    function fly(label, path, ms = 700) {
      const g = $('#pkt');
      if (dead || !g) return Promise.resolve();
      $('#pktT').textContent = label;
      g.setAttribute('opacity', 1);
      return FD.tween(ms, (t) => { const [x, y] = FD.along(path, t); g.setAttribute('transform', `translate(${x} ${y})`); })
        .then(() => g.setAttribute('opacity', 0));
    }
    const blink = () => { const l = $('#cpuLed'); if (!l) return; l.classList.remove('on'); void l.getBoundingClientRect(); l.classList.add('on'); };
    function key(ch) {
      busy = busy.then(async () => {
        if (dead) return;
        FD.focus(svg, ['in']);
        await fly(ch === ' ' ? '␣' : ch, [P.kbd, P.cpu], 420);
        FD.focus(svg, ['cpu']); blink();
        await FD.wait(160);
        FD.focus(svg, ['out']);
        await fly(ch === ' ' ? '␣' : ch, [P.cpu, P.mon], 380);
        text += ch; draw(); FD.focus(svg, []);
      });
      return busy;
    }
    async function typeWord(w, ctx) { for (const ch of w) { if (ctx && !ctx.alive()) return; await key(ch); } }
    function save() {
      busy = busy.then(async () => {
        if (dead) return;
        FD.focus(svg, ['cpu', 'store']);
        await fly('📄', [P.cpu, P.usb], 700);
        files++; draw();
        $('#scr2').textContent = 'Saved ✓';
        $('#flowMsg').innerHTML = 'The file goes to a <b>storage</b> peripheral. Storage works both ways: data can be saved and opened again.';
        FD.focus(svg, []);
      });
      return busy;
    }
    function open() {
      busy = busy.then(async () => {
        if (dead) return;
        if (!files) { $('#flowMsg').innerHTML = 'There is nothing on the USB drive yet. <b>Save</b> first.'; return; }
        FD.focus(svg, ['store', 'cpu']);
        await fly('📄', [P.usb, P.cpu], 700);
        blink();
        await fly('📄', [P.cpu, P.mon], 450);
        $('#scr2').textContent = 'Opened from USB';
        $('#flowMsg').innerHTML = 'The file was read from <b>storage</b>, processed and <b>output</b> on the monitor.';
        FD.focus(svg, []);
      });
      return busy;
    }
    let sent = 0;
    function clear() { text = ''; files = 0; sent = 0; $('#scr2').textContent = ''; $('#typeIn').value = ''; draw(); FD.focus(svg, []); }
    $('#typeIn').addEventListener('input', (e) => {
      const v = e.target.value;
      if (v.length < sent) { sent = v.length; busy = busy.then(() => { text = v; draw(); }); return; }
      const add = v.slice(sent);
      sent = v.length;
      [...add].forEach(key);
    });
    $('#save').addEventListener('click', save);
    $('#open').addEventListener('click', open);
    $('#clr').addEventListener('click', clear);

    // sorting
    const grid = $('#grid');
    function sortReset() {
      grid.querySelectorAll('.pf-dev').forEach((d) => { d.className = 'pf-dev'; d.querySelector('.pf-why').textContent = ''; d.querySelectorAll('button').forEach((b) => { b.disabled = false; b.className = ''; }); });
      count();
    }
    function count() { $('#sortN').textContent = `${grid.querySelectorAll('.pf-dev.ok').length} / ${DEV.length}`; }
    function choose(i, k) {
      const d = grid.querySelector(`.pf-dev[data-i="${i}"]`), [, , want, why] = DEV[i];
      if (d.classList.contains('ok')) return;
      const b = d.querySelector(`button[data-k="${k}"]`);
      if (k === want) {
        d.classList.add('ok'); d.classList.remove('no');
        b.classList.add('right');
        d.querySelectorAll('button').forEach((x) => { x.disabled = true; });
        d.querySelector('.pf-why').textContent = why;
      } else {
        d.classList.add('no'); b.classList.add('wrong'); b.disabled = true; FD.shake(d);
        d.querySelector('.pf-why').textContent = 'Not quite. Try again.';
      }
      count();
    }
    grid.addEventListener('click', (e) => { const b = e.target.closest('button[data-k]'); if (b) choose(+b.closest('.pf-dev').dataset.i, +b.dataset.k); });
    $('#sortReset').addEventListener('click', sortReset);

    const show = FD.panels(root);
    clear(); show('flow');
    return {
      show, clear, save, open, typeWord, sortReset,
      destroy() { dead = true; },
      focus: (z) => FD.focus(svg, z),
      jobs: (z) => FD.focus(root.querySelector('.pf-jobs'), z),
      async demoSort(ctx) { sortReset(); for (const i of [0, 2, 4, 5]) { if (!(await ctx.sleep(700))) return; choose(i, DEV[i][2]); } },
    };
  },
  steps: [
    {
      title: 'Peripheral devices',
      text: `<p><strong>Peripheral devices</strong> are devices that can be connected to a computer, such as a PC or a tablet.</p>
             <p>They can be connected <strong>inside</strong> or <strong>outside</strong> the computer.</p>`,
      on: (a) => { a.show('flow'); a.clear(); a.focus([]); },
    },
    {
      title: 'Three types of peripheral',
      text: `<p>Peripherals can be grouped into three types:</p>
             <ul><li><strong>input</strong></li><li><strong>output</strong></li><li><strong>storage</strong>.</li></ul>
             <p>Data is input from devices such as keyboards and <strong>processed</strong> by the computer. The results can then be sent to output devices such as screens.</p>`,
      tip: 'Try it: type a word in the box and watch each key press travel through the system.',
      async on(a, ctx) { a.show('flow'); a.clear(); if (!(await ctx.sleep(600))) return; await a.typeWord('Hello', ctx); },
    },
    {
      title: 'Storage peripherals',
      text: `<p><strong>Storage</strong> peripherals keep data so that it can be used again later, for example a USB flash drive or an external hard drive.</p>
             <p>Data goes <strong>both ways</strong>: it is saved to storage and opened (read) from it again.</p>`,
      async on(a, ctx) { a.show('flow'); if (!(await ctx.sleep(500))) return; await a.save(); if (!(await ctx.sleep(900))) return; await a.open(); },
    },
    {
      title: 'Input, output or storage?',
      text: `<p>Look at what the device <strong>does with the data</strong>:</p>
             <ul><li>sends data <strong>to</strong> the computer → input</li><li>presents the results <strong>from</strong> the computer → output</li><li>keeps data to use later → storage.</li></ul>`,
      tip: 'Try it: sort all twelve peripherals.',
      async on(a, ctx) { a.show('sort'); await a.demoSort(ctx); },
    },
    {
      title: 'What input peripherals do',
      text: `<p><strong>Input peripherals</strong> are devices that send data to the computer. They allow the user to:</p>
             <ul><li><strong>control</strong> the computer, or</li><li><strong>store data captured</strong> from sources outside the system.</li></ul>
             <p>In the rest of this lesson we look at each type of input device in turn.</p>`,
      async on(a, ctx) { a.show('jobs'); a.jobs(['ctrl']); if (!(await ctx.sleep(2200))) return; a.jobs(['cap']); if (!(await ctx.sleep(2200))) return; a.jobs([]); },
    },
  ],
});

FD.activities({
  section: 'peripherals',
  items: [
    {
      id: 'poster',
      title: 'The characteristics of peripheral devices',
      task: '<p>Create posters that include the <b>characteristics</b> and <b>uses</b> of a range of peripheral devices. Your class could split the work: some investigate input peripherals, some output peripherals and some storage peripherals.</p><p>Plan your poster here: which devices, what each one does, and one use for each.</p>',
      fields: ['My group investigates', 'Devices on my poster'],
      lines: 6,
      hint: 'Device – characteristics – uses…',
    },
  ],
});

FD.check({
  section: 'peripherals',
  items: [
    {
      type: 'sort',
      q: 'Input, output or storage?',
      bins: ['Input', 'Output', 'Storage'],
      rows: [['Graphics tablet', 0], ['Printer', 1], ['External hard drive', 2], ['Barcode scanner', 0], ['Speakers', 1], ['Microphone', 0]],
      why: 'Input sends data to the computer; output presents results; storage keeps data for later.',
    },
    { type: 'mcq', q: 'What is a peripheral device?', opts: ['A device that can be connected to a computer, inside or outside it', 'Any program installed on a computer', 'The processor of a computer', 'A device that only works without a computer'], why: 'Peripherals can be connected inside or outside a computer such as a PC or tablet.' },
    { type: 'tf', q: 'Input peripherals send data to the computer.', a: true, why: 'They let the user control the computer or store data captured from outside the system.' },
    { type: 'multi', q: 'Which two things do input peripherals allow the user to do?', need: 2, opts: [['Control the computer', true], ['Store data captured from sources outside the system', true], ['Print the results of processing', false], ['Make the processor faster', false]], why: 'Input = control, or capture data from outside the system.' },
  ],
});
