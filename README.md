# Input devices — IGCSE ICT

Interactive lesson for Pearson Edexcel International GCSE ICT, **Unit 1 Digital devices**: types of peripheral devices and **input** devices (book pages 21–31).

Each section is explained step by step with interactive simulations, followed by the book's **activities** (where the book has them) and a short auto-marked **✓ Check**. Each part ends with a **test** (multiple choice + exam-style questions with mark schemes).

**Part A · Keying, pointing and scanning**

1. Types of peripheral devices — input → process → output and storage (Figure 1.34), sort twelve peripherals, what input devices do → Activities (posters) → ✓ Check
2. Keyboards — wired/wireless, QWERTY/AZERTY/QWERTZ/Spanish layouts, shortcut trainer (Ctrl/⌘), touch-typing race and speed test, keys mapped to video-editing commands → Activities (three shortcuts) → ✓ Check
3. Pointing devices — mouse on different surfaces, tracker ball, track pad, joystick game with sprites, graphics tablet drawing (pen pressure) → ✓ Check
4. Scanners, barcodes and webcams — scan + OCR (search an image vs a text file), OMR answer sheet, barcode checkout with database look-up, linear vs QR at different angles, the Korean virtual subway store, webcam quality → Activities (**real QR code maker**, webcams) → ✓ Check
5. Test Part A

**Part B · Sound, touch, identity and sensors**

6. Microphones and touch screens — inside a microphone (Figure 1.46) from sound waves to analogue to digital, sound card ports, VoIP and accessibility, resistive vs capacitive with finger/glove/stylus and pinch → ✓ Check
7. Biometric scanners — enrol (average of samples) and verify, arches/loops/whorls, facial, voice and iris recognition, Table 1.2 → Activities → ✓ Check
8. Card readers — magnetic strip and skimming, chip and PIN terminal, RFID/NFC tags linked to a database → Activities (fraud) → ✓ Check
9. Sensors — smart home with six sensor types (light, temperature, PIR, moisture, proximity, pressure), sensor vs human over 24 hours → Activities → ✓ Check
10. Test Part B · Key terms (searchable)

The barcodes and QR codes are real and can be scanned with a phone (EAN-13 and QR, generated in `js/codes.js` without any library). The camera and microphone of the student's device are never used: all scanners and recognisers are simulations.

**Progress that students can share and resume** (same system as *Connectivity*)

- Everything is saved automatically in the student's browser (`localStorage`, key `in-progress-v1`).
- **My progress** shows the percentage completed, with **Copy my progress** / **Download .txt** for the teacher, and a **progress code** (`IN1Z.…`) to carry on with another device.
- Nothing is sent to a server.

**Controls:** Play/Pause (Space), Next (→), Back (←), Restart scene (R), Projector mode (P), Full screen (F), Help (?). Each scene has its own URL, e.g. `#sensors` or `#check-sensors`.

Plain HTML, CSS and JavaScript — no build step. All simulations and drawings are original; the people, shops and products are made up, except examples taken from the book.
