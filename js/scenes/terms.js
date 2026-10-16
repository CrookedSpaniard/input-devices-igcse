FD.add({
  id: 'terms',
  title: 'Key terms',
  tab: 'Key terms',
  icon: 'terms',
  color: '--accent',
  page: true,
  mount(el) {
    const T = [
      ['peripherals', 'Peripheral device', 'A device that can be connected to a computer, such as a PC or tablet, inside or outside it.'],
      ['peripherals', 'Input / output / storage', 'The three types of peripheral. Input peripherals send data to the computer.'],
      ['keyboards', 'Keys', 'Buttons that users press to input text or interact with software.'],
      ['keyboards', 'Shortcut', 'A combination of key presses used to access common software commands quickly.'],
      ['keyboards', 'Touch-typing', 'Typing without needing to look at the keys. It increases input speed.'],
      ['keyboards', 'Mapped', 'Linked: e.g. keys mapped to specialist video-editing commands.'],
      ['pointing', 'Pointer', 'An on-screen indicator used to select displayed objects, often an arrow.'],
      ['pointing', 'Mouse', 'Uses an optical sensor (or a roller ball) to recognise movement. Affected by the surface.'],
      ['pointing', 'Tracker ball', 'A ball that is rolled to move the pointer. No buttons. Used in kiosks.'],
      ['pointing', 'Track pad', 'Senses finger movements, touches and presses. Built into laptops to save space.'],
      ['pointing', 'Joystick / sprites', 'Used on games controllers to move sprites: on-screen graphics of characters, vehicles and objects.'],
      ['pointing', 'Graphics tablet / stylus', 'A flat pad used with a pen-shaped stylus to draw or write. Used by digital artists and designers.'],
      ['scanners', 'Scanner', 'Uses light sensors to record physical documents as images, saved as files.'],
      ['scanners', 'OCR', 'Optical Character Recognition: reads the characters on a scanned document and stores them in a text file.'],
      ['scanners', 'OMR', 'Optical Mark Recognition: detects simple marks, e.g. answers to multiple-choice tests.'],
      ['scanners', 'Barcode', 'A pattern of lines and gaps. The scanner detects their width. Used in shops and on parcels.'],
      ['scanners', 'Linear / matrix (QR) code', 'The two types of barcode. QR codes hold much more information and can be scanned from any angle.'],
      ['scanners', 'Webcam', 'A specialised camera, usually lower quality than a camcorder, sometimes with a built-in microphone.'],
      ['sound', 'Diaphragm', 'A thin round object in a microphone that moves when air hits it.'],
      ['sound', 'Analogue', 'Information shown by continuously variable electrical signals, which digital signals approximate.'],
      ['sound', 'Sound card', 'Built into or added to a computer to play back and record audio. Converts analogue to digital.'],
      ['sound', 'VoIP', 'Voice over Internet Protocol: speaking to people over a broadband internet connection.'],
      ['sound', 'Resistive touch screen', 'Pressure makes two layers touch. Durable, harder to read, one touch at a time.'],
      ['sound', 'Capacitive touch screen', 'Charge flows to a conductive finger. Precise and multi-touch. Used in smartphones.'],
      ['biometrics', 'Biometric scanner', 'Measures unique physical characteristics several times; stores an average to compare with future samples.'],
      ['biometrics', 'Fingerprint recognition', 'Reads the arches, loops and whorls of a fingerprint.'],
      ['biometrics', 'Facial / voice recognition', 'Identifies the structure of a face / compares a voice print with a saved original.'],
      ['biometrics', 'Iris recognition', 'About 120 times more detailed than a fingerprint, so 120 times more reliable.'],
      ['cards', 'Magnetic strip', 'The least secure card method: data can be copied (skimmed) without the owner knowing.'],
      ['cards', 'Programmable chip (chip and PIN)', 'Readable only when the correct PIN is entered. Reduced certain fraud in the UK by 67%.'],
      ['cards', 'RFID / NFC', 'Short-range wireless. Cheap, small tags with a unique ID linked to records in a database. NFC is a branch of RFID.'],
      ['cards', 'Fraud', 'Deceiving other people for criminal reasons.'],
      ['sensors', 'Sensor', 'An input peripheral that inputs data about the physical environment automatically.'],
      ['sensors', 'Smart home', 'A home with devices that connect to the internet and can be controlled remotely.'],
      ['sensors', 'Proximity', 'How close something is relative to something else.'],
      ['sensors', 'PIR', 'Passive Infrared: a motion sensor.'],
    ];
    const colorOf = (id) => (FD.section(id) || { color: '--accent' }).color;
    el.innerHTML = `
      <h2>Key terms</h2>
      <div class="terms-tools"><input type="search" id="tq" placeholder="Search a term…" aria-label="Search terms">
        <span class="seg" id="tp"><button data-v="all">All</button><button data-v="A">Part A</button><button data-v="B">Part B</button></span>
        <span class="small muted" id="tn"></span></div>
      <div class="terms" id="terms">${T.map(([f, t, d]) => `
        <article class="term" data-part="${FD.section(f).part}" style="--c:var(${colorOf(f)})"><h3>${t}</h3><p>${d}</p><button class="link-btn" data-go="${f}">${FD.icon[f]} See it</button></article>`).join('')}</div>`;
    const cards = [...el.querySelectorAll('.term')];
    const q = el.querySelector('#tq'), n = el.querySelector('#tn');
    let part = 'all';
    const filter = () => {
      const s = q.value.trim().toLowerCase();
      let k = 0;
      cards.forEach((c) => { const show = (!s || c.textContent.toLowerCase().includes(s)) && (part === 'all' || c.dataset.part === part); c.hidden = !show; k += show; });
      n.textContent = `${k} of ${cards.length} terms`;
      FD.segSet(el.querySelector('#tp'), part);
    };
    q.addEventListener('input', filter);
    el.querySelector('#tp').addEventListener('click', (e) => { const b = e.target.closest('button[data-v]'); if (b) { part = b.dataset.v; filter(); } });
    filter();
    el.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => FD.goto(b.dataset.go)));
  },
});
