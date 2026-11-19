/* Escape Views Resort – main.js (no build step needed) */
const MAX_ROOMS = 11, MAX_ADULTS = 2, MAX_CHILDREN = 1; // matches room occupancy and 11-room inventory

/* ---------- Guest picker (rooms, adults, children + child ages) ---------- */
function initGuestPicker(root) {
  const state = { rooms: [{ adults: 2, children: [] }] };
  root.guestState = state;
  root.innerHTML = `
    <button type="button" class="gp-toggle" aria-expanded="false">
      <small>Guests</small><strong class="gp-summary"></strong>
    </button>
    <div class="gp-panel" role="dialog" aria-label="Guests"></div>`;
  const toggle = root.querySelector('.gp-toggle');
  const panel = root.querySelector('.gp-panel');

  const totals = () => ({
    a: state.rooms.reduce((s, r) => s + r.adults, 0),
    c: state.rooms.reduce((s, r) => s + r.children.length, 0)
  });
  const summary = () => {
    const t = totals(), n = state.rooms.length;
    root.querySelector('.gp-summary').textContent =
      `${t.a} adult${t.a === 1 ? '' : 's'}, ${t.c} ${t.c === 1 ? 'child' : 'children'}, ${n} room${n === 1 ? '' : 's'}`;
  };

  const stepper = (i, type, value, min, max) => `
    <div class="stepper">
      <button type="button" data-act="dec" data-type="${type}" data-room="${i}" ${value <= min ? 'disabled' : ''} aria-label="Decrease ${type}">−</button>
      <output>${value}</output>
      <button type="button" data-act="inc" data-type="${type}" data-room="${i}" ${value >= max ? 'disabled' : ''} aria-label="Increase ${type}">+</button>
    </div>`;

  const ageOptions = sel => '<option value="">Select</option><option value="0"' + (sel === '0' ? ' selected' : '') + '>Under 1</option>' +
    Array.from({ length: 11 }, (_, k) => k + 1).map(n => `<option value="${n}"${sel === String(n) ? ' selected' : ''}>${n} year${n > 1 ? 's' : ''}</option>`).join('');

  function render() {
    panel.innerHTML = `<h3>Guests</h3>` + state.rooms.map((r, i) => `
      <div class="gp-room-head"><span>ROOM ${i + 1}</span>
        ${state.rooms.length > 1 ? `<button type="button" class="gp-del" data-act="del" data-room="${i}">Remove room</button>` : ''}</div>
      <div class="gp-row">
        <div><span>Adults</span>${stepper(i, 'adults', r.adults, 1, MAX_ADULTS)}</div>
        <div><span>Children under 12 years old</span>${stepper(i, 'children', r.children.length, 0, MAX_CHILDREN)}</div>
      </div>
      ${r.children.map((age, k) => `<div class="gp-age"><label for="age-${i}-${k}">Child ${k + 1}’s age</label>
        <select id="age-${i}-${k}" data-room="${i}" data-child="${k}">${ageOptions(age)}</select></div>`).join('')}
    `).join('') + `
      <div class="gp-err" role="alert"></div>
      <div class="gp-foot">
        <button type="button" class="gp-add" data-act="add" ${state.rooms.length >= MAX_ROOMS ? 'disabled' : ''}>+ Add a room</button>
        <button type="button" class="gp-done" data-act="done">Done</button>
      </div>`;
    summary();
  }

  const open = v => { panel.classList.toggle('open', v); toggle.setAttribute('aria-expanded', v); };
  toggle.addEventListener('click', () => open(!panel.classList.contains('open')));
  document.addEventListener('click', e => { if (!root.contains(e.target)) open(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') open(false); });

  panel.addEventListener('change', e => {
    if (e.target.dataset.child !== undefined)
      state.rooms[e.target.dataset.room].children[e.target.dataset.child] = e.target.value;
  });
  panel.addEventListener('click', e => {
    const b = e.target.closest('button[data-act]'); if (!b) return;
    const i = +b.dataset.room, r = state.rooms[i], act = b.dataset.act;
    if (act === 'add' && state.rooms.length < MAX_ROOMS) state.rooms.push({ adults: 2, children: [] });
    else if (act === 'del') state.rooms.splice(i, 1);
    else if (act === 'inc' || act === 'dec') {
      const d = act === 'inc' ? 1 : -1;
      if (b.dataset.type === 'adults') r.adults = Math.min(MAX_ADULTS, Math.max(1, r.adults + d));
      else if (d > 0 && r.children.length < MAX_CHILDREN) r.children.push('');
      else if (d < 0) r.children.pop();
    } else if (act === 'done') {
      if (state.rooms.some(r => r.children.some(a => a === ''))) {
        panel.querySelector('.gp-err').textContent = 'Select the age of each child.'; return;
      }
      open(false); return;
    }
    render();
  });
  render();
}
document.querySelectorAll('.guest-picker').forEach(initGuestPicker);

/* ---------- Search forms ---------- */
const today = new Date().toISOString().split('T')[0];
document.querySelectorAll('.js-search').forEach(form => {
  form.querySelectorAll('input[type=date]').forEach(i => (i.min = today));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const msg = form.parentElement.querySelector('.msg');
    const { in: checkIn, out } = form.elements;
    const picker = form.querySelector('.guest-picker');
    if (!checkIn.value || !out.value || out.value <= checkIn.value) { msg.textContent = 'Choose a check-out date after your check-in date.'; return; }
    if (picker.guestState.rooms.some(r => r.children.some(a => a === ''))) { msg.textContent = 'Open Guests and select each child’s age.'; return; }
    // TODO: send { checkIn.value, out.value, picker.guestState.rooms } to your booking engine or API here.
    msg.textContent = 'Online booking is not connected yet, so no reservation was made. Please call 085 663 866 or email escapeviewresort@gmail.com with these dates.';
  });
});

/* ---------- Gallery lightbox ---------- */
const lb = new bootstrap.Modal(document.getElementById('lightbox'));
document.querySelectorAll('#gallery-grid button').forEach(b => b.addEventListener('click', () => {
  document.getElementById('lb-title').textContent = b.dataset.title;
  document.getElementById('lb-photo').style.setProperty('--img', `url(${b.dataset.img})`);
  lb.show();
}));
