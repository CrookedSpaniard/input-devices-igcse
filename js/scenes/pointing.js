FD.add({
  id: 'pointing',
  title: 'Pointing devices',
  tab: 'Pointing',
  icon: 'pointing',
  color: '--c3',
  section: true,
  interactive: true,
  vocab: [
    ['pointer', 'an on-screen indicator used to select displayed objects'],
    ['sprites', 'on-screen graphics in a computer game, used to represent characters, vehicles and objects'],
    ['stylus', 'a pen-shaped device'],
  ],
  mount(el) {
    const DEVS = {
      mouse: { n: 'Mouse', e: '🖱️', how: 'An <b>optical sensor</b> recognises the movement of the mouse. Its sensitivity can be affected by the <b>surface</b> it is on. Some mice use a <b>roller ball</b> instead.', use: 'Desktop computers.' },
      tracker: { n: 'Tracker ball', e: '🎱', how: 'You <b>roll the ball</b> to move the pointer. The device stays still and it <b>does not have buttons</b> to press.', use: 'Public kiosks and installations: it cannot be moved or easily broken.' },
      pad: { n: 'Track pad', e: '▭', how: 'The surface senses <b>finger movements, touches and presses</b>.', use: 'Built into laptops to save space.' },
    };
    el.innerHTML = `
      <div class="sim pt">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="ptr">🎯 Move the pointer</button><button data-p="joy">🕹️ Joystick</button><button data-p="tab">✏️ Graphics tablet</button>
        </div>

        <div data-panel="ptr" class="sim">
          <span class="seg" id="devs"><span class="seg-l">Pointing device</span>${Object.entries(DEVS).map(([k, d]) => `<button data-v="${k}">${d.e} ${d.n}</button>`).join('')}</span>
          <div class="pt-grid">
            <div class="pt-screen" id="scr" aria-label="Screen with targets">
              <div class="pt-menu" id="menu"><b>File</b><span data-t="new">New Message</span><span data-t="open">Open…</span><span data-t="save">Save</span><span data-t="close">Close Window</span></div>
              <span class="pt-arrow" id="arrow"><svg class="ic" viewBox="0 0 16 24" aria-hidden="true"><path d="M1 1v19l5-5 3.5 7 3-1.5L9 13.5h7z" fill="#fff" stroke="#000" stroke-width="1.4" stroke-linejoin="round"/></svg></span>
              <span class="pt-target" id="target">🎯</span>
              <p class="pt-score" id="score">Hits: 0</p>
            </div>
            <div class="pt-ctl" id="ctl" data-keys aria-label="Control area: drag here to move the pointer">
              <div class="pt-dev" id="devPic"></div>
              <small id="ctlHint"></small>
            </div>
          </div>
          <div class="ctrls" id="surfCtl">
            <span class="seg" id="surf"><span class="seg-l">Surface under the mouse</span><button data-v="mat">Mouse mat</button><button data-v="desk">Wooden desk</button><button data-v="glass">Glass table</button></span>
          </div>
          <div class="wl-info"><h4 id="dName"></h4><p class="small" id="dHow"></p><p class="small"><b>Used for:</b> <span id="dUse"></span></p></div>
        </div>

        <div data-panel="joy" class="sim" hidden>
          <div class="pt-game sim-box" id="game"><span class="pt-sprite" id="sprite">🚀</span><span class="pt-star" id="star">⭐</span><span class="pt-gscore" id="gscore">Stars: 0</span></div>
          <div class="ctrls">
            <div class="pt-joy" id="joy" aria-label="Joystick: drag the stick"><span class="pt-stick" id="stick"></span></div>
            <p class="small">Drag the stick (or use the arrow keys while the game has focus). The <b>sprite</b> moves in the direction you push.</p>
          </div>
        </div>

        <div data-panel="tab" class="sim" hidden>
          <div class="pt-draw">
            <canvas id="cv" width="640" height="300" aria-label="Drawing area"></canvas>
          </div>
          <div class="ctrls">
            <label class="rng"><span>Pen pressure <output id="pOut"></output></span><input type="range" id="press" min="1" max="10" value="4"></label>
            <span class="seg" id="ink"><span class="seg-l">Colour</span>${['#13294b', '#c8102e', '#1c7ed6', '#2f9e44', '#e67700'].map((c) => `<button data-v="${c}" style="color:${c}">●</button>`).join('')}</span>
            <button class="mini-btn" id="wipe">↺ Clear</button>
          </div>
          <p class="small">Draw with your mouse, finger or a real stylus. Graphics tablets are used by <b>digital artists and designers</b>: a stylus feels like a pen, so drawing is more natural and precise.</p>
        </div>
      </div>`;
    const root = el.querySelector('.pt'), $ = (s) => root.querySelector(s);

    // ---- pointer ----
    let dev = 'mouse', surf = 'mat', pos = { x: 40, y: 60 }, hits = 0;
    const SENS = { mat: 1, desk: 0.75, glass: 0.15 };
    function drawPtr() {
      $('#arrow').style.left = pos.x + '%';
      $('#arrow').style.top = pos.y + '%';
    }
    function placeTarget() {
      const t = $('#target');
      t.style.left = (20 + Math.random() * 70) + '%';
      t.style.top = (25 + Math.random() * 60) + '%';
    }
    function checkHit() {
      const a = $('#arrow').getBoundingClientRect(), t = $('#target').getBoundingClientRect();
      if (Math.abs(a.left - (t.left + t.width / 2)) < t.width / 2 + 4 && Math.abs(a.top - (t.top + t.height / 2)) < t.height / 2 + 4) {
        hits++; $('#score').textContent = 'Hits: ' + hits; FD.pulse($('#score')); placeTarget();
      }
      root.querySelectorAll('#menu [data-t]').forEach((m) => {
        const r = m.getBoundingClientRect();
        m.classList.toggle('hl', a.left >= r.left && a.left <= r.right && a.top >= r.top && a.top <= r.bottom);
      });
    }
    function move(dx, dy) {
      const k = dev === 'mouse' ? SENS[surf] : 1;
      const jitter = dev === 'mouse' && surf === 'glass' ? (Math.random() - 0.5) * 2 : 0;
      pos.x = FD.clamp(pos.x + dx * k + jitter, 1, 97);
      pos.y = FD.clamp(pos.y + dy * k + jitter, 2, 94);
      drawPtr(); checkHit();
    }
    function device(k) {
      dev = k;
      const d = DEVS[k];
      FD.segSet($('#devs'), k);
      $('#dName').innerHTML = `${d.e} ${d.n}`;
      $('#dHow').innerHTML = d.how;
      $('#dUse').textContent = d.use;
      $('#surfCtl').hidden = k !== 'mouse';
      $('#ctl').dataset.dev = k;
      $('#devPic').innerHTML = k === 'mouse' ? '<span class="pt-mouse"><i></i></span>' : k === 'tracker' ? '<span class="pt-ball" id="ball"></span>' : '<span class="pt-pad"></span>';
      $('#ctlHint').textContent = k === 'mouse' ? 'Drag the mouse around this area' : k === 'tracker' ? 'Roll the ball: drag across it' : 'Slide your finger (drag) on the pad';
    }
    function surface(v) { surf = v; FD.segSet($('#surf'), v); $('#ctl').dataset.surf = v; }
    let last = null, roll = 0;
    $('#ctl').addEventListener('pointerdown', (e) => { last = [e.clientX, e.clientY]; $('#ctl').setPointerCapture(e.pointerId); e.preventDefault(); });
    $('#ctl').addEventListener('pointermove', (e) => {
      if (!last) return;
      const r = $('#ctl').getBoundingClientRect();
      const dx = ((e.clientX - last[0]) / r.width) * 100, dy = ((e.clientY - last[1]) / r.height) * 100;
      last = [e.clientX, e.clientY];
      move(dx, dy);
      if (dev === 'tracker') { roll += dx * 6; const b = $('#ball'); if (b) b.style.backgroundPosition = `${roll}px ${roll / 2}px`; }
      if (dev === 'mouse') { const m = $('.pt-mouse'); if (m) m.style.transform = `translate(${(pos.x - 50) * 0.6}px, ${(pos.y - 50) * 0.5}px)`; }
    });
    const up = () => { last = null; };
    $('#ctl').addEventListener('pointerup', up);
    $('#ctl').addEventListener('pointercancel', up);
    $('#devs').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) device(b.dataset.v); });
    $('#surf').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) surface(b.dataset.v); });
    async function glide(tx, ty, ctx) {
      const sx = pos.x, sy = pos.y;
      for (let i = 1; i <= 20; i++) {
        if (ctx && !ctx.alive()) return false;
        move(((sx + (tx - sx) * i / 20) - pos.x) / (dev === 'mouse' ? SENS[surf] : 1), ((sy + (ty - sy) * i / 20) - pos.y) / (dev === 'mouse' ? SENS[surf] : 1));
        await FD.wait(40);
      }
      return true;
    }

    // ---- joystick ----
    const sp = { x: 20, y: 50 }, vel = { x: 0, y: 0 };
    let stars = 0, loop = 0;
    function placeStar() { const s = $('#star'); s.style.left = (10 + Math.random() * 80) + '%'; s.style.top = (15 + Math.random() * 70) + '%'; }
    function stick(x, y) {
      vel.x = x; vel.y = y;
      $('#stick').style.transform = `translate(${x * 26}px, ${y * 26}px)`;
      $('#sprite').style.transform = `rotate(${x || y ? Math.atan2(y, x) * 180 / Math.PI + 45 : 45}deg)`;
    }
    function tick() {
      if (vel.x || vel.y) {
        sp.x = FD.clamp(sp.x + vel.x * 1.4 * FD.speed, 3, 95); sp.y = FD.clamp(sp.y + vel.y * 2.4 * FD.speed, 5, 90);
        $('#sprite').style.left = sp.x + '%'; $('#sprite').style.top = sp.y + '%';
        const a = $('#sprite').getBoundingClientRect(), b = $('#star').getBoundingClientRect();
        if (Math.hypot(a.left - b.left, a.top - b.top) < 26) { stars++; $('#gscore').textContent = 'Stars: ' + stars; FD.pulse($('#gscore')); placeStar(); }
      }
      loop = requestAnimationFrame(tick);
    }
    let jd = null;
    $('#joy').addEventListener('pointerdown', (e) => { const r = $('#joy').getBoundingClientRect(); jd = [r.left + r.width / 2, r.top + r.height / 2]; $('#joy').setPointerCapture(e.pointerId); e.preventDefault(); });
    $('#joy').addEventListener('pointermove', (e) => {
      if (!jd) return;
      let x = (e.clientX - jd[0]) / 30, y = (e.clientY - jd[1]) / 30;
      const m = Math.hypot(x, y); if (m > 1) { x /= m; y /= m; }
      stick(x, y);
    });
    const jup = () => { jd = null; stick(0, 0); };
    $('#joy').addEventListener('pointerup', jup);
    $('#joy').addEventListener('pointercancel', jup);
    $('#game').tabIndex = 0;
    $('#game').dataset.keys = '';
    const keys = {};
    const kstick = () => stick((keys.ArrowRight ? 1 : 0) - (keys.ArrowLeft ? 1 : 0), (keys.ArrowDown ? 1 : 0) - (keys.ArrowUp ? 1 : 0));
    $('#game').addEventListener('keydown', (e) => { if (e.key.startsWith('Arrow')) { e.preventDefault(); keys[e.key] = true; kstick(); } });
    $('#game').addEventListener('keyup', (e) => { if (e.key.startsWith('Arrow')) { keys[e.key] = false; kstick(); } });

    // ---- graphics tablet ----
    const cv = $('#cv'), g = cv.getContext('2d');
    let ink = '#13294b', pen = null;
    function wipe() {
      g.fillStyle = '#fbfaf6'; g.fillRect(0, 0, cv.width, cv.height);
      g.fillStyle = '#9aa1ad'; g.font = '14px system-ui'; g.fillText('Draw here ✏️', 14, 24);
    }
    const at = (e) => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * cv.width / r.width, (e.clientY - r.top) * cv.height / r.height]; };
    cv.addEventListener('pointerdown', (e) => { pen = at(e); cv.setPointerCapture(e.pointerId); e.preventDefault(); });
    cv.addEventListener('pointermove', (e) => {
      if (!pen) return;
      const p = at(e), real = e.pointerType === 'pen' && e.pressure > 0;
      g.strokeStyle = ink; g.lineCap = 'round';
      g.lineWidth = real ? 1 + e.pressure * 14 : +$('#press').value * 1.4;
      g.beginPath(); g.moveTo(...pen); g.lineTo(...p); g.stroke();
      pen = p;
    });
    const pup = () => { pen = null; };
    cv.addEventListener('pointerup', pup);
    cv.addEventListener('pointercancel', pup);
    const pOut = () => { $('#pOut').textContent = $('#press').value <= 3 ? 'light' : $('#press').value <= 7 ? 'medium' : 'heavy'; };
    $('#press').addEventListener('input', pOut);
    $('#ink').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) { ink = b.dataset.v; FD.segSet($('#ink'), ink); } });
    $('#wipe').addEventListener('click', wipe);
    async function sketch(ctx) {
      wipe();
      const pts = Array.from({ length: 60 }, (_, i) => { const t = i / 59 * Math.PI * 2; return [320 + 120 * Math.cos(t) * (1 + .15 * Math.sin(5 * t)), 150 + 90 * Math.sin(t) * (1 + .15 * Math.sin(5 * t))]; });
      g.strokeStyle = '#c8102e'; g.lineCap = 'round';
      for (let i = 1; i < pts.length; i++) {
        g.lineWidth = 2 + 6 * Math.abs(Math.sin(i / 8));
        g.beginPath(); g.moveTo(...pts[i - 1]); g.lineTo(...pts[i]); g.stroke();
        if (!(await ctx.sleep(25))) return;
      }
    }

    const show = FD.panels(root, (p) => { if (p !== 'joy') stick(0, 0); });
    device('mouse'); surface('mat'); drawPtr(); placeTarget(); placeStar(); pOut(); FD.segSet($('#ink'), ink); wipe();
    $('#sprite').style.left = sp.x + '%'; $('#sprite').style.top = sp.y + '%';
    loop = requestAnimationFrame(tick);
    show('ptr');
    return {
      show, device, surface, sketch,
      async demoPtr(ctx) { pos = { x: 30, y: 70 }; drawPtr(); const t = $('#target'); t.style.left = '72%'; t.style.top = '55%'; await FD.wait(300); await glide(72, 55, ctx); },
      async menu(ctx) { pos = { x: 60, y: 70 }; drawPtr(); await glide(8, 26, ctx); },
      async fly(ctx) { for (const [x, y, ms] of [[1, 0, 900], [0, -1, 600], [1, 1, 700], [-1, 0, 500]]) { stick(x, y); if (!(await ctx.sleep(ms))) { stick(0, 0); return; } } stick(0, 0); },
      destroy() { cancelAnimationFrame(loop); },
    };
  },
  steps: [
    {
      title: 'Pointing devices',
      text: `<p>A <strong>pointer</strong> is used on a screen to select displayed objects. An <strong>arrow</strong> is often used as the pointer.</p>
             <p>There are several types of device that allow you to control a pointer.</p>`,
      tip: 'Try it: drag in the control area to move the pointer onto the target.',
      async on(a, ctx) { a.show('ptr'); a.device('mouse'); a.surface('mat'); await a.menu(ctx); },
    },
    {
      title: 'Mouse',
      text: `<p>A <strong>mouse</strong> uses an <strong>optical sensor</strong> to recognise the movement of the device.</p>
             <p>Its <strong>sensitivity</strong> can be affected by the surface it is placed on. Some mice use <strong>roller balls</strong> to control the movement of the pointer.</p>`,
      tip: 'Try it: put the mouse on the glass table. What happens to the pointer?',
      async on(a, ctx) { a.show('ptr'); a.device('mouse'); a.surface('mat'); await a.demoPtr(ctx); if (!(await ctx.sleep(400))) return; a.surface('glass'); },
    },
    {
      title: 'Tracker ball',
      text: `<p>A <strong>tracker ball</strong> is rolled to move the pointer. It does <strong>not have buttons</strong> to press.</p>
             <p>Tracker balls are often used in <strong>installations</strong> like information kiosks, because the device stays fixed in place.</p>`,
      async on(a, ctx) { a.show('ptr'); a.device('tracker'); await a.demoPtr(ctx); },
    },
    {
      title: 'Track pad',
      text: `<p>The <strong>track pad</strong> surface senses finger <strong>movements</strong>, <strong>touches</strong> and <strong>presses</strong>.</p>
             <p>Track pads are often built into <strong>laptop computers</strong> to save space.</p>`,
      async on(a, ctx) { a.show('ptr'); a.device('pad'); await a.demoPtr(ctx); },
    },
    {
      title: 'Joystick',
      text: `<p><strong>Joysticks</strong> are commonly used on <strong>games controllers</strong> to move <strong>sprites</strong> around the game.</p>
             <p>Sprites are on-screen graphics that represent characters, vehicles and objects.</p>`,
      tip: 'Try it: use the joystick to fly the rocket to the stars.',
      async on(a, ctx) { a.show('joy'); await a.fly(ctx); },
    },
    {
      title: 'Graphics tablet',
      text: `<p>A <strong>graphics tablet</strong> is a flat pad that is used with a <strong>stylus</strong> (a pen-shaped device). Users use the stylus to <strong>draw</strong> or <strong>write</strong> on the tablet.</p>
             <p>These devices are often used by <strong>digital artists and designers</strong>.</p>`,
      tip: 'Try it: draw in the box. With a real stylus, pressing harder makes a thicker line.',
      async on(a, ctx) { a.show('tab'); await a.sketch(ctx); },
    },
  ],
});

FD.check({
  section: 'pointing',
  items: [
    {
      type: 'sort',
      q: 'Which pointing device matches each description?',
      bins: ['Mouse', 'Tracker ball', 'Track pad', 'Joystick', 'Graphics tablet'],
      rows: [['Uses an optical sensor; affected by the surface', 0], ['Rolled to move the pointer; no buttons', 1], ['Built into laptops; senses finger movements', 2], ['Moves sprites on a games controller', 3], ['Flat pad used with a stylus', 4]],
      why: 'Each pointing device controls the pointer (or sprite) in a different way.',
    },
    { type: 'mcq', q: 'Why are tracker balls often used in public kiosks?', opts: ['The device stays still in one place and has no separate parts to move or lose', 'They are the fastest way to type text', 'They can scan barcodes', 'They work without electricity'], why: 'A tracker ball is fixed in place; you roll the ball and there are no buttons.' },
    { type: 'mcq', q: 'What can affect the sensitivity of an optical mouse?', opts: ['The surface it is placed on', 'The colour of the screen', 'The size of the keyboard', 'The type of printer'], why: 'Shiny or glass surfaces make it hard for the optical sensor to see the movement.' },
    { type: 'tf', q: 'A stylus is a pen-shaped device used with a graphics tablet.', a: true, why: 'Digital artists and designers use a stylus to draw on graphics tablets.' },
    { type: 'mcq', q: 'What is a pointer?', opts: ['An on-screen indicator used to select displayed objects', 'A key that moves the cursor down one line', 'A type of storage device', 'The cable that connects a mouse'], why: 'An arrow is often used as the pointer.' },
  ],
});
