FD.add({
  id: 'sensors',
  title: 'Sensors',
  tab: 'Sensors',
  icon: 'sensors',
  color: '--c7',
  section: true,
  interactive: true,
  vocab: [
    ['sensor', 'an input peripheral that inputs data about the physical environment'],
    ['smart home', 'a home equipped with devices that can connect to the internet and be controlled remotely by a computer or smartphone app'],
    ['proximity', 'how close something is relative to something else'],
    ['PIR', 'Passive Infrared: a sensor that detects motion'],
  ],
  mount(el) {
    const S = [
      { k: 'light', e: '☀️', n: 'Light sensor', env: 'Daylight', min: 0, max: 100, v: 70, unit: ' lux×10', act: (v) => (v < 30 ? ['💡', 'Outside lights ON'] : ['🌑', 'Outside lights off']) },
      { k: 'temp', e: '🌡️', n: 'Temperature sensor', env: 'Room temperature', min: 5, max: 30, v: 21, unit: ' °C', act: (v) => (v < 18 ? ['🔥', 'Heating ON'] : v > 25 ? ['❄️', 'Air conditioning ON'] : ['✅', 'Heating off']) },
      { k: 'motion', e: '🏃', n: 'Motion sensor (PIR)', env: 'Movement in the hall', min: 0, max: 1, v: 0, unit: '', bool: ['no movement', 'movement'], act: (v) => (v ? ['🚨', 'Alarm! Photo sent to phone'] : ['🛡️', 'Alarm armed']) },
      { k: 'moist', e: '💧', n: 'Moisture sensor', env: 'Soil moisture in the garden', min: 0, max: 100, v: 55, unit: ' %', act: (v) => (v < 30 ? ['💦', 'Sprinkler ON'] : ['🌱', 'Sprinkler off']) },
      { k: 'prox', e: '📏', n: 'Proximity sensor', env: 'Distance from car to garage wall', min: 0, max: 200, v: 150, unit: ' cm', act: (v) => (v < 30 ? ['🛑', 'BEEEEP — stop!'] : v < 80 ? ['🔉', 'beep… beep…'] : ['🚗', 'Silent']) },
      { k: 'press', e: '⚖️', n: 'Pressure sensor', env: 'Weight on the doormat', min: 0, max: 100, v: 0, unit: ' kg', act: (v) => (v > 10 ? ['🔔', 'Someone at the door: camera on'] : ['🚪', 'Nobody there']) },
    ];
    el.innerHTML = `
      <div class="sim sn">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="home">🏠 Smart home</button><button data-p="mon">📈 Sensor vs human</button>
        </div>

        <div data-panel="home" class="sim">
          <div class="sn-flow" id="flow"><span>🌍 Environment</span><i>→</i><span>📟 Sensor</span><i>→</i><span>🔢 Digital data</span><i>→</i><span>🖥️ Computer processes</span><i>→</i><span>⚙️ Action</span></div>
          <div class="sn-grid">${S.map((s) => `
            <div class="sn-card" data-k="${s.k}" data-zone="${s.k}">
              <h5>${s.e} ${s.n}</h5>
              <label class="rng"><span>${s.env} <output></output></span><input type="range" min="${s.min}" max="${s.max}" value="${s.v}" step="${s.bool ? 1 : 1}"></label>
              <div class="sn-row"><span class="sn-data" title="Digital reading sent to the computer"></span><span class="sn-act"><b></b><small></small></span></div>
            </div>`).join('')}</div>
          <p class="small">Move the sliders to change the environment. The sensors input the data <b>automatically</b>: nobody has to press anything.</p>
        </div>

        <div data-panel="mon" class="sim" hidden>
          <p class="strong">⛰️ Gas levels near a volcano, over 24 hours</p>
          <div class="sim-box">
            <svg viewBox="0 0 530 200" aria-label="Gas level over 24 hours: sensor readings and human checks">
              <line class="sn-axis" x1="40" y1="170" x2="510" y2="170"/><line class="sn-axis" x1="40" y1="10" x2="40" y2="170"/>
              <line class="sn-danger" x1="40" y1="60" x2="510" y2="60"/><text class="sn-dl" x="508" y="54">danger level</text>
              ${[0, 6, 12, 18, 24].map((h) => `<text class="svg-sm" x="${40 + h * 19.5}" y="186">${String(h).padStart(2, '0')}:00</text>`).join('')}
              <path class="sn-line" id="sLine" d=""/>
              <g id="hDots"></g>
              <circle class="sn-now" id="now" r="5" cx="40" cy="160"/>
            </svg>
          </div>
          <div class="ctrls"><button class="btn primary small-btn" id="run">▶ Run 24 hours</button><span class="pill g">— sensor: every 10 minutes</span><span class="pill r">● human: checks at 09:00, 13:00 and 17:00</span></div>
          <div class="cards3 sn-ben">
            <div class="mini" data-b="remote"><h5>🌋 Remote or dangerous places</h5><p>Nobody has to stand next to the volcano.</p></div>
            <div class="mini" data-b="cont"><h5>⏱️ Monitor continually</h5><p id="contMsg">Day and night, without a break.</p></div>
            <div class="mini" data-b="err"><h5>✍️ No human error</h5><p id="errMsg">Readings are not misread or copied down wrongly.</p></div>
            <div class="mini" data-b="sense"><h5>👃 Sense what people cannot</h5><p>Small changes in pressure or gas levels.</p></div>
            <div class="mini" data-b="dig"><h5>🔢 Easily converted to digital</h5><p>The data goes straight into the computer.</p></div>
          </div>
        </div>
      </div>`;
    const root = el.querySelector('.sn'), $ = (s) => root.querySelector(s);
    let dead = false;

    // ---- smart home ----
    function update(card) {
      const s = S.find((x) => x.k === card.dataset.k), inp = card.querySelector('input'), v = +inp.value;
      card.querySelector('output').textContent = s.bool ? s.bool[v] : v + s.unit;
      const raw = Math.round(((v - s.min) / (s.max - s.min)) * 255);
      card.querySelector('.sn-data').textContent = raw.toString(2).padStart(8, '0');
      const [ic, txt] = s.act(v);
      const act = card.querySelector('.sn-act');
      if (act.dataset.t !== txt) { act.dataset.t = txt; FD.pulse(act.querySelector('b')); }
      act.querySelector('b').textContent = ic;
      act.querySelector('small').textContent = txt;
      card.classList.toggle('alert', !/off|armed|Silent|Nobody/.test(txt));
    }
    root.querySelectorAll('.sn-card').forEach((c) => { c.querySelector('input').addEventListener('input', () => update(c)); update(c); });
    function setSensor(k, v) { const c = root.querySelector(`.sn-card[data-k="${k}"]`); c.querySelector('input').value = v; update(c); }
    async function slide(k, to, ctx) {
      const c = root.querySelector(`.sn-card[data-k="${k}"]`), inp = c.querySelector('input'), from = +inp.value;
      for (let i = 1; i <= 12; i++) { inp.value = Math.round(from + ((to - from) * i) / 12); update(c); if (!(await ctx.sleep(70))) return false; }
      return true;
    }

    // ---- sensor vs human ----
    const gas = (h) => 30 + 8 * Math.sin(h / 3) + (h > 3.4 && h < 4.4 ? 95 * Math.sin(((h - 3.4) / 1) * Math.PI) : 0);
    const X = (h) => 40 + h * 19.5, Y = (g) => 170 - g;
    let runId = 0;
    async function run() {
      const id = ++runId;
      $('#sLine').setAttribute('d', ''); $('#hDots').innerHTML = '';
      root.querySelectorAll('.sn-ben .mini').forEach((m) => m.classList.remove('hot'));
      let d = '';
      for (let h = 0; h <= 24.001; h += 1 / 6) {
        if (id !== runId || dead) return;
        d += (h ? 'L' : 'M') + X(h).toFixed(1) + ' ' + Y(gas(h)).toFixed(1);
        $('#sLine').setAttribute('d', d);
        $('#now').setAttribute('cx', X(h)); $('#now').setAttribute('cy', Y(gas(h)));
        [9, 13, 17].forEach((c) => {
          if (Math.abs(h - c) < 0.08) {
            const real = Math.round(gas(c)), wrote = c === 13 ? +String(real).split('').reverse().join('') : real;
            $('#hDots').insertAdjacentHTML('beforeend', `<circle class="sn-h" cx="${X(c)}" cy="${Y(wrote)}" r="6"/><text class="sn-ht" x="${X(c)}" y="${Y(wrote) - 10}">${wrote}${c === 13 ? ' ✗' : ''}</text>`);
          }
        });
        await FD.wait(18);
      }
      $('#contMsg').innerHTML = 'The sensor caught the <b>gas leak at 03:30–04:30</b>. The human was asleep and missed it.';
      $('#errMsg').innerHTML = `At 13:00 the human wrote <b>${String(Math.round(gas(13))).split('').reverse().join('')}</b> instead of ${Math.round(gas(13))}: human error.`;
      root.querySelectorAll('.sn-ben .mini[data-b="cont"], .sn-ben .mini[data-b="err"]').forEach((m) => m.classList.add('hot'));
    }
    $('#run').addEventListener('click', run);

    const show = FD.panels(root);
    show('home');
    return {
      show, setSensor, slide, run,
      focus: (z) => FD.focus(root.querySelector('.sn-grid'), z),
      flow(on) { $('#flow').classList.toggle('go', on); },
      ben(list) { root.querySelectorAll('.sn-ben .mini').forEach((m) => m.classList.toggle('hot', list.includes(m.dataset.b))); },
      destroy() { dead = true; runId++; },
    };
  },
  steps: [
    {
      title: 'Sensors',
      text: `<p><strong>Sensors</strong> are used to input data about the <strong>physical environment</strong>. They can input data <strong>automatically</strong>, without the need for human action.</p>
             <p>Their output is then <strong>processed by a computer</strong>.</p>`,
      async on(a, ctx) { a.show('home'); a.focus([]); a.flow(true); a.setSensor('light', 70); if (!(await ctx.sleep(800))) return; a.focus(['light']); await a.slide('light', 15, ctx); },
    },
    {
      title: 'Smart devices and smart homes',
      text: `<p>Sensors are one of the main features of <strong>smart devices</strong>, such as smartphones, and of smart environments such as <strong>smart homes</strong>.</p>
             <p>A smart home has devices that connect to the internet and can be controlled remotely by a computer or a smartphone app.</p>`,
      tip: 'Try it: change the environment and watch what the smart home does.',
      async on(a, ctx) { a.show('home'); a.focus(['motion']); if (!(await ctx.sleep(600))) return; a.setSensor('motion', 1); if (!(await ctx.sleep(1400))) return; a.focus(['press']); await a.slide('press', 60, ctx); },
    },
    {
      title: 'What sensors measure',
      text: `<p>There are many types of sensor, to monitor a range of environmental factors:</p>
             <ul><li>light</li><li>moisture and humidity</li><li>temperature</li><li>proximity and distance</li><li>motion and movement (such as <strong>Passive Infrared (PIR)</strong> sensors)</li><li>pressure.</li></ul>`,
      async on(a, ctx) {
        a.show('home');
        for (const [k, v] of [['temp', 14], ['moist', 20], ['prox', 20]]) { a.focus([k]); if (!(await a.slide(k, v, ctx))) return; if (!(await ctx.sleep(900))) return; }
        a.focus([]);
      },
    },
    {
      title: 'Benefits of sensors',
      text: `<p>Sensors:</p>
             <ul><li>can be placed in <strong>remote or dangerous</strong> places</li><li>can monitor <strong>continually</strong></li><li>remove the possibility of <strong>human error</strong>.</li></ul>`,
      tip: 'Try it: run the 24 hours and compare the sensor with the human checks.',
      async on(a) { a.show('mon'); a.ben(['remote']); await a.run(); },
    },
    {
      title: 'More benefits',
      text: `<p>Sensors can also:</p>
             <ul><li>sense things that people <strong>cannot</strong>, such as small changes in pressure or gas levels</li><li>produce data that is easily (sometimes automatically) converted to a <strong>digital</strong> form.</li></ul>
             <p>For example, sensors are used in aircraft, and the data is displayed to the flight crew on the instruments in the cockpit.</p>`,
      on: (a) => { a.show('mon'); a.ben(['sense', 'dig']); },
    },
  ],
});

FD.activities({
  section: 'sensors',
  items: [
    {
      id: 'sensorplaces',
      title: 'Using sensors (1)',
      task: '<p>For each environmental factor, state one <b>remote</b> and one <b>dangerous</b> environment where a sensor could be used.</p>',
      fields: ['Light', 'Moisture and humidity', 'Temperature', 'Proximity and distance', 'Motion and movement', 'Pressure'],
      lines: 2,
      hint: 'e.g. Temperature – remote: a weather station in Antarctica; dangerous: inside a nuclear reactor…',
    },
    {
      id: 'sensorhome',
      title: 'Using sensors (2 and 3)',
      task: '<ol start="2"><li>Research the appliances in modern smart homes that can use sensors. For each one, describe how sensors are used.</li><li>Research how sensors can help to prevent air traffic accidents. Can you find any instances where they may have caused accidents?</li></ol>',
      fields: ['2. Smart-home appliances and their sensors'],
      lines: 5,
      hint: '3. Sensors and air traffic accidents…',
    },
  ],
});

FD.check({
  section: 'sensors',
  items: [
    { type: 'mcq', q: 'What is a sensor?', opts: ['An input peripheral that inputs data about the physical environment', 'An output device that displays warnings', 'A program that monitors network traffic', 'A storage device for smart homes'], why: 'Sensors input data automatically, without human action.' },
    {
      type: 'sort',
      q: 'Which type of sensor is needed?',
      bins: ['Light', 'Temperature', 'Motion (PIR)', 'Moisture', 'Proximity', 'Pressure'],
      rows: [['Switch on street lights when it gets dark', 0], ['Turn on the heating when the room is cold', 1], ['Detect an intruder walking through a room', 2], ['Water the plants when the soil is dry', 3], ['Warn a driver who is reversing close to a wall', 4], ['Detect a person standing on a doormat', 5]],
      why: 'Each sensor measures one environmental factor.',
    },
    { type: 'multi', q: 'Which three are benefits of using sensors?', need: 3, opts: [['They can be placed in remote or dangerous places', true], ['They can monitor continually', true], ['They remove the possibility of human error', true], ['They never need electricity', false], ['They can replace all computers', false]], why: 'Also: they sense things people cannot, and the data is easily converted to digital form.' },
    { type: 'tf', q: 'Sensors need a person to press a button each time they take a reading.', a: false, why: 'Sensors input data automatically, without the need for human action.' },
    { type: 'mcq', q: 'What does PIR stand for in a motion sensor?', opts: ['Passive Infrared', 'Personal Identification Reader', 'Pressure Input Recorder', 'Proximity Indicator Radar'], why: 'PIR sensors detect motion and movement.' },
  ],
});
