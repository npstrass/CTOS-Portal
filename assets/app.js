/* CTOS One demo app. Renders every page from assets/data.js and keeps changes in the browser. */
(function () {
  'use strict';
  var renderers = {}, el_mapInit, el_tabsInit;

  /* ---------- personas, login, first run ---------- */
  function persona() { try { return localStorage.getItem('ctos-persona') || ''; } catch (e) { return ''; } }
  function personaInfo() { return S.personas[persona()] || S.personas.mike; }
  function isEmployee() { return personaInfo().kind === 'employee'; }
  function isNewCustomer() { return personaInfo().kind === 'new'; }
  function requireLogin() {
    var pg = document.body.getAttribute('data-page');
    if (pg === 'login') return true;
    if (!persona()) { location.href = 'login.html'; return false; }
    return true;
  }
  function applyPersona() {
    var p = personaInfo();
    qsa('.account-name').forEach(function (n) { n.textContent = p.name; });
    qsa('.account-org').forEach(function (n) { n.textContent = isEmployee() ? S.user.org + ' · viewing as CTOS' : p.org; });
    qsa('.account .avatar, .topbar .avatar').forEach(function (n) { n.textContent = p.initials; });
    var acct = $('account'), menu = $('account-menu');
    if (acct && menu) {
      var closeMenu = function () { menu.classList.remove('open'); acct.setAttribute('aria-expanded', 'false'); };
      acct.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); var o = menu.classList.toggle('open'); acct.setAttribute('aria-expanded', o ? 'true' : 'false'); if (o) { var f = menu.querySelector('a, button'); if (f) f.focus(); } });
      document.addEventListener('click', function (e) { if (!menu.contains(e.target) && !acct.contains(e.target)) closeMenu(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
      $('menu-name').textContent = p.name; $('menu-role').textContent = p.role + ' · ' + (isEmployee() ? 'Custom Truck One Source' : p.org);
      var mr = $('menu-reset'); if (mr) mr.addEventListener('click', function (e) { e.preventDefault(); if (confirm('Reset the demo data? Approvals, orders and bookings you made will be cleared.')) reset(); });
      var ms = $('menu-switch'); if (ms) ms.addEventListener('click', function (e) { e.preventDefault(); try { localStorage.removeItem('ctos-persona'); } catch (x) {} location.href = 'login.html'; });
      var mo = $('menu-signout'); if (mo) mo.addEventListener('click', function (e) { e.preventDefault(); try { localStorage.removeItem('ctos-persona'); localStorage.removeItem(KEY); } catch (x) {} location.href = 'login.html'; });
    }

    if (isEmployee()) {
      var bar = document.createElement('div'); bar.className = 'emp-bar';
      bar.innerHTML = '<span><b>Viewing as ' + esc(p.name) + ', ' + esc(p.role) + '.</b> You are in ' + esc(S.user.org) + '\u2019s account. Actions you take here are logged to the account and to Salesforce.</span><a href="login.html">Switch account</a>';
      document.body.insertBefore(bar, document.body.firstChild); document.body.classList.add('employee');
    }
    if (isNewCustomer()) document.body.classList.add('new-customer');
  }
  // A new customer's seed: same shape, nothing in it yet.
  function newCustomerSeed(base) {
    var s = JSON.parse(JSON.stringify(base)), p = base.personas.taylor;
    s.user = { name: p.name, initials: p.initials, org: p.org, fleetSize: 0 };
    ['vehicles', 'extraPins', 'events', 'attention', 'appointments', 'unscheduled', 'workorders', 'serviceHistory', 'orders', 'orderHistory', 'trucks', 'rentals', 'invoices', 'tickets', 'documents', 'quotes', 'driverDetail', 'drivers', 'accountNotes', 'cart', 'inspections', 'campaigns', 'freight', 'sites', 'siteEvents'].forEach(function (k) { s[k] = []; });
    s.inShopDays = {}; s.compliance = {}; s.accountTax = {}; s.fleetCounts = { total: 0, moving: 0, idle: 0, fault: 0, shop: 0, byKind: {} };
    s.telemetry = { milesToday: 0, milesWeek: 0, idlePct: 0, mpg30: 0, uptime30: 0, fuelWeek: 0, idleAvgMin: 0, hardBraking: 0, serviced: 0 };
    s.users = [{ name: p.name, email: 'taylor@blueridgeproduce.com', role: 'owner', last: 'Now', status: 'active' }];
    s.reorder = []; s.autopay = false; s.builds = [];
    s.pricing = { tier: 'Standard', truckPct: 0, rentalPct: 0, partsPct: 0, note: 'List pricing. Fleet tiers start at five units or $250k a year; ask Sarah.', volume: 'New account' };
    s.credit = { status: 'none', limit: 0, used: 0, terms: 'Prepay', since: '', reviewed: '', contact: 'Credit team · (816) 555-0190', application: null };
    s.notifications = [{ id: 'w1', level: '', read: false, title: 'Welcome to CTOS One', text: 'Add your first truck, or import your fleet from a spreadsheet, and we take it from there.', when: 'Just now', href: 'fleet-manage.html' }];
    s.team = base.team.slice(0, 1).concat(base.team.slice(2, 3));
    s.salesforce = { connected: true, lastSync: 'Just now', instance: base.salesforce.instance };
    return s;
  }

  renderers.login = function () {
    var form = $('login-form'); if (!form) return;
    function go(key) { try { localStorage.setItem('ctos-persona', key); localStorage.removeItem(KEY); } catch (e) {} location.href = 'index.html'; }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var em = $('l-email').value.toLowerCase();
      go(em.indexOf('taylor') >= 0 || em.indexOf('blueridge') >= 0 ? 'taylor' : (em.indexOf('customtruck') >= 0 ? 'sarah' : 'mike'));
    });
    qsa('[data-persona]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); go(b.getAttribute('data-persona')); }); });
  };

  function onboardingHtml() {
    var steps = [
      { done: S.vehicles.length > 0, t: 'Add your first truck', d: S.vehicles.length ? S.vehicles.length + ' unit' + (S.vehicles.length > 1 ? 's' : '') + ' added' : 'One at a time, or import a spreadsheet of VINs.', a: 'Add a vehicle', flow: 'add', a2: 'Import a spreadsheet', flow2: 'import' },
      { done: S.vehicles.some(function (v) { return v.telematics === 'ctos' || v.telematics === 'byo'; }), t: 'Connect telematics', d: 'A CTOS device is free with a service plan; your own device connects through the API.', a: 'Choose on each unit', flow: 'manage' },
      { done: S.users.length > 1, t: 'Invite your team', d: S.users.length > 1 ? (S.users.length - 1) + ' invited' : 'Dispatchers, billing, drivers. Each gets only what they need.', a: 'Invite a user', flow: 'invite' },
      { done: S.credit.status !== 'none', t: 'Set up credit terms', d: S.credit.status === 'pending' ? 'Application ' + S.credit.application.ref + ' is under review' : 'Open an account to order parts, rent and book service on Net 30 with one monthly statement.', a: 'Apply for credit', flow: 'credit' },
      { done: S.appointments.length > 0, t: 'Book your first service', d: S.appointments.length ? 'Booked' : 'Or just tell us the PM interval you run and we will remind you.', a: 'Schedule service', flow: 'schedule' }
    ];
    var n = steps.filter(function (s) { return s.done; }).length;
    return '<div class="onboard-head"><div><h2>Let\u2019s get ' + esc(S.user.org) + ' set up.</h2><p>' + n + ' of ' + steps.length + ' done. Nothing here is required; the portal works with whatever you give it.</p></div><div class="onboard-count">' + n + '<small>of ' + steps.length + '</small></div></div>' +
      '<ol class="onboard">' + steps.map(function (s, i) {
        return '<li class="ob' + (s.done ? ' done' : '') + '"><span class="ob-n">' + (s.done ? '<svg viewBox="0 0 24 24"><path d="m5 12 5 5 9-10"/></svg>' : (i + 1)) + '</span><div><strong>' + s.t + '</strong><p>' + esc(s.d) + '</p>' + (s.done ? '' : '<div class="ob-acts"><button type="button" class="btn btn-ghost" data-ob="' + s.flow + '">' + s.a + '</button>' + (s.a2 ? '<button type="button" class="lnk" data-ob="' + s.flow2 + '">' + s.a2 + '</button>' : '') + '</div>') + '</div></li>';
      }).join('') + '</ol>';
  }
  function wireOnboarding(root) {
    qsa('[data-ob]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-ob');
        if (f === 'add') flowVehicleForm(null); else if (f === 'import') flowImport(); else if (f === 'invite') flowInvite(); else if (f === 'schedule') flowSchedule({}); else if (f === 'credit') flowCreditApp(); else location.href = 'fleet-manage.html';
      });
    });
  }

  /* ---------- users and drivers ---------- */
  var ROLES = { owner: 'Owner', dispatcher: 'Dispatcher', billing: 'Billing', viewer: 'View only' };
  function flowInvite(u, row) {
    var editing = !!u; u = u || {};
    openDrawer({
      kind: editing ? 'Portal user' : 'Invite a user', title: editing ? u.name : 'New user', meta: editing ? u.email : 'They get an email with a link that works for 7 days',
      body: '<form class="form" id="inv-form"><label>Name<input type="text" id="i-name" required value="' + esc(u.name || '') + '"></label><label>Email<input type="text" id="i-email" required value="' + esc(u.email || '') + '" placeholder="name@company.com"></label>' +
        '<fieldset><legend>Role</legend>' + Object.keys(ROLES).map(function (r) { var desc = { owner: 'Everything, including billing and users', dispatcher: 'Fleet, service, orders. No billing.', billing: 'Invoices, payments, statements. No fleet changes.', viewer: 'Read only, everywhere' }[r]; return '<label class="radio"><input type="radio" name="role" value="' + r + '"' + ((u.role || 'dispatcher') === r ? ' checked' : '') + '><span>' + ROLES[r] + '<small>' + desc + '</small></span></label>'; }).join('') + '</fieldset></form>',
      foot: '<button type="submit" form="inv-form" class="btn btn-primary">' + (editing ? 'Save' : 'Send invite') + '</button>' + (editing && u.role !== 'owner' ? '<button type="button" class="lnk" id="i-remove">Remove access</button>' : ''),
      row: row,
      after: function () {
        $('inv-form').addEventListener('submit', function (e) {
          e.preventDefault();
          var role = (document.querySelector('input[name="role"]:checked') || {}).value || 'dispatcher';
          if (editing) { u.name = $('i-name').value; u.email = $('i-email').value; u.role = role; }
          else S.users.push({ name: $('i-name').value, email: $('i-email').value, role: role, last: 'Never', status: 'invited' });
          save(); closeDrawer(); toast(editing ? 'Saved.' : 'Invite sent to ' + $('i-email').value + '.'); renderPage();
        });
        var r = $('i-remove'); if (r) r.addEventListener('click', function () { confirmInline($('dr-foot'), 'Remove ' + u.name + '\u2019s access?', 'Remove', function () { S.users = S.users.filter(function (x) { return x !== u; }); save(); closeDrawer(); toast(u.name + ' removed.'); renderPage(); }); });
      }
    });
  }
  function flowDriver(dr, row) {
    var editing = !!dr; dr = dr || {};
    var assigned = S.vehicles.filter(function (v) { return v.driver === dr.name; })[0];
    openDrawer({
      kind: editing ? 'Driver' : 'Add a driver', title: editing ? dr.full : 'New driver', meta: editing ? (assigned ? 'Assigned to Unit #' + assigned.unit : 'Not assigned to a unit') : 'Drivers do not sign in here; they use the in-cab tablet',
      body: '<form class="form" id="drv-form"><label>Full name<input type="text" id="d-full" required value="' + esc(dr.full || '') + '"></label><div class="form-2"><label>Phone<input type="text" id="d-phone" value="' + esc(dr.phone || '') + '"></label><label>CDL expires<input type="text" id="d-cdl" value="' + esc(dr.cdl || '') + '" placeholder="Mon YYYY"></label></div>' +
        '<label>Assigned unit<select id="d-unit"><option value="">Unassigned</option>' + S.vehicles.map(function (v) { return '<option value="' + v.unit + '"' + (assigned && assigned.unit === v.unit ? ' selected' : '') + '>Unit #' + v.unit + ' · ' + esc(v.model) + (v.driver && v.driver !== dr.name ? ' (' + esc(v.driver) + ')' : '') + '</option>'; }).join('') + '</select></label>' +
        '<label class="radio" style="flex-direction:row"><input type="checkbox" id="d-tablet"' + (dr.tablet ? ' checked' : '') + '><span>In-cab tablet<small>Receives messages and inspections</small></span></label></form>',
      foot: '<button type="submit" form="drv-form" class="btn btn-primary">' + (editing ? 'Save' : 'Add driver') + '</button>', row: row,
      after: function () {
        $('drv-form').addEventListener('submit', function (e) {
          e.preventDefault();
          var full = $('d-full').value.trim(), parts = full.split(' '), short = parts.length > 1 ? parts[0][0] + '. ' + parts.slice(1).join(' ') : full;
          var rec = editing ? dr : { name: short, full: full, phone: '', tablet: false, cdl: '' };
          rec.full = full; rec.phone = $('d-phone').value; rec.cdl = $('d-cdl').value; rec.tablet = $('d-tablet').checked;
          if (!editing) { S.driverDetail.push(rec); S.drivers.push(rec.name); }
          var unit = $('d-unit').value;
          S.vehicles.forEach(function (v) { if (v.driver === rec.name) v.driver = ''; });
          if (unit) { var v = vehicle(unit); if (v) v.driver = rec.name; }
          save(); closeDrawer(); toast(editing ? 'Saved.' : full + ' added.'); renderPage();
        });
      }
    });
  }

  /* ---------- spreadsheet import ---------- */
  function parseCsv(text) {
    var lines = text.split(/\r?\n/).map(function (l) { return l.trim(); }).filter(Boolean);
    if (!lines.length) return { rows: [], errors: ['Nothing to import.'] };
    var split = function (l) { return l.split(/,|\t/).map(function (c) { return c.trim().replace(/^"|"$/g, ''); }); };
    var head = split(lines[0]).map(function (h) { return h.toLowerCase(); });
    var hasHead = head.indexOf('vin') >= 0 || head.indexOf('unit') >= 0;
    var idx = function (n, fallback) { var i = head.indexOf(n); return i >= 0 ? i : fallback; };
    var cols = hasHead ? { unit: idx('unit', 0), vin: idx('vin', 1), year: idx('year', 2), model: idx('model', 3), odo: idx('odometer', idx('odo', 4)), source: idx('source', 5), driver: idx('driver', 6), body: idx('body', 7), equipment: idx('equipment', 8) } : { unit: 0, vin: 1, year: 2, model: 3, odo: 4, source: 5, driver: 6, body: 7, equipment: 8 };
    var rows = [], errors = [];
    lines.slice(hasHead ? 1 : 0).forEach(function (l, i) {
      var c = split(l), unit = (c[cols.unit] || '').replace(/\D/g, ''), vin = (c[cols.vin] || '').toUpperCase();
      var problems = [];
      if (!unit) problems.push('no unit number'); if (vin.length < 11) problems.push('VIN too short'); if (vehicle(unit)) problems.push('unit exists');
      if (rows.some(function (r) { return r.unit === unit; })) problems.push('duplicate in file');
      rows.push({ unit: unit, vin: vin, year: c[cols.year] || '', model: c[cols.model] || '', odo: +((c[cols.odo] || '').replace(/\D/g, '')) || 0, source: /ctos/i.test(c[cols.source] || '') ? 'ctos' : (/lease/i.test(c[cols.source] || '') ? 'lease' : 'other'), driver: c[cols.driver] || '', body: c[cols.body] || '', equipment: c[cols.equipment] || '', problems: problems, line: i + 1 + (hasHead ? 1 : 0) });
    });
    return { rows: rows, errors: errors };
  }
  function flowImport() {
    var sample = 'unit,vin,year,model,odometer,source,driver,body,equipment\n1141,1FVACXDT5RHAB1141,2024,Freightliner M2 106,18210,elsewhere,L. Hart,Altec Line body 11 ft,Altec AA55\n1142,3HAMMMML1PL001142,2023,International MV607,26440,elsewhere,,Reading Classic II SL 11 ft,IMT 7500\n1143,1FVHG5CY9NHAB1143,2022,Freightliner 114SD,61900,leased,P. Diaz,Terex Derrick flatbed 18 ft,Terex Commander C4047';
    openDrawer({
      kind: 'Import from a spreadsheet', title: 'Add several units at once', meta: 'Paste rows or choose a CSV. One truck per line.',
      body: '<form class="form" id="imp-form"><label>Rows<textarea id="imp-text" rows="7" placeholder="unit, vin, year, model, odometer, source, driver"></textarea></label>' +
        '<div class="form-2"><label class="file">CSV file<input type="file" id="imp-file" accept=".csv,text/csv"></label><div class="form-note" style="align-self:end"><button type="button" class="lnk" id="imp-sample">Paste a sample</button> · columns: unit, VIN, year, make and model, odometer, source, driver. A header row is optional.</div></div>' +
        '<div id="imp-preview"></div></form>',
      foot: '<button type="button" class="btn btn-primary" id="imp-check">Preview</button><button type="button" class="btn btn-ghost" id="imp-go" hidden>Add 0 units</button>',
      after: function () {
        var parsed = null;
        function preview() {
          parsed = parseCsv($('imp-text').value);
          var ok = parsed.rows.filter(function (r) { return !r.problems.length; });
          $('imp-preview').innerHTML = parsed.rows.length ? '<table class="fleet orders imp"><thead><tr><th scope="col">Unit</th><th scope="col">Vehicle</th><th scope="col">VIN</th><th scope="col">Result</th></tr></thead><tbody>' + parsed.rows.map(function (r) { return '<tr' + (r.problems.length ? ' class="bad"' : '') + '><td>' + (r.unit ? '#' + r.unit : '<span class="muted">\u2014</span>') + '</td><td>' + esc((r.year + ' ' + r.model).trim() || '\u2014') + '</td><td class="mono">' + esc(r.vin || '\u2014') + '</td><td>' + (r.problems.length ? '<span class="warn">Line ' + r.line + ': ' + r.problems.join(', ') + '</span>' : '<span class="status shipped">Ready</span>') + '</td></tr>'; }).join('') + '</tbody></table>' : emptyHtml('Nothing to import yet.');
          var go = $('imp-go'); go.hidden = !ok.length; go.textContent = 'Add ' + ok.length + ' unit' + (ok.length === 1 ? '' : 's') + (parsed.rows.length > ok.length ? ', skip ' + (parsed.rows.length - ok.length) : '');
          go.className = ok.length ? 'btn btn-primary' : 'btn btn-ghost'; $('imp-check').className = ok.length ? 'btn btn-ghost' : 'btn btn-primary';
        }
        $('imp-sample').addEventListener('click', function () { $('imp-text').value = sample; preview(); });
        $('imp-check').addEventListener('click', preview);
        $('imp-text').addEventListener('input', function () { if (parsed) preview(); });
        var f = $('imp-file'); if (f) f.addEventListener('change', function () { var file = f.files && f.files[0]; if (!file || !window.FileReader) return; var rd = new FileReader(); rd.onload = function () { $('imp-text').value = rd.result; preview(); }; rd.readAsText(file); });
        $('imp-go').addEventListener('click', function () {
          var ok = parsed.rows.filter(function (r) { return !r.problems.length; });
          ok.forEach(function (r) {
            var comps = [{ id: 'c1', role: 'chassis', name: 'Chassis', make: r.model.split(' ')[0], model: r.model.split(' ').slice(1).join(' '), serial: r.vin, year: +r.year || 0, spec: 'Spec sheet pending', warranty: 'Unknown' }];
            if (r.body) comps.push({ id: 'c2', role: 'body', name: 'Body', make: r.body.split(' ')[0], model: r.body.split(' ').slice(1).join(' '), serial: 'Not recorded', year: +r.year || 0, spec: 'Spec sheet pending', warranty: 'Unknown' });
            var eqRole = /AA|AT|XT|VST|DTAX|aerial/i.test(r.equipment) ? 'aerial' : (/DC|C40|derrick/i.test(r.equipment) ? 'derrick' : (r.equipment ? 'crane' : ''));
            if (eqRole) comps.push({ id: 'c3', role: eqRole, name: ROLE_NAME[eqRole], make: r.equipment.split(' ')[0], model: r.equipment.split(' ').slice(1).join(' '), serial: 'Not recorded', year: +r.year || 0, hours: 0, spec: 'Spec sheet pending', warranty: 'Unknown' });
            S.vehicles.push({ unit: r.unit, vin: r.vin, model: (r.year + ' ' + r.model).trim() + (r.equipment ? ' · ' + r.equipment : ''), chassis: (r.year + ' ' + r.model).trim(), body: r.body + (r.equipment ? ' + ' + r.equipment : ''), kind: { aerial: 'Bucket truck', crane: 'Crane service truck', derrick: 'Digger derrick' }[eqRole] || (r.body ? 'Service truck' : 'Chassis only'), components: comps, hours: 0, source: r.source, telematics: 'ctos', state: 'off', status: 'Awaiting device', loc: 'Not reporting yet', odo: r.odo, fuel: 0, mpg: 0, nextPm: Math.ceil((r.odo + 1) / S.pmInterval) * S.pmInterval, nextService: 'Not scheduled', driver: r.driver, lat: 38.42, lng: -77.41, dtc: '', isNew: true });
            if (r.driver && S.drivers.indexOf(r.driver) < 0) { S.drivers.push(r.driver); S.driverDetail.push({ name: r.driver, full: r.driver, phone: '', tablet: false, cdl: '' }); }
          });
          S.fleetCounts.total += ok.length; S.fleetCounts.shop += ok.length; S.user.fleetSize = S.fleetCounts.total; save();
          addNotification({ title: ok.length + ' unit' + (ok.length === 1 ? '' : 's') + ' imported', text: 'Telematics devices ship this week. Assign drivers from Manage fleet.', href: 'fleet-manage.html' });
          closeDrawer(); toast(ok.length + ' units added.'); renderPage();
        });
      }
    });
  }

  /* ---------- documents ---------- */
  function docDays(exp) { var d = new Date(exp + (/\d{4}$/.test(exp) && !/\d, \d{4}$/.test(exp) ? ' 1' : '')); if (isNaN(d)) return 9999; return Math.round((d - new Date('2026-10-27')) / 86400000); }
  function docsHtml(unit) {
    var docs = S.documents.filter(function (d) { return d.unit === unit; });
    return (docs.length ? '<div class="list">' + docs.map(function (d) { var days = docDays(d.expires); return '<div class="row fig"><span>' + esc(d.kind) + '<small>' + esc(d.file) + '</small></span><b class="' + (days < 14 ? 'warn' : '') + '">' + (days < 0 ? 'Expired' : 'Expires ' + esc(d.expires)) + '</b></div>'; }).join('') + '</div>' : emptyHtml('No documents on file for this unit.')) + '<button type="button" class="lnk" data-add-doc="' + unit + '" style="margin-top:6px">Add a document</button>';
  }
  function flowDocument(unit, row) {
    openDrawer({
      kind: 'Add a document', title: 'Unit #' + unit, meta: 'Registration, insurance, inspections, permits',
      body: '<form class="form" id="doc-form"><label>Type<select id="doc-kind"><option>Registration</option><option>Annual inspection</option><option>Insurance card</option><option>IFTA permit</option><option>Title</option><option>Other</option></select></label><label>Expires<input type="date" id="doc-exp" required></label><label class="file">File<input type="file" id="doc-file"></label><p class="form-note">Expiry dates feed Coming due on Service and the reminders in the bell.</p></form>',
      foot: '<button type="submit" form="doc-form" class="btn btn-primary">Save document</button>', row: row,
      after: function () {
        $('doc-form').addEventListener('submit', function (e) {
          e.preventDefault(); var d = new Date($('doc-exp').value + 'T12:00:00'); var exp = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
          var f = $('doc-file'); var name = (f && f.files && f.files[0] && f.files[0].name) || ($('doc-kind').value.toLowerCase().replace(/\s+/g, '-') + '-' + unit + '.pdf');
          S.documents.push({ unit: unit, kind: $('doc-kind').value, expires: exp, file: name }); save();
          closeDrawer(); toast('Saved ' + $('doc-kind').value + ' for Unit #' + unit + '.'); renderPage();
        });
      }
    });
  }
  function wireDocs(root) { qsa('[data-add-doc]', root).forEach(function (b) { b.addEventListener('click', function () { flowDocument(b.getAttribute('data-add-doc')); }); }); }
  function expiringDocs(days) { return S.documents.map(function (d) { return { d: d, days: docDays(d.expires) }; }).filter(function (x) { return x.days <= days; }).sort(function (a, b) { return a.days - b.days; }); }

  /* ---------- quotes (mirrored from Salesforce) ---------- */
  var QSTAGE = { requested: ['Requested', 'processing'], review: ['In review at CTOS', 'processing'], ready: ['Quote ready', 'shipped'], accepted: ['Accepted', 'off'], declined: ['Declined', 'off'] };
  function sfStamp() { return 'Synced with Salesforce ' + S.salesforce.lastSync; }
  function quoteTotal(q) { return sum(q.lines.map(function (l) { return l.qty * l.unitPrice; })); }
  function quoteUnits(q) { return sum(q.lines.map(function (l) { return l.qty; })); }
  function flowQuote(q, row) {
    var emp = isEmployee(), total = quoteTotal(q), units = quoteUnits(q);
    var foot = '';
    if (q.stage === 'ready' && !emp) foot = '<button type="button" class="btn btn-primary" id="q-accept">Accept ' + units + ' truck' + (units > 1 ? 's' : '') + ', ' + money(total) + '</button><button type="button" class="lnk" id="q-decline">Decline</button><a href="team.html" class="lnk">Ask Sarah</a>';
    else if (q.stage === 'review' && emp) foot = '<button type="button" class="btn btn-primary" id="q-send">Send quote to customer</button><span class="wo-note">Sets the Salesforce Quote to Presented.</span>';
    else if (q.stage === 'requested' && emp) foot = '<button type="button" class="btn btn-primary" id="q-review">Start review</button>';
    else foot = '<a href="team.html" class="lnk">' + (emp ? 'Open in Salesforce' : 'Ask Sarah a question') + '</a>';
    openDrawer({
      kind: QSTAGE[q.stage][0] + ' · ' + q.no, warn: q.stage === 'ready' && !emp, title: units + ' truck' + (units > 1 ? 's' : '') + ' on ' + q.lines.length + ' line' + (q.lines.length > 1 ? 's' : ''), meta: 'Owner ' + q.owner + ' · requested ' + q.requested + (q.validUntil ? ' · valid until ' + q.validUntil : ''),
      body: '<dl class="dr-facts"><dt>Salesforce</dt><dd class="mono">' + q.sfId + '</dd><dt>Updated</dt><dd>' + q.updated + '</dd></dl>' +
        '<ol class="stages" aria-label="Quote progress">' + stagesHtml([['Requested', q.requested], ['In review at CTOS', q.stage === 'requested' ? '' : q.updated], ['Quote ready', q.stage === 'ready' || q.stage === 'accepted' ? q.updated : ''], [q.stage === 'declined' ? 'Declined' : 'Accepted', q.stage === 'accepted' || q.stage === 'declined' ? q.updated : '']], { requested: 0, review: 1, ready: 2, accepted: 3, declined: 3 }[q.stage]) + '</ol>' +
        '<h4 class="dr-h">Quote lines</h4><div class="list li-list">' + q.lines.map(function (l) { return '<div class="row fig li"><span>' + esc(l.ql) + ' · ' + esc(l.spec) + '<small>' + esc(l.detail) + ' · qty ' + l.qty + (l.eta ? ' · ' + esc(l.eta) : '') + (l.orderNo ? ' · order ' + esc(l.orderNo) : '') + '</small></span><b>' + (l.unitPrice ? money(l.unitPrice) + (l.qty > 1 ? ' × ' + l.qty : '') : '<span class="muted">Pricing pending</span>') + '</b></div>'; }).join('') +
        (total ? '<div class="row fig total"><span>Quote total<small>Before tax, FET and title</small></span><b>' + money(total) + '</b></div>' : '') + '</div>' +
        (q.note ? '<p class="dr-summary" style="margin-top:12px">' + esc(q.note) + '</p>' : '') + '<p class="form-note sf-note">' + sfStamp() + '. This quote and its lines are Salesforce records; the portal reads them and writes your decision back.</p>',
      foot: foot, row: row,
      after: function () {
        var acc = $('q-accept'); if (acc) acc.addEventListener('click', function () {
          confirmInline($('dr-foot'), 'Accept ' + q.no + ' for ' + money(total) + '? One order is created per truck; Sarah sends the purchase agreement for signature.', 'Accept quote', function () {
            q.stage = 'accepted'; q.updated = 'Today';
            var made = [];
            q.lines.forEach(function (l) {
              var mine = [];
              for (var i = 0; i < l.qty; i++) {
                var no = 'T-' + (2066 + S.trucks.length + 1);
                S.trucks.push({ no: no, quote: q.no, ql: l.ql, spec: l.spec, detail: l.detail, price: l.unitPrice, ordered: 'Today', eta: l.eta || 'TBD', where: 'Awaiting build slot', stage: 0, stages: [['Ordered', 'Today'], ['In production', ''], ['Built, in transit', ''], ['Prep at CTOS', ''], ['Delivery', l.eta || '']] });
                made.push(no); mine.push(no);
              }
              l.orderNo = mine.join(', ');
            });
            q.note = 'Accepted from the portal. Orders ' + made.join(', ') + '. Purchase agreement to follow.';
            S.salesforce.lastSync = 'Just now'; save();
            addNotification({ title: q.no + ' accepted', text: money(total) + '. Orders ' + made.join(', ') + ' are on the Trucks tab; Sarah has the agreement.', href: 'parts.html#trucks' });
            closeDrawer(); toast('Quote accepted. ' + made.length + ' order' + (made.length > 1 ? 's' : '') + ' created.'); renderPage();
          });
        });
        var d = $('q-decline'); if (d) d.addEventListener('click', function () { confirmInline($('dr-foot'), 'Decline ' + q.no + '? Sarah will be told, and you can ask for a revised quote any time.', 'Decline', function () { q.stage = 'declined'; q.updated = 'Today'; S.salesforce.lastSync = 'Just now'; save(); closeDrawer(); toast(q.no + ' declined.'); renderPage(); }); });
        var s = $('q-send'); if (s) s.addEventListener('click', function () { q.stage = 'ready'; q.updated = 'Today'; q.lines.forEach(function (l) { if (!l.unitPrice) l.unitPrice = 142500; }); q.validUntil = 'Nov 27'; q.note = 'Available at Richmond; price includes certification and a 90-day warranty.'; S.salesforce.lastSync = 'Just now'; save(); addNotification({ title: q.no + ' quote ready', text: quoteUnits(q) + ' truck' + (quoteUnits(q) > 1 ? 's' : '') + ', ' + money(quoteTotal(q)) + '. Valid until ' + q.validUntil + '.', href: 'parts.html#trucks' }); closeDrawer(); toast('Quote sent to ' + S.user.name + '.'); renderPage(); });
        var r = $('q-review'); if (r) r.addEventListener('click', function () { q.stage = 'review'; q.updated = 'Today'; S.salesforce.lastSync = 'Just now'; save(); closeDrawer(); toast('Review started.'); renderPage(); });
      }
    });
  }
  function flowRequestQuote(stock) {
    var stocks = Array.isArray(stock) ? stock : (stock ? [stock] : []);
    var n = Math.max(1, stocks.length);
    function lineHtml(i, it) { var cond = it ? (it.cond === 'new' ? 'New' : 'Used') : ''; return '<fieldset class="qline" data-line="' + i + '"' + (it ? ' data-stock="' + it.stock + '"' : '') + '><legend>Line ' + i + (it ? ' · stock ' + it.stock + ', ' + esc(it.loc) : '') + '</legend><div class="form-2"><label>New or used<select class="rq-cond">' + ['New', 'Used', 'Either'].map(function (o) { return '<option' + (o === cond ? ' selected' : '') + '>' + o + '</option>'; }).join('') + '</select></label><label>Quantity<input type="text" class="rq-qty" inputmode="numeric" value="1"></label></div><label>Truck<input type="text" class="rq-subject" required placeholder="2026 Freightliner M2 106 · Altec AA55" value="' + (it ? esc(invTitle(it)) : '') + '"></label><label>Spec and must-haves<textarea class="rq-detail" rows="2" placeholder="Chassis, body, aerial or crane, insulation category, color">' + (it ? esc(it.chassis + ' · ' + it.spec) : '') + '</textarea></label></fieldset>'; }
    openDrawer({
      kind: 'Request a quote', title: 'Tell Sarah what you need', meta: 'Creates a Salesforce quote with one line per truck configuration',
      body: '<form class="form" id="rq-form"><div id="rq-lines">' + (stocks.length ? stocks.map(function (it, i) { return lineHtml(i + 1, it); }).join('') : lineHtml(1)) + '</div><button type="button" class="lnk" id="rq-add">Add another truck configuration</button><div class="form-2"><label>Needed by<input type="date" id="rq-by"></label><label>Trade-in<select id="rq-trade"><option value="">None</option>' + S.vehicles.map(function (v) { return '<option>Unit #' + v.unit + ' · ' + esc(v.model) + '</option>'; }).join('') + '</select></label></div></form>',
      foot: '<button type="submit" form="rq-form" class="btn btn-primary">Send request</button><a href="team.html" class="lnk">Call Sarah instead</a>',
      after: function () {
        $('rq-add').addEventListener('click', function () { n += 1; var w = document.createElement('div'); w.innerHTML = lineHtml(n); $('rq-lines').appendChild(w.children ? w.children[0] : w); });
        $('rq-form').addEventListener('submit', function (e) {
          e.preventDefault();
          var lines = qsa('.qline').map(function (f, i) { return { ql: 'QL-0' + (i + 1), spec: f.querySelector('.rq-subject').value, detail: (f.querySelector('.rq-cond').value + ' · ' + f.querySelector('.rq-detail').value).replace(/ · $/, '') + (f.getAttribute('data-stock') ? ' · stock ' + f.getAttribute('data-stock') : ''), qty: +f.querySelector('.rq-qty').value || 1, unitPrice: 0, eta: '' }; }).filter(function (l) { return l.spec; });
          if (!lines.length) return;
          var no = 'Q-' + (10422 + S.quotes.length + 1), sf = '0Q0Hs00000B' + Math.random().toString(36).slice(2, 7).toUpperCase();
          S.quotes.unshift({ no: no, sfId: sf, stage: 'requested', requested: 'Today', updated: 'Today', owner: 'Sarah Mitchell', validUntil: '', lines: lines, note: ($('rq-by').value ? 'Needed by ' + $('rq-by').value + '. ' : '') + ($('rq-trade').value ? 'Trade-in: ' + $('rq-trade').value + '.' : '') });
          S.salesforce.lastSync = 'Just now'; save();
          addNotification({ title: no + ' sent to Sarah', text: lines.length + ' line' + (lines.length > 1 ? 's' : '') + ', ' + quoteUnits(S.quotes[0]) + ' truck' + (quoteUnits(S.quotes[0]) > 1 ? 's' : '') + '. She usually replies within a business day.', href: 'parts.html#trucks' });
          invBasket = []; closeDrawer(); toast('Request ' + no + ' sent to Sarah.'); renderPage();
          if (document.body.getAttribute('data-page') === 'inventory') setTimeout(function () { location.href = 'parts.html#trucks'; }, 900);
        });
      }
    });
  }
  function renderQuotes() {
    var list = $('quote-rows'); if (!list) return;
    var open = S.quotes.filter(function (q) { return q.stage !== 'accepted' && q.stage !== 'declined'; });
    var ready = open.filter(function (q) { return q.stage === 'ready'; }).length;
    $('tab-trucks').querySelector('b').textContent = S.trucks.length + ' on order · ' + open.length + ' quote' + (open.length === 1 ? '' : 's');
    $('quotes-note').innerHTML = (ready ? '<span class="priority high">' + ready + ' ready for your decision</span> · ' : '') + sfStamp();
    list.innerHTML = S.quotes.length ? S.quotes.map(function (q) {
      var st = QSTAGE[q.stage], total = quoteTotal(q);
      return '<tr' + (q.stage === 'ready' ? ' class="due"' : '') + '><td class="id"><button type="button" class="row-btn" data-quote="' + q.no + '" aria-haspopup="dialog">' + q.no + '</button></td><td class="for"><span class="trunc">' + q.lines.map(function (l) { return '<span class="ink">' + (l.qty > 1 ? l.qty + ' × ' : '') + esc(l.spec) + '</span>'; }).join(' · ') + '</span></td><td class="num">' + q.lines.length + '</td><td class="num">' + quoteUnits(q) + '</td><td>' + statusHtml(st[1], st[0]) + '</td><td class="num">' + (total ? money(total) : '<span class="muted">\u2014</span>') + '</td><td class="num eta"><strong>' + q.updated + '</strong><span>' + (q.validUntil ? 'Valid until ' + q.validUntil : esc(q.owner)) + '</span></td></tr>';
    }).join('') : '<tr><td colspan="7">' + emptyHtml('No quotes yet. Request one and Sarah replies here.') + '</td></tr>';
    qsa('[data-quote]').forEach(function (b) { b.addEventListener('click', function () { var q = S.quotes.filter(function (x) { return x.no === b.getAttribute('data-quote'); })[0]; flowQuote(q, b.closest('tr')); }); });
    qsa('[data-flow-quote]').forEach(function (b) { once(b, 'click', function (e) { e.preventDefault(); flowRequestQuote(); }); });
  }

  /* ---------- employee view: account notes and internal actions ---------- */
  function renderEmployeeHome() {
    var p = $('home-internal'); if (!p) return;
    if (!isEmployee()) { p.hidden = true; return; }
    p.hidden = false;
    var waiting = S.workorders.filter(function (w) { return w.state === 'waiting'; }), qr = S.quotes.filter(function (q) { return q.stage === 'review' || q.stage === 'requested'; });
    $('home-internal-body').innerHTML = '<div class="list">' +
      (waiting.length ? '<div class="row fig"><span>Estimates to confirm with the customer<small>' + waiting.map(function (w) { return 'Unit #' + w.unit; }).join(', ') + '</small></span><b>' + waiting.length + '</b></div>' : '') +
      (qr.length ? '<div class="row fig"><span>Quotes waiting on you<small>' + qr.map(function (q) { return q.no + ' (' + quoteUnits(q) + ' trucks)'; }).join(', ') + '</small></span><b class="warn">' + qr.length + '</b></div>' : '') +
      '<div class="row fig"><span>Open invoices<small>' + money(sum(S.invoices.filter(function (i) { return i.status === 'open'; }).map(function (i) { return i.amount; }))) + '</small></span><b>' + S.invoices.filter(function (i) { return i.status === 'open'; }).length + '</b></div></div>' +
      '<h4 class="dr-h" style="padding:0 22px">Account notes</h4><div class="list">' + S.accountNotes.map(function (n) { return '<div class="row ev"><time>' + n.when + '</time><div><strong>' + esc(n.who) + '</strong> <span>' + esc(n.text) + '</span></div></div>'; }).join('') + '</div>' +
      '<div class="table-foot"><span>Internal. The customer does not see this panel.</span><button type="button" class="lnk" id="note-add">Add a note</button></div>';
    once($('note-add'), 'click', function () {
      openDrawer({ kind: 'Account note', title: S.user.org, meta: 'Internal, visible to CTOS staff only', body: '<form class="form" id="note-form"><label>Note<textarea id="n-text" rows="4" required></textarea></label></form>', foot: '<button type="submit" form="note-form" class="btn btn-primary">Save note</button>',
        after: function () { $('note-form').addEventListener('submit', function (e) { e.preventDefault(); S.accountNotes.unshift({ when: 'Today', who: personaInfo().name, text: $('n-text').value }); save(); closeDrawer(); toast('Note saved.'); renderPage(); }); } });
    });
  }

  /* ---------- components, inspections, campaigns, compliance, BOM ---------- */
  var ROLE_NAME = { chassis: 'Chassis', body: 'Body', crane: 'Crane', aerial: 'Aerial device', derrick: 'Digger derrick', equipment: 'Equipment' };
  function unitInspections(unit) { return S.inspections.filter(function (i) { return i.unit === unit; }); }
  function unitCampaigns(unit) { return S.campaigns.map(function (c) { var u = c.units.filter(function (x) { return x.unit === unit; })[0]; return u ? { c: c, u: u } : null; }).filter(Boolean); }
  function openCampaigns() { var out = []; S.campaigns.forEach(function (c) { c.units.forEach(function (u) { if (u.status === 'open') out.push({ c: c, u: u }); }); }); return out; }
  function dueInspections(days) { return S.inspections.map(function (i) { return { i: i, days: docDays(i.due) }; }).filter(function (x) { return x.days <= days; }).sort(function (a, b) { return a.days - b.days; }); }
  function bomFor(comp) { return S.bom[comp.make + ' ' + comp.model] || []; }
  function compRow(c) {
    return '<div class="comp"><div class="comp-head"><span class="comp-role">' + ROLE_NAME[c.role] + '</span><strong>' + esc(c.year + ' ' + c.make + ' ' + c.model) + '</strong><span class="mono">' + esc(c.serial) + '</span></div>' +
      '<dl class="dr-facts comp-facts">' + (c.capacity ? '<dt>Capacity</dt><dd>' + esc(c.capacity) + '</dd>' : '') + '<dt>Spec</dt><dd>' + esc(c.spec) + '</dd>' + (c.hours != null ? '<dt>Hours</dt><dd>' + num(c.hours) + ' h</dd>' : '') + '<dt>Warranty</dt><dd class="' + (/expired/i.test(c.warranty) ? 'muted' : '') + '">' + esc(c.warranty) + '</dd></dl></div>';
  }
  function componentsHtml(v) { return (v.components || []).length ? '<div class="comps">' + v.components.map(compRow).join('') + '</div>' : emptyHtml('No as-built record yet. Add the chassis, body and equipment from Edit.'); }
  function inspectionsHtml(unit, compact) {
    var list = unitInspections(unit);
    if (!list.length) return emptyHtml('No inspection records for this unit.');
    return '<div class="list">' + list.map(function (i) { var days = docDays(i.due); return '<div class="row insp"><div><strong>' + esc(i.type) + '<span class="sub"> · ' + ROLE_NAME[i.comp] + '</span></strong><span>' + esc(i.result) + ' · ' + esc(i.by) + ' · done ' + esc(i.done) + (compact ? '' : ' · <a href="#" class="lnk">' + esc(i.cert) + '</a>') + '</span></div><div class="when"><strong class="' + (days < 30 ? 'warn' : '') + '">' + (days < 0 ? 'Overdue' : 'Due ' + esc(i.due)) + '</strong><span>' + (days < 0 ? Math.abs(days) + ' days ago' : days + ' days') + '</span></div></div>'; }).join('') + '</div>';
  }
  function campaignsHtml(unit) {
    var list = unitCampaigns(unit);
    if (!list.length) return emptyHtml('No open recalls or bulletins on this unit.');
    return '<div class="list">' + list.map(function (x) { return '<div class="row insp"><div><strong>' + esc(x.c.title) + '<span class="sub"> · ' + ROLE_NAME[x.c.scope] + ' · ' + esc(x.c.maker) + '</span></strong><span>' + esc(x.c.severity) + ' ' + esc(x.c.ref) + ' · ' + esc(x.c.remedy) + '</span></div><div class="when">' + (x.u.status === 'open' ? '<strong class="warn">Open</strong><span><button type="button" class="lnk" data-flow-schedule data-unit="' + unit + '" data-job="Campaign work, ' + esc(x.c.ref) + '">Schedule</button></span>' : '<strong class="muted">Completed</strong><span>' + esc(x.u.completedOn) + '</span>') + '</div></div>'; }).join('') + '</div>';
  }
  function complianceHtml(unit) {
    var c = S.compliance[unit]; if (!c) return emptyHtml('No title or tax records on file. Add them from Documents.');
    return '<dl class="dr-facts"><dt>Title</dt><dd>' + esc(c.title) + '</dd><dt>MSO</dt><dd>' + esc(c.mso) + '</dd><dt>Lien</dt><dd>' + esc(c.lien) + '</dd></dl><p class="form-note" style="margin-top:12px">Federal excise tax status is held at the account level. <a href="team.html#tax" class="lnk">See account tax documents</a>.</p>';
  }
  function bomHtml(v) {
    return (v.components || []).map(function (c) {
      var parts = bomFor(c); if (!parts.length) return '';
      return '<h4 class="dr-h">' + ROLE_NAME[c.role] + ' · ' + esc(c.make + ' ' + c.model) + '</h4><div class="list">' + parts.map(function (p, i) { return '<div class="row reord"><div><div class="unit">' + esc(p[1]) + '<span class="sub"> · ' + esc(p[0]) + '</span></div><div class="job">Fits serial ' + esc(c.serial) + ' · usually ' + p[2] + ' at ' + money(p[3]) + '</div></div><div class="when"><strong>' + money(p[2] * p[3]) + '</strong><span>for ' + p[2] + '</span></div><span class="act"><button type="button" class="lnk" data-bom-add="' + v.unit + '|' + c.id + '|' + i + '">Add</button></span></div>'; }).join('') + '</div>';
    }).join('') || emptyHtml('No bill of materials on file for this unit yet.');
  }
  function wireBom(root) {
    qsa('[data-bom-add]', root).forEach(function (b) { b.addEventListener('click', function () { var k = b.getAttribute('data-bom-add').split('|'); var v = vehicle(k[0]); var c = v.components.filter(function (x) { return x.id === k[1]; })[0]; var p = bomFor(c)[+k[2]]; addToCart({ pn: p[0], d: p[1] + ' · Unit #' + v.unit, q: p[2], p: p[3] }); }); });
  }

  /* ---------- unit page ---------- */
  renderers.unit = function () {
    var unit = (location.search.match(/[?&]u=(\d+)/) || [])[1] || (location.hash.match(/u(\d+)/) || [])[1];
    var v = vehicle(unit);
    var head = $('unit-head');
    if (!v) { head.innerHTML = '<h1>Unit not found</h1><p class="finding">That unit is not in your fleet. <a href="fleet-manage.html">See all units</a>.</p>'; return; }
    document.title = 'Unit #' + v.unit + ' — CTOS One';
    var insp = unitInspections(v.unit), due = insp.map(function (i) { return docDays(i.due); }).filter(function (d) { return d <= 45; }).length;
    var camps = unitCampaigns(v.unit).filter(function (x) { return x.u.status === 'open'; }).length;
    var wos = S.workorders.filter(function (w) { return w.unit === v.unit && w.state !== 'done'; });
    var finding = [];
    if (v.dtc) finding.push('reporting fault ' + v.dtc);
    if (wos.length) finding.push(wos[0].state === 'waiting' ? 'an estimate of ' + money(woTotal(wos[0])) + ' is waiting on you' : 'in the shop at ' + wos[0].where);
    if (due) finding.push(due + ' inspection' + (due > 1 ? 's' : '') + ' due within 45 days');
    if (camps) finding.push(camps + ' open campaign' + (camps > 1 ? 's' : ''));
    head.innerHTML = unitPhotoHtml(v) + '<div><h1>Unit #' + v.unit + '</h1><p class="finding">' + esc(v.kind) + ' · ' + esc(v.chassis) + ' with ' + esc(v.body) + '. ' + (finding.length ? 'Right now: ' + finding.join(', ') + '.' : 'Nothing needs attention on this unit.') + '</p></div>' +
      '<div class="side"><a href="#" class="btn btn-primary" data-flow-schedule data-unit="' + v.unit + '">Schedule service<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a><span class="live">' + esc(v.status) + ' · ' + esc(v.loc) + '</span></div>';
    wireUnitPhoto(v);
    $('unit-stats').innerHTML = [['v', num(v.odo), 'mi', 'Odometer', 'Next PM at ' + num(v.nextPm)], ['v', num(v.hours || 0), 'h', 'Boom or crane hours', (v.components || []).filter(function (c) { return c.hours != null && c.role !== 'chassis'; }).map(function (c) { return c.make + ' ' + c.model; }).join(', ') || 'No equipment'], ['v', v.fuel + '', '%', 'Fuel', v.mpg ? v.mpg.toFixed(1) + ' mpg, 30 days' : 'No telematics'], ['v' + (due ? ' attn' : ''), due + '', '', 'Inspections due', 'Within 45 days'], ['v' + (camps ? ' attn' : ''), camps + '', '', 'Open campaigns', camps ? 'No charge to complete' : 'All completed']].map(function (s) { return '<div class="stat-c"><div class="' + s[0] + '">' + s[1] + (s[2] ? '<small>' + s[2] + '</small>' : '') + '</div><div class="l">' + s[3] + '</div><div class="d">' + esc(s[4]) + '</div></div>'; }).join('');
    if ($('u-pm')) { var pmLeft = v.nextPm - v.odo; var booked = S.appointments.filter(function (ap) { return ap.unit === v.unit; }).sort(function (x, y) { return x.day - y.day; }); var insp = unitInspections(v.unit).map(function (i) { return { i: i, d: docDays(i.due) }; }).sort(function (x, y) { return x.d - y.d; });
      $('u-pm').innerHTML = '<div class="list">' +
        '<div class="row svc3"><div><div class="unit">Next PM service</div><div class="job">' + num(v.odo) + ' mi now · interval ' + num(S.pmInterval) + ' mi · due at ' + num(v.nextPm) + ' mi</div></div><div class="when">' + dueText(v) + '<span>' + num(Math.max(0, pmLeft)) + ' mi left</span></div><span class="act"><button type="button" class="lnk" data-flow-schedule data-unit="' + v.unit + '" data-job="PM service">' + (booked.length ? 'Change' : 'Book') + '</button></span></div>' +
        booked.map(function (ap) { return '<div class="row svc3"><div><div class="unit">Booked · ' + esc(ap.job) + '</div><div class="job">' + esc(ap.loc) + '</div></div><div class="when"><strong>' + esc(ap.dateLabel) + '</strong><span>' + esc(ap.time) + '</span></div><span class="act"><a href="service.html" class="lnk">Details</a></span></div>'; }).join('') +
        insp.slice(0, 2).map(function (x) { return '<div class="row svc3"><div><div class="unit">' + esc(x.i.type) + '</div><div class="job">' + ROLE_NAME[x.i.comp] + ' · last ' + esc(x.i.done) + '</div></div><div class="when"><strong class="' + (x.d < 30 ? 'warn' : '') + '">' + (x.d < 0 ? 'Overdue ' + Math.abs(x.d) + ' d' : 'In ' + x.d + ' days') + '</strong><span>' + esc(x.i.due) + '</span></div><span class="act"><button type="button" class="lnk" data-flow-schedule data-unit="' + v.unit + '" data-job="' + esc(x.i.type) + '">Book</button></span></div>'; }).join('') + '</div>'; }
    $('u-comps').innerHTML = (v.components || []).length ? v.components.map(function (c) { var exp = /expired|unknown/i.test(c.warranty); return '<tr><td class="id"><span class="ink">' + ROLE_NAME[c.role] + '</span></td><td class="for"><span class="ink">' + esc(c.year + ' ' + c.make + ' ' + c.model) + '</span><span class="spec">' + esc((c.capacity ? c.capacity + ' · ' : '') + c.spec) + '</span></td><td class="mono" data-label="Serial">' + esc(c.serial) + '</td><td class="num" data-label="Hours">' + (c.hours != null && c.role !== 'chassis' ? num(c.hours) : '<span class="muted">\u2014</span>') + '</td><td class="' + (exp ? 'muted' : '') + '" data-label="Warranty">' + esc(c.warranty) + '</td></tr>'; }).join('') : '<tr><td colspan="5">' + emptyHtml('No as-built record yet. Add the chassis, body and equipment from Edit unit.') + '</td></tr>';
    var briefEl = $('u-comps-brief'); if (briefEl) briefEl.innerHTML = (v.components || []).length ? v.components.map(function (c) { return '<div class="row fig"><span>' + ROLE_NAME[c.role] + '<small>' + esc(c.year + ' ' + c.make + ' ' + c.model) + ' · ' + esc(c.serial) + (c.hours != null && c.role !== 'chassis' ? ' · ' + num(c.hours) + ' h' : '') + '</small></span><b class="' + (/expired/i.test(c.warranty) ? 'muted' : '') + '">' + (/expired/i.test(c.warranty) ? 'Out of warranty' : esc(c.warranty.replace(/^.*? to /, 'Warranty to '))) + '</b></div>'; }).join('') : emptyHtml('No as-built record yet.');
    $('u-insp').innerHTML = inspectionsHtml(v.unit, false);
    $('u-camp').innerHTML = campaignsHtml(v.unit);
    $('u-comp').innerHTML = complianceHtml(v.unit);
    $('u-docs').innerHTML = docsHtml(v.unit); wireDocs($('u-docs'));
    var hist = S.serviceHistory.filter(function (h) { return h.unit === v.unit; });
    $('u-svc').innerHTML = (wos.length ? '<div class="list">' + wos.map(function (w) { return '<button type="button" class="row wo-row" data-wo="' + w.id + '"><div><div class="unit">' + esc(w.stages[w.stage][0]) + '<span class="sub"> · ' + esc(w.where) + '</span></div><div class="job">' + w.items.map(function (it) { return esc(it[0]); }).join(' · ') + '</div></div><div class="when"><strong>' + money(woTotal(w)) + '</strong><span>' + w.items.length + ' lines</span></div><span class="act">' + (w.state === 'waiting' ? 'Review' : 'Details') + '</span></button>'; }).join('') + '</div>' : '') +
      (hist.length ? '<div class="list">' + hist.map(function (h) { return '<div class="row insp"><div><strong>' + esc(h.work) + '<span class="sub"> · ' + ROLE_NAME[h.comp] + '</span></strong><span>' + h.date + ' · CTOS ' + esc(h.loc) + ' · <a href="billing.html" class="lnk">' + h.inv + '</a></span></div><div class="when"><strong>' + money(h.cost) + '</strong></div></div>'; }).join('') + '</div>' : emptyHtml('No service history this year.'));
    qsa('[data-wo]').forEach(function (b) { b.addEventListener('click', function () { var w = S.workorders.filter(function (x) { return x.id === b.getAttribute('data-wo'); })[0]; flowWorkorder(w, b); }); });
    $('u-parts').innerHTML = bomHtml(v); wireBom($('u-parts'));
    var ords = S.orders.filter(function (o) { return o.unit === v.unit; });
    $('u-orders').innerHTML = ords.length ? '<div class="list">' + ords.map(function (o) { return '<div class="row fig"><span>Order ' + o.no + '<small>' + esc(o.for) + ' · ' + o.items.length + ' items</small></span><b>' + esc(o.eta) + '</b></div>'; }).join('') + '</div>' : emptyHtml('No open orders for this unit.');
    var evs = S.events.filter(function (e) { return e.unit === v.unit; });
    $('u-events').innerHTML = evs.length ? '<div class="list">' + evs.map(function (e) { return '<div class="row ev ' + e.kind + '"><time>' + e.t + '</time><div><span>' + esc(e.text) + '</span></div></div>'; }).join('') + '</div>' : emptyHtml('No events today.');
    qsa('[data-flow-schedule]').forEach(function (b) { once(b, 'click', function (e) { e.preventDefault(); flowSchedule({ unit: v.unit, job: b.getAttribute('data-job') || (v.dtc ? 'Diagnostic' : 'PM service') }); }); });
    qsa('[data-flow-edit]').forEach(function (b) { once(b, 'click', function (e) { e.preventDefault(); flowVehicleForm(v); }); });
    renderCartBadge();
    initTabs();
  };

  /* ---------- freight (mirrored from Salesforce, like quotes) ---------- */
  var FSTAGE = { requested: ['Requested', 'processing'], quoted: ['Quote ready', 'shipped'], booked: ['Booked', 'shipped'], completed: ['Completed', 'off'], declined: ['Declined', 'off'] };
  function flowFreight(f, row) {
    var emp = isEmployee();
    var foot = f.stage === 'quoted' && !emp ? '<button type="button" class="btn btn-primary" id="f-book">Book for ' + money(f.amount) + '</button><button type="button" class="lnk" id="f-decline">Decline</button>' :
      (f.stage === 'requested' && emp ? '<button type="button" class="btn btn-primary" id="f-quote">Send freight quote</button>' : '<a href="team.html" class="lnk">Ask Jordan a question</a>');
    openDrawer({
      kind: FSTAGE[f.stage][0], warn: f.stage === 'quoted' && !emp, title: f.what + ' · ' + (/^T-/.test(f.unit) ? 'Order ' + f.unit : 'Unit #' + f.unit), meta: f.from + ' to ' + f.to,
      body: '<dl class="dr-facts"><dt>Freight</dt><dd>' + f.id + '</dd><dt>Date</dt><dd>' + esc(f.date) + '</dd><dt>Distance</dt><dd>' + num(f.miles) + ' mi</dd>' + (f.amount ? '<dt>Price</dt><dd>' + money(f.amount) + '</dd>' : '') + '</dl>' + (f.note ? '<p class="dr-summary">' + esc(f.note) + '</p>' : '') + '<p class="form-note sf-note">Quoted and dispatched by CTOS Logistics. Jordan Wells is your contact.</p>',
      foot: foot, row: row,
      after: function () {
        var b = $('f-book'); if (b) b.addEventListener('click', function () { confirmInline($('dr-foot'), 'Book this move for ' + money(f.amount) + '? It bills on completion.', 'Book it', function () { f.stage = 'booked'; save(); addNotification({ title: f.id + ' booked', text: f.from + ' to ' + f.to + ', ' + f.date + '.', href: 'parts.html#freight' }); closeDrawer(); toast('Move booked for ' + f.date + '.'); renderPage(); }); });
        var d = $('f-decline'); if (d) d.addEventListener('click', function () { f.stage = 'declined'; save(); closeDrawer(); toast(f.id + ' declined.'); renderPage(); });
        var q = $('f-quote'); if (q) q.addEventListener('click', function () { f.stage = 'quoted'; f.amount = Math.round(f.miles * 5.2 + 100); save(); addNotification({ title: f.id + ' freight quote ready', text: money(f.amount) + ' for ' + f.from + ' to ' + f.to + '.', href: 'parts.html#freight' }); closeDrawer(); toast('Quote sent.'); renderPage(); });
      }
    });
  }
  function flowRequestFreight() {
    var units = S.vehicles.map(function (v) { return '<option value="' + v.unit + '">Unit #' + v.unit + ' · ' + esc(v.model) + '</option>'; }).join('') + S.trucks.map(function (t) { return '<option value="' + t.no + '">Order ' + t.no + ' · ' + esc(t.spec) + '</option>'; }).join('');
    var places = ['Shenandoah yard, Stafford', 'Richmond yard', 'CTOS Fredericksburg', 'CTOS Richmond', 'Harrisonburg job site', 'Other address'];
    openDrawer({
      kind: 'Request a freight quote', title: 'Move a unit', meta: 'Lowboy, driven delivery or tow, quoted by CTOS Logistics',
      body: '<form class="form" id="fr-form"><label>Unit<select id="fr-unit">' + units + '</select></label><div class="form-2"><label>From<select id="fr-from">' + places.map(function (p) { return '<option>' + p + '</option>'; }).join('') + '</select></label><label>To<select id="fr-to">' + places.map(function (p, i) { return '<option' + (i === 1 ? ' selected' : '') + '>' + p + '</option>'; }).join('') + '</select></label></div><div class="form-2"><label>Needed by<input type="date" id="fr-date" required></label><label>Move type<select id="fr-what"><option>Reposition</option><option>Shop delivery</option><option>Return from shop</option><option>Breakdown tow</option></select></label></div><label>Notes<textarea id="fr-note" rows="2" placeholder="Permits, escorts, site contact, hours"></textarea></label></form>',
      foot: '<button type="submit" form="fr-form" class="btn btn-primary">Send request</button><a href="team.html" class="lnk">Call Jordan instead</a>',
      after: function () {
        $('fr-form').addEventListener('submit', function (e) {
          e.preventDefault();
          var id = 'F-' + (3310 + S.freight.length + 1), dt = new Date($('fr-date').value + 'T12:00:00');
          S.freight.unshift({ id: id, unit: $('fr-unit').value, what: $('fr-what').value, from: $('fr-from').value, to: $('fr-to').value, date: isNaN(dt) ? 'TBD' : dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), miles: 60 + Math.round(Math.random() * 120), stage: 'requested', amount: 0, note: $('fr-note').value });
          save();
          addNotification({ title: id + ' sent to CTOS Logistics', text: $('fr-from').value + ' to ' + $('fr-to').value + '. Quote usually within two hours.', href: 'parts.html#freight' });
          closeDrawer(); toast('Request ' + id + ' sent.'); renderPage();
        });
      }
    });
  }
  function renderFreight() {
    var list = $('freight-rows'); if (!list) return;
    var open = S.freight.filter(function (f) { return f.stage !== 'completed' && f.stage !== 'declined'; });
    var ready = open.filter(function (f) { return f.stage === 'quoted'; }).length;
    $('tab-freight').querySelector('b').textContent = open.length + ' open';
    $('freight-note').innerHTML = (ready ? '<span class="priority high">' + ready + ' quote ready to book</span> · ' : '') + 'CTOS Logistics';
    list.innerHTML = S.freight.length ? S.freight.map(function (f) { var st = FSTAGE[f.stage]; return '<tr' + (f.stage === 'quoted' ? ' class="due"' : '') + '><td class="id"><button type="button" class="row-btn" data-freight="' + f.id + '" aria-haspopup="dialog">' + f.id + '</button></td><td class="for"><span class="trunc"><span class="ink">' + (/^T-/.test(f.unit) ? 'Order ' + f.unit : 'Unit #' + f.unit) + '</span> · ' + esc(f.what) + ' · ' + esc(f.from) + ' to ' + esc(f.to) + '</span></td><td class="num">' + num(f.miles) + '</td><td>' + statusHtml(st[1], st[0]) + '</td><td class="num">' + (f.amount ? money(f.amount) : '<span class="muted">\u2014</span>') + '</td><td class="num eta"><strong>' + esc(f.date) + '</strong><span>' + (f.stage === 'booked' ? 'Dispatched' : f.stage === 'quoted' ? 'Valid 7 days' : 'Needed by') + '</span></td></tr>'; }).join('') : '<tr><td colspan="6">' + emptyHtml('No freight moves. Request one to reposition a unit or move it to a shop.') + '</td></tr>';
    qsa('[data-freight]').forEach(function (b) { b.addEventListener('click', function () { var f = S.freight.filter(function (x) { return x.id === b.getAttribute('data-freight'); })[0]; flowFreight(f, b.closest('tr')); }); });
    qsa('[data-flow-freight]').forEach(function (b) { once(b, 'click', function (e) { e.preventDefault(); flowRequestFreight(); }); });
  }

  /* ---------- sites and geofences ---------- */
  function distM(a, b, c, d) { var R = 6371000, p = Math.PI / 180, x = (c - a) * p, y = (d - b) * p; var h = Math.sin(x / 2) * Math.sin(x / 2) + Math.cos(a * p) * Math.cos(c * p) * Math.sin(y / 2) * Math.sin(y / 2); return 2 * R * Math.asin(Math.sqrt(h)); }
  function unitsAt(site) { return S.vehicles.filter(function (v) { return v.lat && distM(v.lat, v.lng, site.lat, site.lng) <= site.radius; }); }
  function siteOf(v) { return S.sites.filter(function (s) { return v.lat && distM(v.lat, v.lng, s.lat, s.lng) <= s.radius; })[0] || null; }
  var SITE_COLORS = { 'Yard': '#5B626A', 'Job site': '#2E6FD8', 'CTOS location': '#A6202A', 'Customer location': '#5B626A' };
  function flowSite(s, row) {
    var here = unitsAt(s), emp = isEmployee();
    openDrawer({
      kind: s.type + (s.project ? ' · ' + s.project : ''), title: s.name, meta: s.address,
      body: '<dl class="dr-facts"><dt>Hours</dt><dd>' + esc(s.hours) + '</dd><dt>Geofence</dt><dd>' + num(s.radius) + ' m radius</dd><dt>After hours</dt><dd>' + (s.afterHours ? 'Alert on ignition or movement outside hours' : 'No alerts') + '</dd></dl>' + (s.note ? '<p class="dr-summary">' + esc(s.note) + '</p>' : '') +
        '<h4 class="dr-h">Units on site now · ' + here.length + '</h4>' + (here.length ? '<div class="list">' + here.map(function (v) { return '<div class="row fig"><span><a href="unit.html?u=' + v.unit + '" class="row-btn">Unit #' + v.unit + '</a><small>' + esc(v.kind) + ' · ' + esc(v.status) + (v.driver ? ' · ' + esc(v.driver) : '') + '</small></span><b>' + (v.dtc ? '<span class="dtc">' + v.dtc + '</span>' : (v.state === 'idle' ? 'Idling' : v.state === 'moving' ? 'Moving' : 'Parked')) + '</b></div>'; }).join('') + '</div>' : emptyHtml('No units inside this geofence right now.')) +
        '<h4 class="dr-h">Recent at this site</h4>' + (function () { var ev = S.siteEvents.filter(function (e) { return e.text.indexOf(s.name) >= 0; }); return ev.length ? '<div class="list">' + ev.map(function (e) { return '<div class="row ev ' + e.kind + '"><time>' + e.t + '</time><div><strong>Unit #' + e.unit + '</strong> <span>' + esc(e.text) + '</span></div></div>'; }).join('') + '</div>' : emptyHtml('No arrivals or departures today.'); })(),
      foot: '<button type="button" class="btn btn-ghost" id="site-go">Go to site on map</button><button type="button" class="lnk" id="site-edit">Edit site</button>' + (emp ? '' : '<label class="switch" style="margin-left:auto"><input type="checkbox" id="site-ah"' + (s.afterHours ? ' checked' : '') + ' aria-label="After-hours alerts"><span class="form-note">After-hours alerts</span></label>'),
      row: row,
      after: function () {
        $('site-go').addEventListener('click', function () { if (document.body.getAttribute('data-page') === 'map') { mapApi.pan(s.lat, s.lng); closeDrawer(); } else location.href = 'map.html#site-' + s.id; });
        $('site-edit').addEventListener('click', function () { flowSiteForm(s); });
        var ah = $('site-ah'); if (ah) ah.addEventListener('change', function () { s.afterHours = ah.checked; save(); toast((ah.checked ? 'After-hours alerts on for ' : 'After-hours alerts off for ') + s.name + '.'); renderPage(); });
      }
    });
  }
  function flowSiteForm(s) {
    var editing = !!s; s = s || { lat: 38.4, lng: -77.6, radius: 400, type: 'Job site', afterHours: false };
    var placing = false;
    openDrawer({
      kind: editing ? 'Edit site' : 'Add a site', title: editing ? s.name : 'New site or project', meta: 'A named geofence. Units inside it show as on site; arrivals and departures go to the feed.',
      body: '<form class="form" id="site-form"><label>Name<input type="text" id="st-name" required value="' + esc(s.name || '') + '" placeholder="Culpeper substation"></label><div class="form-2"><label>Type<select id="st-type">' + ['Job site', 'Yard', 'CTOS location', 'Customer location'].map(function (t) { return '<option' + (t === s.type ? ' selected' : '') + '>' + t + '</option>'; }).join('') + '</select></label><label>Project or job number<input type="text" id="st-proj" value="' + esc(s.project || '') + '" placeholder="DOM-4421"></label></div>' +
        '<label>Address<input type="text" id="st-addr" value="' + esc(s.address || '') + '"></label><div class="form-2"><label>Center<input type="text" id="st-center" value="' + s.lat.toFixed(4) + ', ' + s.lng.toFixed(4) + '" placeholder="lat, lng"></label><label>Radius<select id="st-radius">' + [200, 300, 400, 600, 800, 1200].map(function (r) { return '<option' + (r === s.radius ? ' selected' : '') + '>' + r + ' m</option>'; }).join('') + '</select></label></div>' +
        (document.body.getAttribute('data-page') === 'map' ? '<p class="form-note"><button type="button" class="lnk" id="st-place">Click the map to set the center</button></p>' : '<p class="form-note">Open the full map to place the center by clicking.</p>') +
        '<div class="form-2"><label>Hours<input type="text" id="st-hours" value="' + esc(s.hours || '7:00 AM to 5:00 PM') + '"></label><label class="radio" style="flex-direction:row;align-self:end"><input type="checkbox" id="st-ah"' + (s.afterHours ? ' checked' : '') + '><span>After-hours alerts<small>Ignition or movement outside hours</small></span></label></div>' +
        '<label>Notes<textarea id="st-note" rows="2">' + esc(s.note || '') + '</textarea></label></form>',
      foot: '<button type="submit" form="site-form" class="btn btn-primary">' + (editing ? 'Save site' : 'Add site') + '</button>' + (editing ? '<button type="button" class="lnk" id="st-remove">Remove site</button>' : ''),
      after: function () {
        var pl = $('st-place'); if (pl) pl.addEventListener('click', function () { placing = true; pl.textContent = 'Click the map now'; mapApi.onClick = function (lat, lng) { if (!placing) return; $('st-center').value = lat.toFixed(4) + ', ' + lng.toFixed(4); pl.textContent = 'Center set. Click again to move it.'; mapApi.preview(lat, lng, +$('st-radius').value.replace(/\D/g, '')); }; toast('Click the map to set the center.'); });
        $('site-form').addEventListener('submit', function (e) {
          e.preventDefault();
          var c = $('st-center').value.split(',').map(parseFloat);
          if (c.length < 2 || isNaN(c[0]) || isNaN(c[1])) { toast('Center needs a latitude and longitude.'); return; }
          var rec = editing ? s : { id: 's' + Date.now() };
          rec.name = $('st-name').value; rec.type = $('st-type').value; rec.project = $('st-proj').value; rec.address = $('st-addr').value; rec.lat = c[0]; rec.lng = c[1]; rec.radius = +$('st-radius').value.replace(/\D/g, ''); rec.hours = $('st-hours').value; rec.afterHours = $('st-ah').checked; rec.note = $('st-note').value;
          if (!editing) S.sites.push(rec);
          mapApi.onClick = null; save();
          addNotification({ title: (editing ? 'Site updated: ' : 'Site added: ') + rec.name, text: unitsAt(rec).length + ' unit' + (unitsAt(rec).length === 1 ? '' : 's') + ' inside the geofence right now.', href: 'map.html#site-' + rec.id });
          closeDrawer(); toast((editing ? 'Saved ' : 'Added ') + rec.name + '.'); renderPage(); if (mapApi.refreshSites) mapApi.refreshSites();
        });
        var rm = $('st-remove'); if (rm) rm.addEventListener('click', function () { confirmInline($('dr-foot'), 'Remove ' + s.name + '? Its history stays in the feed.', 'Remove', function () { S.sites = S.sites.filter(function (x) { return x.id !== s.id; }); save(); closeDrawer(); toast('Removed ' + s.name + '.'); renderPage(); if (mapApi.refreshSites) mapApi.refreshSites(); }); });
      }
    });
  }
  function renderSitesList() {
    var el = $('site-list'); if (!el) return;
    el.innerHTML = S.sites.length ? S.sites.map(function (s) { var n = unitsAt(s).length; return '<button type="button" class="row mrow site" data-site="' + s.id + '"><div><div class="unit">' + esc(s.name) + '<span class="sub"> · ' + esc(s.type) + '</span></div><div class="job">' + esc(s.project || s.address) + '</div></div><div class="when"><strong>' + n + ' unit' + (n === 1 ? '' : 's') + '</strong><span>' + (s.afterHours ? 'Alerts on' : esc(s.hours)) + '</span></div></button>'; }).join('') : emptyHtml('No sites yet. Add a yard or a job site and the map draws its geofence.');
    $('site-count').textContent = S.sites.length + ' sites · ' + S.sites.filter(function (s) { return s.type === 'Job site'; }).length + ' active projects';
    qsa('[data-site]', el).forEach(function (b) {
      b.addEventListener('click', function () { var s = S.sites.filter(function (x) { return x.id === b.getAttribute('data-site'); })[0]; mapApi.pan(s.lat, s.lng, 13); qsa('.mrow').forEach(function (x) { x.classList.toggle('selected', x === b); }); });
      b.addEventListener('dblclick', function () { var s = S.sites.filter(function (x) { return x.id === b.getAttribute('data-site'); })[0]; flowSite(s, b); });
    });
  }

  /* ---------- state ---------- */
  var KEY = 'ctos-one-demo-v1';
  var S;
  function load() {
    var who = ''; try { who = localStorage.getItem('ctos-persona') || ''; } catch (e) {}
    try { var raw = localStorage.getItem(KEY); if (raw) { S = JSON.parse(raw); if (S.personas) { migrate(who); return; } } } catch (e) {}
    S = who === 'taylor' ? newCustomerSeed(window.CTOS_SEED) : JSON.parse(JSON.stringify(window.CTOS_SEED));
  }
  // Saved state from an earlier version of the demo gets any keys added since.
  function migrate(who) {
    var fresh = who === 'taylor' ? newCustomerSeed(window.CTOS_SEED) : window.CTOS_SEED, changed = false;
    ['inventory', 'builds', 'credit', 'pricing'].forEach(function (k) { if (S[k] === undefined) { S[k] = JSON.parse(JSON.stringify(fresh[k])); changed = true; } });
    if (changed) save();
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function reset() { try { localStorage.removeItem(KEY); } catch (e) {} location.reload(); }
  window.CTOS_RESET = reset;
  load();
  window.CTOS = { state: S, save: save, reset: reset };

  /* ---------- helpers ---------- */
  function money(x) { return '$' + Number(x).toLocaleString('en-US', { minimumFractionDigits: x % 1 ? 2 : 0, maximumFractionDigits: 2 }); }
  function num(x) { return Number(x).toLocaleString('en-US'); }
  function sum(a) { return a.reduce(function (x, y) { return x + y; }, 0); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function $(id) { return document.getElementById(id); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function once(el, type, fn) { if (!el) return; var k = 'w_' + type; if (el[k]) return; el[k] = true; el.addEventListener(type, fn); }
  function vehicle(unit) { for (var i = 0; i < S.vehicles.length; i++) if (S.vehicles[i].unit === unit) return S.vehicles[i]; return null; }
  function woTotal(w) { return sum(w.items.map(function (it) { return it[2]; })); }
  function orderTotal(o) { return sum(o.items.map(function (it) { return it[2] * it[3]; })); }
  var chev = '<svg class="chev" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>';
  function stagesHtml(stages, cur) {
    return stages.map(function (s, j) {
      var c = j < cur ? 'done' : (j === cur ? 'now' : '');
      return '<li class="st ' + c + '"><span class="st-dot"></span><span class="st-name">' + esc(s[0]) + '</span><span class="st-when">' + esc(s[1]) + '</span></li>';
    }).join('');
  }
  function dueText(v) {
    if (v.nextWhat && /in shop/i.test(v.nextWhat)) return '<strong>In the shop</strong><span>' + esc(v.nextWhat.replace(/^In shop,?\s*/i, '') || 'now') + '</span>';
    if (v.nextIn == null) return '<strong class="muted">Not scheduled</strong><span>Set a PM interval</span>';
    if (v.nextIn < 0) return '<strong class="warn">Overdue ' + Math.abs(v.nextIn) + ' d</strong><span>' + esc(v.nextWhat || '') + '</span>';
    if (v.nextIn === 0) return '<strong class="warn">Today</strong><span>' + esc(v.nextWhat || '') + '</span>';
    return '<strong' + (v.nextIn <= 7 ? ' class="warn"' : '') + '>In ' + v.nextIn + ' day' + (v.nextIn === 1 ? '' : 's') + '</strong><span>' + esc(v.nextWhat || '') + '</span>';
  }
  function bookedFor(unit, jobRe) { return S.appointments.filter(function (ap) { return ap.unit === unit && (!jobRe || jobRe.test(ap.job)); }).sort(function (x, y) { return x.day - y.day; })[0] || null; }
  function bookedCell(ap) { return '<strong class="booked">Booked</strong><span>' + esc(ap.dateLabel) + ' · ' + esc(ap.time) + '</span>'; }
  function emptyHtml(text) { return '<div class="empty">' + esc(text) + '</div>'; }

  /* ---------- toast ---------- */
  var toastEl;
  function toast(text) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = text; toastEl.classList.add('show');
    clearTimeout(toastEl._t); toastEl._t = setTimeout(function () { toastEl.classList.remove('show'); }, 3200);
  }

  /* ---------- drawer ---------- */
  var drawer, scrim, lastFocus = null, hideTimer = null;
  function ensureDrawer() {
    if (drawer) return;
    scrim = document.createElement('div'); scrim.className = 'scrim'; scrim.hidden = true;
    drawer = document.createElement('aside'); drawer.className = 'drawer'; drawer.hidden = true;
    drawer.setAttribute('role', 'dialog'); drawer.setAttribute('aria-modal', 'true'); drawer.setAttribute('aria-labelledby', 'dr-title');
    drawer.innerHTML = '<div class="dr-head"><div><div class="dr-kind" id="dr-kind"></div><h2 id="dr-title" class="dr-title"></h2><div class="dr-meta" id="dr-meta"></div></div>' +
      '<button type="button" class="icon-btn" id="dr-close" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>' +
      '<div class="dr-body" id="dr-body"></div><div class="dr-foot" id="dr-foot"></div>';
    document.body.appendChild(scrim); document.body.appendChild(drawer);
    $('dr-close').addEventListener('click', closeDrawer);
    scrim.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function (e) {
      if (drawer.hidden) return;
      if (e.key === 'Escape') { closeDrawer(); return; }
      if (e.key !== 'Tab') return;
      var f = qsa('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])', drawer);
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
  function openDrawer(o) {
    ensureDrawer();
    lastFocus = document.activeElement;
    $('dr-kind').textContent = o.kind || ''; $('dr-kind').className = 'dr-kind' + (o.warn ? ' warn' : '');
    $('dr-title').textContent = o.title || ''; $('dr-meta').textContent = o.meta || '';
    $('dr-body').innerHTML = o.body || ''; $('dr-foot').innerHTML = o.foot || '';
    qsa('.selected').forEach(function (n) { n.classList.remove('selected'); });
    if (o.row) o.row.classList.add('selected');
    clearTimeout(hideTimer);
    drawer.hidden = false; scrim.hidden = false;
    requestAnimationFrame(function () { drawer.classList.add('open'); scrim.classList.add('open'); });
    document.body.classList.add('drawer-open');
    $('dr-close').focus();
    if (o.after) o.after();
  }
  function closeDrawer() {
    if (!drawer || drawer.hidden) return;
    drawer.classList.remove('open'); scrim.classList.remove('open');
    document.body.classList.remove('drawer-open');
    qsa('.selected').forEach(function (n) { n.classList.remove('selected'); });
    hideTimer = setTimeout(function () { drawer.hidden = true; scrim.hidden = true; }, 180);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function confirmInline(container, text, yes, onYes) {
    container.innerHTML = '<div class="confirm"><span>' + esc(text) + '</span><button type="button" class="btn btn-primary" id="cf-yes">' + esc(yes) + '</button><button type="button" class="btn btn-ghost" id="cf-no">Cancel</button></div>';
    $('cf-yes').addEventListener('click', onYes);
    $('cf-no').addEventListener('click', function () { closeDrawer(); });
    $('cf-yes').focus();
  }

  /* ---------- notifications ---------- */
  function addNotification(n) {
    S.notifications.unshift({ id: 'n' + Date.now(), level: n.level || '', read: false, title: n.title, text: n.text, when: 'Just now', href: n.href || '#' });
    save(); renderBell();
  }
  function renderBell() {
    var list = $('notif-list'); if (!list) return;
    var unread = S.notifications.filter(function (n) { return !n.read; }).length;
    var dot = document.querySelector('#bell .dot'); if (dot) dot.style.display = unread ? '' : 'none';
    var kinds = { high: 'Action needed', med: 'Review', '': '' };
    list.innerHTML = S.notifications.length ? S.notifications.map(function (n) {
      return '<a href="' + esc(n.href) + '" class="n-item ' + (n.read ? 'read' : 'unread') + '" data-id="' + n.id + '"><div><strong>' + esc(n.title) +
        (kinds[n.level] ? '<span class="kind ' + n.level + '">' + kinds[n.level] + '</span>' : '') + '</strong><p>' + esc(n.text) + '</p></div><time>' + esc(n.when) + '</time></a>';
    }).join('') : emptyHtml('You are all caught up.');
    var all = $('ntab-all'), alerts = $('ntab-alerts');
    if (all) all.querySelector('span').textContent = S.notifications.length;
    if (alerts) alerts.querySelector('span').textContent = S.notifications.filter(function (n) { return n.level; }).length;
    qsa('.n-item', list).forEach(function (a) {
      a.addEventListener('click', function () {
        S.notifications.forEach(function (n) { if (n.id === a.getAttribute('data-id')) n.read = true; }); save();
      });
    });
  }
  function initBell() {
    var bell = $('bell'), panel = $('notif'); if (!bell || !panel) return;
    function close() { panel.classList.remove('open'); bell.setAttribute('aria-expanded', 'false'); document.body.classList.remove('notif-open'); }
    bell.addEventListener('click', function (e) { e.stopPropagation(); var open = panel.classList.toggle('open'); bell.setAttribute('aria-expanded', open); document.body.classList.toggle('notif-open', open); });
    // Close button, shown on phones where the panel takes the full screen
    var head = panel.querySelector('.notif-head');
    if (head && !$('notif-close')) { var x = document.createElement('button'); x.type = 'button'; x.id = 'notif-close'; x.className = 'notif-close'; x.setAttribute('aria-label', 'Close notifications'); x.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>'; head.appendChild(x); x.addEventListener('click', close); }
    document.addEventListener('click', function (e) { if (!panel.contains(e.target)) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    $('notif-markall').addEventListener('click', function () { S.notifications.forEach(function (n) { n.read = true; }); save(); renderBell(); });
    qsa('.notif-tabs button').forEach(function (b) {
      b.addEventListener('click', function () {
        qsa('.notif-tabs button').forEach(function (x) { x.classList.toggle('on', x === b); });
        var f = b.getAttribute('data-filter');
        qsa('.n-item', panel).forEach(function (item) {
          var n = S.notifications.filter(function (x) { return x.id === item.getAttribute('data-id'); })[0] || {};
          item.style.display = (f === 'all' || (f === 'alerts' && n.level) || (f === 'orders' && !n.level)) ? '' : 'none';
        });
      });
    });
    renderBell();
  }

  /* ---------- nav collapse ---------- */
  function initNav() {
    var tog = $('navToggle'); if (!tog) return;
    function setNav(c) {
      document.body.classList.toggle('nav-collapsed', c);
      tog.setAttribute('aria-expanded', String(!c));
      tog.setAttribute('aria-label', c ? 'Expand navigation' : 'Collapse navigation'); tog.title = tog.getAttribute('aria-label');
      try { localStorage.setItem('ctos-nav', c ? '1' : '0'); } catch (e) {}
    }
    try { if (localStorage.getItem('ctos-nav') === '1') setNav(true); } catch (e) {}
    tog.addEventListener('click', function () { setNav(!document.body.classList.contains('nav-collapsed')); });
    document.addEventListener('keydown', function (e) { if (e.key === '[' && !/input|textarea|select/i.test(e.target.tagName)) setNav(!document.body.classList.contains('nav-collapsed')); });
  }

  /* ---------- search ---------- */
  function initSearch() {
    var input = $('search'), box = $('search-results'); if (!input || !box) return;
    function index() {
      var items = [];
      S.vehicles.forEach(function (v) { items.push({ t: 'Unit #' + v.unit, s: v.model + ' · ' + v.status, h: 'fleet.html#u' + v.unit, k: 'Vehicle' }); });
      S.orders.forEach(function (o) { items.push({ t: 'Order ' + o.no, s: (o.unit ? 'Unit #' + o.unit + ' · ' : '') + o.for, h: 'parts.html#parts', k: 'Parts order' }); });
      S.trucks.forEach(function (t) { items.push({ t: t.no + ' · ' + t.spec, s: 'Expected ' + t.eta, h: 'parts.html#trucks', k: 'Truck order' }); });
      S.rentals.forEach(function (r) { items.push({ t: r.unit + ' · ' + r.spec, s: 'Due back ' + r.due, h: 'parts.html#rentals', k: 'Rental' }); });
      S.invoices.forEach(function (i) { items.push({ t: i.no, s: 'Unit #' + i.unit + ' · ' + i.desc + ' · ' + money(i.amount), h: 'billing.html', k: 'Invoice' }); });
      S.workorders.forEach(function (w) { items.push({ t: 'Work order · Unit #' + w.unit, s: w.where, h: 'service.html', k: 'Service' }); });
      (S.inventory || []).forEach(function (it) { items.push({ t: invTitle(it) + ' · ' + it.stock, s: (it.sale ? 'For sale' : 'For rent') + ' · ' + it.loc, h: 'inventory.html', k: 'Buy & Rent' }); });
      (S.builds || []).forEach(function (b) { items.push({ t: b.name, s: b.spec, h: 'parts.html#trucks', k: 'Preferred build' }); });
      S.team.forEach(function (p) { items.push({ t: p.name, s: p.role, h: 'team.html', k: 'Team' }); });
      S.reports.forEach(function (r) { items.push({ t: r.name, s: r.period, h: 'reports.html#' + r.id, k: 'Report' }); });
      S.quotes.forEach(function (q) { items.push({ t: q.no + ' · ' + q.lines.map(function (l) { return l.spec; }).join(', '), s: QSTAGE[q.stage][0], h: 'parts.html#trucks', k: 'Quote' }); });
      S.vehicles.forEach(function (v) { (v.components || []).forEach(function (c) { if (c.role !== 'chassis') items.push({ t: c.make + ' ' + c.model + ' · ' + c.serial, s: ROLE_NAME[c.role] + ' on Unit #' + v.unit, h: 'unit.html?u=' + v.unit, k: 'Component' }); }); });
      S.freight.forEach(function (f) { items.push({ t: f.id + ' · ' + f.what, s: f.from + ' to ' + f.to, h: 'parts.html#freight', k: 'Freight' }); });
      S.posts.forEach(function (p) { items.push({ t: p.title, s: p.tag + ' · ' + p.date, h: 'news.html#' + p.id, k: 'Article' }); });
      S.sites.forEach(function (s) { items.push({ t: s.name, s: s.type + (s.project ? ' · ' + s.project : '') + ' · ' + unitsAt(s).length + ' units on site', h: 'map.html#site-' + s.id, k: 'Site' }); });
      S.campaigns.forEach(function (c) { items.push({ t: c.ref + ' · ' + c.title, s: c.maker + ' · ' + c.units.length + ' unit' + (c.units.length > 1 ? 's' : ''), h: 'service.html', k: 'Campaign' }); });
      S.users.forEach(function (u) { items.push({ t: u.name, s: ROLES[u.role] + ' · ' + u.email, h: 'team.html', k: 'User' }); });
      return items;
    }
    var all = null, active = -1;
    function render(q) {
      if (!all) all = index();
      q = q.trim().toLowerCase();
      if (!q) { box.hidden = true; return; }
      var hits = all.filter(function (i) { return (i.t + ' ' + i.s + ' ' + i.k).toLowerCase().indexOf(q) >= 0; }).slice(0, 8);
      box.innerHTML = hits.length ? hits.map(function (h) { return '<a href="' + esc(h.h) + '" class="sr"><span class="sr-k">' + esc(h.k) + '</span><span><strong>' + esc(h.t) + '</strong><span class="sr-s">' + esc(h.s) + '</span></span></a>'; }).join('') : '<div class="sr none">No matches for "' + esc(q) + '"</div>';
      box.hidden = false; active = -1;
    }
    input.addEventListener('input', function () { render(input.value); });
    input.addEventListener('focus', function () { if (input.value) render(input.value); });
    input.addEventListener('keydown', function (e) {
      var links = qsa('a.sr', box);
      if (e.key === 'ArrowDown' && links.length) { e.preventDefault(); active = Math.min(active + 1, links.length - 1); links[active].focus(); }
      if (e.key === 'Escape') { box.hidden = true; input.blur(); }
    });
    box.addEventListener('keydown', function (e) {
      var links = qsa('a.sr', box), i = links.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); if (i < links.length - 1) links[i + 1].focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); if (i > 0) links[i - 1].focus(); else input.focus(); }
      if (e.key === 'Escape') { box.hidden = true; input.focus(); }
    });
    document.addEventListener('click', function (e) { if (!box.contains(e.target) && e.target !== input) box.hidden = true; });
    document.addEventListener('keydown', function (e) { if (e.key === '/' && !/input|textarea|select/i.test(e.target.tagName)) { e.preventDefault(); input.focus(); } });
  }

  /* ---------- live stamp ---------- */
  function initStamp() {
    var el = $('live-stamp'); if (!el) return;
    var t0 = Date.now() - 30000;
    function tick() { var s = Math.round((Date.now() - t0) / 1000); el.textContent = 'Live telematics · updated ' + (s < 60 ? s + ' seconds ago' : Math.round(s / 60) + ' min ago'); if (s > 90) t0 = Date.now(); }
    tick(); setInterval(tick, 1000);
  }

  /* ---------- flows ---------- */
  function flowSchedule(opts, row) {
    opts = opts || {};
    var jobs = ['PM service', 'Annual inspection', 'Dielectric test', 'Brake inspection', 'DOT inspection', 'Diagnostic', 'Tires', 'Campaign work', 'Storm readiness check', 'Other'];
    if (opts.job && jobs.indexOf(opts.job) < 0) jobs.unshift(opts.job);
    var jobOpts = jobs.map(function (j) { return '<option' + (j === opts.job ? ' selected' : '') + '>' + esc(j) + '</option>'; }).join('');
    var d = new Date(); d.setDate(d.getDate() + 1); var iso = d.toISOString().slice(0, 10);
    var sel = opts.unit ? vehicle(opts.unit) : null;
    function nearest(v) { if (!v || !v.lat) return S.locations[0]; var best = null, bd = 1e12; S.locations.forEach(function (l) { var s = S.sites.filter(function (x) { return x.name === l.name; })[0]; if (!s) return; var dm = distM(v.lat, v.lng, s.lat, s.lng); if (dm < bd) { bd = dm; best = l; best._mi = Math.round(dm / 1609); } }); return best || S.locations[0]; }
    function unitLine(v) { return 'Unit #' + v.unit + ' · ' + esc(v.model) + (v.loc ? ' · ' + esc(v.loc) : ''); }
    function locOptions(v) {
      var near = nearest(v);
      return S.locations.map(function (l) { return '<option value="' + esc(l.name) + '"' + (l.name === near.name ? ' selected' : '') + '>' + esc(l.name) + (l.name === near.name && near._mi != null ? ' · closest, about ' + near._mi + ' mi' : '') + '</option>'; }).join('');
    }
    openDrawer({
      kind: 'Schedule service', title: sel ? 'Unit #' + sel.unit : 'New appointment', meta: sel ? sel.model : 'Search for a unit, choose the work and where',
      body: '<form class="form" id="sched-form">' +
        '<label>Unit<input type="text" id="f-unit-q" autocomplete="off" placeholder="Search by unit number, model or driver" value="' + (sel ? esc('Unit #' + sel.unit + ' · ' + sel.model) : '') + '"><input type="hidden" id="f-unit" value="' + (sel ? sel.unit : '') + '"><div class="unit-results" id="f-unit-results" hidden></div></label>' +
        '<label>Service<select id="f-job">' + jobOpts + '</select></label>' +
        '<fieldset><legend>Where</legend><label class="radio"><input type="radio" name="where" value="shop" checked><span>Bring it to a CTOS shop<small>Full bay, lift and parts on hand</small></span></label><label class="radio"><input type="radio" name="where" value="field"><span>Field service, we come to the unit<small>Mobile technician at your yard or job site</small></span></label></fieldset>' +
        '<label id="f-loc-wrap">Shop<select id="f-loc">' + locOptions(sel) + '</select></label>' +
        '<label id="f-site-wrap" hidden>Meet the technician at<select id="f-site">' + S.sites.filter(function (s) { return s.type !== 'CTOS location'; }).map(function (s) { return '<option' + (sel && siteOf(sel) && siteOf(sel).id === s.id ? ' selected' : '') + '>' + esc(s.name) + '</option>'; }).join('') + '<option>Other address</option></select></label>' +
        '<div class="form-2"><label>Date<input type="date" id="f-date" value="' + iso + '" required></label><label>Time<select id="f-time"><option>7:00 AM</option><option selected>9:00 AM</option><option>11:00 AM</option><option>1:00 PM</option><option>3:00 PM</option></select></label></div>' +
        '<label>Notes for the advisor<textarea id="f-notes" rows="3" placeholder="Anything the technician should know"></textarea></label>' +
        '<p class="form-note" id="f-note">Luis or Priya will confirm within the hour during shop hours.</p></form>',
      foot: '<button type="submit" form="sched-form" class="btn btn-primary">Book appointment</button><a href="team.html" class="lnk">Call the shop instead</a>',
      row: row,
      after: function () {
        var q = $('f-unit-q'), hid = $('f-unit'), res = $('f-unit-results');
        function search() {
          var t = q.value.trim().toLowerCase();
          if (!t) { res.hidden = true; return; }
          var hits = S.vehicles.filter(function (v) { return (v.unit + ' ' + v.model + ' ' + (v.driver || '') + ' ' + (v.kind || '')).toLowerCase().indexOf(t) >= 0; }).slice(0, 6);
          res.innerHTML = hits.length ? hits.map(function (v) { return '<button type="button" class="ur" data-u="' + v.unit + '"><strong>Unit #' + v.unit + '</strong><span>' + esc(v.model) + (v.loc ? ' · ' + esc(v.loc) : '') + '</span></button>'; }).join('') : '<div class="ur none">No unit matches "' + esc(t) + '"</div>';
          res.hidden = false;
          qsa('.ur[data-u]', res).forEach(function (b) { b.addEventListener('click', function () { var v = vehicle(b.getAttribute('data-u')); hid.value = v.unit; q.value = 'Unit #' + v.unit + ' · ' + v.model; res.hidden = true; $('f-loc').innerHTML = locOptions(v); var so = siteOf(v); if (so) { qsa('#f-site option').forEach(function (o) { o.selected = o.textContent === so.name; }); } }); });
        }
        q.addEventListener('input', function () { hid.value = ''; search(); });
        q.addEventListener('focus', function () { if (!hid.value) search(); });
        qsa('input[name="where"]').forEach(function (r) { r.addEventListener('change', function () { var field = r.value === 'field' && r.checked; $('f-loc-wrap').hidden = field; $('f-site-wrap').hidden = !field; $('f-note').textContent = field ? 'A mobile technician comes to the unit. Priya confirms the window within the hour.' : 'Luis or Priya will confirm within the hour during shop hours.'; }); });
        $('sched-form').addEventListener('submit', function (e) {
          e.preventDefault();
          var u = hid.value; if (!u) { toast('Pick a unit from the search results.'); q.focus(); return; }
          var fieldEl = document.querySelector('input[name="where"][value="field"]'); var field = !!(fieldEl && fieldEl.checked);
          var job = $('f-job').value, loc = field ? 'Field service · ' + $('f-site').value : $('f-loc').value, dt = new Date($('f-date').value + 'T12:00:00'), time = $('f-time').value;
          var label = dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
          var day = dt.getDate() + (dt.getMonth() === 10 ? 31 : 0);
          S.appointments.push({ id: 'ap' + Date.now(), unit: u, job: job, loc: loc, day: day, dateLabel: label, time: time, field: field });
          S.unscheduled = S.unscheduled.filter(function (x) { return x.unit !== u; });
          S.attention = S.attention.filter(function (a) { return !(a.unitFor === u && a.flow === 'schedule'); });
          var v = vehicle(u); if (v) { v.nextService = label; v.nextIn = Math.max(0, Math.round((dt - new Date('2026-10-30')) / 86400000)); v.nextWhat = job + ', booked'; }
          save();
          addNotification({ title: 'Unit #' + u + ' booked for ' + job, text: label + ' at ' + time + ', ' + loc + '.', href: 'service.html' });
          closeDrawer(); toast('Unit #' + u + ' booked for ' + label + ' at ' + time + '.');
          renderPage();
        });
      }
    });
  }

  function flowAllWorkorders() {
    var active = S.workorders.filter(function (w) { return w.state !== 'done'; });
    var done = S.serviceHistory.slice(0, 8);
    function row(w) { return '<button type="button" class="row wo-row" data-wo-all="' + w.id + '"><div><div class="unit">Unit #' + w.unit + '</div><div class="job">' + esc((vehicle(w.unit) || {}).model || '') + '</div><div class="job">' + esc(w.where) + ' · ' + esc(w.stages[w.stage][0]) + '</div></div><div class="when"><strong>' + esc(w.stages[w.stage][1] || w.stages[w.stage][0]) + '</strong><span>' + (w.stages[w.stage + 1] ? 'Next: ' + esc(w.stages[w.stage + 1][0]) : 'Ready') + '</span></div><span class="act">Details</span></button>'; }
    openDrawer({
      kind: 'Work orders', title: 'All work orders', meta: active.length + ' open · ' + S.serviceHistory.length + ' completed in October',
      body: '<h4 class="dr-sub">Open</h4><div class="list">' + (active.length ? active.map(row).join('') : emptyHtml('Nothing in the shop right now.')) + '</div>' +
        '<h4 class="dr-sub">Completed</h4><div class="list">' + done.map(function (h) { return '<div class="row fig"><span>Unit #' + h.unit + ' · ' + esc(h.work) + '<small>' + esc(h.date) + ' · ' + esc(h.loc) + ' · <a href="billing.html" class="lnk">' + h.inv + '</a></small></span><b>' + money(h.cost) + '</b></div>'; }).join('') + '</div>',
      foot: '<a href="billing.html" class="lnk">Invoices</a><a href="reports.html#spend" class="lnk">Service spend report</a>',
      after: function () { qsa('[data-wo-all]').forEach(function (b) { b.addEventListener('click', function () { var w = S.workorders.filter(function (x) { return x.id === b.getAttribute('data-wo-all'); })[0]; if (w) flowWorkorder(w, null, true); }); }); }
    });
  }

  function flowWorkorder(w, row, fromAll) {
    var total = woTotal(w);
    openDrawer({
      kind: 'In the shop · ' + w.stages[w.stage][0], title: 'Unit #' + w.unit, meta: (vehicle(w.unit) || {}).model + ' · ' + w.where, warn: w.state === 'waiting',
      body: '<p class="dr-summary">' + esc(w.summary) + '</p><ol class="stages" aria-label="Work order progress">' + stagesHtml(w.stages, w.stage) + '</ol>' +
        '<div class="list li-list">' + w.items.map(function (it) { return '<div class="row fig li"><span>' + esc(it[0]) + '<small>' + esc(it[1]) + '</small></span><b>' + money(it[2]) + '</b></div>'; }).join('') +
        '<div class="row fig total"><span>Estimate<small>Parts and labor, before tax. Your advisor confirms the work with you by phone.</small></span><b>' + money(total) + '</b></div></div>',
      foot: (fromAll ? '<button type="button" class="lnk" id="wo-back">\u2190 All work orders</button>' : '') + '<a href="team.html" class="lnk">Ask the advisor a question</a>' + (isEmployee() ? '<a href="#" class="lnk">Open in the shop system</a>' : ''),
      row: row,
      after: function () {
        var bk = $('wo-back'); if (bk) bk.addEventListener('click', function () { flowAllWorkorders(); });
        var rm = $('wo-remind'); if (rm) rm.addEventListener('click', function () { S.accountNotes.unshift({ when: 'Today', who: personaInfo().name, text: 'Sent approval reminder for Unit #' + w.unit + ' (' + money(total) + ').' }); save(); closeDrawer(); toast('Reminder sent to ' + S.user.name + '.'); });
        var b = $('wo-approve'); if (!b) return;
        b.addEventListener('click', function () {
          confirmInline($('dr-foot'), 'Approve ' + money(total) + ' for Unit #' + w.unit + '?', 'Yes, approve', function () {
            w.state = 'approved'; w.stage = 3; w.stages[2][1] = 'Approved just now'; w.stages[3][1] = 'Started';
            save();
            addNotification({ title: 'Unit #' + w.unit + ' estimate approved', text: money(total) + ' at ' + w.where + '. Work has started.', href: 'service.html' });
            closeDrawer(); toast('Approved ' + money(total) + ' for Unit #' + w.unit + '. Work has started.');
            renderPage();
          });
        });
      }
    });
  }

  function flowVehicle(unit, row) {
    var v = vehicle(unit); if (!v) return;
    var evs = S.events.filter(function (e) { return e.unit === unit; });
    var hist = S.serviceHistory.filter(function (h) { return h.unit === unit; });
    var ords = S.orders.filter(function (o) { return o.unit === unit; });
    var wos = S.workorders.filter(function (w) { return w.unit === unit; });
    var left = v.nextPm - v.odo;
    openDrawer({
      kind: v.status, warn: v.state === 'fault', title: 'Unit #' + v.unit, meta: v.model + (v.driver ? ' · ' + v.driver : ''),
      body: '<dl class="dr-facts"><dt>Location</dt><dd>' + esc(v.loc) + (siteOf(v) ? ' · <a href="map.html#site-' + siteOf(v).id + '" class="lnk">' + esc(siteOf(v).name) + '</a>' : '') + '</dd><dt>Type</dt><dd>' + esc(v.kind || '') + '</dd><dt>VIN</dt><dd class="mono">' + esc(v.vin || '') + '</dd><dt>Odometer</dt><dd>' + num(v.odo) + ' mi</dd>' + (v.hours ? '<dt>Boom hours</dt><dd>' + num(v.hours) + ' h</dd>' : '') + '<dt>Fuel</dt><dd>' + v.fuel + '%</dd><dt>MPG, 30 days</dt><dd>' + v.mpg + '</dd><dt>Next PM</dt><dd>' + num(v.nextPm) + ' mi · ' + num(left) + ' mi left</dd><dt>Next service</dt><dd>' + esc(v.nextService) + '</dd>' + (v.dtc ? '<dt>Fault</dt><dd class="warn">' + esc(v.dtc) + '</dd>' : '') + '</dl>' +
        '<h4 class="dr-h">Major components</h4>' + ((v.components || []).length ? '<div class="list">' + v.components.map(function (c) { return '<div class="row fig"><span>' + ROLE_NAME[c.role] + '<small>' + esc(c.year + ' ' + c.make + ' ' + c.model) + ' · ' + esc(c.serial) + (c.hours != null && c.role !== 'chassis' ? ' · ' + num(c.hours) + ' h' : '') + '</small></span><b class="muted">' + (/expired/i.test(c.warranty) ? 'Out of warranty' : 'In warranty') + '</b></div>'; }).join('') + '</div>' : emptyHtml('No as-built record yet.')) +
        '<h4 class="dr-h">Inspections and campaigns</h4>' + (unitInspections(unit).length || unitCampaigns(unit).length ? '<div class="list">' + unitInspections(unit).map(function (i) { var d = docDays(i.due); return '<div class="row fig"><span>' + esc(i.type) + '<small>' + ROLE_NAME[i.comp] + ' · ' + esc(i.result) + '</small></span><b class="' + (d < 30 ? 'warn' : '') + '">' + (d < 0 ? 'Overdue' : 'Due ' + esc(i.due)) + '</b></div>'; }).join('') + unitCampaigns(unit).map(function (x) { return '<div class="row fig"><span>' + esc(x.c.title) + '<small>' + esc(x.c.severity) + ' · ' + esc(x.c.maker) + ' ' + esc(x.c.ref) + '</small></span><b class="' + (x.u.status === 'open' ? 'warn' : 'muted') + '">' + (x.u.status === 'open' ? 'Open' : 'Done') + '</b></div>'; }).join('') + '</div>' : emptyHtml('Nothing on file.')) +
        '<h4 class="dr-h">Work in progress</h4>' + (wos.length ? '<div class="list">' + wos.map(function (w) { return '<div class="row fig"><span>' + esc(w.stages[w.stage][0]) + '<small>' + esc(w.where) + '</small></span><b>' + money(woTotal(w)) + '</b></div>'; }).join('') + '</div>' : emptyHtml('Nothing in the shop.')) +
        '<h4 class="dr-h">Parts on order</h4>' + (ords.length ? '<div class="list">' + ords.map(function (o) { return '<div class="row fig"><span>Order ' + o.no + '<small>' + esc(o.for) + '</small></span><b>' + esc(o.eta) + '</b></div>'; }).join('') + '</div>' : emptyHtml('No open orders for this unit.')) +
        '<h4 class="dr-h">Recent events</h4>' + (evs.length ? '<div class="list">' + evs.map(function (e) { return '<div class="row ev ' + e.kind + '"><time>' + e.t + '</time><div><span>' + esc(e.text) + '</span></div></div>'; }).join('') + '</div>' : emptyHtml('No events today.')) +
        '<h4 class="dr-h">Documents</h4>' + docsHtml(unit) +
        '<h4 class="dr-h">Service history</h4>' + (hist.length ? '<div class="list">' + hist.map(function (h) { return '<div class="row fig"><span>' + esc(h.work) + '<small>' + h.date + ' · ' + esc(h.loc) + '</small></span><b>' + money(h.cost) + '</b></div>'; }).join('') + '</div>' : emptyHtml('No service this month.')),
      foot: '<a href="unit.html?u=' + v.unit + '" class="btn btn-primary">Open unit page</a><button type="button" class="btn btn-ghost" id="v-sched">Schedule service</button>' + (v.driver ? '<button type="button" class="lnk" id="v-msg">Message ' + esc(v.driver) + '</button>' : ''),
      row: row,
      after: function () {
        $('v-sched').addEventListener('click', function () { flowSchedule({ unit: v.unit, job: v.dtc ? 'Diagnostic' : 'PM service' }); });
        wireDocs(drawer);
        var m = $('v-msg'); if (m) m.addEventListener('click', function () { flowMessage(v.unit); });
      }
    });
  }

  function flowMessage(unit, row) {
    var v = vehicle(unit) || {};
    openDrawer({
      kind: 'Message driver', title: v.driver || 'Driver', meta: 'Unit #' + unit + ' · sent to the in-cab tablet',
      body: '<form class="form" id="msg-form"><label>Message<textarea id="m-text" rows="4" required>Please shut down if you are going to be parked more than 10 minutes. Thanks.</textarea></label></form>',
      foot: '<button type="submit" form="msg-form" class="btn btn-primary">Send</button>',
      row: row,
      after: function () {
        $('msg-form').addEventListener('submit', function (e) {
          e.preventDefault();
          S.attention = S.attention.filter(function (a) { return !(a.unitFor === unit && a.flow === 'message'); });
          S.events.unshift({ t: 'Now', unit: unit, text: 'Message sent to ' + (v.driver || 'driver'), kind: '' });
          save(); closeDrawer(); toast('Message sent to ' + (v.driver || 'the driver') + '.'); renderPage();
        });
      }
    });
  }

  function cartCount() { return sum(S.cart.map(function (c) { return c.q; })); }
  function cartTotal() { return sum(S.cart.map(function (c) { return c.q * c.p; })); }
  function addToCart(part) {
    var line = S.cart.filter(function (c) { return c.pn === part.pn; })[0];
    if (line) line.q += part.q; else S.cart.push({ pn: part.pn, d: part.d, q: part.q, p: part.p });
    save(); toast(part.d + ' added. ' + cartCount() + ' items in your order.'); renderCartBadge();
  }
  function renderCartBadge() { qsa('[data-cart-count]').forEach(function (n) { var c = cartCount(); n.textContent = c ? 'Order parts · ' + c + ' items' : 'Order parts'; }); }
  // Everything orderable: the reorder list, every as-built BOM, and common chassis service parts.
  var CHASSIS_PARTS = [['FL-OIL-15', 'Oil filter, Cummins B6.7', 34], ['FL-FUEL-9', 'Fuel filter kit, Cummins B6.7', 52], ['FL-AIR-22', 'Air filter, primary', 61], ['DEF-25', 'DEF fluid, 2.5 gal', 18], ['BRK-PAD-M2', 'Brake pads, front axle, M2 106', 184], ['WIP-28', 'Wiper blades, 28 in, pair', 24], ['BLB-H11', 'Headlamp bulb, H11', 16], ['MRK-LED', 'Marker lamp, LED amber', 22], ['PTO-SW', 'PTO switch, dash', 68], ['HYD-AW46', 'Hydraulic oil AW46, 5 gal', 89]];
  function catalog() {
    var seen = {}, out = [];
    function add(pn, d, p, fits, q) { if (seen[pn]) { if (fits && seen[pn].fits.indexOf(fits) < 0) seen[pn].fits.push(fits); return; } var it = { pn: pn, d: d, p: p, fits: fits ? [fits] : [], q: q || 1 }; seen[pn] = it; out.push(it); }
    S.reorder.forEach(function (r) { add(r.pn, r.d, r.p, '', r.q); });
    CHASSIS_PARTS.forEach(function (x) { add(x[0], x[1], x[2], 'Chassis'); });
    Object.keys(S.bom).forEach(function (k) { S.bom[k].forEach(function (x) { add(x[0], x[1], x[3], k, x[2]); }); });
    return out;
  }
  function partsForUnit(v) {
    var list = [], seen = {};
    (v.components || []).forEach(function (comp) { bomFor(comp).forEach(function (x) { if (!seen[x[0]]) { seen[x[0]] = 1; list.push({ pn: x[0], d: x[1], p: x[3], q: x[2], fits: [comp.make + ' ' + comp.model], group: ROLE_NAME[comp.role] + ' · ' + comp.make + ' ' + comp.model }); } }); });
    CHASSIS_PARTS.slice(0, 6).forEach(function (x) { if (!seen[x[0]]) { seen[x[0]] = 1; list.push({ pn: x[0], d: x[1], p: x[2], q: 1, fits: ['Chassis'], group: 'Chassis service' }); } });
    return list;
  }
  function flowCart(opts) {
    opts = opts || {};
    var q = '', unit = opts.unit || '';
    function inCart(pn) { var l = S.cart.filter(function (c) { return c.pn === pn; })[0]; return l ? l.q : 0; }
    function partRow(it, showFits) {
      var n = inCart(it.pn);
      return '<div class="row fig li part"><span>' + esc(it.d) + '<small>' + esc(it.pn) + ' · ' + money(it.p) + (showFits && it.fits.length ? ' · fits ' + esc(it.fits.slice(0, 2).join(', ')) + (it.fits.length > 2 ? ' +' + (it.fits.length - 2) : '') : '') + '</small></span>' + (n ? '<span class="qty"><button type="button" data-pn="' + esc(it.pn) + '" data-q="-1" aria-label="Fewer">−</button><b>' + n + '</b><button type="button" data-pn="' + esc(it.pn) + '" data-q="1" aria-label="More">+</button></span>' : '<button type="button" class="btn btn-ghost sm" data-add-pn="' + esc(it.pn) + '">Add' + (it.q > 1 ? ' ' + it.q : '') + '</button>') + '</div>';
    }
    function pickHtml() {
      var head = '<div class="cart-find"><label class="inv-search"><span class="vh">Search parts</span><input type="search" id="c-q" placeholder="Search part number or description" value="' + esc(q) + '" autocomplete="off"></label><select id="c-for" aria-label="Parts that fit a unit"><option value="">Any unit</option>' + S.vehicles.map(function (v) { return '<option value="' + v.unit + '"' + (v.unit === unit ? ' selected' : '') + '>Unit #' + v.unit + ' · ' + esc(v.model) + '</option>'; }).join('') + '</select></div>';
      var v = unit ? vehicle(unit) : null, body = '';
      if (q) {
        var t = q.toLowerCase(), pool = v ? partsForUnit(v) : catalog();
        var hits = pool.filter(function (it) { return (it.pn + ' ' + it.d + ' ' + it.fits.join(' ')).toLowerCase().indexOf(t) >= 0; }).slice(0, 12);
        body = '<h4 class="dr-sub">' + (hits.length ? hits.length + ' part' + (hits.length === 1 ? '' : 's') : 'No parts') + ' matching "' + esc(q) + '"' + (v ? ' for Unit #' + v.unit : '') + '</h4><div class="list li-list cart-picks">' + (hits.length ? hits.map(function (it) { return partRow(it, !v); }).join('') : emptyHtml('Nothing by that number or name. Dan can source it: use Ask Dan below with the number or a photo of the part.')) + '</div>';
      } else if (v) {
        var list = partsForUnit(v), groups = [];
        list.forEach(function (it) { var g = groups.filter(function (x) { return x.name === it.group; })[0]; if (!g) { g = { name: it.group, items: [] }; groups.push(g); } g.items.push(it); });
        body = groups.map(function (g) { return '<h4 class="dr-sub">' + esc(g.name) + '</h4><div class="list li-list cart-picks">' + g.items.map(function (it) { return partRow(it, false); }).join('') + '</div>'; }).join('') || emptyHtml('No as-built record for this unit yet, so no matched parts. Search by part number instead.');
      } else {
        body = (S.reorder.length ? '<h4 class="dr-sub">Your reorder list<button type="button" class="lnk" id="c-reorder-all">Add all at usual quantities</button></h4><div class="list li-list cart-picks">' + S.reorder.map(function (r) { return partRow({ pn: r.pn, d: r.d, p: r.p, q: r.q, fits: [] }, false); }).join('') + '</div>' : '') +
          (S.orderHistory.length ? '<h4 class="dr-sub">Recent orders</h4><div class="list li-list cart-picks">' + S.orderHistory.slice(0, 3).map(function (h) { return '<div class="row fig li part"><span>Order ' + h.no + ' · ' + esc(h.for) + '<small>' + h.date + ' · ' + h.items + ' item' + (h.items === 1 ? '' : 's') + ' · ' + money(h.total) + '</small></span><button type="button" class="btn btn-ghost sm" data-reorder-hist="' + h.no + '">Order again</button></div>'; }).join('') + '</div>' : '') +
          (!S.reorder.length && !S.orderHistory.length ? '<p class="form-note">Pick a unit above to see every part that fits its chassis, body and equipment, or search by part number.</p>' : '');
      }
      return head + body;
    }
    function cartHtml() {
      if (!S.cart.length) return '<h4 class="dr-sub">Your order</h4>' + emptyHtml('Nothing added yet.');
      return '<h4 class="dr-sub">Your order<span class="muted">' + cartCount() + ' item' + (cartCount() === 1 ? '' : 's') + '</span></h4><div class="list li-list cart">' + S.cart.map(function (c, i) {
        return '<div class="row fig li"><span>' + esc(c.d) + '<small>' + esc(c.pn) + ' · ' + money(c.p) + ' each</small></span><span class="qty"><button type="button" data-q="-1" data-i="' + i + '" aria-label="Fewer">−</button><b>' + c.q + '</b><button type="button" data-q="1" data-i="' + i + '" aria-label="More">+</button></span><b>' + money(c.q * c.p) + '</b></div>';
      }).join('') + '<div class="row fig total"><span>Order total<small>Before tax · ' + (S.credit.status === 'active' ? 'bills to your account, ' + esc(S.credit.terms) : 'card or prepayment') + '</small></span><b>' + money(cartTotal()) + '</b></div></div>' +
        '<form class="form" id="cart-form"><div class="form-2"><label>Ship to<select id="c-ship">' + S.shipTo.map(function (s) { return '<option>' + esc(s) + '</option>'; }).join('') + '</select></label><label>For unit<select id="c-unit"><option value="">Shop stock</option>' + S.vehicles.map(function (v) { return '<option value="' + v.unit + '"' + (v.unit === unit ? ' selected' : '') + '>Unit #' + v.unit + '</option>'; }).join('') + '</select></label></div><label>PO number or note<input type="text" id="c-po" placeholder="Optional"></label></form>';
    }
    function body() { return '<div id="c-pick">' + pickHtml() + '</div><div id="c-cart">' + cartHtml() + '</div>'; }
    function repaint(keepFocus) {
      var qEl = $('c-q'), pos = qEl ? qEl.selectionStart : 0;
      $('c-pick').innerHTML = pickHtml(); $('c-cart').innerHTML = cartHtml(); $('dr-foot').innerHTML = foot(); wire(); renderCartBadge();
      $('dr-title').textContent = S.cart.length ? cartCount() + ' item' + (cartCount() === 1 ? '' : 's') + ' · ' + money(cartTotal()) : 'New parts order';
      if (keepFocus && $('c-q')) { $('c-q').focus(); try { $('c-q').setSelectionRange(pos, pos); } catch (e) {} }
    }
    function bump(pn, d) { var l = S.cart.filter(function (c) { return c.pn === pn; })[0]; if (!l) return; l.q += d; if (l.q <= 0) S.cart = S.cart.filter(function (c) { return c !== l; }); save(); }
    function wire() {
      var qEl = $('c-q'); if (qEl) qEl.addEventListener('input', function () { q = qEl.value.trim(); repaint(true); });
      var fEl = $('c-for'); if (fEl) fEl.addEventListener('change', function () { unit = fEl.value; repaint(); });
      qsa('[data-add-pn]', drawer).forEach(function (b) { b.addEventListener('click', function () { var pn = b.getAttribute('data-add-pn'); var it = (unit && vehicle(unit) ? partsForUnit(vehicle(unit)) : []).concat(catalog()).filter(function (x) { return x.pn === pn; })[0]; if (!it) return; var line = S.cart.filter(function (c) { return c.pn === pn; })[0]; if (line) line.q += it.q; else S.cart.push({ pn: it.pn, d: it.d, q: it.q, p: it.p }); save(); repaint(); }); });
      qsa('.cart-picks .qty button', drawer).forEach(function (b) { b.addEventListener('click', function () { bump(b.getAttribute('data-pn'), +b.getAttribute('data-q')); repaint(); }); });
      qsa('.cart .qty button', drawer).forEach(function (b) { b.addEventListener('click', function () { var i = +b.getAttribute('data-i'); S.cart[i].q += +b.getAttribute('data-q'); if (S.cart[i].q <= 0) S.cart.splice(i, 1); save(); repaint(); }); });
      var ra = $('c-reorder-all'); if (ra) ra.addEventListener('click', function () { S.reorder.forEach(function (r) { var line = S.cart.filter(function (c) { return c.pn === r.pn; })[0]; if (line) line.q += r.q; else S.cart.push({ pn: r.pn, d: r.d, q: r.q, p: r.p }); }); save(); repaint(); });
      qsa('[data-reorder-hist]', drawer).forEach(function (b) { b.addEventListener('click', function () { var h = S.orderHistory.filter(function (x) { return x.no === b.getAttribute('data-reorder-hist'); })[0]; var src = S.orders.filter(function (o) { return o.no === h.no; })[0]; var items = src ? src.items.map(function (it) { return { pn: it[0], d: it[1], q: it[2], p: it[3] }; }) : S.reorder.slice(0, Math.max(1, Math.min(h.items, S.reorder.length))).map(function (r) { return { pn: r.pn, d: r.d, q: r.q, p: r.p }; }); items.forEach(function (it) { var line = S.cart.filter(function (c) { return c.pn === it.pn; })[0]; if (line) line.q += it.q; else S.cart.push(it); }); save(); repaint(); toast('Order ' + h.no + ' added to your order.'); }); });
      var pb = $('c-place'); if (pb) pb.addEventListener('click', place);
    }
    function foot() { return S.cart.length ? '<button type="button" class="btn btn-primary" id="c-place">Place order · ' + money(cartTotal()) + '</button><a href="team.html" class="lnk">Ask Dan a question</a>' : '<span class="wo-note">Add parts above, then place the order.</span><a href="team.html" class="lnk">Ask Dan a question</a>'; }
    function place() {
      var ship = $('c-ship').value, u = $('c-unit').value, po = $('c-po').value;
      var no = String(48231 + S.orders.filter(function (o) { return +o.no > 48231; }).length + 1);
      S.orders.unshift({ no: no, placed: 'Today', unit: u, for: po ? 'PO ' + po : (u ? 'Requested from the portal' : 'Shop stock'), ship: ship, state: 'processing', eta: 'Thu, Oct 29', etaSub: 'Standard delivery', carrier: 'CTOS truck from Fredericksburg',
        items: S.cart.map(function (c) { return [c.pn, c.d, c.q, c.p]; }), stages: [['Placed', 'Just now'], ['Picked', ''], ['Shipped', ''], ['Delivered', 'Thu Oct 29']], stage: 0 });
      S.cart.forEach(function (c) { S.reorder.forEach(function (r) { if (r.pn === c.pn) r.last = 'Today'; }); });
      var total = cartTotal(); S.cart = []; save();
      addNotification({ title: 'Order ' + no + ' placed', text: money(total) + ' to ' + ship + '. Arrives Thursday.', href: 'parts.html#parts' });
      closeDrawer(); toast('Order ' + no + ' placed, ' + money(total) + '. Arrives Thursday.'); renderCartBadge(); renderPage();
    }
    openDrawer({ kind: 'New parts order', title: S.cart.length ? cartCount() + ' item' + (cartCount() === 1 ? '' : 's') + ' · ' + money(cartTotal()) : 'New parts order', meta: 'Search, pick a unit for parts that fit it, or reorder. Delivered by CTOS truck, usually in two business days.', body: body(), foot: foot(), after: function () { wire(); if ($('c-q') && !unit) $('c-q').focus(); } });
  }

  function flowOrder(o, row) {
    var total = orderTotal(o);
    var label = { processing: 'Processing', shipped: 'Shipped', back: 'Backordered', delivered: 'Delivered' }[o.state];
    openDrawer({
      kind: label, warn: o.state === 'back', title: 'Order ' + o.no, meta: (o.unit ? 'Unit #' + o.unit + ' · ' : '') + o.for,
      body: '<dl class="dr-facts"><dt>Arrives</dt><dd>' + esc(o.eta) + ', ' + esc(o.etaSub).toLowerCase() + '</dd><dt>Ship to</dt><dd>' + esc(o.ship) + '</dd><dt>Carrier</dt><dd>' + esc(o.carrier) + '</dd></dl>' +
        '<ol class="stages" aria-label="Order progress">' + stagesHtml(o.stages, o.stage) + '</ol>' +
        '<div class="list li-list">' + o.items.map(function (it) { return '<div class="row fig li"><span>' + esc(it[1]) + '<small>' + esc(it[0]) + ' · ' + it[2] + ' at ' + money(it[3]) + '</small></span><b>' + money(it[2] * it[3]) + '</b></div>'; }).join('') + '<div class="row fig total"><span>Order total<small>Before tax</small></span><b>' + money(total) + '</b></div></div>',
      foot: '<button type="button" class="btn btn-ghost" id="o-reorder">Reorder these items</button><a href="team.html" class="lnk">Ask Dan a question</a>',
      row: row,
      after: function () { $('o-reorder').addEventListener('click', function () { o.items.forEach(function (it) { addToCart({ pn: it[0], d: it[1], q: it[2], p: it[3] }); }); closeDrawer(); }); }
    });
  }

  function flowTruck(t, row) {
    openDrawer({
      kind: t.stages[t.stage][0], title: t.spec, meta: t.detail,
      body: '<dl class="dr-facts"><dt>Order</dt><dd>' + t.no + ', placed ' + t.ordered + '</dd>' + (t.quote ? '<dt>Salesforce</dt><dd>' + t.quote + ' · ' + t.ql + '</dd>' : '') + '<dt>Expected</dt><dd>' + esc(t.eta) + '</dd><dt>Built at</dt><dd>' + esc(t.where) + '</dd><dt>Price</dt><dd>' + money(t.price) + '</dd></dl><ol class="stages" aria-label="Build progress">' + stagesHtml(t.stages, t.stage) + '</ol>',
      foot: '<a href="#" class="btn btn-ghost">Build sheet</a><button type="button" class="lnk" id="t-save-build">Save as preferred build</button><a href="team.html" class="lnk">Ask Sarah a question</a>', row: row,
      after: function () { $('t-save-build').addEventListener('click', function () { flowSaveBuild({ spec: t.spec, detail: t.detail, last: t.ordered + ' · order ' + t.no, lastPrice: t.price }); }); }
    });
  }

  function flowRental(r, action, row) {
    if (action === 'extend') {
      openDrawer({
        kind: 'Extend rental', title: r.unit, meta: r.spec + ' · due back ' + r.due,
        body: '<form class="form" id="ext-form"><label>Extend by<select id="e-days"><option value="7">7 days</option><option value="14">14 days</option><option value="30">30 days</option></select></label><p class="form-note">Same day rate, ' + money(r.rate) + '. Jordan will confirm availability.</p></form>',
        foot: '<button type="submit" form="ext-form" class="btn btn-primary">Request extension</button>', row: row,
        after: function () {
          $('ext-form').addEventListener('submit', function (e) {
            e.preventDefault(); var d = +$('e-days').value;
            r.due = r.due + ' + ' + d + ' days'; r.state = ''; r.extended = d; save();
            addNotification({ title: r.unit + ' extension requested', text: d + ' more days at ' + money(r.rate) + ' per day.', href: 'parts.html#rentals' });
            closeDrawer(); toast('Extension requested for ' + r.unit + ', ' + d + ' days.'); renderPage();
          });
        }
      });
    } else {
      openDrawer({
        kind: 'Schedule return', title: r.unit, meta: r.spec + ' · due back ' + r.due,
        body: '<form class="form" id="ret-form"><label>Return to<select id="r-loc"><option>CTOS Fredericksburg lot</option><option>CTOS Richmond lot</option><option>Pick up from our yard</option></select></label><label>Fuel<select><option>Return full</option><option>Bill me for fuel</option></select></label><p class="form-note">Returns are due by 5:00 PM. Charges stop at check-in.</p></form>',
        foot: '<button type="submit" form="ret-form" class="btn btn-primary">Confirm return</button>', row: row,
        after: function () {
          $('ret-form').addEventListener('submit', function (e) {
            e.preventDefault(); r.state = 'returning'; r.returnTo = $('r-loc').value; save();
            addNotification({ title: r.unit + ' return scheduled', text: r.due + ' at ' + $('r-loc').value + '.', href: 'parts.html#rentals' });
            closeDrawer(); toast('Return scheduled for ' + r.unit + '.'); renderPage();
          });
        }
      });
    }
  }

  function flowVehicleForm(v, row) {
    var editing = !!v; v = v || {};
    var opt = function (list, cur) { return list.map(function (x) { return '<option' + (x === cur ? ' selected' : '') + '>' + esc(x) + '</option>'; }).join(''); };
    var srcLabel = { ctos: 'Purchased from CTOS', other: 'Purchased elsewhere', lease: 'Leased' }, telLabel = { ctos: 'CTOS device, ship one to me', byo: 'Bring my own, connect later', none: 'None for now' };
    openDrawer({
      kind: editing ? 'Edit vehicle' : 'Add a vehicle', title: editing ? 'Unit #' + v.unit : 'New unit', meta: editing ? v.model : 'Any truck in your fleet, whether or not it came from CTOS',
      body: '<form class="form" id="veh-form">' +
        '<div class="form-2"><label>Unit number<input type="text" id="v-unit" required value="' + esc(v.unit || '') + '" placeholder="1131"' + (editing ? ' readonly' : '') + '></label><label>VIN<input type="text" id="v-vin" required minlength="11" value="' + esc(v.vin || '') + '" placeholder="17 characters"></label></div>' +
        '<div class="form-2"><label>Year<input type="text" id="v-year" required value="' + esc((v.model || '').split(' ')[0]) + '" placeholder="2024"></label><label>Make and model<input type="text" id="v-model" required value="' + esc((v.model || '').split(' ').slice(1).join(' ')) + '" placeholder="Kenworth T680"></label></div>' +
        '<label>Where it came from<select id="v-source"><option value=""' + (srcLabel[v.source] ? '' : ' selected') + '>Select</option>' + opt(['Purchased from CTOS', 'Purchased elsewhere', 'Leased'], srcLabel[v.source] || '') + '</select></label>' +
        '<label>Telematics<select id="v-tel">' + opt(['CTOS device, ship one to me', 'Bring my own, connect later', 'None for now'], telLabel[v.telematics] || 'CTOS device, ship one to me') + '</select></label>' +
        '<div class="form-2"><label>Odometer<input type="text" id="v-odo" inputmode="numeric" value="' + (v.odo || '') + '" placeholder="miles"></label><label>Driver<select id="v-driver"><option value="">Unassigned</option>' + opt(S.drivers, v.driver) + '</select></label></div>' +
        '<h4 class="dr-h">Body and equipment</h4><div class="form-2"><label>Upfitter and body<input type="text" id="v-body" value="' + esc((v.components || []).filter(function (c) { return c.role === 'body'; }).map(function (c) { return c.make + ' ' + c.model; })[0] || '') + '" placeholder="Reading Classic II SL, 11 ft"></label><label>Body serial<input type="text" id="v-body-sn" value="' + esc((v.components || []).filter(function (c) { return c.role === 'body'; }).map(function (c) { return c.serial; })[0] || '') + '"></label></div>' +
        '<div class="form-2"><label>Equipment<select id="v-eq"><option value="">None</option><option value="aerial">Aerial device</option><option value="crane">Crane</option><option value="derrick">Digger derrick</option><option value="equipment">Other equipment</option></select></label><label>Make and model<input type="text" id="v-eq-model" placeholder="Altec AA55"></label></div><div class="form-2"><label>Equipment serial<input type="text" id="v-eq-sn"></label><label>Hours<input type="text" id="v-eq-hours" inputmode="numeric"></label></div>' +
        '<label>PM interval<select id="v-pm"><option>25,000 mi</option><option>20,000 mi</option><option>30,000 mi</option><option>15,000 mi</option></select></label>' +
        '<p class="form-note">' + (editing ? 'Changes apply across the portal.' : 'Service history from other shops can be uploaded from the unit page once it is added.') + '</p></form>',
      foot: '<button type="submit" form="veh-form" class="btn btn-primary">' + (editing ? 'Save changes' : 'Add vehicle') + '</button>' + (editing ? '<button type="button" class="lnk" id="v-retire">Retire this unit</button>' : ''),
      row: row,
      after: function () {
        $('veh-form').addEventListener('submit', function (e) {
          e.preventDefault();
          var unit = $('v-unit').value.replace(/\D/g, '');
          var src = { 'Purchased from CTOS': 'ctos', 'Purchased elsewhere': 'other', 'Leased': 'lease' }[$('v-source').value] || '';
          var tel = { 'CTOS device, ship one to me': 'ctos', 'Bring my own, connect later': 'byo', 'None for now': 'none' }[$('v-tel').value] || 'ctos';
          var odo = +(String($('v-odo').value).replace(/\D/g, '')) || 0, pm = +($('v-pm').value.replace(/\D/g, '')) || 25000;
          if (!editing && (!unit || vehicle(unit))) { toast(unit ? 'Unit #' + unit + ' already exists.' : 'Give the unit a number.'); return; }
          var rec = editing ? v : { unit: unit, state: 'off', status: tel === 'none' ? 'No telematics' : 'Awaiting device', loc: 'Not reporting yet', fuel: 0, mpg: 0, nextService: 'Not scheduled', lat: 38.42, lng: -77.41, dtc: '', isNew: true };
          rec.vin = $('v-vin').value.toUpperCase(); rec.model = $('v-year').value + ' ' + $('v-model').value; rec.source = src; rec.telematics = tel; rec.driver = $('v-driver').value; rec.odo = odo; rec.nextPm = Math.ceil((odo + 1) / pm) * pm;
          if (!editing) {
            rec.components = [{ id: 'c1', role: 'chassis', name: 'Chassis', make: $('v-model').value.split(' ')[0], model: $('v-model').value.split(' ').slice(1).join(' '), serial: rec.vin, year: +$('v-year').value || 0, spec: 'Spec sheet pending', warranty: 'Unknown' }];
            if ($('v-body').value) rec.components.push({ id: 'c2', role: 'body', name: 'Body', make: $('v-body').value.split(' ')[0], model: $('v-body').value.split(' ').slice(1).join(' '), serial: $('v-body-sn').value || 'Not recorded', year: +$('v-year').value || 0, spec: 'Spec sheet pending', warranty: 'Unknown' });
            if ($('v-eq').value) rec.components.push({ id: 'c3', role: $('v-eq').value, name: ROLE_NAME[$('v-eq').value], make: $('v-eq-model').value.split(' ')[0], model: $('v-eq-model').value.split(' ').slice(1).join(' '), serial: $('v-eq-sn').value || 'Not recorded', year: +$('v-year').value || 0, hours: +($('v-eq-hours').value.replace(/\D/g, '')) || 0, spec: 'Spec sheet pending', warranty: 'Unknown' });
            rec.kind = { aerial: 'Bucket truck', crane: 'Crane service truck', derrick: 'Digger derrick' }[$('v-eq').value] || ($('v-body').value ? 'Service truck' : 'Chassis only');
            rec.chassis = rec.model; rec.body = ($('v-body').value || '') + ($('v-eq-model').value ? ' + ' + $('v-eq-model').value : ''); rec.hours = +($('v-eq-hours').value.replace(/\D/g, '')) || 0;
            S.vehicles.push(rec); S.fleetCounts.total += 1; S.fleetCounts.shop += 1;
          }
          save();
          addNotification({ title: editing ? 'Unit #' + rec.unit + ' updated' : 'Unit #' + rec.unit + ' added to your fleet', text: rec.model + (tel === 'ctos' && !editing ? '. A telematics device ships this week.' : '.'), href: 'fleet-manage.html' });
          closeDrawer(); toast(editing ? 'Unit #' + rec.unit + ' saved.' : 'Unit #' + rec.unit + ' added.'); renderPage();
        });
        var r = $('v-retire'); if (r) r.addEventListener('click', function () {
          confirmInline($('dr-foot'), 'Retire Unit #' + v.unit + '? It leaves the fleet list and stops reporting. History stays.', 'Retire unit', function () {
            S.vehicles = S.vehicles.filter(function (x) { return x.unit !== v.unit; }); S.fleetCounts.total -= 1; save();
            closeDrawer(); toast('Unit #' + v.unit + ' retired.'); renderPage();
          });
        });
      }
    });
  }

  function flowPay(invs, row) {
    var total = sum(invs.map(function (i) { return i.amount; }));
    openDrawer({
      kind: 'Pay invoice' + (invs.length > 1 ? 's' : ''), title: money(total), meta: invs.length > 1 ? invs.length + ' invoices' : invs[0].no + ' · Unit #' + invs[0].unit + ' · ' + invs[0].desc,
      body: '<div class="list li-list">' + invs.map(function (i) { return '<div class="row fig li"><span>' + i.no + '<small>Unit #' + i.unit + ' · ' + esc(i.desc) + ' · due ' + i.due + '</small></span><b>' + money(i.amount) + '</b></div>'; }).join('') + '<div class="row fig total"><span>Payment total</span><b>' + money(total) + '</b></div></div>' +
        '<form class="form" id="pay-form"><fieldset><legend>Pay with</legend>' + S.paymentMethods.map(function (m, i) { return '<label class="radio"><input type="radio" name="pm" value="' + m.id + '"' + (i === 0 ? ' checked' : '') + '><span>' + esc(m.label) + '<small>' + esc(m.sub) + '</small></span></label>'; }).join('') + '</fieldset><p class="form-note">A receipt goes to ar@shenandoahfreight.com and appears on the invoice.</p></form>',
      foot: '<button type="submit" form="pay-form" class="btn btn-primary">Pay ' + money(total) + '</button><a href="team.html" class="lnk">Question about an invoice</a>', row: row,
      after: function () {
        $('pay-form').addEventListener('submit', function (e) {
          e.preventDefault();
          invs.forEach(function (i) { i.status = 'paid'; i.paidOn = 'Today'; });
          save(); addNotification({ title: 'Payment of ' + money(total) + ' received', text: invs.map(function (i) { return i.no; }).join(', ') + '. Thank you.', href: 'billing.html' });
          closeDrawer(); toast('Paid ' + money(total) + '. Receipt sent.'); renderPage();
        });
      }
    });
  }

  function flowTicket() {
    openDrawer({
      kind: 'New support request', title: 'How can we help?', meta: 'Replies within one business hour, 6:00 AM to 10:00 PM',
      body: '<form class="form" id="tk-form"><label>Subject<input type="text" id="t-sub" required placeholder="What is going on"></label><label>Related to<select id="t-rel"><option>Portal or account</option><option>Telematics</option><option>A vehicle</option><option>An order</option><option>An invoice</option></select></label><label>Details<textarea id="t-body" rows="4" required placeholder="Unit numbers, order numbers, what you expected"></textarea></label></form>',
      foot: '<button type="submit" form="tk-form" class="btn btn-primary">Send request</button><a href="tel:+18005550199" class="lnk">Call support</a>',
      after: function () {
        $('tk-form').addEventListener('submit', function (e) {
          e.preventDefault();
          var id = 'TK-' + (5120 + S.tickets.length);
          S.tickets.unshift({ id: id, opened: 'Today', subject: $('t-sub').value, state: 'open', owner: 'Support', last: 'Just now · Received. We will reply within one business hour.' });
          save(); addNotification({ title: id + ' opened', text: $('t-sub').value, href: 'support.html' });
          closeDrawer(); toast(id + ' opened. We will reply within the hour.'); renderPage();
        });
      }
    });
  }

  /* ---------- shared renderers ---------- */
  function attentionRows(items, opts) {
    if (!items.length) return emptyHtml(opts && opts.empty || 'Nothing needs you right now.');
    return items.map(function (a) {
      return '<button type="button" class="row attn" data-attn="' + a.id + '"><div><strong>Unit #' + a.unit + ' · ' + esc(a.title) + '<span class="priority ' + a.level + '">' + esc(a.label) + '</span></strong><p>' + esc(a.text) + '</p><span class="act-line">' + esc(a.action) + '</span></div>' + chev + '</button>';
    }).join('');
  }
  function wireAttention(root) {
    qsa('[data-attn]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        var a = S.attention.filter(function (x) { return x.id === b.getAttribute('data-attn'); })[0]; if (!a) return;
        if (a.flow === 'schedule') flowSchedule({ unit: a.unitFor, job: a.job }, b);
        else if (a.flow === 'message') flowMessage(a.unitFor, b);
        else flowVehicle(a.unitFor, b);
      });
    });
  }
  function apptRows(list, withAction) {
    var sorted = list.slice().sort(function (a, b) { return a.day - b.day; });
    return sorted.map(function (a) {
      var v = vehicle(a.unit) || {};
      return '<div class="row ' + (withAction ? 'svc3' : 'svc') + '"><div><div class="unit">Unit #' + a.unit + '<span class="sub"> · ' + esc(a.job) + '</span></div><div class="job">' + esc(v.model || '') + ' · ' + esc(a.loc) + '</div></div><div class="when"><strong>' + esc(a.dateLabel) + '</strong><span>' + esc(a.time) + '</span></div>' + (withAction ? '<span class="act"><a href="team.html" class="lnk">Reschedule</a></span>' : '') + '</div>';
    }).join('');
  }
  function statusHtml(state, label) { return '<span class="status ' + state + '">' + esc(label) + '</span>'; }

  /* ---------- pages ---------- */
  el_mapInit = false; el_tabsInit = false;

  renderers.home = function () {
    renderEmployeeHome();
    var ob = $('home-onboard');
    if (isNewCustomer()) {
      ob.hidden = false; ob.innerHTML = onboardingHtml(); wireOnboarding(ob);
      qsa('[data-home-std]').forEach(function (n) { n.hidden = true; });
      $('home-greet').textContent = 'Welcome, ' + personaInfo().name.split(' ')[0] + '.';
      $('home-sub').textContent = 'Your account is open. Add a truck and the rest of this page fills in.';
      $('home-date').innerHTML = '<strong>Tuesday, October 27</strong>' + esc(S.user.org) + ' · ' + S.vehicles.length + ' vehicles';
      return;
    }
    if (ob) ob.hidden = true;
    if (isEmployee()) { $('home-greet').textContent = S.user.org; $('home-sub').textContent = 'Mike Brown\u2019s account, as he sees it, plus your internal panel.'; }
    var inshop = S.workorders.filter(function (w) { return w.state !== 'done'; });
    var due = S.vehicles.filter(function (v) { return v.nextPm - v.odo <= 1000; }).length;
    var alerts = [];
    if (due) alerts.push({ level: 'high', title: due + ' vehicle' + (due > 1 ? 's are' : ' is') + ' due for maintenance', text: 'Schedule service to avoid downtime.', href: 'service.html', icon: 'wrench' });
    if (inshop.length) alerts.push({ level: '', title: inshop.length + ' unit' + (inshop.length > 1 ? 's' : '') + ' in the shop', text: inshop.map(function (w) { return 'Unit #' + w.unit; }).join(', ') + '. Priya and Luis have the work orders.', href: 'service.html', icon: 'wrench' });
    alerts.push({ level: 'med', title: '1 open recall notice', text: 'Unit #1058 · Steering gear, manufacturer recall.', href: 'service.html', icon: 'doc' });
    alerts.push({ level: '', title: 'Fuel spend up 12% this month', text: 'See details and fuel-saving recommendations.', href: 'reports.html#fuel', icon: 'trend' });
    var icons = { wrench: '<svg class="ico" viewBox="0 0 24 24"><path d="M14.5 5.5a4 4 0 0 0 5 5L10 20l-3-3Z"/><path d="M9 14l-3.5 3.5"/></svg>', doc: '<svg class="ico" viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/><path d="M9 12h6M9 16h4"/></svg>', trend: '<svg class="ico" viewBox="0 0 24 24"><path d="M4 17 9.5 11l4 4L20 7"/><path d="M15 7h5v5"/></svg>' };
    var kinds = { high: 'Action needed', med: 'Review', '': 'Insight' };
    $('home-alerts').innerHTML = alerts.map(function (a) { return '<a href="' + a.href + '" class="row alert">' + icons[a.icon] + '<div><strong>' + esc(a.title) + '<span class="priority ' + a.level + '">' + kinds[a.level] + '</span></strong><span>' + esc(a.text) + '</span></div>' + chev + '</a>'; }).join('');
    $('home-appts').innerHTML = S.appointments.length ? apptRows(S.appointments.slice(0, 4), false) : emptyHtml('No service booked. Everything is inside its interval.');
    qsa('[data-stat-due]').forEach(function (n) { n.textContent = due; });
    qsa('[data-stat-shop]').forEach(function (n) { n.textContent = S.fleetCounts.shop; });
    qsa('[data-flow-schedule]').forEach(function (b) { once(b, 'click', function (e) { e.preventDefault(); flowSchedule({}); }); });
  };

  renderers.fleet = function () {
    var attn = $('fleet-attn'); attn.innerHTML = attentionRows(S.attention); wireAttention(attn);
    qsa('[data-stat-attn]').forEach(function (n) { n.textContent = S.attention.filter(function (a) { return a.level === 'high' || a.level === 'med'; }).length; });
    var filter = 'all', fleetTab = 'own';
    function table() {
      var src = fleetTab === 'rental' ? S.rentals.filter(function (r) { return r.state !== 'returned'; }) : S.vehicles;
      var rows = src.filter(function (v) { var st = v.state === 'due' || v.state === 'returning' || v.state === '' ? (v.status && /Moving|On site/.test(v.status) ? 'moving' : (/Idling/.test(v.status || '') ? 'idle' : 'off')) : v.state; return filter === 'all' || st === filter || (filter === 'shop' && (st === 'shop' || st === 'off')); });
      $('fleet-rows').innerHTML = rows.length ? rows.map(function (v) {
        var isR = fleetTab === 'rental';
        var st = isR ? (/Moving|On site/.test(v.status) ? 'moving' : (/Idling/.test(v.status) ? 'idle' : 'off')) : v.state;
        var id = isR ? v.unit : 'u' + v.unit;
        var name = isR ? v.unit : 'Unit #' + v.unit;
        var sub = isR ? (v.kind || '') + ' · ' + v.spec : (v.kind || '') + ' · ' + v.model;
        var due = isR ? '<strong>Due back ' + esc(v.due) + '</strong><span>' + v.days + ' days on rent · ' + money(v.rate) + '/day</span>' : dueText(v);
        return '<tr id="' + id + '"><td class="unit-cell">' + (isR ? '<strong>' + esc(name) + '</strong>' : '<button type="button" class="row-btn" data-unit="' + v.unit + '" aria-haspopup="dialog">' + name + '</button>') + '<span>' + esc(sub) + '</span></td><td>' + statusHtml(st, v.status) + (v.dtc ? ' <span class="dtc">' + v.dtc + '</span>' : '') + '</td><td>' + esc(v.loc) + (v.driver ? '<span class="cell-sub">' + esc(v.driver) + '</span>' : '') + '</td><td class="eta">' + due + '</td><td class="act-col">' + (isR ? (v.state === 'due' ? '<a href="parts.html#rentals" class="lnk">Schedule return</a>' : '<a href="parts.html#rentals" class="lnk">Extend</a>') : '<button type="button" class="lnk" data-flow-schedule data-unit="' + v.unit + '" data-job="' + esc((v.nextWhat || 'PM service').replace(/,.*$/, '')) + '">Schedule</button>') + '</td></tr>';
      }).join('') : '<tr><td colspan="5">' + emptyHtml(fleetTab === 'rental' ? 'No rental units on your account.' : 'No vehicles match this filter.') + '</td></tr>';
      $('fleet-count').textContent = fleetTab === 'rental' ? rows.length + ' rental units from CTOS' : 'Showing ' + rows.length + ' of ' + S.fleetCounts.total + ' vehicles';
      qsa('[data-unit]', $('fleet-rows')).forEach(function (b) { b.addEventListener('click', function () { flowVehicle(b.getAttribute('data-unit'), b.closest('tr')); }); });
      qsa('[data-flow-schedule]', $('fleet-rows')).forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); flowSchedule({ unit: b.getAttribute('data-unit'), job: b.getAttribute('data-job') }, b.closest('tr')); }); });
    }
    qsa('.filters a[data-filter]').forEach(function (a) { once(a, 'click', function (e) { e.preventDefault(); filter = a.getAttribute('data-filter'); qsa('.filters a[data-filter]').forEach(function (x) { x.classList.toggle('on', x === a); }); table(); }); });
    qsa('[data-fleet-tab]').forEach(function (t) { once(t, 'click', function (e) { e.preventDefault(); fleetTab = t.getAttribute('data-fleet-tab'); qsa('[data-fleet-tab]').forEach(function (x) { x.classList.toggle('on', x === t); x.setAttribute('aria-selected', x === t ? 'true' : 'false'); }); table(); }); });
    var rt = $('fleet-tab-rental'); if (rt) rt.querySelector('b').textContent = S.rentals.filter(function (r) { return r.state !== 'returned'; }).length;
    var ot = $('fleet-tab-own'); if (ot) ot.querySelector('b').textContent = S.fleetCounts.total;
    table();
    var hash = location.hash.replace('#', '');
    if (/^u\d+$/.test(hash)) { var b = document.querySelector('[data-unit="' + hash.slice(1) + '"]'); if (b) setTimeout(function () { flowVehicle(hash.slice(1), b.closest('tr')); }, 300); }
    if ($('fleet-sites')) { var js = S.sites.filter(function (s) { return s.type === 'Job site' || s.type === 'Yard'; }); $('fleet-sites').innerHTML = js.map(function (s) { var n = unitsAt(s).length; return '<a href="map.html#site-' + s.id + '" class="row fig"><span>' + esc(s.name) + '<small>' + esc(s.project || s.type) + '</small></span><b>' + n + '</b></a>'; }).join(''); }
    $('fleet-events').innerHTML = S.events.concat(S.siteEvents || []).slice(0, 8).map(function (e) { return '<div class="row ev ' + e.kind + '"><time>' + esc(e.t) + '</time><div><strong>Unit #' + e.unit + '</strong> <span>' + esc(e.text) + '</span></div></div>'; }).join('');
    // upcoming service panel
    if ($('fleet-upcoming')) { var up = S.vehicles.filter(function (v) { return v.nextIn != null && !/in shop/i.test(v.nextWhat || ''); }).sort(function (x, y) { return x.nextIn - y.nextIn; }).slice(0, 6); $('fleet-upcoming').innerHTML = up.map(function (v) { return '<div class="row svc3"><div><div class="unit"><a href="unit.html?u=' + v.unit + '" class="row-btn">Unit #' + v.unit + '</a><span class="sub"> · ' + esc((v.nextWhat || '').replace(/, booked.*$/, '')) + '</span></div><div class="job">' + esc(v.kind || '') + ' · ' + esc(v.loc) + '</div></div><div class="when">' + dueText(v) + '</div><span class="act"><button type="button" class="lnk" data-flow-schedule data-unit="' + v.unit + '">' + (/booked/.test(v.nextWhat || '') ? 'Change' : 'Book') + '</button></span></div>'; }).join(''); }
    qsa('[data-flow-schedule]').forEach(function (b) { once(b, 'click', function (e) { e.preventDefault(); flowSchedule({ unit: b.getAttribute('data-unit') || '', job: b.getAttribute('data-job') || '' }); }); });
    qsa('[data-flow-import]').forEach(function (b) { once(b, 'click', function (e) { e.preventDefault(); flowImport(); }); });
    if (!el_mapInit) { el_mapInit = true; initMap(); }
  };

  renderers.map = function () {
    var filter = 'all';
    function list() {
      var rows = S.vehicles.filter(function (v) { return filter === 'all' || v.state === filter || (filter === 'shop' && (v.state === 'shop' || v.state === 'off')); });
      $('map-list').innerHTML = rows.length ? rows.map(function (v) {
        return '<button type="button" class="row mrow" data-pan="' + v.unit + '"><span class="sdot ' + v.state + '"></span><div><div class="unit">Unit #' + v.unit + '<span class="sub"> · ' + esc(v.model) + '</span></div><div class="job">' + (siteOf(v) ? 'At ' + esc(siteOf(v).name) : esc(v.loc)) + (v.driver ? ' · ' + esc(v.driver) : '') + '</div></div><div class="when">' + statusHtml(v.state, v.status) + '<span>' + (v.dtc ? '<span class="dtc">' + v.dtc + '</span>' : v.fuel + '% fuel') + '</span></div></button>';
      }).join('') : emptyHtml('No vehicles match this filter.');
      $('map-count').textContent = rows.length + ' of ' + S.fleetCounts.total + ' vehicles';
      qsa('[data-pan]').forEach(function (b) {
        b.addEventListener('click', function () { var v = vehicle(b.getAttribute('data-pan')); mapApi.pan(v.lat, v.lng); qsa('.mrow').forEach(function (x) { x.classList.toggle('selected', x === b); }); });
        b.addEventListener('dblclick', function () { flowVehicle(b.getAttribute('data-pan'), b); });
        b.addEventListener('mouseenter', function () { mapApi.hot(b.getAttribute('data-pan'), true); });
        b.addEventListener('mouseleave', function () { mapApi.hot(b.getAttribute('data-pan'), false); });
      });
    }
    qsa('.filters a').forEach(function (a) { once(a, 'click', function (e) { e.preventDefault(); filter = a.getAttribute('data-filter'); qsa('.filters a').forEach(function (x) { x.classList.toggle('on', x === a); }); list(); }); });
    list();
    once($('map-open-unit'), 'click', function () { var sel = document.querySelector('.mrow.selected'); if (!sel) { toast('Select a unit or a site in the list first.'); return; } if (sel.hasAttribute('data-site')) flowSite(S.sites.filter(function (x) { return x.id === sel.getAttribute('data-site'); })[0], sel); else flowVehicle(sel.getAttribute('data-pan'), sel); });
    renderSitesList();
    qsa('[data-side]').forEach(function (t) { once(t, 'click', function (e) { e.preventDefault(); var which = t.getAttribute('data-side'); qsa('[data-side]').forEach(function (x) { x.classList.toggle('on', x === t); x.setAttribute('aria-selected', x === t ? 'true' : 'false'); }); $('side-units').hidden = which !== 'units'; $('side-sites').hidden = which !== 'sites'; }); });
    qsa('[data-flow-site]').forEach(function (b) { once(b, 'click', function (e) { e.preventDefault(); flowSiteForm(null); }); });
    var sh = location.hash.match(/^#site-(.+)$/); if (sh) { var ss = S.sites.filter(function (x) { return x.id === sh[1]; })[0]; if (ss) { qsa('[data-side="sites"]')[0] && qsa('[data-side="sites"]')[0].click(); setTimeout(function () { mapApi.pan(ss.lat, ss.lng, 13); flowSite(ss); }, 700); } }
    if (!el_mapInit) { el_mapInit = true; initMap(); }
    var hash = location.hash.replace('#', ''); if (/^u\d+$/.test(hash)) { var b = document.querySelector('[data-pan="' + hash.slice(1) + '"]'); if (b) setTimeout(function () { b.click(); }, 600); }
  };

  renderers.manage = function () {
    var src = { ctos: 'CTOS', other: 'Elsewhere', lease: 'Leased' }, tel = { ctos: 'CTOS device', byo: 'Own device', none: 'None' };
    var vs = S.vehicles.slice().sort(function (a, b) { return a.unit.localeCompare(b.unit); });
    var other = vs.filter(function (v) { return v.source !== 'ctos'; }).length, noTel = vs.filter(function (v) { return v.telematics === 'none' || v.isNew; }).length;
    $('mg-finding').textContent = vs.length + ' units listed of ' + S.fleetCounts.total + ' in the fleet. ' + other + ' were bought or leased elsewhere and are serviced here all the same.' + (noTel ? ' ' + noTel + ' ' + (noTel === 1 ? 'is' : 'are') + ' not reporting telematics yet.' : '');
    $('mg-rows').innerHTML = vs.map(function (v) {
      return '<tr' + (v.isNew ? ' class="new"' : '') + '><td class="id"><a href="unit.html?u=' + v.unit + '" class="row-btn">Unit #' + v.unit + '</a></td><td class="for"><span class="trunc"><span class="ink">' + esc(v.kind || '') + '</span> · ' + esc(v.model) + '</span></td><td class="mono">' + esc(v.vin || '') + '</td><td>' + (src[v.source] || 'Elsewhere') + '</td><td>' + statusHtml(v.telematics === 'none' ? 'off' : (v.isNew ? 'processing' : 'shipped'), (tel[v.telematics] || 'None') + (v.isNew && v.telematics === 'ctos' ? ', shipping' : '')) + '</td><td>' + (v.driver ? esc(v.driver) : '<span class="muted">Unassigned</span>') + '</td><td class="num">' + num(v.odo) + '</td><td class="act-col"><button type="button" class="lnk" data-edit="' + v.unit + '">Edit</button></td></tr>';
    }).join('');
    qsa('[data-edit]').forEach(function (b) { b.addEventListener('click', function () { flowVehicleForm(vehicle(b.getAttribute('data-edit')), b.closest('tr')); }); });
    $('mg-foot').textContent = vs.length + ' units · ' + other + ' from elsewhere · ' + noTel + ' without telematics';
    qsa('[data-flow-add]').forEach(function (b) { once(b, 'click', function (e) { e.preventDefault(); flowVehicleForm(null); }); });
    $('mg-sources').innerHTML = [['ctos', 'Purchased from CTOS'], ['other', 'Purchased elsewhere'], ['lease', 'Leased']].map(function (p) { var n = vs.filter(function (v) { return v.source === p[0]; }).length; return '<div class="row fig"><span>' + p[1] + '</span><b>' + n + '</b></div>'; }).join('');
    var ex = expiringDocs(30);
    $('mg-docs').innerHTML = ex.length ? ex.map(function (x) { return '<div class="row fig"><span>Unit #' + x.d.unit + ' · ' + esc(x.d.kind) + '<small>' + esc(x.d.file) + '</small></span><b class="' + (x.days < 14 ? 'warn' : '') + '">' + (x.days < 0 ? 'Expired' : x.days + ' days') + '</b></div>'; }).join('') : emptyHtml('Nothing expires in the next 30 days.');
    $('mg-ins').textContent = S.fleetInsurance.carrier + ' · ' + S.fleetInsurance.policy + ' · expires ' + S.fleetInsurance.expires;
    qsa('[data-flow-import]').forEach(function (b) { once(b, 'click', function (e) { e.preventDefault(); flowImport(); }); });
    $('mg-drivers').innerHTML = S.driverDetail.length ? S.driverDetail.map(function (d, i) { var v = S.vehicles.filter(function (x) { return x.driver === d.name; })[0]; return '<div class="row fig"><span>' + esc(d.full) + '<small>' + (v ? 'Unit #' + v.unit : 'Unassigned') + (d.tablet ? ' · tablet' : '') + (d.cdl ? ' · CDL ' + esc(d.cdl) : '') + '</small></span><button type="button" class="lnk" data-driver="' + i + '">Edit</button></div>'; }).join('') : emptyHtml('No drivers yet.');
    qsa('[data-driver]').forEach(function (b) { b.addEventListener('click', function () { flowDriver(S.driverDetail[+b.getAttribute('data-driver')]); }); });
    qsa('[data-flow-driver]').forEach(function (b) { once(b, 'click', function (e) { e.preventDefault(); flowDriver(null); }); });
    if ($('mg-comp')) { var cs = vs.map(function (v) { return S.compliance[v.unit]; }).filter(Boolean); var liens = cs.filter(function (c) { return /lien/i.test(c.title); }).length, noMso = cs.filter(function (c) { return /not on file/i.test(c.mso); }).length, exempt = cs.filter(function (c) { return c.fet === 'Exempt'; }).length, fetMissing = cs.filter(function (c) { return !c.fetCert; }).length;
      $('mg-comp').innerHTML = '<div class="row fig"><span>Titles clear<small>' + liens + ' with a lender lien</small></span><b>' + (cs.length - liens) + '</b></div><div class="row fig"><span>MSO on file<small>' + noMso + ' bought used, not on file</small></span><b>' + (cs.length - noMso) + '</b></div><div class="row fig"><span>FET exempt<small>' + fetMissing + ' without a certificate on file</small></span><b>' + exempt + '</b></div>'; }
    $('mg-tel').innerHTML = [['ctos', 'CTOS device'], ['byo', 'Own device'], ['none', 'None']].map(function (p) { var n = vs.filter(function (v) { return v.telematics === p[0]; }).length; return '<div class="row fig"><span>' + p[1] + '</span><b>' + n + '</b></div>'; }).join('');
  };

  renderers.service = function () {
    var waiting = [];
    var inwork = S.workorders.filter(function (w) { return w.state !== 'done'; });
    var wt = 0;
    var nextUp = S.vehicles.filter(function (v) { return v.nextIn != null && v.nextIn >= 0 && !/in shop/i.test(v.nextWhat || ''); }).sort(function (x, y) { return x.nextIn - y.nextIn; });
    var overdue = S.vehicles.filter(function (v) { return v.nextIn != null && v.nextIn < 0; });
    $('svc-finding').innerHTML = inwork.length || nextUp.length ? inwork.length + ' unit' + (inwork.length === 1 ? ' is' : 's are') + ' in the shop' + (overdue.length ? ', <a href="#" data-unit-link="' + overdue[0].unit + '">Unit #' + overdue[0].unit + '</a> is overdue for its ' + esc((overdue[0].nextWhat || 'service').replace(/,.*$/, '').toLowerCase()) : '') + (nextUp.length ? ', and the next service due is <a href="#" data-unit-link="' + nextUp[0].unit + '">Unit #' + nextUp[0].unit + '</a> ' + (nextUp[0].nextIn === 0 ? 'today' : 'in ' + nextUp[0].nextIn + ' days') : '') + '.' + (S.unscheduled.length ? ' The diagnostic for <a href="#" data-unit-link="' + S.unscheduled[0].unit + '">Unit #' + S.unscheduled[0].unit + '</a> still needs a time.' : '') : false ? waiting.length + ' estimate' + (waiting.length > 1 ? 's' : '') + ' totaling ' + money(wt) + ' ' + (waiting.length > 1 ? 'are' : 'is') + ' waiting on your approval, the largest for <a href="#" data-unit-link="' + waiting[0].unit + '">Unit #' + waiting[0].unit + '</a>.' + (S.unscheduled.length ? ' The diagnostic for <a href="#" data-unit-link="' + S.unscheduled[0].unit + '">Unit #' + S.unscheduled[0].unit + '</a> still needs a time.' : '') : 'Nothing is waiting on you. ' + inwork.length + ' job' + (inwork.length === 1 ? ' is' : 's are') + ' in work and ' + S.appointments.length + ' appointments are booked.';
    function woRow(w) { return '<button type="button" class="row wo-row" data-wo="' + w.id + '" aria-haspopup="dialog"><div><div class="unit">Unit #' + w.unit + '<span class="sub"> · ' + esc((vehicle(w.unit) || {}).model || '') + '</span></div><div class="job">' + esc(w.where) + ' · ' + esc(w.stages[w.stage][0]) + (w.state === 'waiting' ? ' · estimate ' + money(woTotal(w)) : '') + '</div></div><div class="when"><strong>' + esc(w.stages[w.stage][1] || w.stages[w.stage][0]) + '</strong><span>' + (w.stages[w.stage + 1] ? 'Next: ' + esc(w.stages[w.stage + 1][0]) : 'Ready') + '</span></div><span class="act">Details</span></button>'; }
    $('svc-inwork').innerHTML = inwork.length ? inwork.map(woRow).join('') : emptyHtml('Nothing in the shop right now.');
    var allLink = document.querySelector('[data-flow-all-wo]'); if (allLink) once(allLink, 'click', function (e) { e.preventDefault(); flowAllWorkorders(); });
    qsa('[data-wo]').forEach(function (b) { b.addEventListener('click', function () { var w = S.workorders.filter(function (x) { return x.id === b.getAttribute('data-wo'); })[0]; flowWorkorder(w, b); }); });
    // week strip
    $('svc-week').innerHTML = S.week.map(function (d) {
      var items = (S.inShopDays[d[1]] || []).map(function (u) { return '<div class="wk-item shop">Unit #' + u + ' · In shop</div>'; });
      S.appointments.filter(function (a) { return a.day === d[1]; }).forEach(function (a) { items.push('<div class="wk-item"><b>' + esc(a.time) + '</b> Unit #' + a.unit + ' · ' + esc(a.job) + '</div>'); });
      return '<div class="wk-col' + (d[1] === 27 ? ' today' : '') + '"><div class="wk-day">' + d[0] + ' <b>' + (d[1] > 31 ? d[1] - 31 : d[1]) + '</b></div>' + (items.join('') || '<div class="wk-none">Nothing booked</div>') + '</div>';
    }).join('');
    $('svc-appts').innerHTML = apptRows(S.appointments, true) + S.unscheduled.map(function (u) {
      return '<div class="row svc3 needs"><div><div class="unit">Unit #' + u.unit + '<span class="sub"> · ' + esc(u.job) + '</span></div><div class="job">' + esc((vehicle(u.unit) || {}).model || '') + ' · Not yet scheduled</div></div><div class="when"><strong class="priority high">Needs a time</strong><span>' + esc(u.note) + '</span></div><span class="act"><button type="button" class="lnk" data-flow-schedule data-unit="' + u.unit + '" data-job="' + esc(u.job) + '">Schedule</button></span></div>';
    }).join('');
    // coming due
    var maint = S.vehicles.slice().sort(function (a, b) { return (a.nextPm - a.odo) - (b.nextPm - b.odo); }).slice(0, 6);
    $('svc-maint').innerHTML = maint.map(function (v) {
      var left = v.nextPm - v.odo, pct = Math.max(2, 100 - left / S.pmInterval * 100);
      var booked = S.appointments.filter(function (a) { return a.unit === v.unit; })[0];
      return '<div class="row maint' + (left <= 1000 ? ' due' : '') + '"><div><div class="unit">Unit #' + v.unit + '</div><div class="job">' + num(v.odo) + ' mi · next PM at ' + num(v.nextPm) + ' mi</div></div><div class="track"><i style="width:' + pct.toFixed(0) + '%"></i></div><div class="when">' + (booked ? bookedCell(booked) : '<strong>' + num(left) + ' mi left</strong><span>' + (v.state === 'shop' ? 'In shop now' : '<button type="button" class="lnk" data-flow-schedule data-unit="' + v.unit + '" data-job="PM service">Book it</button>') + '</span>') + '</div></div>';
    }).join('');
    var di = dueInspections(45);
    if ($('svc-insp')) $('svc-insp').innerHTML = di.length ? di.map(function (x) { return '<div class="row maint' + (x.days < 14 ? ' due' : '') + '"><div><div class="unit">Unit #' + x.i.unit + '<span class="sub"> · ' + esc(x.i.type) + '</span></div><div class="job">' + ROLE_NAME[x.i.comp] + ' · last ' + esc(x.i.done) + ' by ' + esc(x.i.by) + '</div></div><div class="track"><i style="width:' + Math.max(2, Math.min(100, 100 - x.days / 365 * 100)).toFixed(0) + '%"></i></div><div class="when">' + (function () { var ap = bookedFor(x.i.unit, new RegExp(x.i.type.split(' ')[0], 'i')) || bookedFor(x.i.unit, /inspection|dielectric/i); return ap ? bookedCell(ap) + '<span><button type="button" class="lnk" data-flow-schedule data-unit="' + x.i.unit + '" data-job="' + esc(x.i.type) + '">Change</button></span>' : '<strong>' + (x.days < 0 ? 'Overdue' : 'Due ' + esc(x.i.due)) + '</strong><span><button type="button" class="lnk" data-flow-schedule data-unit="' + x.i.unit + '" data-job="' + esc(x.i.type) + '">Book it</button></span>'; })() + '</div></div>'; }).join('') : emptyHtml('No inspections due in the next 45 days.');
    var oc = openCampaigns();
    if ($('svc-camp')) $('svc-camp').innerHTML = oc.length ? oc.map(function (x) { return '<div class="row insp"><div><strong>Unit #' + x.u.unit + ' · ' + esc(x.c.title) + '<span class="sub"> · ' + ROLE_NAME[x.c.scope] + '</span></strong><span>' + esc(x.c.severity) + ' ' + esc(x.c.ref) + ' · ' + esc(x.c.maker) + ' · ' + esc(x.c.remedy) + '</span></div><div class="when">' + (function () { var ap = bookedFor(x.u.unit, /campaign|recall|diagnostic/i); return ap ? bookedCell(ap) + '<span>Open until completed</span>' : '<strong class="warn">Open</strong><span><button type="button" class="lnk" data-flow-schedule data-unit="' + x.u.unit + '" data-job="Campaign work, ' + esc(x.c.ref) + '">Schedule</button></span>'; })() + '</div></div>'; }).join('') : emptyHtml('No open recalls or bulletins across the fleet.');
    var exd = expiringDocs(21);
    if ($('svc-docs')) $('svc-docs').innerHTML = exd.length ? exd.map(function (x) { return '<div class="row fig"><span>Unit #' + x.d.unit + ' · ' + esc(x.d.kind) + '<small>' + (x.days < 0 ? 'Expired ' : 'Expires ') + esc(x.d.expires) + '</small></span><b class="' + (x.days < 14 ? 'warn' : '') + '">' + (x.days < 0 ? 'Expired' : x.days + ' days') + '</b></div>'; }).join('') : emptyHtml('No documents expire in the next three weeks.');
    $('svc-hist').innerHTML = S.serviceHistory.map(function (h) { return '<tr><td>' + h.date + '</td><td class="unit-cell"><strong><a href="unit.html?u=' + h.unit + '" class="row-btn">Unit #' + h.unit + '</a></strong></td><td>' + (ROLE_NAME[h.comp] || '') + '</td><td>' + esc(h.work) + '</td><td>' + esc(h.loc) + '</td><td class="num">' + money(h.cost) + '</td><td><a href="billing.html" class="lnk">' + h.inv + '</a></td></tr>'; }).join('');
    $('svc-hist-foot').textContent = S.serviceHistory.length + ' completed in October · ' + money(sum(S.serviceHistory.map(function (h) { return h.cost; })));
    qsa('[data-flow-schedule]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); flowSchedule({ unit: b.getAttribute('data-unit') || '', job: b.getAttribute('data-job') || '' }, b.closest('.row')); }); });
    // Coming due tabs: counts, and the tab that needs attention most opens first
    if ($('due-n-insp')) {
      var dcounts = { insp: dueInspections(45).length, pm: S.vehicles.filter(function (v) { return v.nextPm - v.odo <= 10000 && v.state !== 'shop'; }).length, camp: openCampaigns().length, docs: expiringDocs(21).length };
      var durgent = { insp: dueInspections(45).some(function (x) { return x.days < 14; }), pm: S.vehicles.some(function (v) { return v.nextPm - v.odo <= 1000 && v.state !== 'shop'; }), camp: dcounts.camp > 0, docs: expiringDocs(21).some(function (x) { return x.days < 14; }) };
      var dfoots = { insp: 'Inspections due within 45 days: ANSI A92.2, ANSI A10.31, ASME B30.5 and dielectric', pm: 'PM every ' + num(S.pmInterval) + ' mi · units within 10,000 mi of the next service', camp: 'Recalls and bulletins across chassis, body and equipment, open items only', docs: 'Registrations, inspection certificates and permits expiring within three weeks' };
      Object.keys(dcounts).forEach(function (k) { var n = $('due-n-' + k); n.textContent = dcounts[k]; n.className = durgent[k] ? 'warn' : ''; });
      var showDue = function (k) { qsa('.due-tabs a').forEach(function (t) { var on = t.getAttribute('data-due') === k; t.classList.toggle('on', on); t.setAttribute('aria-selected', on ? 'true' : 'false'); }); ['insp', 'maint', 'camp', 'docs'].forEach(function (id) { $('svc-' + id).hidden = (id === 'maint' ? 'pm' : id) !== k; }); $('due-foot').textContent = dfoots[k]; };
      qsa('.due-tabs a').forEach(function (t) { once(t, 'click', function (e) { e.preventDefault(); showDue(t.getAttribute('data-due')); }); });
      if (!document.body.hasAttribute('data-due-init')) { document.body.setAttribute('data-due-init', '1'); showDue(durgent.insp ? 'insp' : durgent.pm ? 'pm' : durgent.camp ? 'camp' : durgent.docs ? 'docs' : 'insp'); }
    }
    qsa('[data-unit-link]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); flowVehicle(a.getAttribute('data-unit-link')); }); });
  };

  renderers.parts = function () {
    var open = S.orders.filter(function (o) { return o.state !== 'delivered'; });
    var ot = sum(open.map(orderTotal));
    var back = open.filter(function (o) { return o.state === 'back'; }).length;
    var labels = { processing: 'Processing', shipped: 'Shipped', back: 'Backordered' };
    $('tab-parts').querySelector('b').textContent = open.length + ' open';
    $('tab-trucks').querySelector('b').textContent = S.trucks.length + ' on order';
    $('tab-rentals').querySelector('b').textContent = S.rentals.filter(function (r) { return r.state !== 'returned'; }).length + ' active';
    $('parts-note').innerHTML = money(ot) + ' before tax · ' + open.filter(function (o) { return /Today|Oct 2[789]/.test(o.eta); }).length + ' arriving this week' + (back ? ' · <span class="priority high">' + back + ' backordered</span>' : '');
    $('parts-rows').innerHTML = open.length ? open.map(function (o) {
      return '<tr><td class="id"><button type="button" class="row-btn" data-ord="' + o.no + '" aria-haspopup="dialog">Order ' + o.no + '</button></td><td class="for"><span class="trunc">' + (o.unit ? 'Unit #' + o.unit + ' · ' : '') + esc(o.for) + '</span></td><td>' + esc(o.ship) + '</td><td class="num">' + o.items.length + '</td><td class="num">' + money(orderTotal(o)) + '</td><td>' + statusHtml(o.state, labels[o.state]) + '</td><td class="num eta"><strong>' + esc(o.eta) + '</strong><span>' + esc(o.etaSub) + '</span></td></tr>';
    }).join('') : '<tr><td colspan="7">' + emptyHtml('No open orders. Everything you ordered has been delivered.') + '</td></tr>';
    qsa('[data-ord]').forEach(function (b) { b.addEventListener('click', function () { var o = S.orders.filter(function (x) { return x.no === b.getAttribute('data-ord'); })[0]; flowOrder(o, b.closest('tr')); }); });
    $('reorder-rows').innerHTML = S.reorder.map(function (r, i) { return '<div class="row reord"><div><div class="unit">' + esc(r.d) + '<span class="sub"> · ' + r.pn + '</span></div><div class="job">Last ordered ' + esc(r.last) + ' · usually ' + r.q + ' at ' + money(r.p) + ' each</div></div><div class="when"><strong>' + money(r.q * r.p) + '</strong><span>for ' + r.q + '</span></div><span class="act"><button type="button" class="lnk" data-add="' + i + '">Add</button></span></div>'; }).join('');
    qsa('[data-add]').forEach(function (b) { b.addEventListener('click', function () { addToCart(S.reorder[+b.getAttribute('data-add')]); }); });
    once($('reorder-all'), 'click', function (e) { e.preventDefault(); S.reorder.forEach(addToCart); flowCart(); });
    $('trucks-note').textContent = S.trucks.length ? 'Next delivery ' + S.trucks[0].eta + ' · ' + money(sum(S.trucks.map(function (t) { return t.price; }))) + ' committed' : 'Nothing on order';
    $('truck-rows').innerHTML = !S.trucks.length ? '<tr><td colspan="6">' + emptyHtml('No trucks on order. Accepted quotes show up here.') + '</td></tr>' : S.trucks.map(function (t) { return '<tr><td class="id"><button type="button" class="row-btn" data-truck="' + t.no + '" aria-haspopup="dialog">' + t.no + '</button></td><td class="for"><span class="trunc"><span class="ink">' + esc(t.spec) + '</span> · ' + esc(t.detail) + (t.quote ? ' · ' + t.quote + ' ' + t.ql : '') + '</span></td><td>' + t.ordered + '</td><td>' + statusHtml(t.stage >= 2 ? 'shipped' : 'processing', t.stages[t.stage][0]) + '</td><td class="num">' + money(t.price) + '</td><td class="num eta"><strong>' + esc(t.eta) + '</strong><span>' + esc(t.where) + '</span></td></tr>'; }).join('');
    qsa('[data-truck]').forEach(function (b) { b.addEventListener('click', function () { var t = S.trucks.filter(function (x) { return x.no === b.getAttribute('data-truck'); })[0]; flowTruck(t, b.closest('tr')); }); });
    var active = S.rentals.filter(function (r) { return r.state !== 'returned'; });
    var rt = sum(active.map(function (r) { return r.days * r.rate; }));
    var dueWk = active.filter(function (r) { return r.state === 'due'; }).length;
    $('rentals-note').innerHTML = money(rt) + ' accrued before tax' + (dueWk ? ' · <span class="priority high">' + dueWk + ' due back this week</span>' : '');
    $('rental-rows').innerHTML = active.length ? active.map(function (r, i) {
      var sub = r.state === 'reserved' ? 'Reserved · ' + esc(r.where || '') : r.state === 'due' ? 'Due in 2 days' : (r.state === 'returning' ? 'Return scheduled, ' + esc(r.returnTo || '') : (r.extended ? 'Extension requested' : r.days + ' days so far'));
      var act = r.state === 'reserved' ? '<span class="muted">Starts ' + esc(r.started) + '</span>' : r.state === 'returning' ? '<span class="muted">Return booked</span>' : (r.state === 'due' ? '<button type="button" class="lnk" data-rent="' + i + '" data-act="return">Schedule return</button>' : '<button type="button" class="lnk" data-rent="' + i + '" data-act="extend">Extend</button>');
      return '<tr class="' + r.state + '"><td class="id"><span class="ink">' + r.unit + '</span></td><td class="for"><span class="trunc">' + esc(r.spec) + '</span></td><td>' + r.started + '</td><td class="num eta"><strong>' + esc(r.due) + '</strong><span>' + sub + '</span></td><td class="num">' + money(r.rate) + '</td><td class="num">' + money(r.days * r.rate) + '</td><td class="act-col">' + act + '</td></tr>';
    }).join('') : '<tr><td colspan="7">' + emptyHtml('No active rentals.') + '</td></tr>';
    qsa('[data-rent]').forEach(function (b) { b.addEventListener('click', function () { flowRental(active[+b.getAttribute('data-rent')], b.getAttribute('data-act'), b.closest('tr')); }); });
    renderQuotes(); renderFreight(); renderBuilds();
    renderCartBadge();
    if (!el_tabsInit) { el_tabsInit = true; initTabs(); }
  };

  renderers.billing = function () {
    renderCredit();
    var open = S.invoices.filter(function (i) { return i.status === 'open'; });
    var paid = S.invoices.filter(function (i) { return i.status === 'paid'; });
    var ot = sum(open.map(function (i) { return i.amount; }));
    var rentals = sum(S.rentals.filter(function (r) { return r.state !== 'returned'; }).map(function (r) { return r.days * r.rate; }));
    var soon = open.filter(function (i) { return /Oct 3|Nov [1-7]$/.test(i.due); });
    $('bill-finding').innerHTML = open.length ? money(ot) + ' is open across ' + open.length + ' invoice' + (open.length > 1 ? 's' : '') + (soon.length ? ', ' + money(sum(soon.map(function (i) { return i.amount; }))) + ' of it due within ten days' : '') + '. Rental charges of ' + money(rentals) + ' bill on ' + S.rentalBilling.billedOn + '.' : 'Nothing is open. Rental charges of ' + money(rentals) + ' bill on ' + S.rentalBilling.billedOn + '.';
    $('bill-open-note').textContent = open.length ? money(ot) + ' before fees' : 'Paid in full';
    $('bill-rows').innerHTML = open.length ? open.map(function (i) { return '<tr' + (soon.indexOf(i) >= 0 ? ' class="due"' : '') + '><td class="id"><button type="button" class="row-btn" data-inv="' + i.no + '" aria-haspopup="dialog">' + i.no + '</button></td><td class="for"><span class="trunc">Unit #' + i.unit + ' · ' + esc(i.desc) + '</span></td><td>' + i.date + '</td><td class="num eta"><strong>' + i.due + '</strong><span>' + (soon.indexOf(i) >= 0 ? 'Due soon' : 'Net 24') + '</span></td><td class="num">' + money(i.amount) + '</td><td class="act-col"><button type="button" class="lnk" data-pay="' + i.no + '">Pay</button></td></tr>'; }).join('') : '<tr><td colspan="6">' + emptyHtml('No open invoices. Thank you.') + '</td></tr>';
    $('bill-payall').textContent = open.length ? 'Pay all · ' + money(ot) : '';
    $('bill-payall').style.display = open.length ? '' : 'none';
    $('bill-payall').onclick = function (e) { e.preventDefault(); flowPay(open); };
    qsa('[data-pay]').forEach(function (b) { b.addEventListener('click', function () { flowPay(S.invoices.filter(function (i) { return i.no === b.getAttribute('data-pay'); }), b.closest('tr')); }); });
    qsa('[data-inv]').forEach(function (b) { b.addEventListener('click', function () {
      var i = S.invoices.filter(function (x) { return x.no === b.getAttribute('data-inv'); })[0];
      var svc = S.serviceHistory.filter(function (h) { return h.inv === i.no; })[0];
      var ord = S.orderHistory.filter(function (h) { return h.inv === i.no; })[0];
      var parts = ord ? ord.total : 0, labor = i.amount - parts;
      openDrawer({ kind: i.status === 'paid' ? 'Paid ' + i.paidOn : 'Open · due ' + i.due, warn: i.status !== 'paid' && soon.indexOf(i) >= 0, title: i.no, meta: 'Unit #' + i.unit + ' · ' + i.desc,
        body: '<dl class="dr-facts"><dt>Issued</dt><dd>' + i.date + '</dd><dt>Due</dt><dd>' + i.due + '</dd><dt>Location</dt><dd>' + esc(svc ? 'CTOS ' + svc.loc : 'CTOS Fredericksburg') + '</dd></dl><div class="list li-list">' + (parts ? '<div class="row fig li"><span>Parts<small>Order ' + ord.no + ' · ' + ord.items + ' items</small></span><b>' + money(parts) + '</b></div>' : '') + '<div class="row fig li"><span>Labor and fees</span><b>' + money(labor) + '</b></div><div class="row fig total"><span>Invoice total<small>Before tax</small></span><b>' + money(i.amount) + '</b></div></div>',
        foot: i.status === 'paid' ? '<a href="#" class="btn btn-ghost">Download PDF</a><a href="team.html" class="lnk">Question about this invoice</a>' : '<button type="button" class="btn btn-primary" id="inv-pay">Pay ' + money(i.amount) + '</button><a href="#" class="lnk">Download PDF</a>', row: b.closest('tr'),
        after: function () { var p = $('inv-pay'); if (p) p.addEventListener('click', function () { flowPay([i]); }); } });
    }); });
    $('bill-paid').innerHTML = paid.map(function (i) { return '<tr><td class="id"><button type="button" class="row-btn" data-inv="' + i.no + '" aria-haspopup="dialog">' + i.no + '</button></td><td class="for"><span class="trunc">Unit #' + i.unit + ' · ' + esc(i.desc) + '</span></td><td>' + i.date + '</td><td>' + i.paidOn + '</td><td class="num">' + money(i.amount) + '</td></tr>'; }).join('');
    qsa('[data-inv]', $('bill-paid')).forEach(function (b) { b.addEventListener('click', function () { qsa('[data-inv="' + b.getAttribute('data-inv') + '"]')[0].click(); }); });
    $('bill-paid-foot').textContent = paid.length + ' paid since Sep 19 · ' + money(sum(paid.map(function (i) { return i.amount; })));
    $('bill-rentals').innerHTML = S.rentals.filter(function (r) { return r.state !== 'returned'; }).map(function (r) { return '<div class="row fig"><span>' + r.unit + '<small>' + esc(r.spec) + ' · ' + r.days + ' days at ' + money(r.rate) + '</small></span><b>' + money(r.days * r.rate) + '</b></div>'; }).join('') + '<div class="row fig total"><span>Accrued this cycle<small>' + S.rentalBilling.cycle + '</small></span><b>' + money(rentals) + '</b></div>';
    var ap = $('autopay'); ap.checked = !!S.autopay;
    once(ap, 'change', function () { S.autopay = ap.checked; save(); $('autopay-state').textContent = ap.checked ? 'On · bank account ending 4471, on the due date' : 'Off'; toast(ap.checked ? 'Autopay on. Open invoices pay on their due date.' : 'Autopay off.'); });
    $('autopay-state').textContent = S.autopay ? 'On · bank account ending 4471, on the due date' : 'Off';
    $('bill-methods').innerHTML = S.paymentMethods.map(function (m) { return '<div class="row fig"><span>' + esc(m.label) + '<small>' + esc(m.sub) + '</small></span><b class="muted">Edit</b></div>'; }).join('');
  };

  renderers.reports = function () {
    var cur = (location.hash || '#fuel').slice(1);
    $('rep-list').innerHTML = S.reports.map(function (r) { return '<a href="#' + r.id + '" class="row rep' + (r.id === cur ? ' selected' : '') + '" data-rep="' + r.id + '"><div><strong>' + esc(r.name) + '</strong><span>' + esc(r.period) + ' · ' + esc(r.schedule) + '</span></div>' + chev + '</a>'; }).join('');
    function render(id) {
      var r = S.reports.filter(function (x) { return x.id === id; })[0] || S.reports[0];
      qsa('.rep').forEach(function (a) { a.classList.toggle('selected', a.getAttribute('data-rep') === r.id); });
      $('rep-title').textContent = r.name; $('rep-period').textContent = r.period + ' · ' + r.desc;
      var body = '';
      if (r.id === 'fuel') {
        var avg = S.telemetry.mpg30, vs = S.vehicles.slice().sort(function (a, b) { return b.mpg - a.mpg; });
        body = '<div class="rep-figs"><div><b>' + avg.toFixed(1) + '</b><span>Fleet average MPG</span></div><div><b>' + S.telemetry.idlePct + '%</b><span>Idle time</span></div><div><b>' + money(S.telemetry.fuelWeek) + '</b><span>Fuel, last 7 days</span></div></div>' +
          '<div class="list">' + vs.map(function (v) { var d = v.mpg - avg; return '<div class="hbar"><span class="name">Unit #' + v.unit + '</span><span class="track"><i style="width:' + (v.mpg / 8 * 100).toFixed(0) + '%" class="' + (d < -0.4 ? 'bad' : '') + '"></i></span><span class="val">' + v.mpg.toFixed(1) + ' <small>' + (d >= 0 ? '+' : '') + d.toFixed(1) + '</small></span></div>'; }).join('') + '</div><p class="form-note">Bars are MPG on a 0 to 8 scale; the small figure is the difference from the fleet average. Red marks units more than 0.4 below it.</p>';
      } else if (r.id === 'uptime') {
        body = '<div class="rep-figs"><div><b>' + S.telemetry.uptime30 + '%</b><span>Uptime, 30 days</span></div><div><b>26 h</b><span>In the shop</span></div><div><b>5</b><span>Vehicles serviced</span></div></div><div class="list">' + S.serviceHistory.map(function (h) { return '<div class="row fig"><span>Unit #' + h.unit + '<small>' + esc(h.work) + ' · ' + h.date + '</small></span><b>' + (h.cost > 1000 ? '8 h' : '4 h') + '</b></div>'; }).join('') + '</div>';
      } else if (r.id === 'spend') {
        var svc = sum(S.serviceHistory.map(function (h) { return h.cost; })), prt = sum(S.orderHistory.map(function (h) { return h.total; }));
        body = '<div class="rep-figs"><div><b>' + money(svc) + '</b><span>Service invoiced, October</span></div><div><b>' + money(prt) + '</b><span>Of which parts</span></div><div><b>' + money(svc - prt) + '</b><span>Labor and fees</span></div></div><div class="list">' + S.serviceHistory.map(function (h) { return '<div class="row fig"><span>Unit #' + h.unit + '<small>' + esc(h.work) + ' · <a href="billing.html" class="lnk">' + h.inv + '</a></small></span><b>' + money(h.cost) + '</b></div>'; }).join('') + '</div>';
      } else if (r.id === 'insp') {
        var all = S.inspections.map(function (i) { return { i: i, d: docDays(i.due) }; }), over = all.filter(function (x) { return x.d < 0; }).length, soon = all.filter(function (x) { return x.d >= 0 && x.d <= 45; }).length;
        body = '<div class="rep-figs"><div><b>' + (all.length - over) + ' of ' + all.length + '</b><span>Inspections current</span></div><div><b>' + soon + '</b><span>Due within 45 days</span></div><div><b>' + openCampaigns().length + '</b><span>Open campaigns</span></div></div><div class="list">' + all.sort(function (a, b) { return a.d - b.d; }).map(function (x) { return '<div class="row fig"><span>Unit #' + x.i.unit + ' · ' + esc(x.i.type) + '<small>' + ROLE_NAME[x.i.comp] + ' · ' + esc(x.i.by) + '</small></span><b class="' + (x.d < 30 ? 'warn' : '') + '">' + (x.d < 0 ? 'Overdue' : x.d + ' days') + '</b></div>'; }).join('') + '</div>';
      } else {
        body = '<div class="rep-figs"><div><b>94%</b><span>PM on time, YTD</span></div><div><b>3</b><span>Inside the window now</span></div><div><b>0</b><span>Past due</span></div></div>' + '<div class="list">' + S.vehicles.slice().sort(function (a, b) { return (a.nextPm - a.odo) - (b.nextPm - b.odo); }).map(function (v) { var l = v.nextPm - v.odo; return '<div class="row fig"><span>Unit #' + v.unit + '<small>Next PM at ' + num(v.nextPm) + ' mi</small></span><b class="' + (l <= 1000 ? 'warn' : '') + '">' + num(l) + ' mi left</b></div>'; }).join('') + '</div>';
      }
      $('rep-body').innerHTML = body;
    }
    render(cur);
    once(window, 'hashchange', function () { render((location.hash || '#fuel').slice(1)); });
    once($('rep-export'), 'click', function (e) { e.preventDefault(); toast('Export queued. A CSV will be emailed to you in a minute.'); });
  };

  renderers.news = function () {
    function card(p, big) {
      return '<a href="#' + p.id + '" class="post-card' + (big ? ' big' : '') + '"><div class="pc-img"><img src="' + p.img + '" alt="" loading="lazy" onerror="this.style.display=\'none\'"></div><div class="pc-body"><span class="post-tag">' + esc(p.tag) + ' · ' + p.date + '</span><h2>' + esc(p.title) + '</h2>' + (big ? '<p>' + esc(p.summary) + '</p>' : '') + '<span class="pc-meta">' + esc(p.author.split(',')[0]) + ' · ' + p.read + '</span></div></a>';
    }
    function index() {
      document.title = 'News — CTOS One';
      $('news-head').innerHTML = '<div><h1>News</h1><p class="finding">Notes from the people who service your fleet: what we are seeing in the shops, what to check before the season turns, and what the telematics numbers mean.</p></div>';
      $('news-body').innerHTML = '<div class="post-index">' + card(S.posts[0], true) + '<div class="post-grid">' + S.posts.slice(1).map(function (p) { return card(p, false); }).join('') + '</div></div>';
    }
    function article(id) {
      var p = S.posts.filter(function (x) { return x.id === id; })[0]; if (!p) { index(); return; }
      document.title = p.title + ' — CTOS One';
      $('news-head').innerHTML = '<div><a href="#" class="lnk back">All news</a></div>';
      var body = p.body.map(function (t, i) { return '<p>' + esc(t) + '</p>' + (i === 1 && p.pull ? '<blockquote class="pull">' + esc(p.pull) + '</blockquote>' : ''); }).join('');
      $('news-body').innerHTML = '<article class="post"><header class="post-head"><span class="post-tag">' + esc(p.tag) + '</span><h1>' + esc(p.title) + '</h1><p class="post-lead">' + esc(p.summary) + '</p><p class="post-meta">' + esc(p.author) + ' · ' + p.date + ' · ' + p.read + ' read</p></header>' +
        '<figure class="post-img"><img src="' + p.img + '" alt="" loading="lazy" onerror="this.parentNode.style.display=\'none\'"></figure>' +
        '<div class="post-body">' + body + (p.takeaways ? '<aside class="takeaways"><h3>What to do this week</h3><ol>' + p.takeaways.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol></aside>' : '') + '</div>' +
        '<footer class="post-foot"><button type="button" class="btn btn-primary" data-flow-schedule>' + esc(p.cta || 'Schedule service') + '</button><a href="team.html" class="lnk">Talk to ' + esc(p.author.split(',')[0]) + '</a></footer></article>' +
        '<section class="post-more"><div class="section-head"><h3>More from the shop</h3></div><div class="post-grid">' + S.posts.filter(function (x) { return x.id !== p.id; }).map(function (x) { return card(x, false); }).join('') + '</div></section>';
      qsa('[data-flow-schedule]', $('news-body')).forEach(function (b) { b.addEventListener('click', function () { flowSchedule({ job: p.id === 'storm-season' ? 'Storm readiness check' : '' }); }); });
    }
    function route() { var h = (location.hash || '').slice(1); if (h) article(h); else index(); if (window.scrollTo) window.scrollTo(0, 0); }
    route(); once(window, 'hashchange', route);
  };

  renderers.team = function () {
    $('users-rows').innerHTML = S.users.map(function (u, i) { return '<tr><td class="id"><button type="button" class="row-btn" data-user="' + i + '" aria-haspopup="dialog">' + esc(u.name) + '</button></td><td class="for"><span class="trunc">' + esc(u.email) + '</span></td><td>' + ROLES[u.role] + '</td><td>' + statusHtml(u.status === 'active' ? 'shipped' : 'processing', u.status === 'active' ? 'Active' : 'Invited') + '</td><td class="num">' + esc(u.last) + '</td><td class="act-col"><button type="button" class="lnk" data-user="' + i + '">' + (u.status === 'invited' ? 'Resend' : 'Edit') + '</button></td></tr>'; }).join('');
    qsa('[data-user]').forEach(function (b) { b.addEventListener('click', function () { var u = S.users[+b.getAttribute('data-user')]; if (b.textContent === 'Resend') { toast('Invite resent to ' + u.email + '.'); return; } flowInvite(u, b.closest('tr')); }); });
    $('users-foot').textContent = S.users.length + ' users · ' + S.users.filter(function (u) { return u.status === 'invited'; }).length + ' invited, not yet signed in';
    qsa('[data-flow-invite]').forEach(function (b) { once(b, 'click', function (e) { e.preventDefault(); flowInvite(null); }); });
    $('drivers-rows').innerHTML = S.driverDetail.length ? S.driverDetail.map(function (d, i) { var v = S.vehicles.filter(function (x) { return x.driver === d.name; })[0]; return '<tr><td class="id"><button type="button" class="row-btn" data-drv="' + i + '" aria-haspopup="dialog">' + esc(d.full) + '</button></td><td>' + (v ? 'Unit #' + v.unit + ' · ' + esc(v.model) : '<span class="muted">Unassigned</span>') + '</td><td>' + esc(d.phone || '\u2014') + '</td><td>' + statusHtml(d.tablet ? 'shipped' : 'off', d.tablet ? 'Tablet' : 'No tablet') + '</td><td class="num">' + esc(d.cdl || '\u2014') + '</td><td class="act-col"><button type="button" class="lnk" data-drv="' + i + '">Edit</button></td></tr>'; }).join('') : '<tr><td colspan="6">' + emptyHtml('No drivers yet. Add one, or assign them when you add a truck.') + '</td></tr>';
    qsa('[data-drv]').forEach(function (b) { b.addEventListener('click', function () { flowDriver(S.driverDetail[+b.getAttribute('data-drv')], b.closest('tr')); }); });
    $('drivers-foot').textContent = S.driverDetail.length + ' drivers · ' + S.driverDetail.filter(function (d) { return d.tablet; }).length + ' with tablets · ' + S.vehicles.filter(function (v) { return !v.driver; }).length + ' units unassigned';
    qsa('[data-flow-driver]').forEach(function (b) { once(b, 'click', function (e) { e.preventDefault(); flowDriver(null); }); });
    $('team-grid').innerHTML = S.team.map(function (p) { return '<article class="person"><span class="avatar ' + p.tint + '">' + p.initials + '</span><div class="person-body"><div class="team-name">' + esc(p.name) + '</div><div class="team-role">' + esc(p.role) + '</div><p>' + esc(p.scope) + '</p><div class="team-contact"><a href="tel:' + p.phone.replace(/\D/g, '') + '"><svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg>' + p.phone + '</a><a href="mailto:' + p.email + '"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 7 9 6 9-6"/></svg>' + p.email + '</a></div></div></article>'; }).join('');
    if ($('team-tax')) { var t = S.accountTax || {}; $('team-tax').innerHTML = t.fetStatus ? '<div class="row fig"><span>Federal excise tax<small>' + esc(t.fetBasis) + '</small></span><b>' + esc(t.fetStatus) + '</b></div><div class="row fig"><span>Exemption certificate<small>Expires ' + esc(t.fetExpires) + '</small></span><b><a href="#" class="lnk">' + esc(t.fetCert) + '</a></b></div><div class="row fig"><span>IFTA permit<small>Expires ' + esc(t.iftaExpires) + '</small></span><b>' + esc(t.iftaPermit) + '</b></div>' : emptyHtml('No tax documents on file. Upload the exemption certificate and it applies to every unit.'); }
    $('team-locs').innerHTML = S.locations.map(function (l) { return '<div class="row loc"><div><strong>' + esc(l.name) + '</strong><p>' + esc(l.address) + ' · ' + esc(l.hours) + '</p></div><div class="when"><strong>' + l.phone + '</strong><span>' + (l.open ? 'Open now' : 'Closed') + '</span></div></div>'; }).join('');
  };

  renderers.support = function () {
    var open = S.tickets.filter(function (t) { return t.state === 'open'; });
    $('sup-note').textContent = open.length ? open.length + ' open · replies within one business hour' : 'No open requests';
    $('sup-rows').innerHTML = S.tickets.length ? S.tickets.map(function (t) { return '<div class="row tk"><div><div class="unit">' + esc(t.subject) + '<span class="sub"> · ' + t.id + '</span></div><div class="job">' + esc(t.last) + '</div></div><div class="when">' + statusHtml(t.state === 'open' ? 'shipped' : 'off', t.state === 'open' ? 'Open' : 'Closed') + '<span>Opened ' + t.opened + '</span></div></div>'; }).join('') : emptyHtml('No requests yet.');
    qsa('[data-flow-ticket]').forEach(function (b) { once(b, 'click', function (e) { e.preventDefault(); flowTicket(); }); });
  };



  /* ---------- unit photo: seeded, or uploaded by the customer or CTOS ---------- */
  function unitPhotoHtml(v) {
    var k = /bucket/i.test(v.kind) ? 'bucket' : /digger|derrick/i.test(v.kind) ? 'digger' : /crane/i.test(v.kind) ? 'crane' : 'service';
    return '<figure class="unit-photo' + (v.photo ? '' : ' none') + '"><img src="' + (v.photo ? esc(v.photo) : 'assets/img/placeholder-' + k + '.svg') + '" alt="' + (v.photo ? 'Unit #' + v.unit : '') + '" onerror="this.onerror=null;this.src=\'assets/img/placeholder-' + k + '.svg\';this.parentNode.classList.add(\'none\')">' +
      '<figcaption><label class="btn btn-ghost sm up-btn"><input type="file" accept="image/*" id="u-photo-in" class="vh">' + (v.photo ? 'Change photo' : 'Add a photo') + '</label>' + (v.photo ? '<button type="button" class="lnk" id="u-photo-rm">Remove</button>' : '') + '</figcaption></figure>';
  }
  function wireUnitPhoto(v) {
    var inp = $('u-photo-in'); if (!inp) return;
    inp.addEventListener('change', function () {
      var f = inp.files && inp.files[0]; if (!f) return;
      if (!/^image\//.test(f.type)) { toast('That file is not an image.'); return; }
      var rd = new FileReader();
      rd.onload = function () {
        var img = new Image();
        img.onload = function () {
          // Resize on the way in so the photo fits in local storage and loads fast.
          var max = 1200, s = Math.min(1, max / Math.max(img.width, img.height)), cv = document.createElement('canvas');
          cv.width = Math.round(img.width * s); cv.height = Math.round(img.height * s);
          cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
          var url = cv.toDataURL('image/jpeg', 0.82);
          v.photo = url; save();
          S.events.unshift({ t: 'Now', unit: v.unit, text: 'Photo updated by ' + personaInfo().name, kind: '' });
          toast('Photo saved for Unit #' + v.unit + '.'); renderPage();
        };
        img.onerror = function () { toast('Could not read that image.'); };
        img.src = rd.result;
      };
      rd.readAsDataURL(f);
    });
    var rm = $('u-photo-rm'); if (rm) rm.addEventListener('click', function () { confirmInline(rm.parentNode, 'Remove the photo for Unit #' + v.unit + '?', 'Remove', function () { delete v.photo; save(); renderPage(); }); });
  }

  /* ---------- inventory: buy and rent ---------- */
  var invFilter = { mode: 'sale', kind: '', loc: '', cond: '', q: '', avail: '', from: '', term: 30, sort: 'near' };
  var invBasket = [];
  function invTitle(it) { return it.year + ' ' + it.make + ' ' + it.model + ' · ' + it.equip; }
  function yourPrice(list) { return Math.round(list * (1 - (S.pricing.truckPct || 0) / 100)); }
  function yourRate(list) { return Math.round(list * (1 - (S.pricing.rentalPct || 0) / 100)); }
  function invAvailDate(it) { var m = (it.avail || '').match(/(Nov|Dec|Jan|Feb|Mar) (\d+)/); if (!m) return null; var mon = { Nov: 10, Dec: 11, Jan: 0, Feb: 1, Mar: 2 }[m[1]]; return new Date(mon <= 2 ? 2027 : 2026, mon, +m[2]); }
  function invReady(it) { return /now|In stock/.test(it.avail) && !/Reserved/.test(it.avail); }
  function invAvailFor(it) { // rental availability against the requested dates
    if (/Reserved/.test(it.avail)) return { ok: false, text: it.avail };
    if (!invFilter.from) return { ok: invReady(it), text: it.avail };
    var want = new Date(invFilter.from + 'T12:00:00'), d = invAvailDate(it);
    if (invReady(it) || (d && d <= want)) return { ok: true, text: 'Available for ' + want.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) };
    return { ok: false, text: 'Not until ' + (d ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'later') };
  }
  var LOC_MI = { 'Fredericksburg, VA': 14, 'Richmond, VA': 52, 'Union Grove, WI': 790, 'Kansas City, MO': 1050, 'Houston, TX': 1380 };
  function invMatches(it) {
    if (invFilter.mode === 'sale' && !it.sale) return false;
    if (invFilter.mode === 'rent' && !it.rent) return false;
    if (invFilter.kind && it.kind !== invFilter.kind) return false;
    if (invFilter.loc && it.loc.indexOf(invFilter.loc) < 0) return false;
    if (invFilter.cond && invFilter.mode === 'sale' && it.cond !== invFilter.cond) return false;
    if (invFilter.avail === 'now' && !(invFilter.mode === 'rent' ? invAvailFor(it).ok : invReady(it))) return false;
    if (invFilter.q) { var hay = (it.stock + ' ' + invTitle(it) + ' ' + it.spec + ' ' + it.chassis + ' ' + it.loc + ' ' + it.kindName).toLowerCase(); if (hay.indexOf(invFilter.q.toLowerCase()) < 0) return false; }
    return true;
  }
  function invSort(a, b) {
    var s = invFilter.sort, pa = invFilter.mode === 'sale' ? a.price : a.rates.day, pb = invFilter.mode === 'sale' ? b.price : b.rates.day;
    if (s === 'price') return pa - pb; if (s === 'priceDesc') return pb - pa; if (s === 'year') return b.year - a.year;
    return (LOC_MI[a.loc] || 999) - (LOC_MI[b.loc] || 999) || pa - pb;
  }
  function invPriceHtml(it, sale) {
    var pct = sale ? S.pricing.truckPct : S.pricing.rentalPct;
    if (sale) return '<b>' + money(yourPrice(it.price)) + '</b>' + (pct ? '<s>' + money(it.price) + ' list</s>' : '') + '<span>' + (it.cond === 'new' ? 'Before tax, FET and title' : 'Certified · 90-day warranty') + '</span>';
    var term = invFilter.term, est = term >= 90 ? yourRate(it.rates.month) * Math.round(term / 30) : term >= 30 ? yourRate(it.rates.month) : term >= 7 ? yourRate(it.rates.week) * Math.round(term / 7) : yourRate(it.rates.day) * term;
    return '<b>' + money(yourRate(it.rates.day)) + '<small> / day</small></b>' + (pct ? '<s>' + money(it.rates.day) + ' list</s>' : '') + '<span>' + money(yourRate(it.rates.week)) + ' / wk · ' + money(yourRate(it.rates.month)) + ' / mo</span>' + (invFilter.from ? '<span class="term">About ' + money(est) + ' for the term</span>' : '');
  }
  function invCard(it) {
    var sale = invFilter.mode === 'sale', inB = invBasket.indexOf(it.stock) >= 0, av = sale ? { ok: invReady(it), text: it.avail } : invAvailFor(it);
    var meter = it.cond === 'new' ? 'New · ' + num(it.miles) + ' mi' : (it.cond === 'used' ? 'Used · ' + num(it.miles) + ' mi · ' + num(it.hours) + ' h' : 'Rental fleet · ' + num(it.hours) + ' h');
    var acts = sale ? '<button type="button" class="btn ' + (inB ? 'btn-ghost on' : 'btn-ghost') + '" data-inv-pick="' + it.stock + '" aria-pressed="' + inB + '">' + (inB ? 'Added to quote' : 'Add to quote') + '</button><button type="button" class="lnk" data-inv-save="' + it.stock + '">Save build</button>' : '<button type="button" class="btn btn-ghost" data-inv-reserve="' + it.stock + '"' + (av.ok ? '' : ' disabled') + '>' + (av.ok ? 'Reserve' : 'Not available') + '</button><button type="button" class="lnk" data-inv-detail="' + it.stock + '">Details</button>';
    var photo = it.photo || ('assets/img/' + it.stock + '.jpg'), fallback = 'assets/img/placeholder-' + (it.kind || 'service') + '.svg';
    return '<article class="inv-card' + (inB ? ' picked' : '') + '" data-stock="' + it.stock + '"><figure class="inv-photo"><img src="' + esc(photo) + '" alt="" loading="lazy" onerror="this.onerror=null;this.src=\'' + fallback + '\';this.classList.add(\'ph\')"></figure><div class="inv-top"><span class="inv-kind">' + esc(it.kindName) + '</span><span class="inv-stock mono">' + it.stock + '</span></div>' +
      '<h4><button type="button" class="row-btn" data-inv-detail="' + it.stock + '">' + esc(invTitle(it)) + '</button></h4>' +
      '<p class="inv-spec">' + esc(it.spec) + '</p><p class="inv-chassis">' + esc(it.chassis) + ' · ' + esc(meter) + '</p>' +
      '<div class="inv-foot"><div class="inv-where"><strong>' + esc(it.loc) + (LOC_MI[it.loc] ? ' · ' + num(LOC_MI[it.loc]) + ' mi' : '') + '</strong><span class="' + (av.ok ? 'ok-t' : 'warn-t') + '">' + esc(av.text) + '</span></div><div class="inv-price">' + invPriceHtml(it, sale) + '</div></div>' +
      '<div class="inv-acts">' + acts + '</div></article>';
  }
  function renderPricingStrip() {
    var el = $('inv-pricing'); if (!el) return; var p = S.pricing, sale = invFilter.mode === 'sale';
    el.innerHTML = '<div><span class="ps-tier">' + esc(p.tier) + '</span><span class="ps-note">' + esc(p.note) + '</span></div><dl class="ps-facts"><div><dt>Trucks</dt><dd>' + (p.truckPct ? p.truckPct + '% off list' : 'List') + '</dd></div><div><dt>Rentals</dt><dd>' + (p.rentalPct ? p.rentalPct + '% off rate card' : 'Rate card') + '</dd></div><div><dt>Parts</dt><dd>' + (p.partsPct ? p.partsPct + '% off list' : 'List') + '</dd></div><div><dt>Terms</dt><dd>' + esc(S.credit.status === 'active' ? S.credit.terms + ' · ' + money(S.credit.limit - S.credit.used) + ' available' : 'Card or prepay') + '</dd></div></dl>';
  }
  function renderBasket() {
    var panel = $('inv-basket-panel'); if (!panel) return;
    panel.hidden = !invBasket.length;
    var btn = $('inv-quote-btn'); if (btn) btn.firstChild.textContent = invBasket.length ? 'Request quote for ' + invBasket.length + ' truck' + (invBasket.length > 1 ? 's' : '') + ' ' : 'Request a quote ';
    if (!invBasket.length) return;
    var items = invBasket.map(function (s) { return S.inventory.filter(function (x) { return x.stock === s; })[0]; });
    $('inv-basket-n').textContent = money(sum(items.map(function (it) { return yourPrice(it.price); }))) + ' at your price';
    $('inv-basket').innerHTML = items.map(function (it) { return '<div class="row fig"><span>' + esc(invTitle(it)) + '<small>' + it.stock + ' · ' + esc(it.loc) + '</small></span><button type="button" class="lnk" data-inv-pick="' + it.stock + '" aria-label="Remove ' + it.stock + '">Remove</button></div>'; }).join('');
    qsa('[data-inv-pick]', $('inv-basket')).forEach(function (b) { b.addEventListener('click', function () { togglePick(b.getAttribute('data-inv-pick')); }); });
  }
  function togglePick(stock) { var i = invBasket.indexOf(stock); if (i >= 0) invBasket.splice(i, 1); else invBasket.push(stock); renderInventory(); }
  function renderInventory() {
    var root = $('inv-results'); if (!root) return;
    var items = S.inventory.filter(invMatches).sort(invSort);
    var locs = []; S.inventory.forEach(function (it) { if (locs.indexOf(it.loc) < 0) locs.push(it.loc); });
    var ls = $('inv-loc'); if (ls && ls.options.length <= 1) ls.innerHTML = '<option value="">Any CTOS location</option>' + locs.sort(function (a, b) { return (LOC_MI[a] || 999) - (LOC_MI[b] || 999); }).map(function (l) { return '<option>' + esc(l) + (LOC_MI[l] ? ' · ' + num(LOC_MI[l]) + ' mi' : '') + '</option>'; }).join('');
    qsa('[data-inv-mode]').forEach(function (b) { var on = b.getAttribute('data-inv-mode') === invFilter.mode; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    var cw = $('inv-cond-wrap'); if (cw) cw.hidden = invFilter.mode !== 'sale';
    var dw = $('inv-dates'); if (dw) dw.hidden = invFilter.mode !== 'rent';
    var sale = invFilter.mode === 'sale';
    $('inv-count').textContent = items.length ? items.length + ' truck' + (items.length === 1 ? '' : 's') + (sale ? ' for sale' : ' to rent') + (invFilter.from ? ' from ' + new Date(invFilter.from + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '') : 'No matches';
    var ready = S.inventory.filter(function (it) { return it.sale && invReady(it); }).length, rent = S.inventory.filter(function (it) { return it.rent && invReady(it); }).length;
    var fnd = $('inv-finding'); if (fnd) fnd.innerHTML = ready + ' trucks in stock for sale and ' + rent + ' available to rent, at ' + esc(S.pricing.tier) + ' pricing' + (S.pricing.truckPct ? ' (' + S.pricing.truckPct + '% off list)' : '') + '. Nearest stock is at Fredericksburg, 14 miles from your yard. Pick trucks to build one quote request, or reserve a rental against your dates.';
    root.innerHTML = items.length ? items.map(invCard).join('') : emptyHtml('Nothing matches those filters. Clear one, or describe what you need and Sarah locates it from national stock.');
    qsa('[data-inv-pick]', root).forEach(function (b) { b.addEventListener('click', function () { togglePick(b.getAttribute('data-inv-pick')); }); });
    qsa('[data-inv-save]').forEach(function (b) { b.addEventListener('click', function () { var it = S.inventory.filter(function (x) { return x.stock === b.getAttribute('data-inv-save'); })[0]; flowSaveBuild({ spec: invTitle(it), detail: it.chassis + ' · ' + it.spec + ' · ' + it.color.toLowerCase(), lastPrice: it.price }); }); });
    qsa('[data-inv-reserve]').forEach(function (b) { b.addEventListener('click', function () { flowReserve(S.inventory.filter(function (x) { return x.stock === b.getAttribute('data-inv-reserve'); })[0], b.closest('.inv-card')); }); });
    qsa('[data-inv-detail]').forEach(function (b) { b.addEventListener('click', function () { flowInventoryDetail(S.inventory.filter(function (x) { return x.stock === b.getAttribute('data-inv-detail'); })[0], b.closest('.inv-card')); }); });
    renderPricingStrip(); renderBasket();
  }
  function initInventory() {
    if (!$('inv-results')) return;
    var m = location.search.match(/[?&]mode=(rent|sale)/); if (m) invFilter.mode = m[1];
    qsa('[data-inv-mode]').forEach(function (b) { once(b, 'click', function () { invFilter.mode = b.getAttribute('data-inv-mode'); renderInventory(); }); });
    [['inv-kind', 'kind'], ['inv-loc', 'loc'], ['inv-cond', 'cond'], ['inv-avail', 'avail'], ['inv-from', 'from'], ['inv-sort', 'sort']].forEach(function (p) { once($(p[0]), 'change', function () { invFilter[p[1]] = $(p[0]).value; renderInventory(); }); });
    once($('inv-term'), 'change', function () { invFilter.term = +$('inv-term').value; renderInventory(); });
    once($('inv-q'), 'input', function () { invFilter.q = $('inv-q').value.trim(); renderInventory(); });
    once($('inv-clear'), 'click', function (e) { e.preventDefault(); invFilter = { mode: invFilter.mode, kind: '', loc: '', cond: '', q: '', avail: '', from: '', term: 30, sort: 'near' }; ['inv-kind', 'inv-loc', 'inv-cond', 'inv-q', 'inv-avail', 'inv-from'].forEach(function (id) { if ($(id)) $(id).value = ''; }); if ($('inv-term')) $('inv-term').value = '30'; if ($('inv-sort')) $('inv-sort').value = 'near'; renderInventory(); });
    function go() { if (invBasket.length) flowRequestQuote(invBasket.map(function (s) { return S.inventory.filter(function (x) { return x.stock === s; })[0]; })); else flowRequestQuote(); }
    once($('inv-quote-btn'), 'click', go); once($('inv-basket-go'), 'click', go);
  }
  renderers.inventory = function () { initInventory(); renderInventory(); };
  function flowInventoryDetail(it, row) {
    var pct = S.pricing.truckPct, rp = S.pricing.rentalPct;
    openDrawer({
      kind: esc(it.kindName) + ' · ' + it.stock, title: invTitle(it), meta: it.loc + ' · ' + it.avail,
      body: '<figure class="inv-photo dr-photo"><img src="' + esc(it.photo || ('assets/img/' + it.stock + '.jpg')) + '" alt="" onerror="this.onerror=null;this.src=\'assets/img/placeholder-' + (it.kind || 'service') + '.svg\';this.classList.add(\'ph\')"></figure><dl class="dr-facts"><dt>Condition</dt><dd>' + (it.cond === 'new' ? 'New' : it.cond === 'used' ? 'Used, CTOS certified' : 'Rental fleet') + '</dd><dt>Odometer</dt><dd>' + num(it.miles) + ' mi</dd><dt>Hours</dt><dd>' + num(it.hours) + '</dd><dt>Color</dt><dd>' + esc(it.color) + '</dd></dl>' +
        '<h4 class="dr-h">Specification</h4><div class="list li-list"><div class="row fig li"><span>Chassis<small>' + esc(it.chassis) + '</small></span></div><div class="row fig li"><span>Equipment<small>' + esc(it.equip) + ' · ' + esc(it.spec) + '</small></span></div></div>' +
        (it.sale ? '<div class="row fig total"><span>Your price<small>' + esc(S.pricing.tier) + (pct ? ' · ' + pct + '% off list of ' + money(it.price) : '') + ' · before tax, FET and title</small></span><b>' + money(yourPrice(it.price)) + '</b></div>' : '') +
        (it.rent ? '<div class="row fig total"><span>Your rental rates<small>' + (rp ? rp + '% off the rate card · ' : '') + 'before tax and damage waiver · delivery quoted separately</small></span><b>' + money(yourRate(it.rates.day)) + ' / day<small style="display:block;font-weight:400">' + money(yourRate(it.rates.week)) + ' / wk · ' + money(yourRate(it.rates.month)) + ' / mo</small></b></div>' : ''),
      foot: (it.sale ? '<button type="button" class="btn btn-primary" id="inv-d-quote">' + (invBasket.indexOf(it.stock) >= 0 ? 'Remove from quote request' : 'Add to quote request') + '</button>' : '') + (it.rent ? '<button type="button" class="btn ' + (it.sale ? 'btn-ghost' : 'btn-primary') + '" id="inv-d-reserve">Reserve</button>' : '') + (it.sale ? '<button type="button" class="lnk" id="inv-d-save">Save as preferred build</button>' : ''),
      row: row,
      after: function () {
        var q = $('inv-d-quote'); if (q) q.addEventListener('click', function () { togglePick(it.stock); closeDrawer(); });
        var r = $('inv-d-reserve'); if (r) r.addEventListener('click', function () { flowReserve(it, row); });
        var s = $('inv-d-save'); if (s) s.addEventListener('click', function () { flowSaveBuild({ spec: invTitle(it), detail: it.chassis + ' · ' + it.spec + ' · ' + it.color.toLowerCase(), lastPrice: it.price }); });
      }
    });
  }
  function flowReserve(it, row) {
    var d = invFilter.from ? new Date(invFilter.from + 'T12:00:00') : new Date(); if (!invFilter.from) d.setDate(d.getDate() + 2); var iso = d.toISOString().slice(0, 10);
    var sites = S.sites.filter(function (s) { return s.type !== 'CTOS location'; });
    var rp = S.pricing.rentalPct;
    openDrawer({
      kind: 'Reserve a rental', title: invTitle(it), meta: it.stock + ' · ' + it.loc + ' · ' + it.avail,
      body: '<form class="form" id="rsv-form"><div class="form-2"><label>Start<input type="date" id="rsv-start" value="' + iso + '" required></label><label>Term<select id="rsv-term">' + [[7, '1 week'], [14, '2 weeks'], [30, '1 month'], [90, '3 months'], [180, '6 months']].map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === invFilter.term ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select></label></div>' +
        '<fieldset><legend>Delivery</legend><label class="radio"><input type="radio" name="rsv-how" value="deliver" checked><span>Deliver to a site<small>CTOS Logistics quotes the move; usually next business day</small></span></label><label class="radio"><input type="radio" name="rsv-how" value="pickup"><span>Pick up at ' + esc(it.loc) + '<small>Ready at 7:00 AM on the start date</small></span></label></fieldset>' +
        '<label id="rsv-site-wrap">Deliver to<select id="rsv-site">' + sites.map(function (s) { return '<option>' + esc(s.name) + '</option>'; }).join('') + '<option>Other address</option></select></label>' +
        '<label>Operator or driver<input type="text" id="rsv-driver" placeholder="Who will be running it"></label>' +
        '<p class="form-note">Your rate ' + money(yourRate(it.rates.day)) + ' per day, ' + money(yourRate(it.rates.month)) + ' per month' + (rp ? ' (' + rp + '% off the rate card)' : '') + ', before tax and damage waiver. Bills ' + (S.credit.status === 'active' ? 'to your account on ' + esc(S.credit.terms) : 'to a card on file') + '.</p></form>',
      foot: '<button type="submit" form="rsv-form" class="btn btn-primary">Reserve ' + it.stock + '</button><a href="team.html" class="lnk">Call Jordan instead</a>',
      row: row,
      after: function () {
        qsa('input[name="rsv-how"]').forEach(function (r) { r.addEventListener('change', function () { $('rsv-site-wrap').hidden = r.value === 'pickup' && r.checked; }); });
        $('rsv-form').addEventListener('submit', function (e) {
          e.preventDefault();
          var days = +$('rsv-term').value, st = new Date($('rsv-start').value + 'T12:00:00'), en = new Date(st); en.setDate(en.getDate() + days);
          var fmt = function (x) { return x.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); };
          var pick = (document.querySelector('input[name="rsv-how"][value="pickup"]') || {}).checked;
          var where = pick ? 'Pick up at ' + it.loc : 'Deliver to ' + $('rsv-site').value;
          S.rentals.push({ unit: it.stock, spec: invTitle(it) + ' ' + it.kindName.toLowerCase(), started: fmt(st), due: fmt(en), days: 0, rate: yourRate(it.rates.day), state: 'reserved', status: 'Reserved', loc: it.loc, driver: $('rsv-driver').value, kind: it.kindName, nextService: '', where: where });
          it.avail = 'Reserved for ' + S.user.org;
          save();
          addNotification({ title: it.stock + ' reserved', text: invTitle(it) + ', ' + fmt(st) + ' to ' + fmt(en) + '. ' + where + '. Jordan confirms within the hour.', href: 'parts.html#rentals' });
          closeDrawer(); toast(it.stock + ' reserved from ' + fmt(st) + '. It is on your Rentals tab.'); renderPage();
        });
      }
    });
  }

  /* ---------- preferred builds ---------- */
  function renderBuilds() {
    var root = $('build-rows'); if (!root) return;
    root.innerHTML = S.builds.length ? S.builds.map(function (b) {
      var inFleet = b.units.filter(function (u) { return vehicle(u); }).length;
      return '<div class="row build"><div><div class="unit">' + esc(b.name) + '</div><div class="job">' + esc(b.spec) + '</div><div class="job build-detail">' + esc(b.detail) + '</div></div><div class="when"><strong>' + (inFleet ? inFleet + ' in your fleet' : 'Saved') + '</strong><span>Last ' + esc(b.last) + '</span></div><span class="act"><button type="button" class="btn btn-ghost" data-build-reorder="' + b.id + '">Reorder</button><button type="button" class="lnk" data-build-edit="' + b.id + '">Edit</button></span></div>';
    }).join('') : emptyHtml('No preferred builds yet. Save one from a truck order, from inventory, or from any unit in your fleet.');
    qsa('[data-build-reorder]').forEach(function (b) { b.addEventListener('click', function () { flowReorderBuild(S.builds.filter(function (x) { return x.id === b.getAttribute('data-build-reorder'); })[0], b.closest('.row')); }); });
    qsa('[data-build-edit]').forEach(function (b) { b.addEventListener('click', function () { flowSaveBuild(S.builds.filter(function (x) { return x.id === b.getAttribute('data-build-edit'); })[0], b.closest('.row')); }); });
    qsa('[data-flow-build]').forEach(function (b) { once(b, 'click', function (e) { e.preventDefault(); flowSaveBuild(null); }); });
  }
  function flowSaveBuild(seed, row) {
    var editing = !!(seed && seed.id);
    seed = seed || {};
    openDrawer({
      kind: editing ? 'Edit preferred build' : 'Save a preferred build', title: editing ? seed.name : 'Name this configuration', meta: 'Reorder it any time in one step; Sarah quotes it from the saved spec',
      body: '<form class="form" id="pb-form"><label>Name<input type="text" id="pb-name" required value="' + esc(seed.name || '') + '" placeholder="Standard 55 ft bucket"></label><label>Truck<input type="text" id="pb-spec" required value="' + esc(seed.spec || '') + '" placeholder="2026 Freightliner M2 106 · Altec AA55"></label><label>Spec and must-haves<textarea id="pb-detail" rows="4" placeholder="Chassis, body, aerial or crane, insulation category, color, options">' + esc(seed.detail || '') + '</textarea></label><label>Units in your fleet built this way<input type="text" id="pb-units" value="' + esc((seed.units || []).join(', ')) + '" placeholder="1042, 1130"></label></form>',
      foot: '<button type="submit" form="pb-form" class="btn btn-primary">' + (editing ? 'Save changes' : 'Save build') + '</button>' + (editing ? '<button type="button" class="lnk" id="pb-del">Remove</button>' : ''),
      row: row,
      after: function () {
        $('pb-form').addEventListener('submit', function (e) {
          e.preventDefault();
          var units = $('pb-units').value.split(/[,\s]+/).filter(Boolean);
          if (editing) { seed.name = $('pb-name').value; seed.spec = $('pb-spec').value; seed.detail = $('pb-detail').value; seed.units = units; }
          else S.builds.unshift({ id: 'b' + Date.now(), name: $('pb-name').value, spec: $('pb-spec').value, detail: $('pb-detail').value, units: units, last: seed.last || 'Not ordered yet', lastPrice: seed.lastPrice || 0, lead: seed.lead || 'Quoted' });
          save(); closeDrawer(); toast(editing ? 'Build updated.' : '"' + $('pb-name').value + '" saved to preferred builds.'); renderPage();
          if (!editing && document.body.getAttribute('data-page') === 'parts') location.hash = '#trucks';
        });
        var del = $('pb-del'); if (del) del.addEventListener('click', function () { confirmInline($('dr-foot'), 'Remove "' + seed.name + '" from preferred builds?', 'Remove', function () { S.builds = S.builds.filter(function (b) { return b !== seed; }); save(); closeDrawer(); toast('Build removed.'); renderPage(); }); });
      }
    });
  }
  function flowReorderBuild(b, row) {
    openDrawer({
      kind: 'Reorder · ' + b.name, title: b.spec, meta: 'Last ' + b.last + (b.lastPrice ? ' at ' + money(b.lastPrice) : '') + ' · typical lead ' + b.lead,
      body: '<p class="dr-summary">' + esc(b.detail) + '</p><form class="form" id="ro-form"><div class="form-2"><label>Quantity<input type="text" id="ro-qty" inputmode="numeric" value="1"></label><label>Needed by<input type="date" id="ro-by"></label></div>' +
        '<fieldset><legend>Build</legend><label class="radio"><input type="radio" name="ro-same" value="same" checked><span>Exactly as last time<small>Same spec, current model year, same color</small></span></label><label class="radio"><input type="radio" name="ro-same" value="changes"><span>With changes<small>Tell Sarah what is different</small></span></label></fieldset>' +
        '<label id="ro-ch-wrap" hidden>What changes<textarea id="ro-changes" rows="2" placeholder="Different color, add a jib, swap the body"></textarea></label>' +
        '<label>Trade-in<select id="ro-trade"><option value="">None</option>' + S.vehicles.map(function (v) { return '<option>Unit #' + v.unit + ' · ' + esc(v.model) + '</option>'; }).join('') + '</select></label>' +
        '<p class="form-note">Sends Sarah a Salesforce quote request with this build as the quote line. Current pricing comes back on the quote; the last price was ' + (b.lastPrice ? money(b.lastPrice) : 'not recorded') + '.</p></form>',
      foot: '<button type="submit" form="ro-form" class="btn btn-primary">Request quote for this build</button><a href="team.html" class="lnk">Call Sarah instead</a>',
      row: row,
      after: function () {
        qsa('input[name="ro-same"]').forEach(function (r) { r.addEventListener('change', function () { $('ro-ch-wrap').hidden = !(r.value === 'changes' && r.checked); }); });
        $('ro-form').addEventListener('submit', function (e) {
          e.preventDefault();
          var qty = +$('ro-qty').value || 1, ch = (document.querySelector('input[name="ro-same"][value="changes"]') || {}).checked ? $('ro-changes').value : '';
          var no = 'Q-' + (10422 + S.quotes.length + 1), sf = '0Q0Hs00000B' + Math.random().toString(36).slice(2, 7).toUpperCase();
          S.quotes.unshift({ no: no, sfId: sf, stage: 'requested', requested: 'Today', updated: 'Today', owner: 'Sarah Mitchell', validUntil: '', build: b.id, lines: [{ ql: 'QL-01', spec: b.spec, detail: 'Preferred build "' + b.name + '" · ' + b.detail + (ch ? ' · Changes: ' + ch : ''), qty: qty, unitPrice: 0, eta: '' }], note: 'Reorder of preferred build "' + b.name + '".' + ($('ro-by').value ? ' Needed by ' + $('ro-by').value + '.' : '') + ($('ro-trade').value ? ' Trade-in: ' + $('ro-trade').value + '.' : '') });
          b.last = 'Today · ' + no;
          S.salesforce.lastSync = 'Just now'; save();
          addNotification({ title: no + ' sent to Sarah', text: qty + ' × ' + b.name + ', built as before' + (ch ? ' with changes' : '') + '. She usually replies within a business day.', href: 'parts.html#trucks' });
          closeDrawer(); toast('Request ' + no + ' sent for ' + qty + ' × ' + b.name + '.'); renderPage();
        });
      }
    });
  }

  /* ---------- credit ---------- */
  function renderCredit() {
    var root = $('credit-panel'); if (!root) return;
    var c = S.credit, app = c.application;
    var html = '';
    if (c.status === 'active') {
      var pct = Math.min(100, Math.round(c.used / c.limit * 100));
      html = '<div class="credit-head"><div><b>' + money(c.limit - c.used) + '</b><span>available of ' + money(c.limit) + '</span></div><span class="status shipped">Open account · ' + esc(c.terms) + '</span></div>' +
        '<div class="credit-bar" role="img" aria-label="' + pct + ' percent of the credit line in use"><i style="width:' + pct + '%"></i></div>' +
        '<div class="list"><div class="row fig"><span>In use<small>Open invoices and rentals accrued</small></span><b>' + money(c.used) + '</b></div><div class="row fig"><span>Terms<small>Customer since ' + esc(c.since) + ' · last reviewed ' + esc(c.reviewed) + '</small></span><b>' + esc(c.terms) + '</b></div>' +
        (app ? '<div class="row fig"><span>Increase requested<small>' + esc(app.ref) + ' · submitted ' + esc(app.submitted) + '</small></span><b class="warn">' + money(app.amount) + '</b></div>' : '') + '</div>' +
        '<div class="table-foot"><span>' + esc(c.contact) + '</span>' + (app ? '<button type="button" class="lnk" data-credit-view>Application status</button>' : '<button type="button" class="lnk" data-credit-apply>Request an increase</button>') + '</div>';
    } else if (c.status === 'pending') {
      html = '<div class="credit-head"><div><b>Under review</b><span>Application ' + esc(app.ref) + ' · submitted ' + esc(app.submitted) + '</span></div><span class="status processing">In review</span></div>' +
        '<div class="list"><div class="row fig"><span>Requested<small>' + esc(app.terms) + ' terms</small></span><b>' + money(app.amount) + '</b></div><div class="row fig"><span>What happens next<small>Accounts Receivable checks the trade and bank references and replies within two business days. Until then, orders run on card or prepayment.</small></span></div></div>' +
        '<div class="table-foot"><span>Credit team · (816) 555-0190</span><button type="button" class="lnk" data-credit-view>View application</button></div>';
    } else {
      html = '<div class="credit-head"><div><b>No credit line yet</b><span>Orders and rentals run on card or prepayment</span></div></div>' +
        '<p class="credit-copy">An open account lets you order parts, book service and rent trucks on ' + esc(S.credit.terms === 'Prepay' ? 'Net 30' : 'Net 30') + ' terms with one monthly statement. The application takes about ten minutes; most decisions come back within two business days.</p>' +
        '<div class="table-foot"><button type="button" class="btn btn-primary" data-credit-apply>Apply for credit</button><span>No fee · no hard pull on personal credit for incorporated businesses</span></div>';
    }
    root.innerHTML = html;
    qsa('[data-credit-apply]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); flowCreditApp(); }); });
    qsa('[data-credit-view]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); flowCreditStatus(); }); });
  }
  function flowCreditStatus() {
    var c = S.credit, app = c.application, emp = isEmployee();
    var stages = [['Submitted', app.submitted], ['References checked', app.stage >= 1 ? app.updated || 'Today' : ''], ['Decision', app.stage >= 2 ? app.updated || 'Today' : '']];
    openDrawer({
      kind: 'Credit application · ' + app.ref, title: money(app.amount) + ' requested', meta: esc(app.legal) + ' · ' + esc(app.terms) + ' terms',
      body: '<ol class="stages" aria-label="Application progress">' + stagesHtml(stages, app.stage || 0) + '</ol><dl class="dr-facts"><dt>Business</dt><dd>' + esc(app.legal) + (app.dba ? ' dba ' + esc(app.dba) : '') + '</dd><dt>Entity</dt><dd>' + esc(app.entity) + ' · since ' + esc(app.years) + '</dd><dt>Monthly volume</dt><dd>' + money(app.monthly) + '</dd><dt>References</dt><dd>' + app.refs.length + ' trade · ' + esc(app.bank) + '</dd><dt>Signed</dt><dd>' + esc(app.signer) + ', ' + esc(app.submitted) + '</dd></dl><p class="form-note">A copy was emailed to ' + esc(app.email) + '. Changes go through the credit team.</p>',
      foot: emp && c.status === 'pending' ? '<button type="button" class="btn btn-primary" id="cr-approve">Approve ' + money(app.amount) + ' on ' + esc(app.terms) + '</button><span class="wo-note">Writes the limit to the account and notifies the customer.</span>' : '<a href="#" class="lnk">Download PDF</a><a href="team.html" class="lnk">Question for the credit team</a>',
      after: function () {
        var ap = $('cr-approve'); if (ap) ap.addEventListener('click', function () {
          confirmInline($('dr-foot'), 'Approve a ' + money(app.amount) + ' line on ' + app.terms + ' for ' + S.user.org + '?', 'Approve', function () {
            c.status = 'active'; c.limit = app.amount; c.used = c.used || 0; c.terms = app.terms; c.since = '2026'; c.reviewed = 'Today'; c.contact = 'Accounts Receivable · (816) 555-0190'; app.stage = 2; app.updated = 'Today'; c.application = null;
            save(); addNotification({ title: 'Credit approved', text: money(app.amount) + ' open account on ' + app.terms + ' terms. Orders and rentals can bill to the account from today.', href: 'billing.html#credit' });
            closeDrawer(); toast('Credit approved.'); renderPage();
          });
        });
      }
    });
  }
  function flowCreditApp() {
    var c = S.credit, increase = c.status === 'active';
    var step = 0, data = { refs: [] };
    var names = ['Business', 'Ownership', 'References', 'Request', 'Sign'];
    var org = S.user.org;
    function stepper() { return '<ol class="cr-steps" aria-label="Application steps">' + names.map(function (n, i) { return '<li class="' + (i < step ? 'done' : i === step ? 'on' : '') + '"><span>' + (i + 1) + '</span>' + n + '</li>'; }).join('') + '</ol>'; }
    function body() {
      var f = '';
      if (step === 0) f = '<div class="form-2"><label>Legal business name<input type="text" id="cr-legal" required value="' + esc(data.legal || org) + '"></label><label>DBA, if any<input type="text" id="cr-dba" value="' + esc(data.dba || '') + '"></label></div><div class="form-2"><label>Federal EIN<input type="text" id="cr-ein" inputmode="numeric" required placeholder="12-3456789" value="' + esc(data.ein || '') + '"></label><label>Entity type<select id="cr-entity">' + ['LLC', 'S corporation', 'C corporation', 'Partnership', 'Sole proprietor', 'Municipality or co-op'].map(function (o) { return '<option' + (data.entity === o ? ' selected' : '') + '>' + o + '</option>'; }).join('') + '</select></label></div><div class="form-2"><label>Year established<input type="text" id="cr-years" inputmode="numeric" required value="' + esc(data.years || '') + '" placeholder="2012"></label><label>Industry<select id="cr-ind">' + ['Electric utility contractor', 'Telecom contractor', 'Tree care', 'Municipal / public works', 'Sign and lighting', 'General construction', 'Other'].map(function (o) { return '<option' + (data.ind === o ? ' selected' : '') + '>' + o + '</option>'; }).join('') + '</select></label></div><label>Billing address<input type="text" id="cr-addr" required value="' + esc(data.addr || '1180 Garrisonville Rd, Stafford, VA 22554') + '"></label><div class="form-2"><label>AP contact<input type="text" id="cr-ap" required value="' + esc(data.ap || personaInfo().name) + '"></label><label>AP email<input type="email" id="cr-email" required value="' + esc(data.email || 'ap@' + org.toLowerCase().replace(/[^a-z]/g, '') + '.com') + '"></label></div>';
      if (step === 1) f = '<p class="form-note" style="margin-top:0">Owners, officers or members with 20% or more. Incorporated businesses: no personal guarantee is required under $150,000.</p><div class="form-2"><label>Name<input type="text" id="cr-o1" required value="' + esc(data.o1 || personaInfo().name) + '"></label><label>Title<input type="text" id="cr-t1" required value="' + esc(data.t1 || personaInfo().role) + '"></label></div><div class="form-2"><label>Ownership<input type="text" id="cr-p1" inputmode="numeric" required value="' + esc(data.p1 || '100') + '" placeholder="%"></label><label>Second owner, if any<input type="text" id="cr-o2" value="' + esc(data.o2 || '') + '" placeholder="Name and title"></label></div><label class="check"><input type="checkbox" id="cr-pg"' + (data.pg ? ' checked' : '') + '><span>Include a personal guarantee<small>Speeds approval for newer businesses and larger limits</small></span></label>';
      if (step === 2) f = '<p class="form-note" style="margin-top:0">Three trade references you buy from on terms, plus your bank.</p>' + [0, 1, 2].map(function (i) { var r = data.refs[i] || {}; return '<div class="form-2 cr-ref"><label>Trade reference ' + (i + 1) + '<input type="text" class="cr-rn" ' + (i === 0 ? 'required ' : '') + 'value="' + esc(r.n || '') + '" placeholder="' + ['Altec Industries', 'Rush Truck Centers', 'Wesco'][i] + '"></label><label>Phone or email<input type="text" class="cr-rc" value="' + esc(r.c || '') + '"></label></div>'; }).join('') + '<div class="form-2"><label>Bank<input type="text" id="cr-bank" required value="' + esc(data.bank || '') + '" placeholder="Atlantic Union Bank"></label><label>Banker contact<input type="text" id="cr-bankc" value="' + esc(data.bankc || '') + '"></label></div>';
      if (step === 3) f = '<div class="form-2"><label>' + (increase ? 'New limit requested' : 'Credit limit requested') + '<input type="text" id="cr-amt" inputmode="numeric" required value="' + esc(data.amount || (increase ? c.limit * 2 : 100000)) + '"></label><label>Terms<select id="cr-terms">' + ['Net 30', 'Net 45', 'Net 60'].map(function (o) { return '<option' + ((data.terms || 'Net 30') === o ? ' selected' : '') + '>' + o + '</option>'; }).join('') + '</select></label></div><div class="form-2"><label>Expected monthly purchases<input type="text" id="cr-monthly" inputmode="numeric" required value="' + esc(data.monthly || 18000) + '"></label><label>Fleet size<input type="text" id="cr-fleet" inputmode="numeric" value="' + esc(data.fleet || (S.vehicles.length || '')) + '"></label></div><label class="check"><input type="checkbox" id="cr-po"' + (data.po ? ' checked' : '') + '><span>Purchase orders required on invoices</span></label><label class="check"><input type="checkbox" id="cr-tax"' + (data.tax ? ' checked' : '') + '><span>We will provide a resale or exemption certificate<small>FET and sales tax certificates live under Team, Account tax documents</small></span></label>' + (increase ? '<p class="form-note">Current line ' + money(c.limit) + ' on ' + esc(c.terms) + ', ' + money(c.used) + ' in use.</p>' : '');
      if (step === 4) f = '<div class="cr-review"><div class="row fig"><span>Business</span><b>' + esc(data.legal) + '</b></div><div class="row fig"><span>Requested</span><b>' + money(+data.amount) + ' · ' + esc(data.terms) + '</b></div><div class="row fig"><span>References</span><b>' + data.refs.filter(function (r) { return r.n; }).length + ' trade · ' + esc(data.bank) + '</b></div></div><label class="check"><input type="checkbox" id="cr-auth" required><span>I am authorized to apply for credit on behalf of ' + esc(data.legal) + ' and I authorize Custom Truck One Source to verify the information above with the references and bank listed, and to obtain business credit reports.<small>Terms and conditions of sale apply to every purchase billed to the account.</small></span></label><label>Type your full name to sign<input type="text" id="cr-sign" required placeholder="' + esc(personaInfo().name) + '" autocomplete="off"></label><p class="form-note">Signed electronically, ' + new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + '.</p>';
      return stepper() + '<form class="form" id="cr-form">' + f + '</form>';
    }
    function collect() {
      var g = function (id) { var e = $(id); return e ? e.value : ''; };
      if (step === 0) { data.legal = g('cr-legal'); data.dba = g('cr-dba'); data.ein = g('cr-ein'); data.entity = g('cr-entity'); data.years = g('cr-years'); data.ind = g('cr-ind'); data.addr = g('cr-addr'); data.ap = g('cr-ap'); data.email = g('cr-email'); }
      if (step === 1) { data.o1 = g('cr-o1'); data.t1 = g('cr-t1'); data.p1 = g('cr-p1'); data.o2 = g('cr-o2'); data.pg = !!($('cr-pg') && $('cr-pg').checked); }
      if (step === 2) { data.refs = qsa('.cr-ref').map(function (w) { return { n: w.querySelector('.cr-rn').value, c: w.querySelector('.cr-rc').value }; }); data.bank = g('cr-bank'); data.bankc = g('cr-bankc'); }
      if (step === 3) { data.amount = String(g('cr-amt')).replace(/[^0-9.]/g, ''); data.terms = g('cr-terms'); data.monthly = String(g('cr-monthly')).replace(/[^0-9.]/g, ''); data.fleet = g('cr-fleet'); data.po = !!($('cr-po') && $('cr-po').checked); data.tax = !!($('cr-tax') && $('cr-tax').checked); }
    }
    function foot() { return (step > 0 ? '<button type="button" class="lnk" id="cr-back">Back</button>' : '') + '<button type="submit" form="cr-form" class="btn btn-primary">' + (step === 4 ? 'Submit application' : 'Continue') + '</button><span class="wo-note">Step ' + (step + 1) + ' of 5' + (step === 0 ? ' · about ten minutes' : '') + '</span>'; }
    function paint() {
      $('dr-body').innerHTML = body(); $('dr-foot').innerHTML = foot();
      var bk = $('cr-back'); if (bk) bk.addEventListener('click', function () { collect(); step -= 1; paint(); });
      $('cr-form').addEventListener('submit', function (e) {
        e.preventDefault();
        if (step < 4) { collect(); step += 1; paint(); $('dr-body').scrollTop = 0; return; }
        var ref = 'CA-' + new Date().getFullYear() + '-' + String(1000 + Math.floor(Math.random() * 9000));
        c.application = { ref: ref, submitted: 'Today', amount: +data.amount, terms: data.terms, legal: data.legal, dba: data.dba, entity: data.entity, years: data.years, monthly: +data.monthly, refs: data.refs.filter(function (r) { return r.n; }), bank: data.bank, signer: $('cr-sign').value, email: data.email, stage: 0, increase: increase };
        if (!increase) c.status = 'pending';
        save();
        addNotification({ title: (increase ? 'Credit increase' : 'Credit application') + ' ' + ref + ' received', text: money(+data.amount) + ' on ' + data.terms + '. Accounts Receivable replies within two business days; a copy went to ' + data.email + '.', href: 'billing.html#credit' });
        closeDrawer(); toast('Application ' + ref + ' submitted.'); renderPage();
      });
    }
    openDrawer({ kind: increase ? 'Request a credit increase' : 'Credit application', title: increase ? 'Raise the line for ' + org : 'Open an account for ' + org, meta: increase ? 'Current line ' + money(c.limit) + ' · ' + c.terms : 'Five short steps · decisions usually within two business days', body: '', foot: '', after: paint });
  }

  /* ---------- tabs (parts page) ---------- */
  function initTabs() {
    var tabs = qsa('.tabs [role="tab"]'), views = qsa('.view'); if (!tabs.length) return;
    function show(name, focus) {
      tabs.forEach(function (t) { var on = t.getAttribute('href') === '#' + name; t.classList.toggle('on', on); t.setAttribute('aria-selected', on ? 'true' : 'false'); t.tabIndex = on ? 0 : -1; if (on && focus) t.focus(); });
      views.forEach(function (v) { v.hidden = v.id !== 'view-' + name; });
    }
    function fromHash() { var first = (tabs[0].getAttribute('href') || '#parts').slice(1); var h = (location.hash || '#' + first).slice(1); if (h === 'quotes') h = 'trucks'; var known = tabs.map(function (t) { return (t.getAttribute('href') || '').slice(1); }); show(known.indexOf(h) >= 0 ? h : first, false); }
    tabs.forEach(function (t, i) { t.addEventListener('keydown', function (e) { var j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : -1; if (j < 0 || j >= tabs.length) return; e.preventDefault(); location.hash = tabs[j].getAttribute('href'); show(tabs[j].getAttribute('href').slice(1), true); }); });
    window.addEventListener('hashchange', fromHash); fromHash();
  }

  /* ---------- map ---------- */
  var mapApi = { pan: function () {}, onClick: null, preview: function () {}, refreshSites: null, hot: function () {} };
  function initMap() {
    var el = $('map'); if (!el) return;
    var cfg = window.CTOS_CONFIG || {}; var provider = cfg.MAP_API_KEY ? (cfg.MAP_PROVIDER || 'carto') : 'osm';
    var skel = $('map-skeleton'), err = $('map-error');
    var colors = { moving: '#1F9D55', idle: '#E39B1A', fault: '#D1232B', shop: '#2E6FD8', off: '#9AA0A6' };
    var pins = S.vehicles.map(function (v) { return [v.lat, v.lng, v.state, 'Unit #' + v.unit]; }).concat(S.rentals.filter(function (r) { return r.lat && r.state !== 'returned'; }).map(function (r) { return [r.lat, r.lng, /Moving|On site/.test(r.status) ? 'moving' : (/Idling/.test(r.status) ? 'idle' : 'off'), r.unit + ' (rental)']; })).concat(S.extraPins.map(function (p) { return [p[0], p[1], p[2], '']; }));
    function ready() { if (skel) skel.hidden = true; }
    function fail() { if (skel) skel.hidden = true; if (err) err.hidden = false; }
    function loadScript(src, ok) { var s = document.createElement('script'); s.src = src; s.async = true; s.onload = ok; s.onerror = fail; document.head.appendChild(s); }
    function loadCss(href) { var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; document.head.appendChild(l); }
    var timeout = setTimeout(fail, 12000);
    if (provider === 'google') {
      window.__initGoogle = function () {
        clearTimeout(timeout);
        var map = new google.maps.Map(el, { center: { lat: 38.2, lng: -77.9 }, zoom: 7, disableDefaultUI: true, zoomControl: true, zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_TOP }, scrollwheel: false, clickableIcons: false,
          styles: [{ elementType: 'geometry', stylers: [{ color: '#F2F3F4' }] }, { elementType: 'labels.text.fill', stylers: [{ color: '#646B73' }] }, { elementType: 'labels.text.stroke', stylers: [{ color: '#FFFFFF' }] }, { featureType: 'poi', stylers: [{ visibility: 'off' }] }, { featureType: 'transit', stylers: [{ visibility: 'off' }] }, { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#FFFFFF' }] }, { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#E2E5E8' }] }, { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#DCE1E5' }] }] });
        pins.forEach(function (p) { var mk = new google.maps.Marker({ position: { lat: p[0], lng: p[1] }, map: map, title: p[3], icon: { path: google.maps.SymbolPath.CIRCLE, scale: p[2] === 'fault' ? 6.5 : 5, fillColor: colors[p[2]], fillOpacity: 1, strokeColor: '#FFFFFF', strokeWeight: 2 } }); if (p[3]) mk.addListener('click', function () { flowVehicle(p[3].replace('Unit #', '')); }); });
        mapApi.pan = function (lat, lng, z) { map.panTo({ lat: lat, lng: lng }); map.setZoom(z || 10); };
        var gCircles = [];
        mapApi.refreshSites = function () { gCircles.forEach(function (c) { c.setMap(null); }); gCircles = S.sites.map(function (s) { var c = new google.maps.Circle({ map: map, center: { lat: s.lat, lng: s.lng }, radius: s.radius, strokeColor: '#5B626A', strokeWeight: 1, fillColor: '#5B626A', fillOpacity: 0.04 }); c.addListener('click', function () { flowSite(s); }); return c; }); };
        mapApi.refreshSites();
        map.addListener('click', function (e) { if (mapApi.onClick) mapApi.onClick(e.latLng.lat(), e.latLng.lng()); });
        ready();
      };
      loadScript('https://maps.googleapis.com/maps/api/js?key=' + encodeURIComponent(cfg.MAP_API_KEY) + '&callback=__initGoogle');
    } else if (provider === 'mapbox') {
      loadCss('https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css');
      loadScript('https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.js', function () {
        clearTimeout(timeout); mapboxgl.accessToken = cfg.MAP_API_KEY;
        var map = new mapboxgl.Map({ container: 'map', style: 'mapbox://styles/mapbox/light-v11', center: [-77.9, 38.2], zoom: 6, scrollZoom: false });
        map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'top-right');
        pins.forEach(function (p) { var e = document.createElement('div'); e.className = 'ping-wrap'; e.innerHTML = '<span class="ping ' + p[2] + '"><i></i></span>'; if (p[3]) e.title = p[3]; new mapboxgl.Marker({ element: e }).setLngLat([p[1], p[0]]).addTo(map); });
        mapApi.pan = function (lat, lng, z) { map.flyTo({ center: [lng, lat], zoom: z ? z - 1 : 9 }); };
        map.on('click', function (e) { if (mapApi.onClick) mapApi.onClick(e.lngLat.lat, e.lngLat.lng); });
        map.on('load', ready); map.on('error', fail);
      });
    } else if (provider === 'carto') {
      // Style B: CARTO Positron vector tiles through MapLibre, repainted with the portal's tokens.
      loadCss('https://cdnjs.cloudflare.com/ajax/libs/maplibre-gl/4.7.1/maplibre-gl.min.css');
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/maplibre-gl/4.7.1/maplibre-gl.min.js', function () {
        clearTimeout(timeout);
        var key = cfg.MAP_API_KEY;
        var map = new maplibregl.Map({
          container: 'map', style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json', center: [-77.9, 38.2], zoom: 6.2, attributionControl: true,
          transformRequest: function (url) { if (/cartocdn\.com/.test(url) && key) return { url: url + (url.indexOf('?') >= 0 ? '&' : '?') + 'key=' + encodeURIComponent(key) }; return { url: url }; }
        });
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
        map.scrollZoom.disable();
        // Style A, Paper: white land, hairline greys, water a cool pale grey, no road casings
        var T = { land: '#FFFFFF', water: '#EEF1F3', park: '#F4F6F4', building: '#F2F3F5', minor: '#E6E9EC', major: '#D8DCE0', highway: '#C9CED3', casing: '#FFFFFF', label: '#8A9097', labelSoft: '#A6ADB3' };
        function repaint() {
          var style = map.getStyle(); if (!style || !style.layers) return;
          style.layers.forEach(function (l) {
            var id = l.id, t = l.type, lid = id.toLowerCase();
            try {
              if (t === 'background') map.setPaintProperty(id, 'background-color', T.land);
              else if (t === 'fill') {
                if (/water/.test(lid)) map.setPaintProperty(id, 'fill-color', T.water);
                else if (/park|grass|wood|forest|landcover|green|cemetery|golf/.test(lid)) map.setPaintProperty(id, 'fill-color', T.park);
                else if (/building/.test(lid)) { map.setPaintProperty(id, 'fill-color', T.building); map.setPaintProperty(id, 'fill-outline-color', T.building); map.setLayerZoomRange(id, 13, 24); }
                else if (/landuse|residential|commercial|industrial|hospital|school|university|stadium|pitch|sand|ice|glacier/.test(lid)) map.setPaintProperty(id, 'fill-color', T.land);
                else if (/boundary/.test(lid)) map.setPaintProperty(id, 'fill-opacity', 0);
              } else if (t === 'line') {
                if (/boundary|admin/.test(lid)) { map.setPaintProperty(id, 'line-color', '#D5DAE0'); map.setPaintProperty(id, 'line-dasharray', [3, 3]); }
                else if (/casing/.test(lid)) map.setLayoutProperty(id, 'visibility', 'none');
                else if (/motorway|trunk|highway/.test(lid)) { map.setPaintProperty(id, 'line-color', T.highway); var w = map.getPaintProperty(id, 'line-width'); if (typeof w === 'number') map.setPaintProperty(id, 'line-width', Math.max(1, w * 0.8)); else if (w) map.setPaintProperty(id, 'line-width', ['*', w, 0.8]); }
                else if (/primary|secondary|major|rail/.test(lid)) map.setPaintProperty(id, 'line-color', /rail/.test(lid) ? '#E3E6EA' : T.major);
                else if (/water|river|stream|canal/.test(lid)) map.setPaintProperty(id, 'line-color', T.water);
                else { map.setPaintProperty(id, 'line-color', T.minor); if (/minor|service|path|street|tertiary|residential|link|track|footway|cycle|pedestrian|bridge|tunnel/.test(lid)) map.setLayerZoomRange(id, 9, 24); }
              } else if (t === 'symbol') {
                if (/poi|shield|housenum|oneway/.test(lid)) { map.setLayoutProperty(id, 'visibility', 'none'); return; }
                map.setPaintProperty(id, 'text-color', /place|city|town|state|country/.test(lid) ? T.label : T.labelSoft);
                map.setPaintProperty(id, 'text-halo-color', '#FFFFFF'); map.setPaintProperty(id, 'text-halo-width', 1);
                var size = map.getLayoutProperty(id, 'text-size');
                if (typeof size === 'number') map.setLayoutProperty(id, 'text-size', Math.round(size * 0.85 * 10) / 10);
                else if (size) map.setLayoutProperty(id, 'text-size', ['*', size, 0.85]);
                if (/country/.test(lid)) map.setLayoutProperty(id, 'visibility', 'none');
              }
            } catch (e) {}
          });
        }
        function circlePoly(lat, lng, r) { var pts = []; for (var i = 0; i <= 48; i++) { var a = i / 48 * Math.PI * 2; var dLat = r / 111320 * Math.cos(a); var dLng = r / (111320 * Math.cos(lat * Math.PI / 180)) * Math.sin(a); pts.push([lng + dLng, lat + dLat]); } return pts; }
        function sitesGeo() { return { type: 'FeatureCollection', features: S.sites.map(function (s) { return { type: 'Feature', properties: { id: s.id, name: s.name + ' · ' + unitsAt(s).length }, geometry: { type: 'Polygon', coordinates: [circlePoly(s.lat, s.lng, s.radius)] } }; }) }; }
        function sitePts() { return { type: 'FeatureCollection', features: S.sites.map(function (s) { return { type: 'Feature', properties: { id: s.id, name: s.name + ' · ' + unitsAt(s).length }, geometry: { type: 'Point', coordinates: [s.lng, s.lat + s.radius / 111320 * 1.15] } }; }) }; }
        var markers = {};
        map.on('load', function () {
          repaint();
          map.addSource('sites', { type: 'geojson', data: sitesGeo() });
          map.addSource('site-pts', { type: 'geojson', data: sitePts() });
          map.addLayer({ id: 'site-fill', type: 'fill', source: 'sites', paint: { 'fill-color': '#5B626A', 'fill-opacity': 0.04 } });
          map.addLayer({ id: 'site-line', type: 'line', source: 'sites', paint: { 'line-color': '#5B626A', 'line-width': 1, 'line-dasharray': [3, 3] } });
          map.addLayer({ id: 'site-label', type: 'symbol', source: 'site-pts', minzoom: 10, layout: { 'text-field': ['get', 'name'], 'text-size': 10.5, 'text-anchor': 'bottom', 'text-allow-overlap': false }, paint: { 'text-color': '#646B73', 'text-halo-color': '#FFFFFF', 'text-halo-width': 1.2 } });
          map.addSource('preview', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
          map.addLayer({ id: 'preview-line', type: 'line', source: 'preview', paint: { 'line-color': '#1B1E22', 'line-width': 1.5, 'line-dasharray': [2, 2] } });
          ['site-fill', 'site-label'].forEach(function (lid) {
            map.on('click', lid, function (e) { var f = e.features && e.features[0]; if (!f) return; var s = S.sites.filter(function (x) { return x.id === f.properties.id; })[0]; if (s) { mapApi.pan(s.lat, s.lng, 13); flowSite(s); } });
            map.on('mouseenter', lid, function () { map.getCanvas().style.cursor = 'pointer'; }); map.on('mouseleave', lid, function () { map.getCanvas().style.cursor = ''; });
          });
          pins.forEach(function (p) { var e = document.createElement('div'); e.className = 'ping-wrap'; e.innerHTML = '<span class="ping ' + p[2] + '"><i></i></span>'; if (p[3]) { e.title = p[3]; e.addEventListener('click', function (ev) { ev.stopPropagation(); if (/rental/.test(p[3])) { location.href = 'parts.html#rentals'; return; } flowVehicle(p[3].replace('Unit #', '')); }); markers[p[3].replace('Unit #', '')] = e; } new maplibregl.Marker({ element: e }).setLngLat([p[1], p[0]]).addTo(map); });
          map.on('click', function (e) { if (mapApi.onClick) mapApi.onClick(e.lngLat.lat, e.lngLat.lng); });
          ready();
        });
        map.on('error', function (e) { if (e && e.error && /40[13]/.test(String(e.error.status || e.error.message))) fail(); });
        mapApi.pan = function (lat, lng, z) { map.flyTo({ center: [lng, lat], zoom: z || 10, speed: 1.4 }); };
        mapApi.hot = function (unit, on) { var e = markers[unit]; if (e) e.classList.toggle('hot', !!on); };
        mapApi.refreshSites = function () { var s1 = map.getSource('sites'), s2 = map.getSource('site-pts'); if (s1) s1.setData(sitesGeo()); if (s2) s2.setData(sitePts()); };
        mapApi.preview = function (lat, lng, r) { var s = map.getSource('preview'); if (s) s.setData({ type: 'FeatureCollection', features: [{ type: 'Feature', geometry: { type: 'Polygon', coordinates: [circlePoly(lat, lng, r)] } }] }); };
      });
    } else {
      loadCss('https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css');
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js', function () {
        clearTimeout(timeout);
        var map = L.map('map', { zoomControl: false, scrollWheelZoom: false }).setView([38.2, -77.9], 7);
        L.control.zoom({ position: 'topright' }).addTo(map);
        var layer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', { attribution: 'Tiles &copy; Esri', maxZoom: 16 });
        { map.createPane('labels'); map.getPane('labels').style.zIndex = 650; map.getPane('labels').style.pointerEvents = 'none'; L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}', { pane: 'labels', maxZoom: 16 }).addTo(map); el.classList.add('light'); }
        var errs = 0; layer.on('tileerror', function () { if (++errs > 6) fail(); }); layer.on('load', ready);
        layer.addTo(map);
        var markers = {};
        pins.forEach(function (p) { var m = L.marker([p[0], p[1]], { icon: L.divIcon({ className: 'ping-wrap', html: '<span class="ping ' + p[2] + '"><i></i></span>', iconSize: [28, 28], iconAnchor: [14, 14] }), keyboard: !!p[3], title: p[3] || '' }).addTo(map); if (p[3]) { markers[p[3].replace('Unit #', '')] = m; m.bindTooltip(p[3], { direction: 'top', offset: [0, -10] }); m.on('click', function () { if (/rental/.test(p[3])) { location.href = 'parts.html#rentals'; return; } flowVehicle(p[3].replace('Unit #', '')); }); } });
        mapApi.hot = function (unit, on) { var m = markers[unit]; if (m && m._icon) m._icon.classList.toggle('hot', !!on); };
        mapApi.pan = function (lat, lng, z) { map.setView([lat, lng], z || 10); };
        var siteLayer = L.layerGroup().addTo(map), previewCircle = null;
        mapApi.refreshSites = function () {
          siteLayer.clearLayers();
          S.sites.forEach(function (s) {
            var c = L.circle([s.lat, s.lng], { radius: s.radius, color: '#5B626A', weight: 1, fillColor: '#5B626A', fillOpacity: 0.04, className: 'geofence' }).addTo(siteLayer);
            c.bindTooltip(s.name + ' · ' + unitsAt(s).length, { permanent: true, direction: 'top', offset: [0, -4], className: 'site-label', opacity: 1, interactive: true });
            c.on('click', function () { mapApi.pan(s.lat, s.lng, 13); flowSite(s); });
          });
        };
        mapApi.refreshSites();
        function labelsByZoom() { el.classList.toggle('labels-hidden', map.getZoom() < 10); }
        map.on('zoomend', labelsByZoom); labelsByZoom();
        mapApi.preview = function (lat, lng, r) { if (previewCircle) map.removeLayer(previewCircle); previewCircle = L.circle([lat, lng], { radius: r, color: '#1B1E22', weight: 1.5, dashArray: '4 4', fillOpacity: 0.04 }).addTo(map); };
        map.on('click', function (e) { if (mapApi.onClick) mapApi.onClick(e.latlng.lat, e.latlng.lng); });
        setTimeout(ready, 2500);
      });
    }
  }

  /* ---------- boot ---------- */
  function renderPage() { var p = document.body.getAttribute('data-page'); if (renderers[p]) renderers[p](); }
  document.addEventListener('DOMContentLoaded', function () {
    if (!requireLogin()) return;
    applyPersona();
    initNav(); initBell(); initSearch(); initStamp();
    qsa('[data-flow-cart]').forEach(function (b) { b.addEventListener('click', function (e) { e.preventDefault(); flowCart({ unit: document.body.getAttribute('data-page') === 'unit' ? ((location.search.match(/[?&]u=(\d+)/) || [])[1] || '') : '' }); }); });
    renderCartBadge();
    renderPage();
  });
  window.CTOS.flows = { schedule: flowSchedule, vehicle: flowVehicle, cart: flowCart, ticket: flowTicket, addVehicle: flowVehicleForm };
})();
