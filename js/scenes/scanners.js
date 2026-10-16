FD.add({
  id: 'scanners',
  title: 'Scanners, barcodes and webcams',
  tab: 'Scanners',
  icon: 'scanners',
  color: '--c1',
  section: true,
  interactive: true,
  vocab: [
    ['characters', 'printed or written letters and symbols'],
    ['OCR', 'Optical Character Recognition: software that reads characters on a scanned document and stores them in a text file'],
    ['OMR', 'Optical Mark Recognition: software that detects simple marks on a document'],
    ['barcode', 'a pattern of lines and gaps that can be read by a device'],
    ['plain text', 'text that is not specially formatted'],
  ],
  mount(el) {
    const DOC = 'Dear parents, the Year 10 trip to the Science Museum is on Friday 14 November. Please return the consent form to the school office by Monday.';
    const KEY = ['B', 'D', 'A', 'C', 'B'];
    const QS = [
      ['Which software reads marks on a form?', 'OCR', 'OMR', 'VoIP', 'DAB'],
      ['Which is a pointing device?', 'Scanner', 'Printer', 'Microphone', 'Track pad'],
      ['What does OCR read?', 'Characters', 'Fingerprints', 'Marks', 'Barcodes'],
      ['Which code can be read from any angle?', 'Linear barcode', 'Magnetic strip', 'QR code', 'PIN'],
      ['What does a barcode scanner detect?', 'Colours', 'Widths of lines and gaps', 'Sound', 'Pressure'],
    ];
    const PROD = [['500012345678', 'Crunchy Oats', '🥣', 2.49], ['501234567890', 'Orange juice 1 l', '🧃', 1.35], ['503210987654', 'Wholemeal bread', '🍞', 1.10]];
    const SHELF = [['🥛', 'Milk', 0.95], ['🍎', 'Apples ×6', 1.80], ['🍝', 'Pasta', 0.89], ['🧀', 'Cheese', 2.75], ['🍫', 'Chocolate', 1.20], ['🥚', 'Eggs ×12', 2.30]];
    el.innerHTML = `
      <div class="sim sc">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="ocr">📄 Scanner + OCR</button><button data-p="omr">✏️ OMR</button><button data-p="bar">▮▯▮ Barcode scanner</button><button data-p="qr">🔳 Linear vs QR</button><button data-p="cam">📷 Webcam</button>
        </div>

        <div data-panel="ocr" class="sim">
          <div class="sc-ocr">
            <div class="sc-scanner sim-box">
              <div class="sc-paper" id="paper"><p class="sc-hand" id="docTxt">${DOC}</p><span class="sc-light" id="light"></span></div>
              <small>Paper document</small>
            </div>
            <div class="sc-files">
              <div class="sc-file" id="fImg" hidden><b>📷 scan.jpg</b><small>Image file</small><div class="sc-img"><p>${DOC}</p></div></div>
              <div class="sc-file" id="fTxt" hidden><b>📝 scan.txt</b><small>Text file (OCR)</small><textarea id="ocrOut" rows="4" spellcheck="false"></textarea></div>
            </div>
          </div>
          <div class="ctrls">
            <button class="btn primary small-btn" id="scan">▶ Scan</button>
            <button class="btn small-btn" id="ocr" disabled>🔤 Run OCR</button>
            <label class="rng sc-find"><span>Find a word</span><input type="text" id="find" value="Museum" autocomplete="off"></label>
            <button class="mini-btn" id="findGo">🔍 Search</button>
            <button class="mini-btn" id="ocrReset">↺ Reset</button>
          </div>
          <p class="small" id="ocrMsg">Put the letter on the scanner and press <b>Scan</b>.</p>
        </div>

        <div data-panel="omr" class="sim" hidden>
          <div class="sc-omr">
            <div class="sc-sheet" id="sheet"><p class="sc-sh">ANSWER SHEET · ICT quiz</p>${QS.map((q, i) => `
              <div class="sc-row" data-q="${i}" title="${q[0]}"><b>${i + 1}</b>${['A', 'B', 'C', 'D'].map((l) => `<button class="sc-bub" data-l="${l}" aria-pressed="false">${l}</button>`).join('')}<span class="sc-res"></span></div>`).join('')}
              <span class="sc-light h" id="omrLight"></span>
            </div>
            <div class="sc-qs">${QS.map(([q, ...o], i) => `<p><b>${i + 1}.</b> ${q}<br><small>${o.map((x, k) => `<b>${'ABCD'[k]}</b> ${x}`).join(' · ')}</small></p>`).join('')}</div>
          </div>
          <div class="ctrls"><button class="btn primary small-btn" id="omrGo">▶ Read with OMR</button><button class="mini-btn" id="omrReset">↺ New sheet</button></div>
          <p class="small" id="omrMsg">Fill in one bubble on each line (click it), then let the OMR scanner mark the sheet.</p>
        </div>

        <div data-panel="bar" class="sim" hidden>
          <div class="sc-till">
            <div class="sc-belt sim-box">
              <div class="sc-prod" id="prod"><span class="sc-pe" id="pe"></span><b id="pn"></b><div id="pcode"></div></div>
              <span class="sc-laser" id="laser"></span>
            </div>
            <div class="sc-rcpt"><b>🧾 Receipt</b><ul id="rcpt"></ul><p class="sc-tot">Total <b id="tot">£0.00</b></p></div>
          </div>
          <div class="ctrls"><button class="btn primary small-btn" id="beep">▶ Scan item</button><span class="seg" id="items"><span class="seg-l">Item</span>${PROD.map((p, i) => `<button data-v="${i}">${p[2]} ${p[1]}</button>`).join('')}</span></div>
          <div class="cli" id="barLog" aria-live="polite"></div>
        </div>

        <div data-panel="qr" class="sim" hidden>
          <div class="sc-cmp">
            <div class="sc-code sim-box"><div class="sc-rot" id="rot1">${FD.barSvg('500098765432')}</div><b>Linear barcode</b><span class="ro" id="r1"><small>Scanner</small><b>–</b></span></div>
            <div class="sc-code sim-box"><div class="sc-rot" id="rot2">${FD.qrSvg('Order 4471: milk, apples, pasta. Deliver to 12 Park Road this evening.')}</div><b>Matrix code (QR code)</b><span class="ro" id="r2"><small>Scanner</small><b>–</b></span></div>
          </div>
          <div class="ctrls">
            <label class="rng"><span>Angle of the code <output id="angOut"></output></span><input type="range" id="ang" min="-90" max="90" value="0"></label>
            <button class="btn primary small-btn" id="qrScan">▶ Scan both</button>
          </div>
          <div class="tbl-wrap"><table class="tbl"><thead><tr><th></th><th>Linear barcode</th><th>Matrix (QR) code</th></tr></thead><tbody>
            <tr><th>What it holds</th><td>About 13 digits (an ID number)</td><td>Much more information: the code on the right holds a whole sentence</td></tr>
            <tr><th>Scanning angle</th><td>Lines must cross the scanner’s beam</td><td>Can be scanned from <b>any angle</b></td></tr>
          </tbody></table></div>
          <div class="sc-store sim-box" id="store">
            <p class="strong">🚇 A virtual store in a subway station</p>
            <div class="sc-shelf">${SHELF.map(([e, n, p], i) => `<button class="sc-item" data-i="${i}"><span>${e}</span><small>${n}</small><i class="sc-mini">${FD.qrSvg('SKU' + (1000 + i))}</i><b>£${p.toFixed(2)}</b></button>`).join('')}</div>
            <p class="small" id="storeMsg">Tap a product to scan its QR code with your phone.</p>
          </div>
        </div>

        <div data-panel="cam" class="sim" hidden>
          <div class="sc-cam"><canvas id="cv" width="480" height="270" aria-label="Simulated beach webcam"></canvas><span class="sc-live">● LIVE · Sunny Bay beach cam</span><span class="sc-mic" id="mic">🎤 ∿∿∿</span></div>
          <div class="ctrls">
            <span class="seg" id="qual"><span class="seg-l">Quality</span><button data-v="cam">📷 Webcam</button><button data-v="hd">🎥 Camcorder</button></span>
            <label class="tgl"><input type="checkbox" id="micOn" checked> Built-in microphone</label>
          </div>
          <div class="cards3">
            <div class="mini"><h5>📺 Stream</h5><p>Images or video can be streamed to the internet, e.g. a beach webcam to check the conditions for surfing.</p></div>
            <div class="mini"><h5>🔒 Security</h5><p>Webcams can be used as security cameras.</p></div>
            <div class="mini"><h5>💬 Video calls</h5><p>A webcam with a built-in microphone captures pictures and sound.</p></div>
          </div>
          <p class="note">This is a drawing, not a real camera: your own webcam is never switched on.</p>
        </div>
      </div>`;
    const root = el.querySelector('.sc'), $ = (s) => root.querySelector(s);
    let dead = false;
    const sleep = (ms) => FD.wait(ms).then(() => !dead);

    // ---- scanner + OCR ----
    let ocrDone = false, scanning = false;
    function ocrReset() { ocrDone = false; $('#fImg').hidden = true; $('#fTxt').hidden = true; $('#ocr').disabled = true; $('#ocrOut').value = ''; $('#ocrMsg').innerHTML = 'Put the letter on the scanner and press <b>Scan</b>.'; $('#docTxt').innerHTML = DOC; }
    async function scan() {
      if (scanning) return; scanning = true;
      ocrReset();
      const l = $('#light'); l.classList.remove('go'); void l.offsetWidth; l.classList.add('go');
      $('#ocrMsg').innerHTML = 'The scanner shines light on the page. <b>Light sensors</b> record how much light each tiny area reflects…';
      if (!(await sleep(1800))) return;
      $('#fImg').hidden = false;
      $('#ocr').disabled = false;
      $('#ocrMsg').innerHTML = 'Saved as <b>scan.jpg</b>: an <b>image</b> of the page. Try searching for a word: the computer cannot see the words in a picture.';
      scanning = false;
    }
    async function runOcr(ctx) {
      if ($('#fImg').hidden) return;
      $('#fTxt').hidden = false;
      $('#ocrMsg').innerHTML = 'OCR software looks at the shapes in the image and recognises each <b>character</b>…';
      const out = $('#ocrOut');
      out.value = '';
      for (let i = 0; i < DOC.length; i += 3) {
        out.value = DOC.slice(0, i + 3);
        if (!(await sleep(18)) || (ctx && !ctx.alive())) { out.value = DOC; break; }
      }
      ocrDone = true;
      $('#ocrMsg').innerHTML = '✓ Saved as <b>scan.txt</b>: a <b>text file</b>. Now the words can be searched, edited and copied.';
    }
    function find() {
      const w = $('#find').value.trim();
      if (!w) return;
      if ($('#fImg').hidden) { $('#ocrMsg').innerHTML = 'Scan the document first.'; return; }
      if (!ocrDone) { $('#ocrMsg').innerHTML = `🔍 “${FD.esc(w)}”: <b>0 results</b> in scan.jpg. To the computer an image is just coloured dots. Run <b>OCR</b> to turn it into text.`; return; }
      const re = new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const n = (DOC.match(re) || []).length;
      $('#docTxt').innerHTML = FD.esc(DOC).replace(re, (x) => `<mark>${x}</mark>`);
      $('#ocrMsg').innerHTML = `🔍 “${FD.esc(w)}”: <b>${n} result${n === 1 ? '' : 's'}</b> in scan.txt.`;
    }
    $('#scan').addEventListener('click', scan);
    $('#ocr').addEventListener('click', () => runOcr());
    $('#findGo').addEventListener('click', find);
    $('#find').addEventListener('keydown', (e) => { if (e.key === 'Enter') find(); });
    $('#ocrReset').addEventListener('click', ocrReset);

    // ---- OMR ----
    function omrReset() {
      root.querySelectorAll('.sc-row').forEach((r) => { r.className = 'sc-row'; r.querySelector('.sc-res').textContent = ''; r.querySelectorAll('.sc-bub').forEach((b) => { b.classList.remove('on', 'key'); b.setAttribute('aria-pressed', false); }); });
      $('#omrMsg').innerHTML = 'Fill in one bubble on each line (click it), then let the OMR scanner mark the sheet.';
      $('#sheet').classList.remove('read');
    }
    function mark(q, l) {
      const b = root.querySelector(`.sc-row[data-q="${q}"] [data-l="${l}"]`);
      b.classList.toggle('on'); b.setAttribute('aria-pressed', b.classList.contains('on'));
      if ($('#sheet').classList.contains('read')) { $('#sheet').classList.remove('read'); root.querySelectorAll('.sc-row').forEach((r) => { r.className = 'sc-row'; r.querySelector('.sc-res').textContent = ''; }); }
    }
    root.querySelectorAll('.sc-bub').forEach((b) => b.addEventListener('click', () => mark(b.closest('.sc-row').dataset.q, b.dataset.l)));
    async function omr() {
      const l = $('#omrLight'); l.classList.remove('go'); void l.offsetWidth; l.classList.add('go');
      let score = 0;
      const rows = [...root.querySelectorAll('.sc-row')];
      for (const [i, r] of rows.entries()) {
        if (!(await sleep(320))) return;
        const on = [...r.querySelectorAll('.sc-bub.on')].map((b) => b.dataset.l);
        let res, cls;
        if (on.length === 0) { res = 'no mark'; cls = 'no'; }
        else if (on.length > 1) { res = `${on.length} marks ✗`; cls = 'no'; }
        else if (on[0] === KEY[i]) { res = `${on[0]} ✓`; cls = 'ok'; score++; }
        else { res = `${on[0]} ✗ (${KEY[i]})`; cls = 'no'; }
        r.classList.add(cls);
        r.querySelector('.sc-res').textContent = res;
        r.querySelector(`[data-l="${KEY[i]}"]`).classList.add('key');
      }
      $('#sheet').classList.add('read');
      $('#omrMsg').innerHTML = `OMR detected the marks and recorded the answers: <b>${score} / ${KEY.length}</b>. A pile of 200 sheets can be marked in minutes. A line with two marks, or none, cannot be read.`;
    }
    $('#omrGo').addEventListener('click', omr);
    $('#omrReset').addEventListener('click', omrReset);
    async function omrDemo(ctx) {
      omrReset();
      for (const [q, l] of [[0, 'B'], [1, 'D'], [2, 'B'], [3, 'C'], [4, 'B'], [4, 'A']]) { mark(q, l); if (!(await ctx.sleep(300))) return; }
      await omr();
    }

    // ---- barcode scanner ----
    let item = 0, total = 0;
    function pick(i) {
      item = i; FD.segSet($('#items'), i);
      const [code, n, e] = PROD[i];
      $('#pe').textContent = e; $('#pn').textContent = n; $('#pcode').innerHTML = FD.barSvg(code);
    }
    function barReset() { total = 0; $('#rcpt').innerHTML = ''; $('#tot').textContent = '£0.00'; $('#barLog').innerHTML = '<span class="p">$</span> waiting for a barcode…'; pick(0); }
    async function beep() {
      const [code, n, e, price] = PROD[item];
      const { digits, bits } = FD.ean13(code);
      const l = $('#laser'); l.classList.remove('go'); void l.offsetWidth; l.classList.add('go');
      const runs = bits.match(/1+|0+/g).slice(0, 12).map((r) => r.length).join(' ');
      const log = $('#barLog');
      log.innerHTML = `<span class="p">1</span> laser crosses the code: widths of lines and gaps → ${runs} …`;
      if (!(await sleep(900))) return;
      log.innerHTML += `\n<span class="p">2</span> widths decoded → number <b>${digits}</b>`;
      if (!(await sleep(700))) return;
      log.innerHTML += `\n<span class="p">3</span> look up ${digits} in the shop’s database → ${e} ${n}, £${price.toFixed(2)}`;
      total += price;
      $('#rcpt').insertAdjacentHTML('beforeend', `<li><span>${e} ${n}</span><b>£${price.toFixed(2)}</b></li>`);
      $('#tot').textContent = '£' + total.toFixed(2);
      FD.pulse($('#tot'));
    }
    $('#beep').addEventListener('click', beep);
    $('#items').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) pick(+b.dataset.v); });

    // ---- linear vs QR ----
    function angle(v) {
      $('#ang').value = v;
      $('#angOut').textContent = v + '°';
      $('#rot1').style.transform = `rotate(${v}deg)`;
      $('#rot2').style.transform = `rotate(${v}deg)`;
      ['#r1', '#r2'].forEach((r) => { $(r).className = 'ro'; $(r).querySelector('b').textContent = '–'; });
    }
    async function scanBoth() {
      const a = Math.abs(+$('#ang').value), ok1 = a <= 25;
      root.querySelectorAll('.sc-code').forEach((c) => { c.classList.remove('beam'); void c.offsetWidth; c.classList.add('beam'); });
      if (!(await sleep(800))) return;
      $('#r1').className = 'ro ' + (ok1 ? 'good' : 'bad');
      $('#r1').querySelector('b').textContent = ok1 ? '✓ 5000987654321' : '✗ cannot read: turn it';
      $('#r2').className = 'ro good';
      $('#r2').querySelector('b').textContent = '✓ Order 4471: milk, apples…';
    }
    $('#ang').addEventListener('input', (e) => angle(+e.target.value));
    $('#qrScan').addEventListener('click', scanBoth);
    let basket = [];
    function buy(i) {
      const b = root.querySelector(`.sc-item[data-i="${i}"]`);
      b.classList.remove('hit'); void b.offsetWidth; b.classList.add('hit');
      basket.push(SHELF[i]);
      const sum = basket.reduce((s, x) => s + x[2], 0);
      $('#storeMsg').innerHTML = `📱 Basket: ${basket.map((x) => x[0]).join(' ')} · <b>£${sum.toFixed(2)}</b> — delivered to your home <b>this evening</b>.`;
    }
    root.querySelectorAll('.sc-item').forEach((b) => b.addEventListener('click', () => buy(+b.dataset.i)));

    // ---- webcam ----
    const cv = $('#cv'), g = cv.getContext('2d');
    const off = document.createElement('canvas'); off.width = 480; off.height = 270;
    const og = off.getContext('2d');
    let qual = 'cam', raf = 0, t = 0;
    function drawBeach() {
      t += 0.016 * FD.speed;
      const c = og;
      const sky = c.createLinearGradient(0, 0, 0, 150); sky.addColorStop(0, '#4dabf7'); sky.addColorStop(1, '#d0ebff');
      c.fillStyle = sky; c.fillRect(0, 0, 480, 150);
      c.fillStyle = '#ffd43b'; c.beginPath(); c.arc(400, 50, 26, 0, 7); c.fill();
      c.fillStyle = '#1971c2'; c.fillRect(0, 130, 480, 80);
      c.fillStyle = '#fff';
      for (let k = 0; k < 4; k++) {
        c.beginPath();
        for (let x = 0; x <= 480; x += 8) c.lineTo(x, 150 + k * 16 + Math.sin(x / 30 + t * 2 + k) * 3);
        c.lineTo(480, 155 + k * 16); c.lineTo(0, 155 + k * 16); c.fill();
      }
      c.fillStyle = '#f1d6a0'; c.fillRect(0, 205, 480, 65);
      const sx = (t * 40) % 560 - 40;
      c.font = '26px system-ui'; c.fillText('🏄', sx, 168 + Math.sin(t * 3) * 4);
      c.fillText('⛱️', 60, 245); c.fillText('🚶', 300 + Math.sin(t / 2) * 60, 252);
      c.fillStyle = 'rgb(0 0 0 / .45)'; c.fillRect(8, 238, 150, 24);
      c.fillStyle = '#fff'; c.font = '12px ui-monospace, monospace';
      c.fillText(new Date().toLocaleTimeString('en-GB'), 16, 254);
      const px = qual === 'cam' ? 5 : 1;
      g.imageSmoothingEnabled = false;
      g.drawImage(off, 0, 0, 480 / px, 270 / px);
      g.drawImage(cv, 0, 0, 480 / px, 270 / px, 0, 0, 480, 270);
      raf = requestAnimationFrame(drawBeach);
    }
    function quality(v) { qual = v; FD.segSet($('#qual'), v); }
    $('#qual').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) quality(b.dataset.v); });
    $('#micOn').addEventListener('change', (e) => { $('#mic').hidden = !e.target.checked; });

    const show = FD.panels(root, (p) => { cancelAnimationFrame(raf); if (p === 'cam') raf = requestAnimationFrame(drawBeach); });
    ocrReset(); omrReset(); barReset(); angle(0); quality('cam');
    show('ocr');
    return {
      show, scan, runOcr, find, omrDemo, beep, pick, barReset, angle, scanBoth, buy, quality,
      async tilt(ctx) { angle(0); await scanBoth(); if (!(await ctx.sleep(1600))) return; for (let v = 0; v <= 60; v += 4) { angle(v); if (!(await ctx.sleep(40))) return; } await scanBoth(); },
      destroy() { dead = true; cancelAnimationFrame(raf); },
    };
  },
  steps: [
    {
      title: 'Scanners',
      text: `<p><strong>Scanners</strong> use <strong>light sensors</strong> to record physical documents as <strong>images</strong>, which are then saved as files on the computer.</p>`,
      tip: 'Try it: scan the letter, then search for a word in the image.',
      async on(a, ctx) { a.show('ocr'); if (!(await ctx.sleep(600))) return; await a.scan(); if (!(await ctx.sleep(400))) return; a.find(); },
    },
    {
      title: 'Optical Character Recognition (OCR)',
      text: `<p>Software allows scanners to read the <strong>characters</strong> on the document and store the result in a <strong>text file</strong>.</p>
             <p>This is known as <strong>Optical Character Recognition (OCR)</strong>. The text can then be edited and searched.</p>`,
      async on(a, ctx) { a.show('ocr'); await a.scan(); if (!(await ctx.sleep(300))) return; await a.runOcr(ctx); if (!(await ctx.sleep(400))) return; a.find(); },
    },
    {
      title: 'Optical Mark Recognition (OMR)',
      text: `<p><strong>Optical Mark Recognition (OMR)</strong> software can also be used with scanners to detect <strong>simple marks</strong> on a document.</p>
             <p>A common use of OMR is recognising and recording the responses to <strong>multiple-choice tests</strong>.</p>`,
      tip: 'Try it: fill in the answer sheet, then read it with OMR. What happens if you fill in two bubbles on one line?',
      async on(a, ctx) { a.show('omr'); await a.omrDemo(ctx); },
    },
    {
      title: 'Barcode scanners',
      text: `<p>A <strong>barcode</strong> is a pattern of lines and gaps. Barcode scanners <strong>detect the width</strong> of the lines and gaps.</p>
             <p>The barcode represents letters and numbers which are used to <strong>identify the item</strong>. Barcodes are used on items for sale in shops, and on <strong>parcels</strong> so that they can be tracked.</p>`,
      tip: 'These are real barcodes: you can scan them with a barcode app on a phone.',
      async on(a, ctx) { a.show('bar'); a.barReset(); if (!(await ctx.sleep(500))) return; await a.beep(); },
    },
    {
      title: 'Linear and matrix codes',
      text: `<p>There are two types of barcode: <strong>linear</strong> and <strong>matrix</strong>. Matrix codes are also known as <strong>QR codes</strong>.</p>
             <p>QR codes are newer than linear barcodes and have some advantages:</p>
             <ul><li>they can hold <strong>much more information</strong></li><li>they can be scanned from <strong>any angle</strong>.</li></ul>`,
      tip: 'Try it: turn the codes and scan them again.',
      async on(a, ctx) { a.show('qr'); await a.tilt(ctx); },
    },
    {
      title: 'A virtual store',
      text: `<p>In South Korea, a supermarket company wanted to open a new shop, but there was no space left on the high street. Instead, it put <strong>posters of supermarket shelves</strong> in a subway station.</p>
             <p>Every item had its own <strong>QR code</strong>. People could shop on the way to work and their shopping was <strong>delivered</strong> to their home that evening.</p>`,
      tip: 'Did you know? Apps on smartphones and tablets use the device’s camera to read barcodes and QR codes.',
      async on(a, ctx) { a.show('qr'); a.angle(0); for (const i of [0, 1, 4]) { if (!(await ctx.sleep(900))) return; a.buy(i); } },
    },
    {
      title: 'Webcams',
      text: `<p><strong>Webcams</strong> are specialised cameras. They are generally <strong>lower quality</strong> than camcorders, and may have <strong>built-in microphones</strong> to capture sound.</p>
             <p>They can be used as <strong>security cameras</strong> and can <strong>stream</strong> images or video to the internet.</p>`,
      tip: 'Try it: compare the webcam picture with a camcorder.',
      async on(a, ctx) { a.show('cam'); a.quality('cam'); if (!(await ctx.sleep(2500))) return; a.quality('hd'); },
    },
  ],
});

FD.activities({
  section: 'scanners',
  intro: 'Write your answers in the boxes. They are <b>saved automatically</b> on this device and included when you copy <b>My progress</b>. For the first activity you can make a real QR code right here.',
  items: [
    {
      id: 'matrix',
      title: 'Matrix codes',
      task: `<p>Create a QR code for a <b>plain text</b> message. Ask a friend to scan it to reveal the message you have left for them.</p>
             <div class="qr-maker"><label class="act-f"><span>Your message (up to ${FD.QR_MAX} characters)</span><input id="qrMsg" maxlength="${FD.QR_MAX}" placeholder="e.g. Meet me in the library at break!"></label><div class="qr-out" id="qrOut"></div></div>`,
      fields: ['The message I encoded', 'What happened when my friend scanned it'],
      lines: 2,
      hint: 'Why do you think QR codes are used on posters and adverts?',
    },
    {
      id: 'webcams',
      title: 'Using webcams',
      task: '<p>Webcam footage can be used for many purposes. For example, an internet search for <i>Bondi Beach webcam</i> shows live footage from Bondi Beach in Australia, which can be used to check the conditions for surfing.</p><p>Find out about any webcams in your local country or local area. <b>What are they being used for? Who would be interested in the footage?</b></p>',
      lines: 5,
      hint: 'Webcam – where – what it is used for – who watches it…',
    },
  ],
});

// The QR maker inside the "Matrix codes" activity.
document.addEventListener('input', (e) => {
  if (e.target.id !== 'qrMsg') return;
  const out = document.getElementById('qrOut'), v = e.target.value;
  out.innerHTML = v.trim() ? `${FD.qrSvg(v)}<small>Scan me with a phone camera</small>` : '';
});

FD.check({
  section: 'scanners',
  items: [
    {
      type: 'sort',
      q: 'Which technology is being used?',
      bins: ['OCR', 'OMR', 'Barcode', 'QR code'],
      rows: [['Marking 200 multiple-choice answer sheets', 1], ['Turning a scanned letter into a text file you can edit', 0], ['Identifying a tin of beans at a supermarket checkout', 2], ['A poster that opens a web page when you point your phone at it', 3], ['Tracking a parcel at each depot', 2]],
      why: 'OCR reads characters; OMR detects simple marks; linear barcodes identify items and parcels; QR codes hold more information and can be scanned from any angle.',
    },
    { type: 'mcq', q: 'What do scanners use to record physical documents as images?', opts: ['Light sensors', 'Microphones', 'Magnetic strips', 'Pressure pads'], why: 'Scanners use light sensors; the image is saved as a file on the computer.' },
    { type: 'mcq', q: 'What does a barcode scanner detect?', opts: ['The width of the lines and gaps', 'The colour of the product', 'The weight of the item', 'The price printed on the label'], why: 'The widths represent letters and numbers that identify the item.' },
    { type: 'multi', q: 'Give two advantages of QR codes over linear barcodes.', need: 2, opts: [['They can hold much more information', true], ['They can be scanned from any angle', true], ['They are older', false], ['They do not need a scanner or camera', false]], why: 'Book: QR codes hold much more information and can be scanned from any angle.' },
    { type: 'tf', q: 'Webcams are generally higher quality than camcorders.', a: false, why: 'Webcams are generally lower quality than camcorders. They may have built-in microphones.' },
  ],
});
