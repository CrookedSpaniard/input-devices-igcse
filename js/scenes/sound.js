FD.add({
  id: 'sound',
  title: 'Microphones and touch screens',
  tab: 'Mic · touch',
  icon: 'sound',
  color: '--c5',
  section: true,
  interactive: true,
  vocab: [
    ['diaphragm', 'a thin round object, especially in a telephone or loudspeaker, that is moved by sound or that moves when it produces sound'],
    ['analogue', 'representing information with continuously variable electrical signals that digital signals approximate'],
    ['sound card', 'a device built into or added into a computer to allow it to play back and record audio'],
    ['VoIP', 'Voice over Internet Protocol: lets people use broadband internet connections to speak to other people, rather than a conventional telephone'],
    ['capacitive', 'able to hold an electrical charge'],
    ['conductive', 'able to conduct electricity'],
  ],
  mount(el) {
    el.innerHTML = `
      <div class="sim snd">
        <div class="ptabs" role="group" aria-label="Simulations">
          <button data-p="mic">🎤 Inside a microphone</button><button data-p="card">🔌 Sound card</button><button data-p="touch">☝️ Touch screens</button>
        </div>

        <div data-panel="mic" class="sim">
          <div class="sim-box">
            <svg viewBox="0 0 560 230" role="img" aria-label="Sound waves move a diaphragm, which produces an analogue signal that the sound card turns into digital data">
              <g data-zone="waves" id="waves">${[0, 1, 2, 3].map((i) => `<path class="mc-wave" style="--d:${i * 0.35}s" d="M${40 + i * 18} 70a60 60 0 0 1 0 90"/>`).join('')}<text class="svg-sm" x="60" y="190">sound waves</text></g>
              <g data-zone="mic">
                <path class="mc-body" d="M150 62h120l70 40v26l-70 40H150z"/>
                <rect class="mc-box" x="168" y="74" width="80" height="82" rx="4"/>
                <g id="gran">${Array.from({ length: 18 }, (_, i) => `<circle class="mc-gran" cx="${190 + (i % 3) * 16 + (Math.floor(i / 3) % 2) * 8}" cy="${84 + Math.floor(i / 3) * 13}" r="6.5"/>`).join('')}</g>
                <path class="mc-dia" id="dia" d="M168 72Q168 115 168 158"/>
                <rect class="mc-elec" x="250" y="72" width="5" height="86"/>
                <text class="svg-sm" x="168" y="58">diaphragm</text><text class="svg-sm" x="210" y="180">carbon granules</text>
              </g>
              <path class="wire on" d="M340 115H368"/>
              <g data-zone="ana">
                <rect class="mc-scr" x="368" y="18" width="180" height="88" rx="8"/>
                <path class="mc-sig" id="ana" d=""/>
                <text class="mc-cap" x="378" y="34">analogue signal</text>
              </g>
              <path class="wire on" d="M458 106v18"/>
              <g data-zone="dig">
                <rect class="mc-scr dg" x="368" y="124" width="180" height="88" rx="8"/>
                <path class="mc-sig dg" id="dig" d=""/>
                <text class="mc-cap" x="378" y="140">digital data</text>
                <text class="mc-bin" id="bin" x="540" y="205"></text>
              </g>
              <text class="svg-sm" x="448" y="228">sound card: analogue-to-digital converter</text>
            </svg>
          </div>
          <div class="ctrls">
            <button class="btn primary small-btn" id="talk" aria-pressed="false">🗣️ Speak</button>
            <label class="rng"><span>Loudness <output id="lOut"></output></span><input type="range" id="loud" min="1" max="10" value="6"></label>
            <label class="rng"><span>Pitch <output id="pOut"></output></span><input type="range" id="pitch" min="1" max="10" value="4"></label>
          </div>
          <p class="small" id="micMsg">Press <b>Speak</b>. The sound waves hit the diaphragm and make it move.</p>
        </div>

        <div data-panel="card" class="sim" hidden>
          <div class="sim-box sn-card">
            <div class="sn-ports">${[['mic', '🎤', 'microphone', '#f08c7d'], ['in', '🔈', 'line in', '#74c0fc'], ['out', '🔊', 'line out', '#8ce99a']].map(([k, e, n, c]) => `
              <button class="sn-port" data-port="${k}" style="--pc:${c}"><span class="sn-hole"></span><b>${e}</b><small>${n}</small></button>`).join('')}<span class="sn-free"></span></div>
          </div>
          <p class="small" id="cardMsg">🎤 Plug the microphone into the right port on the sound card.</p>
          <div class="cards3">
            <div class="mini"><h5>💻 Small, built-in microphones</h5><p>Lower quality. Used for voice recognition, recording speech and <b>VoIP</b> calls.</p></div>
            <div class="mini"><h5>🎙️ Higher quality microphones</h5><p>Used by recording artists, connected to the sound card’s audio input port.</p></div>
            <div class="mini"><h5>♿ Accessibility</h5><p>Microphones give access to people who cannot input data using a mouse and keyboard.</p></div>
          </div>
        </div>

        <div data-panel="touch" class="sim" hidden>
          <span class="seg" id="tool"><span class="seg-l">Touch with</span><button data-v="finger">☝️ Finger</button><button data-v="glove">🧤 Gloved finger</button><button data-v="stylus">🖊️ Plastic stylus</button></span>
          <div class="tc-grid">
            <div class="tc-col" id="colR">
              <h4>Resistive</h4>
              <svg viewBox="0 0 240 120" aria-hidden="true">
                <path class="tc-top" id="topR" d="M10 40Q120 40 230 40"/>
                ${[30, 70, 110, 150, 190].map((x) => `<circle class="tc-dot" cx="${x + 10}" cy="52" r="2.5"/>`).join('')}
                <rect class="tc-bot" x="10" y="62" width="220" height="6"/><rect class="tc-glass" x="10" y="68" width="220" height="14"/>
                <text class="tc-hand" id="handR" x="120" y="30">☝️</text>
                <circle class="tc-spark" id="spark" cx="120" cy="61" r="0"/>
                <text class="svg-sm" x="120" y="105">two layers: pressure makes them touch</text>
              </svg>
              <div class="tc-pad" id="padR" aria-label="Resistive screen: tap here"><span class="tc-hint">Tap here</span></div>
              <p class="tc-res" id="resR"></p>
            </div>
            <div class="tc-col" id="colC">
              <h4>Capacitive</h4>
              <svg viewBox="0 0 240 120" aria-hidden="true">
                <rect class="tc-glass" x="10" y="40" width="220" height="14"/>
                <rect class="tc-cap" x="10" y="54" width="220" height="8"/>
                ${[30, 70, 110, 150, 190].map((x) => `<text class="tc-plus" x="${x + 10}" y="61">+</text>`).join('')}
                <text class="tc-hand" id="handC" x="120" y="30">☝️</text>
                <g id="flow">${[0, 1, 2].map((i) => `<circle class="tc-e" style="--d:${i * 0.2}s" cx="120" cy="56" r="3"/>`).join('')}</g>
                <text class="svg-sm" x="120" y="105">charge flows into a conductive finger</text>
              </svg>
              <div class="tc-pad" id="padC" aria-label="Capacitive screen: tap here"><span class="tc-hint">Tap here</span>${['tl', 'tr', 'bl', 'br'].map((c) => `<span class="tc-meter ${c}"><i></i></span>`).join('')}</div>
              <p class="tc-res" id="resC"></p>
            </div>
          </div>
          <div class="ctrls"><button class="btn small-btn" id="pinch">🤏 Pinch with two fingers</button></div>
          <div class="tbl-wrap"><table class="tbl"><thead><tr><th></th><th>Resistive</th><th>Capacitive</th></tr></thead><tbody>
            <tr><th>How it works</th><td>Pressure makes two layers touch and make a connection</td><td>A small amount of charge flows from the capacitive layer to the finger</td></tr>
            <tr><th>Durability</th><td class="y">More durable ✓</td><td class="n">Less durable</td></tr>
            <tr><th>Reading the screen</th><td class="n">Harder to read: more layers reflect more light</td><td class="y">Easier to read ✓</td></tr>
            <tr><th>Multi-touch</th><td class="n">Only one touch at a time ✗</td><td class="y">Yes ✓ (pinch to zoom)</td></tr>
            <tr><th>Often used in</th><td>Some older devices and kiosks</td><td>Smartphones</td></tr>
          </tbody></table></div>
        </div>
      </div>`;
    const root = el.querySelector('.snd'), $ = (s) => root.querySelector(s);
    const svgMic = root.querySelector('[data-panel="mic"] svg');
    let dead = false;

    // ---- microphone ----
    let talking = false, raf = 0, t = 0, hist = [];
    const loud = () => +$('#loud').value, pitch = () => +$('#pitch').value;
    function sample() {
      if (!talking) return 0;
      const env = 0.55 + 0.45 * Math.sin(t * 1.3) * Math.sin(t * 0.7 + 1);
      return (loud() / 10) * env * (Math.sin(t * pitch() * 2.2) * 0.75 + Math.sin(t * pitch() * 5.1) * 0.25);
    }
    function frame() {
      t += 0.05 * FD.speed;
      const v = sample();
      hist.push(v); if (hist.length > 160) hist.shift();
      const x0 = 372, w = 172;
      $('#ana').setAttribute('d', 'M' + hist.map((h, i) => `${x0 + (i * w) / 160} ${62 - h * 36}`).join('L'));
      let d = '', last = null, bins = [];
      for (let i = 0; i < hist.length; i += 8) {
        const q = Math.round(((hist[i] + 1) / 2) * 7); // 3-bit sample: 0–7
        const x = x0 + (i * w) / 160, y = 204 - q * 8.5;
        d += last == null ? `M${x} ${y}` : `H${x}V${y}`;
        last = y; bins.push(q);
      }
      if (d) d += `H${x0 + w}`;
      $('#dig').setAttribute('d', d);
      $('#bin').textContent = bins.slice(-4).map((q) => q.toString(2).padStart(3, '0')).join(' ');
      $('#dia').setAttribute('d', `M168 72Q${168 + v * 22} 115 168 158`);
      $('#gran').setAttribute('transform', `translate(${Math.max(0, v) * 4} 0)`);
      raf = requestAnimationFrame(frame);
    }
    function talk(on) {
      talking = on;
      $('#talk').setAttribute('aria-pressed', on);
      $('#talk').classList.toggle('on', on);
      $('#talk').innerHTML = on ? '🤫 Stop' : '🗣️ Speak';
      svgMic.classList.toggle('talking', on);
      $('#micMsg').innerHTML = on
        ? 'The diaphragm moves, squeezing the carbon granules. This produces an <b>analogue</b> electrical signal. The <b>sound card</b> measures it many times a second and turns each measurement into a binary number: <b>digital</b> data.'
        : 'Press <b>Speak</b>. The sound waves hit the diaphragm and make it move.';
    }
    $('#talk').addEventListener('click', () => talk(!talking));
    const outs = () => { $('#lOut').textContent = loud() <= 3 ? 'quiet' : loud() <= 7 ? 'normal' : 'loud'; $('#pOut').textContent = pitch() <= 3 ? 'low' : pitch() <= 7 ? 'medium' : 'high'; };
    $('#loud').addEventListener('input', outs); $('#pitch').addEventListener('input', outs);

    // ---- sound card ----
    function plug(k) {
      root.querySelectorAll('.sn-port').forEach((p) => p.classList.remove('ok', 'no'));
      const p = root.querySelector(`[data-port="${k}"]`);
      p.classList.add(k === 'mic' ? 'ok' : 'no');
      $('#cardMsg').innerHTML = k === 'mic' ? '✓ Correct: the <b>microphone</b> port (pink) is an audio <b>input</b> port. The sound card converts the analogue signal to digital.'
        : k === 'in' ? '✗ <b>Line in</b> (blue) is for other audio equipment, such as a music player. Try the pink port.'
          : '✗ <b>Line out</b> (green) is an <b>output</b>: it is for speakers or headphones.';
    }
    root.querySelectorAll('.sn-port').forEach((p) => p.addEventListener('click', () => plug(p.dataset.port)));

    // ---- touch screens ----
    let tool = 'finger';
    const HAND = { finger: '☝️', glove: '🧤', stylus: '🖊️' };
    function setTool(v) { tool = v; FD.segSet($('#tool'), v); $('#handR').textContent = HAND[v]; $('#handC').textContent = HAND[v]; }
    $('#tool').addEventListener('click', (e) => { const b = e.target.closest('[data-v]'); if (b) setTool(b.dataset.v); });
    function dot(pad, x, y, cls = '') { const d = FD.h(`<span class="tc-touch ${cls}" style="left:${x}%;top:${y}%"></span>`); pad.appendChild(d); setTimeout(() => d.remove(), FD.dur(1400)); }
    async function pressR(x, y) {
      $('#topR').setAttribute('d', 'M10 40Q120 82 230 40');
      $('#spark').setAttribute('r', 6);
      dot($('#padR'), x, y);
      $('#resR').innerHTML = `✓ Touch at (${Math.round(x)}, ${Math.round(y)}). Pressure works with ${tool === 'finger' ? 'a finger' : tool === 'glove' ? 'a gloved finger' : 'a stylus'}.`;
      $('#resR').className = 'tc-res good';
      await FD.wait(500);
      if (dead) return;
      $('#topR').setAttribute('d', 'M10 40Q120 40 230 40');
      $('#spark').setAttribute('r', 0);
    }
    async function pressC(x, y) {
      const ok = tool === 'finger';
      const corners = { tl: [0, 0], tr: [100, 0], bl: [0, 100], br: [100, 100] };
      Object.entries(corners).forEach(([c, [cx, cy]]) => {
        const v = ok ? Math.max(8, 100 - Math.hypot(x - cx, y - cy) * 0.8) : 0;
        $(`#padC .tc-meter.${c} i`).style.width = v + '%';
      });
      $('#colC').classList.toggle('flowing', ok);
      if (ok) {
        dot($('#padC'), x, y);
        $('#resC').innerHTML = `✓ The current measured at each corner gives the location: (${Math.round(x)}, ${Math.round(y)}).`;
      } else {
        dot($('#padC'), x, y, 'miss');
        $('#resC').innerHTML = `✗ Nothing happens: ${tool === 'glove' ? 'the glove' : 'a plastic stylus'} is not <b>conductive</b>, so no charge flows.`;
      }
      $('#resC').className = 'tc-res ' + (ok ? 'good' : 'bad');
      await FD.wait(900);
      if (!dead) $('#colC').classList.remove('flowing');
    }
    const at = (pad, e) => { const r = pad.getBoundingClientRect(); return [FD.clamp(((e.clientX - r.left) / r.width) * 100, 0, 100), FD.clamp(((e.clientY - r.top) / r.height) * 100, 0, 100)]; };
    $('#padR').addEventListener('pointerdown', (e) => pressR(...at($('#padR'), e)));
    $('#padC').addEventListener('pointerdown', (e) => pressC(...at($('#padC'), e)));
    function pinch() {
      dot($('#padR'), 35, 50); dot($('#padR'), 65, 50, 'miss');
      $('#resR').innerHTML = '✗ Only <b>one touch</b> is recognised at a time: no multi-touch.'; $('#resR').className = 'tc-res bad';
      if (tool !== 'finger') setTool('finger');
      dot($('#padC'), 35, 50); dot($('#padC'), 65, 50);
      $('#padC').classList.remove('zoom'); void $('#padC').offsetWidth; $('#padC').classList.add('zoom');
      $('#resC').innerHTML = '✓ Two touches recognised: <b>pinch to zoom</b> works (multi-touch).'; $('#resC').className = 'tc-res good';
    }
    $('#pinch').addEventListener('click', pinch);

    const show = FD.panels(root, (p) => { cancelAnimationFrame(raf); if (p === 'mic') raf = requestAnimationFrame(frame); });
    outs(); setTool('finger'); show('mic');
    return {
      show, talk, plug, setTool, pinch,
      focus: (z) => FD.focus(svgMic, z),
      tapR: (x, y) => pressR(x, y), tapC: (x, y) => pressC(x, y),
      destroy() { dead = true; cancelAnimationFrame(raf); },
    };
  },
  steps: [
    {
      title: 'Microphones',
      text: `<p>A <strong>microphone</strong> is used to capture sound. It uses a <strong>diaphragm</strong>, which moves when air hits it.</p>
             <p>This movement produces an <strong>analogue</strong> electrical signal.</p>`,
      tip: 'Try it: press Speak and change the loudness and pitch.',
      async on(a, ctx) { a.show('mic'); a.talk(false); a.focus(['waves', 'mic']); if (!(await ctx.sleep(700))) return; a.talk(true); if (!(await ctx.sleep(2200))) return; a.focus(['mic', 'ana']); },
    },
    {
      title: 'From analogue to digital',
      text: `<p>A computer can only process <strong>digital</strong> data. The microphone’s electrical signal is converted into a digital signal by the computer’s <strong>sound card</strong>, which acts as an <strong>analogue-to-digital converter</strong>.</p>`,
      async on(a, ctx) { a.show('mic'); a.talk(true); a.focus(['ana', 'dig']); if (!(await ctx.sleep(3500))) return; a.focus([]); },
    },
    {
      title: 'Using microphones',
      text: `<p><strong>Small, low-quality</strong> microphones are often built into computers. They are used for voice recognition, recording speech or <strong>VoIP</strong> calls.</p>
             <p><strong>Higher quality</strong> microphones are used by recording artists and can be connected to a sound card’s <strong>audio input port</strong>.</p>`,
      tip: 'Try it: which port on the sound card is for the microphone?',
      async on(a, ctx) { a.show('card'); if (!(await ctx.sleep(1200))) return; a.plug('mic'); },
    },
    {
      title: 'Microphones and accessibility',
      text: `<p>Microphones are often used to make devices and technology <strong>accessible</strong> to people with disabilities: they give access to people who are unable to input data using a mouse and keyboard.</p>`,
      tip: 'Exam hint: a headset is not a type of peripheral. It is equipment that combines a microphone and headphone speakers. Give specific peripherals in your answers. And do not confuse accessibility (more people can use it) with usability (more efficient and satisfying to use).',
      on: (a) => a.show('card'),
    },
    {
      title: 'Touch screens: resistive',
      text: `<p>Touch screens are used in smartphones, tablets, laptops and desktop computers. There are two types: <strong>resistive</strong> and <strong>capacitive</strong>.</p>
             <p>When a user presses on a <strong>resistive</strong> screen, the <strong>pressure</strong> causes two layers underneath the screen to touch and make a connection.</p>`,
      tip: 'Try it: tap both screens with a finger, a glove and a stylus.',
      async on(a, ctx) { a.show('touch'); a.setTool('glove'); if (!(await ctx.sleep(800))) return; await a.tapR(40, 45); },
    },
    {
      title: 'Resistive: pros and cons',
      text: `<p>Resistive touch screens are <strong>more durable</strong> than capacitive ones, but they are <strong>harder to read</strong> because more layers reflect more light.</p>
             <p>They can only recognise <strong>one touch at a time</strong>, so they are not suitable for <strong>multi-touch</strong> applications.</p>`,
      async on(a, ctx) { a.show('touch'); if (!(await ctx.sleep(700))) return; a.pinch(); },
    },
    {
      title: 'Touch screens: capacitive',
      text: `<p>Under the glass of a <strong>capacitive</strong> screen there is a layer of capacitive material. When a user touches the screen, a small amount of charge flows away from their finger, because humans are <strong>conductive</strong>.</p>
             <p>The closer the finger is to the charged areas, the more current flows away. This lets the computer calculate the <strong>precise location</strong>. Capacitive screens are often used in <strong>smartphones</strong>.</p>`,
      async on(a, ctx) { a.show('touch'); a.setTool('finger'); if (!(await ctx.sleep(600))) return; await a.tapC(25, 30); if (!(await ctx.sleep(900))) return; a.setTool('glove'); await a.tapC(70, 60); },
    },
  ],
});

FD.check({
  section: 'sound',
  items: [
    { type: 'mcq', q: 'What part of a microphone moves when sound waves hit it?', opts: ['The diaphragm', 'The sound card', 'The stylus', 'The optical sensor'], why: 'The movement of the diaphragm produces an analogue electrical signal.' },
    { type: 'mcq', q: 'What does the sound card do with the signal from a microphone?', opts: ['Converts the analogue signal to a digital signal', 'Converts the digital signal to an analogue signal', 'Makes the sound louder for the speakers', 'Stores the sound on a USB drive'], why: 'The sound card acts as an analogue-to-digital converter.' },
    {
      type: 'sort',
      q: 'Resistive or capacitive?',
      bins: ['Resistive', 'Capacitive'],
      rows: [['Pressure makes two layers touch', 0], ['Works because humans are conductive', 1], ['More durable', 0], ['Supports multi-touch, e.g. pinch to zoom', 1], ['Harder to read because more layers reflect light', 0], ['Often used in smartphones', 1]],
      why: 'Resistive: pressure, two layers, durable, one touch. Capacitive: charge flows to the finger, precise, multi-touch.',
    },
    { type: 'tf', q: 'A headset is a type of peripheral device.', a: false, why: 'A headset is a piece of equipment that combines a microphone and headphone speakers. In the exam, name specific peripherals.' },
    { type: 'mcq', q: 'Why might a capacitive touch screen not work when the user wears thick gloves?', opts: ['The glove is not conductive, so no charge flows away', 'The glove presses too hard on the layers', 'Gloves block the microphone', 'The screen can only detect styluses'], why: 'Capacitive screens detect the charge that flows into a conductive finger.' },
    { type: 'multi', q: 'Give two uses of small microphones built into computers.', need: 2, opts: [['Voice recognition', true], ['VoIP calls', true], ['Printing documents', false], ['Reading barcodes', false]], why: 'Also recording speech.' },
  ],
});
