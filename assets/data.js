// CTOS One demo data. One dataset for every page; app.js renders from it.
// Totals are computed in app.js from these rows, never typed in separately.
window.CTOS_SEED = {
  today: 'Tue, Oct 27',
  user: { name: 'Mike Brown', initials: 'MB', org: 'Shenandoah Line Services', fleetSize: 48 },

  vehicles: [
    { unit: '1042', vin: '1FVACXDT3NHAB1042', source: 'ctos', telematics: 'ctos', model: '2022 Freightliner M2 106 · Altec AA55 aerial', chassis: '2022 Freightliner M2 106', body: 'Altec AA55 aerial, 55 ft', kind: 'Bucket truck', state: 'moving', status: 'On site · PTO engaged', loc: 'Garrisonville substation, Stafford, VA', odo: 84212, hours: 2310, fuel: 68, mpg: 7.9, nextPm: 85000, nextService: 'Today', nextIn: 0, nextWhat: 'PM service, booked today', driver: 'T. Whitaker', lat: 38.418, lng: -77.412, dtc: '',
      components: [
        { id: 'c1', role: 'chassis', name: 'Chassis', make: 'Freightliner', model: 'M2 106', serial: '1FVACXDT3NHAB1042', year: 2022, spec: 'Cummins B6.7 260 hp · Allison 2500 RDS · 33,000 GVWR · 4x2 · 190" WB', warranty: 'Powertrain to Mar 2027 or 250,000 mi' },
        { id: 'c2', role: 'body', name: 'Body', make: 'Altec', model: 'Line body, 11 ft', serial: 'ALT-B-224781', year: 2022, spec: 'Aluminum, 4 compartments per side, 2,500 lb cargo, strobe package', warranty: 'Structural to Mar 2032' },
        { id: 'c3', role: 'aerial', name: 'Aerial device', make: 'Altec', model: 'AA55', serial: 'ALT-A-0922-1178', year: 2022, hours: 2310, capacity: '55 ft working height · 350 lb platform · Category C insulated', spec: 'Articulating telescopic, hydraulic jib, 46 kV insulated upper boom', warranty: 'Boom structure to Mar 2027' }
      ] },
    { unit: '1058', vin: '1HTEUMML2MH001058', source: 'ctos', telematics: 'ctos', model: '2021 International MV607 · Terex XT55 aerial', chassis: '2021 International MV607', body: 'Terex Hi-Ranger XT55 aerial, 55 ft', kind: 'Bucket truck', state: 'fault', status: 'Fault reported', loc: 'Garrisonville substation, Stafford, VA', odo: 103870, hours: 3140, fuel: 41, mpg: 7.2, nextPm: 125000, nextService: 'Nov 12', nextIn: 16, nextWhat: 'PM service', driver: 'R. Alvarez', lat: 38.421, lng: -77.408, dtc: 'SPN 3226',
      components: [
        { id: 'c1', role: 'chassis', name: 'Chassis', make: 'International', model: 'MV607', serial: '1HTEUMML2MH001058', year: 2021, spec: 'Cummins B6.7 280 hp · Allison 3000 RDS · 35,000 GVWR · 4x2', warranty: 'Expired Jun 2026' },
        { id: 'c2', role: 'body', name: 'Body', make: 'Terex', model: 'Utility body, 10 ft', serial: 'TRX-B-77120', year: 2021, spec: 'Steel, through compartment, 2 ladder racks', warranty: 'Structural to Jun 2031' },
        { id: 'c3', role: 'aerial', name: 'Aerial device', make: 'Terex', model: 'Hi-Ranger XT55', serial: 'TRX-A-21-4410', year: 2021, hours: 3140, capacity: '55 ft working height · 400 lb platform · Category C', spec: 'Over-center, material handling jib 1,000 lb', warranty: 'Expired Jun 2026' }
      ] },
    { unit: '1076', vin: '2NKHHM7X5PM001076', source: 'ctos', telematics: 'ctos', model: '2023 Kenworth T380 · Palfinger PK 18500 crane', chassis: '2023 Kenworth T380', body: 'Reading service body + Palfinger PK 18500 knuckleboom', kind: 'Crane service truck', state: 'moving', status: 'On site · crane in use', loc: 'Harrisonburg job site, US-33', odo: 46501, hours: 980, fuel: 82, mpg: 8.1, nextPm: 50000, nextService: 'Oct 28', nextIn: -1, nextWhat: 'Brake inspection, Oct 28', driver: 'D. Pham', lat: 38.45, lng: -78.87, dtc: '',
      components: [
        { id: 'c1', role: 'chassis', name: 'Chassis', make: 'Kenworth', model: 'T380', serial: '2NKHHM7X5PM001076', year: 2023, spec: 'PACCAR PX-7 300 hp · Allison 3000 RDS · 35,000 GVWR · 4x2 · 228" WB', warranty: 'Powertrain to Feb 2028' },
        { id: 'c2', role: 'body', name: 'Body', make: 'Reading', model: 'Classic II SL, 14 ft', serial: 'RDG-SL14-55821', year: 2023, spec: 'Steel service body, crane-reinforced, 12V outlets, drawer pack', warranty: 'Structural to Feb 2033' },
        { id: 'c3', role: 'crane', name: 'Crane', make: 'Palfinger', model: 'PK 18500', serial: 'PAL-18500-30417', year: 2023, hours: 980, capacity: '12 t·m · 7,300 lb at 8 ft · 46 ft horizontal reach', spec: 'Knuckleboom, radio remote, Paltronic 50 overload', warranty: 'Structure to Feb 2028' }
      ] },
    { unit: '1081', vin: '1FVHCYFE5LHAB1081', source: 'other', telematics: 'byo', model: '2020 Freightliner M2 112 · Altec DC47 digger derrick', chassis: '2020 Freightliner M2 112', body: 'Altec DC47 digger derrick', kind: 'Digger derrick', state: 'idle', status: 'Idling · 23 min', loc: 'Richmond yard', odo: 141118, hours: 4120, fuel: 55, mpg: 6.4, nextPm: 150000, nextService: 'Nov 20', nextIn: 21, nextWhat: 'PM service', driver: 'M. Castillo', lat: 37.539, lng: -77.432, dtc: '',
      components: [
        { id: 'c1', role: 'chassis', name: 'Chassis', make: 'Freightliner', model: 'M2 112', serial: '1FVHCYFE5LHAB1081', year: 2020, spec: 'Detroit DD8 350 hp · Allison 3500 RDS · 60,000 GVWR · 6x4', warranty: 'Expired' },
        { id: 'c2', role: 'body', name: 'Body', make: 'Altec', model: 'Derrick flatbed, 16 ft', serial: 'ALT-B-198220', year: 2020, spec: 'Steel, pole racks, outrigger pads', warranty: 'Structural to Jan 2030' },
        { id: 'c3', role: 'derrick', name: 'Digger derrick', make: 'Altec', model: 'DC47', serial: 'ALT-D-20-0771', year: 2020, hours: 4120, capacity: '47 ft sheave height · 16,000 lb max · 4,850 lb at full reach', spec: 'Hydraulic digger, 24" auger, pole guide', warranty: 'Expired' }
      ] },
    { unit: '1093', vin: '1FDXF7DC8NDF01093', source: 'ctos', telematics: 'ctos', model: '2022 Ford F-750 · Versalift VST-52 aerial', chassis: '2022 Ford F-750', body: 'Versalift VST-52 aerial, 52 ft', kind: 'Bucket truck', state: 'moving', status: 'On site · PTO engaged', loc: 'Dulles substation, Sterling, VA', odo: 72944, hours: 1870, fuel: 74, mpg: 8.4, nextPm: 75000, nextService: 'Nov 2', nextIn: 3, nextWhat: 'DOT inspection', driver: 'K. Brooks', lat: 38.952, lng: -77.447, dtc: '',
      components: [
        { id: 'c1', role: 'chassis', name: 'Chassis', make: 'Ford', model: 'F-750', serial: '1FDXF7DC8NDF01093', year: 2022, spec: '7.3L V8 gas 350 hp · TorqShift 10-speed · 33,000 GVWR', warranty: 'Powertrain to Apr 2027' },
        { id: 'c2', role: 'body', name: 'Body', make: 'Versalift', model: 'Line body, 11 ft', serial: 'VST-B-3384', year: 2022, spec: 'Fiberglass, 4 compartments per side', warranty: 'Structural to Apr 2032' },
        { id: 'c3', role: 'aerial', name: 'Aerial device', make: 'Versalift', model: 'VST-52', serial: 'VST-A-22-0915', year: 2022, hours: 1870, capacity: '52 ft working height · 350 lb platform · Category C', spec: 'Telescopic articulating, jib and winch', warranty: 'Boom to Apr 2027' }
      ] },
    { unit: '1104', vin: '3HAMMMML9KL001104', source: 'other', telematics: 'ctos', model: '2019 International 4300 · IMT 7500 crane', chassis: '2019 International 4300', body: 'Reading service body + IMT 7500 crane', kind: 'Crane service truck', state: 'shop', status: 'In service', loc: 'CTOS Richmond', odo: 188430, hours: 5210, fuel: 30, mpg: 6.9, nextPm: 200000, nextService: 'In shop', nextIn: 0, nextWhat: 'In shop', driver: '', lat: 37.50, lng: -77.52, dtc: '',
      components: [
        { id: 'c1', role: 'chassis', name: 'Chassis', make: 'International', model: '4300', serial: '3HAMMMML9KL001104', year: 2019, spec: 'Cummins B6.7 240 hp · Allison 2500 RDS · 33,000 GVWR', warranty: 'Expired' },
        { id: 'c2', role: 'body', name: 'Body', make: 'Reading', model: 'Classic II SL, 11 ft', serial: 'RDG-SL11-41177', year: 2019, spec: 'Steel service body, crane-reinforced, compressor compartment', warranty: 'Expired' },
        { id: 'c3', role: 'crane', name: 'Crane', make: 'IMT', model: '7500', serial: 'IMT-7500-19-2208', year: 2019, hours: 5210, capacity: '7,500 lb at 4 ft · 24 ft reach · 34,000 ft-lb', spec: 'Telescopic, radio remote, hex boom', warranty: 'Expired' },
        { id: 'c4', role: 'equipment', name: 'Compressor', make: 'Vanair', model: 'Viper G80', serial: 'VNR-G80-55310', year: 2019, hours: 2960, capacity: '80 cfm · 150 psi', spec: 'Gas drive, body-mounted', warranty: 'Expired' }
      ] },
    { unit: '1110', vin: '2NP3HJ7X8PM001110', source: 'ctos', telematics: 'ctos', model: '2023 Peterbilt 548 · Dur-A-Lift DTAX-45 aerial', chassis: '2023 Peterbilt 548', body: 'Dur-A-Lift DTAX-45 aerial, 45 ft', kind: 'Bucket truck', state: 'moving', status: 'Returning · 38 mph', loc: 'Shenandoah yard, Stafford', odo: 31207, hours: 640, fuel: 91, mpg: 8.6, nextPm: 50000, nextService: 'Dec 4', nextIn: 35, nextWhat: 'PM service', driver: 'A. Nguyen', lat: 38.962, lng: -77.357, dtc: '',
      components: [
        { id: 'c1', role: 'chassis', name: 'Chassis', make: 'Peterbilt', model: '548', serial: '2NP3HJ7X8PM001110', year: 2023, spec: 'PACCAR PX-7 300 hp · Allison 3000 RDS · 35,000 GVWR', warranty: 'Powertrain to Jun 2028' },
        { id: 'c2', role: 'body', name: 'Body', make: 'Dur-A-Lift', model: 'Line body, 11 ft', serial: 'DAL-B-7701', year: 2023, spec: 'Aluminum, 3 compartments per side', warranty: 'Structural to Jun 2033' },
        { id: 'c3', role: 'aerial', name: 'Aerial device', make: 'Dur-A-Lift', model: 'DTAX-45', serial: 'DAL-A-23-0388', year: 2023, hours: 640, capacity: '45 ft working height · 350 lb platform · Category C', spec: 'Telescopic articulating', warranty: 'Boom to Jun 2028' }
      ] },
    { unit: '1117', vin: '3C7WRNFL2MG001117', source: 'ctos', telematics: 'ctos', model: '2021 Ram 5500 · Auto Crane 6406H', chassis: '2021 Ram 5500', body: 'Knapheide service body + Auto Crane 6406H', kind: 'Crane service truck', state: 'idle', status: 'Idling · 8 min', loc: 'Dulles substation, Sterling, VA', odo: 98640, hours: 1420, fuel: 17, mpg: 10.8, nextPm: 100000, nextService: 'Nov 8', nextIn: 9, nextWhat: 'PM service', driver: 'J. Okoro', lat: 38.949, lng: -77.452, dtc: '',
      components: [
        { id: 'c1', role: 'chassis', name: 'Chassis', make: 'Ram', model: '5500', serial: '3C7WRNFL2MG001117', year: 2021, spec: '6.7L Cummins 360 hp · Aisin 6-speed · 19,500 GVWR · 4x4', warranty: 'Powertrain to Sep 2026' },
        { id: 'c2', role: 'body', name: 'Body', make: 'Knapheide', model: 'KMT1 mechanics, 11 ft', serial: 'KNP-KMT1-88402', year: 2021, spec: 'Steel, crane-reinforced, drawer units', warranty: 'Structural to Sep 2027' },
        { id: 'c3', role: 'crane', name: 'Crane', make: 'Auto Crane', model: '6406H', serial: 'AC-6406H-21-1190', year: 2021, hours: 1420, capacity: '6,400 lb at 1 ft · 24 ft reach · 38,400 ft-lb', spec: 'Hydraulic telescopic, wireless remote', warranty: 'Expired' }
      ] },
    { unit: '1122', vin: '1FVHG5CY7LHAB1122', source: 'other', telematics: 'byo', model: '2020 Freightliner 114SD · Terex C4047 digger derrick', chassis: '2020 Freightliner 114SD', body: 'Terex Commander C4047 digger derrick', kind: 'Digger derrick', state: 'off', status: 'Parked', loc: 'Richmond yard', odo: 133015, hours: 3880, fuel: 63, mpg: 6.1, nextPm: 135000, nextService: 'Nov 18', nextIn: 19, nextWhat: 'PM service', driver: 'S. Reed', lat: 37.542, lng: -77.427, dtc: '',
      components: [
        { id: 'c1', role: 'chassis', name: 'Chassis', make: 'Freightliner', model: '114SD', serial: '1FVHG5CY7LHAB1122', year: 2020, spec: 'Detroit DD13 410 hp · Allison 4500 RDS · 66,000 GVWR · 6x4', warranty: 'Expired' },
        { id: 'c2', role: 'body', name: 'Body', make: 'Terex', model: 'Derrick flatbed, 18 ft', serial: 'TRX-B-60377', year: 2020, spec: 'Steel, pole racks, winch', warranty: 'Structural to Mar 2030' },
        { id: 'c3', role: 'derrick', name: 'Digger derrick', make: 'Terex', model: 'Commander C4047', serial: 'TRX-D-20-1162', year: 2020, hours: 3880, capacity: '47 ft sheave height · 17,500 lb max', spec: 'Hydraulic digger, pole claws, 30" auger', warranty: 'Expired' }
      ] },
    { unit: '1130', vin: '1FVACXDT9NHAB1130', source: 'ctos', telematics: 'ctos', model: '2022 Freightliner M2 106 · Altec AT40G aerial', chassis: '2022 Freightliner M2 106', body: 'Altec AT40G aerial, 45 ft', kind: 'Bucket truck', state: 'off', status: 'Parked', loc: 'Shenandoah yard, Stafford', odo: 43780, hours: 1120, fuel: 77, mpg: 8.0, nextPm: 50000, nextService: 'Dec 1', nextIn: 32, nextWhat: 'PM service', driver: '', lat: 38.959, lng: -77.362, dtc: '',
      components: [
        { id: 'c1', role: 'chassis', name: 'Chassis', make: 'Freightliner', model: 'M2 106', serial: '1FVACXDT9NHAB1130', year: 2022, spec: 'Cummins B6.7 260 hp · Allison 2500 RDS · 33,000 GVWR', warranty: 'Powertrain to Aug 2027' },
        { id: 'c2', role: 'body', name: 'Body', make: 'Altec', model: 'Line body, 11 ft', serial: 'ALT-B-231002', year: 2022, spec: 'Aluminum, 4 compartments per side', warranty: 'Structural to Aug 2032' },
        { id: 'c3', role: 'aerial', name: 'Aerial device', make: 'Altec', model: 'AT40G', serial: 'ALT-A-0922-2210', year: 2022, hours: 1120, capacity: '45 ft working height · 350 lb platform · Category C', spec: 'Telescopic articulating, non-overcenter', warranty: 'Boom to Aug 2027' }
      ] }
,
    { unit: '1138', vin: '1FVHCYFE8NHAB1138', source: 'ctos', telematics: 'ctos', model: '2022 Freightliner M2 112 · Pole trailer tractor', chassis: '2022 Freightliner M2 112', body: 'Fifth wheel, pole trailer', kind: 'Dump and flatbed', state: 'idle', status: 'On site · unloading', loc: 'Harrisonburg job site, US-33', odo: 58210, hours: 0, fuel: 59, mpg: 7.4, nextPm: 75000, nextService: 'Dec 9', nextIn: 40, nextWhat: 'PM service', driver: 'P. Diaz', lat: 38.453, lng: -78.873, dtc: '',
      components: [
        { id: 'c1', role: 'chassis', name: 'Chassis', make: 'Freightliner', model: 'M2 112', serial: '1FVHCYFE8NHAB1138', year: 2022, spec: 'Detroit DD8 350 hp · Allison 3500 RDS · 56,000 GVWR · 6x4', warranty: 'Powertrain to May 2027' },
        { id: 'c2', role: 'body', name: 'Body', make: 'Fontaine', model: 'Fifth wheel and pole trailer', serial: 'FNT-PT-20991', year: 2022, spec: '40 ft pole trailer, hydraulic brakes', warranty: 'Structural to May 2027' }
      ] },
    { unit: '1145', vin: '1FDXF7DC2PDF01145', source: 'ctos', telematics: 'ctos', model: '2023 Ford F-750 · Altec AT37G aerial', chassis: '2023 Ford F-750', body: 'Altec AT37G aerial, 42 ft', kind: 'Bucket truck', state: 'shop', status: 'In service', loc: 'CTOS Fredericksburg', odo: 22140, hours: 410, fuel: 52, mpg: 8.9, nextPm: 25000, nextService: 'In shop', nextIn: 0, nextWhat: 'In shop, dielectric test', driver: '', lat: 38.301, lng: -77.459, dtc: '',
      components: [
        { id: 'c1', role: 'chassis', name: 'Chassis', make: 'Ford', model: 'F-750', serial: '1FDXF7DC2PDF01145', year: 2023, spec: '7.3L V8 gas 350 hp · TorqShift 10-speed · 33,000 GVWR', warranty: 'Powertrain to Jun 2028' },
        { id: 'c2', role: 'body', name: 'Body', make: 'Altec', model: 'Line body, 11 ft', serial: 'ALT-B-240118', year: 2023, spec: 'Aluminum, 4 compartments per side', warranty: 'Structural to Jun 2033' },
        { id: 'c3', role: 'aerial', name: 'Aerial device', make: 'Altec', model: 'AT37G', serial: 'ALT-A-0623-0442', year: 2023, hours: 410, capacity: '42 ft working height · 350 lb platform · Category C', spec: 'Telescopic articulating, non-overcenter', warranty: 'Boom to Jun 2028' }
      ] }
  ],
  // Extra pins for the map beyond the ten vehicles listed above
  extraPins: [[38.423,-77.414,'moving'],[38.417,-77.406,'idle'],[38.953,-77.453,'moving'],[38.447,-78.866,'moving'],[38.452,-78.874,'idle'],[37.541,-77.436,'off'],[38.958,-77.356,'off'],[38.963,-77.363,'off'],[38.75,-77.48,'moving'],[37.78,-77.47,'moving'],[38.92,-78.19,'moving'],[37.23,-80.42,'moving']],
  fleetCounts: { total: 48, moving: 36, idle: 5, fault: 2, shop: 5, byKind: { 'Bucket truck': 22, 'Digger derrick': 9, 'Crane service truck': 8, 'Dump and flatbed': 6, 'Pickup': 3 } },
  telemetry: { milesToday: 3214, milesWeek: 21414, idlePct: 18.4, mpg30: 7.6, uptime30: 97.8, fuelWeek: 11920, idleAvgMin: 52, hardBraking: 4, serviced: 5, ptoHoursWeek: 612 },

  events: [
    { t: '2:41 PM', unit: '1058', text: 'Check-engine fault SPN 3226 reported', kind: 'fault' },
    { t: '2:18 PM', unit: '1081', text: 'Idle threshold exceeded, 20 min, PTO off', kind: '' },
    { t: '1:52 PM', unit: '1104', text: 'Checked in at CTOS Richmond for PM service', kind: '' },
    { t: '12:30 PM', unit: '1117', text: 'Fuel below 20%', kind: '' },
    { t: '11:05 AM', unit: '1076', text: 'Crane overload cutout, 92% at 24 ft', kind: '' },
    { t: '9:14 AM', unit: '1130', text: 'Ignition off, Shenandoah yard', kind: '' }
  ],

  attention: [
    { id: 'a1', unit: '1058', title: 'Check-engine fault', level: 'high', label: 'Action needed', text: 'SPN 3226 reported at 2:41 PM. The truck is stopped on US-1 in Stafford. CTOS Fredericksburg is 14 miles away.', action: 'Schedule diagnostic', flow: 'schedule', unitFor: '1058', job: 'Diagnostic, SPN 3226' },
    { id: 'a2', unit: '1081', title: 'Idling 23 minutes, PTO off', level: 'med', label: 'Review', text: 'Over the 20-minute threshold at the Richmond yard with the PTO disengaged. Roughly 0.8 gallons burned so far.', action: 'Message driver', flow: 'message', unitFor: '1081' },
    { id: 'a3', unit: '1117', title: 'Fuel at 17%', level: '', label: 'Insight', text: 'About 90 miles of range left from the Dulles substation.', action: 'View route', flow: 'vehicle', unitFor: '1117' }
  ],

  appointments: [
    { id: 'ap1', unit: '1042', job: 'PM service', loc: 'CTOS Fredericksburg', day: 27, dateLabel: 'Today, Oct 27', time: '9:00 AM' },
    { id: 'ap2', unit: '1076', job: 'Brake inspection', loc: 'CTOS Richmond', day: 28, dateLabel: 'Wed, Oct 28', time: '11:00 AM' },
    { id: 'ap3', unit: '1093', job: 'DOT inspection', loc: 'CTOS Fredericksburg', day: 33, dateLabel: 'Mon, Nov 2', time: '8:00 AM' }
  ],
  unscheduled: [ { id: 'u1', unit: '1058', job: 'Diagnostic, SPN 3226', note: 'Fault reported yesterday' } ],
  week: [['Mon',26],['Tue',27],['Wed',28],['Thu',29],['Fri',30],['Sat',31],['Sun',32]],
  inShopDays: { '26': ['1104'], '27': ['1104', '1145'] },

  workorders: [
    { id: 'wo1', unit: '1104', where: 'CTOS Richmond', since: 'Mon 4:35 PM', state: 'waiting',
      summary: 'Checked in Monday 1:52 PM. Inspection found worn front brakes and a frayed hoist cable on the IMT 7500. Parts are in stock; the truck can be ready tomorrow by noon if approved today.',
      items: [['Brake pads and rotors, front axle','Chassis · parts',612],['Labor, 7.0 h at $140','Chassis · labor',980],['Crane hoist cable, replace','Crane · parts',250]],
      stages: [['Checked in','Mon 1:52 PM'],['Inspected','Mon 4:20 PM'],['Awaiting approval','Estimate sent 4:35 PM'],['In work',''],['Ready for pickup','Tomorrow by noon if approved today']], stage: 2 },
    { id: 'wo2', unit: '1081', where: 'Mobile tech, Richmond terminal', since: 'Tue 8:10 AM', state: 'waiting',
      summary: 'Mobile technician found the digger motor weeping and the fan clutch slipping during the idle check. The truck can stay in service; both are a two-hour job on site.',
      items: [['Fan clutch assembly','Chassis · parts',846],['Digger motor seal kit','Derrick · parts',58],['Labor, 2.0 h at $140, on site','Labor',280],['Mobile service call','Fee',112]],
      stages: [['Checked in','Tue 7:40 AM'],['Inspected','Tue 8:05 AM'],['Awaiting approval','Estimate sent 8:10 AM'],['In work',''],['Ready for pickup','Same day if approved by noon']], stage: 2 },
    { id: 'wo3', unit: '1130', where: 'Mobile tech, Shenandoah yard', since: 'Mon 5:50 PM', state: 'waiting',
      summary: 'Parked since Monday morning with a no-start. Both batteries tested below spec, and the upper boom hose on the AT40G is weeping at the fitting.',
      items: [['Batteries, pair, group 31','Chassis · parts',486],['Upper boom hydraulic hose','Aerial · parts',292],['Labor, 1.0 h at $140, on site','Labor',140]],
      stages: [['Checked in','Mon 3:30 PM'],['Inspected','Mon 5:40 PM'],['Awaiting approval','Estimate sent 5:50 PM'],['In work',''],['Ready for pickup','Same day if approved']], stage: 2 }
  ],

  serviceHistory: [
    { date: 'Oct 22', unit: '1110', comp: 'chassis', work: 'PM service, 30k', loc: 'Fredericksburg', cost: 742, inv: 'INV-20461' },
    { date: 'Oct 17', unit: '1081', comp: 'derrick', work: 'Digger motor seal, hydraulic fluid', loc: 'Richmond', cost: 318, inv: 'INV-20433' },
    { date: 'Oct 14', unit: '1130', comp: 'chassis', work: 'Steer tires, pair', loc: 'Fredericksburg', cost: 1296, inv: 'INV-20419' },
    { date: 'Oct 9', unit: '1122', comp: 'chassis', work: 'PM service, 130k', loc: 'Richmond', cost: 884, inv: 'INV-20398' },
    { date: 'Oct 6', unit: '1117', comp: 'crane', work: 'Crane remote receiver, rotation bearing grease', loc: 'Richmond', cost: 406, inv: 'INV-20380' },
    { date: 'Oct 2', unit: '1104', comp: 'chassis', work: 'Alternator', loc: 'Richmond', cost: 1184, inv: 'INV-20361' },
    { date: 'Sep 24', unit: '1042', comp: 'aerial', work: 'Annual ANSI A92.2 inspection and dielectric test', loc: 'Fredericksburg', cost: 796, inv: 'INV-20302' },
    { date: 'Sep 19', unit: '1076', comp: 'body', work: 'Compartment door latches, rear step', loc: 'Richmond', cost: 912, inv: 'INV-20288' }
  ],
  pmInterval: 25000,
  locations: [
    { name: 'CTOS Fredericksburg', dist: '14 mi from the Stafford yard', hours: 'Mon to Fri 6:00 AM to 8:00 PM, Sat to 2:00 PM', phone: '(540) 555-0142', open: true, address: '2200 Jefferson Davis Hwy, Fredericksburg, VA' },
    { name: 'CTOS Richmond', dist: '52 mi', hours: 'Mon to Fri 6:00 AM to 10:00 PM, Sat to 4:00 PM', phone: '(804) 555-0177', open: true, address: '7500 Midlothian Tpke, Richmond, VA' }
  ],

  orders: [
    { no: '48213', placed: 'Oct 24', unit: '1076', for: 'Brake inspection, Wed 11:00', ship: 'CTOS Richmond', state: 'shipped', eta: 'Wed, Oct 28', etaSub: 'Morning, before 11:00', carrier: 'CTOS truck from Fredericksburg',
      items: [['BW-7421','Brake pads, front axle set',1,286],['BW-7431','Brake rotor, front',2,212],['PAL-3081','Crane rotation bearing bolts, set',1,24]],
      stages: [['Placed','Fri Oct 24, 2:10 PM'],['Picked','Mon Oct 26, 7:30 AM'],['Shipped','Tue Oct 27, 6:15 AM'],['Delivered','Wed Oct 28, before 11:00']], stage: 2 },
    { no: '48190', placed: 'Oct 21', unit: '1122', for: 'PM service, Nov 18', ship: 'Shenandoah yard, Stafford', state: 'back', eta: 'Tue, Nov 3', etaSub: 'Was Oct 29', carrier: 'Supplier to CTOS Fredericksburg',
      items: [['TR-29580','Steer tire, 295/75R22.5',2,598],['TR-VLV','Valve stem and balance',2,18]],
      stages: [['Placed','Tue Oct 21, 9:40 AM'],['Backordered','Supplier date Nov 3'],['Shipped',''],['Delivered','']], stage: 1 },
    { no: '48227', placed: 'Oct 26', unit: '', for: 'Shop stock', ship: 'Shenandoah yard, Stafford', state: 'processing', eta: 'Thu, Oct 29', etaSub: 'Standard delivery', carrier: 'CTOS truck from Fredericksburg',
      items: [['FL-OIL-15','Oil filter, Cummins B6.7',6,34],['FL-FUEL-9','Fuel filter kit',6,52],['DEF-2.5','DEF, 2.5 gal',12,14.5],['WB-28','Wiper blade, 28 in',8,11]],
      stages: [['Placed','Mon Oct 26, 4:05 PM'],['Picked','In progress'],['Shipped',''],['Delivered','Thu Oct 29']], stage: 1 },
    { no: '48231', placed: 'Oct 27', unit: '1104', for: 'Approved estimate, Richmond', ship: 'CTOS Richmond', state: 'processing', eta: 'Today', etaSub: 'Pulled from Richmond stock', carrier: 'In shop',
      items: [['BW-7421','Brake pads, front axle set',1,286],['BW-7431','Brake rotor, front',2,212],['IMT-WC75','Hoist cable, 7500, 85 ft',1,82]],
      stages: [['Placed','Tue Oct 27, 8:52 AM'],['Picked','In progress'],['Shipped',''],['Delivered','Today, to the bay']], stage: 1 }
  ],
  orderHistory: [
    { no: '48174', date: 'Oct 20', for: 'Unit #1110 · PM service', items: 5, total: 312, inv: 'INV-20461' },
    { no: '48161', date: 'Oct 16', for: 'Unit #1081 · Digger seal kit', items: 1, total: 196, inv: 'INV-20433' },
    { no: '48150', date: 'Oct 13', for: 'Unit #1130 · Steer tires', items: 2, total: 1196, inv: 'INV-20419' },
    { no: '48138', date: 'Oct 8', for: 'Unit #1122 · PM service', items: 5, total: 338, inv: 'INV-20398' },
    { no: '48129', date: 'Oct 6', for: 'Unit #1117 · Crane remote receiver', items: 2, total: 88, inv: 'INV-20380' },
    { no: '48112', date: 'Oct 1', for: 'Unit #1104 · Alternator', items: 1, total: 644, inv: 'INV-20361' }
  ],
  reorder: [
    { pn: 'FL-OIL-15', d: 'Oil filter, Cummins B6.7', last: 'Oct 26', q: 6, p: 34 },
    { pn: 'FL-FUEL-9', d: 'Fuel filter kit', last: 'Oct 26', q: 6, p: 52 },
    { pn: 'DEF-2.5', d: 'DEF, 2.5 gal', last: 'Oct 26', q: 12, p: 14.5 },
    { pn: 'BW-7421', d: 'Brake pads, front axle set', last: 'Oct 27', q: 1, p: 286 },
    { pn: 'HYD-AW46', d: 'Hydraulic oil, AW46, 5 gal', last: 'Oct 16', q: 2, p: 118 },
    { pn: 'WB-28', d: 'Wiper blade, 28 in', last: 'Oct 26', q: 8, p: 11 }
  ],
  shipTo: ['Shenandoah yard, Stafford', 'CTOS Richmond', 'CTOS Fredericksburg'],
  trucks: [
    { no: 'T-2051', quote: 'Q-10301', ql: 'QL-01', spec: '2026 Freightliner M2 106 · Altec AA55', detail: 'Cummins B6.7 · Allison 2500 · 11 ft aluminum line body · AA55 aerial', price: 268400, ordered: 'Aug 14', eta: 'Dec 12', where: 'Altec, Burnsville NC', stage: 2,
      stages: [['Ordered','Aug 14'],['In production','Oct 6'],['Built, in transit','Nov 24'],['Prep at CTOS','Dec 8'],['Delivery','Dec 12']] },
    { no: 'T-2066', quote: 'Q-10388', ql: 'QL-01', spec: '2026 Kenworth T380 · Palfinger PK 23500', detail: 'PX-7 · Allison 3000 · 14 ft Reading body · PK 23500 knuckleboom', price: 214900, ordered: 'Sep 30', eta: 'Feb 2027', where: 'CTOS upfit, Kansas City', stage: 1,
      stages: [['Ordered','Sep 30'],['In production','Scheduled Dec'],['Built, in transit',''],['Prep at CTOS',''],['Delivery','Feb 2027']] }
  ],
  rentals: [
    { unit: 'R-418', spec: '2024 Freightliner M2 · Altec AA55 bucket', started: 'Oct 13', due: 'Thu, Oct 29', days: 16, rate: 415, state: 'due', status: 'On site · PTO engaged', loc: 'Garrisonville substation, Stafford, VA', lat: 38.419, lng: -77.415, driver: 'L. Hart', kind: 'Bucket truck', nextService: 'Nov 12' },
    { unit: 'R-402', spec: '2023 International MV · Terex C4047 derrick', started: 'Oct 6', due: 'Nov 6', days: 21, rate: 545, state: '', status: 'Moving · 41 mph', loc: 'US-29 N, Culpeper, VA', lat: 38.47, lng: -78.00, driver: 'P. Diaz', kind: 'Digger derrick', nextService: 'Dec 2' },
    { unit: 'R-431', spec: '2024 Ram 5500 · Auto Crane 6406H service', started: 'Oct 20', due: 'Nov 20', days: 7, rate: 265, state: '', status: 'Parked', loc: 'Shenandoah yard, Stafford', lat: 38.961, lng: -77.359, driver: '', kind: 'Crane service truck', nextService: 'Jan 8' }
  ],

  invoices: [
    { no: 'INV-20461', date: 'Oct 22', due: 'Nov 15', unit: '1110', desc: 'PM service, 60k', amount: 742, status: 'open' },
    { no: 'INV-20433', date: 'Oct 17', due: 'Nov 10', unit: '1081', desc: 'Digger motor seal', amount: 318, status: 'open' },
    { no: 'INV-20419', date: 'Oct 14', due: 'Nov 7', unit: '1130', desc: 'Steer tires, pair', amount: 1296, status: 'open' },
    { no: 'INV-20398', date: 'Oct 9', due: 'Nov 2', unit: '1122', desc: 'PM service, 230k', amount: 884, status: 'open' },
    { no: 'INV-20380', date: 'Oct 6', due: 'Oct 30', unit: '1117', desc: 'Crane remote receiver', amount: 406, status: 'paid', paidOn: 'Oct 20' },
    { no: 'INV-20361', date: 'Oct 2', due: 'Oct 26', unit: '1104', desc: 'Alternator', amount: 1184, status: 'paid', paidOn: 'Oct 15' },
    { no: 'INV-20302', date: 'Sep 24', due: 'Oct 18', unit: '1042', desc: 'ANSI A92.2 inspection and dielectric', amount: 796, status: 'paid', paidOn: 'Oct 9' },
    { no: 'INV-20288', date: 'Sep 19', due: 'Oct 13', unit: '1076', desc: 'Body door latches, rear step', amount: 912, status: 'paid', paidOn: 'Oct 2' }
  ],
  rentalBilling: { cycle: 'Oct 1 to Oct 31', billedOn: 'Nov 1' },
  paymentMethods: [ { id: 'ach', label: 'Bank account ending 4471', sub: 'ACH, no fee' }, { id: 'card', label: 'Visa ending 2208', sub: '2.9% processing fee' } ],
  autopay: false,

  team: [
    { initials: 'SM', name: 'Sarah Mitchell', role: 'Account Manager', scope: 'Your main contact for anything about the account, pricing, truck orders and escalations.', phone: '(630) 555-0184', email: 'sarah.mitchell@customtruck.com', tint: 'am' },
    { initials: 'DO', name: 'Dan Okafor', role: 'Parts Specialist, Fredericksburg', scope: 'Parts orders, backorders, sourcing and the reorder list.', phone: '(540) 555-0168', email: 'dan.okafor@customtruck.com', tint: 'parts' },
    { initials: 'LO', name: 'Luis Ortega', role: 'Service Advisor, Fredericksburg', scope: 'Scheduling, estimates and work in progress at Fredericksburg.', phone: '(540) 555-0150', email: 'luis.ortega@customtruck.com', tint: 'svc' },
    { initials: 'PN', name: 'Priya Nair', role: 'Service Advisor, Richmond', scope: 'Scheduling, estimates and work in progress at Richmond, including mobile service.', phone: '(804) 555-0161', email: 'priya.nair@customtruck.com', tint: 'svc' },
    { initials: 'JW', name: 'Jordan Wells', role: 'Rental Coordinator', scope: 'Rental units, extensions, returns and swap-outs.', phone: '(540) 555-0173', email: 'jordan.wells@customtruck.com', tint: 'rent' },
    { initials: 'AR', name: 'Accounts Receivable', role: 'Billing', scope: 'Invoices, payments, autopay and statements.', phone: '(800) 555-0199', email: 'ar@customtruck.com', tint: 'bill' }
  ],

  tickets: [
    { id: 'TK-5120', opened: 'Oct 23', subject: 'Telematics gap on Unit #1093 overnight', state: 'open', owner: 'Support', last: 'Oct 26 · We traced it to a cellular dead zone on I-64; the unit buffered and backfilled. Monitoring for a repeat.' },
    { id: 'TK-5098', opened: 'Oct 15', subject: 'Add two drivers to the portal', state: 'closed', owner: 'Support', last: 'Oct 16 · Both accounts created; invites sent.' }
  ],

  reports: [
    { id: 'fuel', name: 'Fuel economy by unit', period: 'Last 30 days', desc: 'MPG by vehicle against the fleet average, with idle percentage.', schedule: 'Weekly, Monday 7:00 AM' },
    { id: 'uptime', name: 'Uptime and downtime', period: 'Last 30 days', desc: 'Hours available, hours in the shop, and the reasons.', schedule: 'Monthly' },
    { id: 'spend', name: 'Service and parts spend', period: 'October', desc: 'Spend by unit and by category, with invoices.', schedule: 'Monthly' },
    { id: 'insp', name: 'Inspection and campaign compliance', period: 'Today', desc: 'ANSI, ASME and dielectric status by unit, and open recalls and bulletins.', schedule: 'Weekly, Monday 7:00 AM' },
    { id: 'pm', name: 'PM compliance', period: 'Year to date', desc: 'Services done inside the interval against those past due.', schedule: 'Not scheduled' }
  ],

  notifications: [
    { id: 'n1', level: 'high', read: false, title: 'Unit #1058 · Active fault code', text: 'Check-engine fault (SPN 3226) reported near Stafford, VA.', when: '14m', href: 'fleet.html#u1058' },
    { id: 'n2', level: 'med', read: false, title: '3 units with open work orders', text: 'Units #1104, #1081 and #1130. Priya will call to confirm the work.', when: '2h', href: 'service.html' },
    { id: 'n3', level: 'med', read: false, title: 'Campaign notice: Unit #1058', text: 'Terex XT55 leveling cable bulletin, plus the steering gear recall. Both can be done with the diagnostic.', when: 'Yesterday', href: 'service.html' },
    { id: 'n4', level: '', read: true, title: 'Order 48213 shipped', text: 'Brake pads and rotors for Unit #1076 arrive Wednesday.', when: 'Yesterday', href: 'parts.html#parts' },
    { id: 'n5', level: '', read: true, title: 'Invoice INV-20461 is ready', text: 'Unit #1110 PM service, $742.00, due Nov 15.', when: '2d', href: 'billing.html' },
    { id: 'n6', level: '', read: true, title: 'Sarah Mitchell left a note', text: '"Confirmed the DOT inspection for #1093 on Nov 2. Let me know if anything changes."', when: '3d', href: 'team.html' }
  ],
  cart: [],
  drivers: ['T. Whitaker','R. Alvarez','D. Pham','M. Castillo','K. Brooks','A. Nguyen','J. Okoro','S. Reed','L. Hart','P. Diaz'],
  driverDetail: [
    { name: 'T. Whitaker', full: 'Tom Whitaker', phone: '(540) 555-0201', tablet: true, cdl: 'Jun 2028' },
    { name: 'R. Alvarez', full: 'Rosa Alvarez', phone: '(540) 555-0202', tablet: true, cdl: 'Mar 2027' },
    { name: 'D. Pham', full: 'Danny Pham', phone: '(540) 555-0203', tablet: true, cdl: 'Nov 2029' },
    { name: 'M. Castillo', full: 'Marco Castillo', phone: '(804) 555-0204', tablet: true, cdl: 'Jan 2027' },
    { name: 'K. Brooks', full: 'Kim Brooks', phone: '(540) 555-0205', tablet: true, cdl: 'Aug 2028' },
    { name: 'A. Nguyen', full: 'An Nguyen', phone: '(703) 555-0206', tablet: true, cdl: 'May 2030' },
    { name: 'J. Okoro', full: 'Jide Okoro', phone: '(703) 555-0207', tablet: true, cdl: 'Dec 2026' },
    { name: 'S. Reed', full: 'Sam Reed', phone: '(540) 555-0208', tablet: true, cdl: 'Feb 2028' },
    { name: 'L. Hart', full: 'Lena Hart', phone: '(540) 555-0209', tablet: false, cdl: 'Sep 2027' },
    { name: 'P. Diaz', full: 'Pablo Diaz', phone: '(804) 555-0210', tablet: false, cdl: 'Oct 2029' }
  ],
  users: [
    { name: 'Mike Brown', email: 'mike@shenandoahfreight.com', role: 'owner', last: 'Now', status: 'active' },
    { name: 'Carla Jensen', email: 'carla@shenandoahfreight.com', role: 'dispatcher', last: 'Today, 7:40 AM', status: 'active' },
    { name: 'Ray Patel', email: 'ray@shenandoahfreight.com', role: 'dispatcher', last: 'Yesterday', status: 'active' },
    { name: 'Dana Fox', email: 'dana@shenandoahfreight.com', role: 'billing', last: 'Oct 20', status: 'active' },
    { name: 'Owen Marsh', email: 'owen@shenandoahfreight.com', role: 'viewer', last: 'Never', status: 'invited' }
  ],
  documents: [
    { unit: '1042', kind: 'Registration', expires: 'Mar 2027', file: 'reg-1042.pdf' },
    { unit: '1042', kind: 'Annual inspection', expires: 'Nov 14, 2026', file: 'dot-1042.pdf' },
    { unit: '1058', kind: 'Registration', expires: 'Jan 2027', file: 'reg-1058.pdf' },
    { unit: '1058', kind: 'Annual inspection', expires: 'Nov 3, 2026', file: 'dot-1058.pdf' },
    { unit: '1076', kind: 'Registration', expires: 'Aug 2027', file: 'reg-1076.pdf' },
    { unit: '1081', kind: 'Annual inspection', expires: 'Oct 30, 2026', file: 'dot-1081.pdf' },
    { unit: '1093', kind: 'Annual inspection', expires: 'Nov 2, 2026', file: 'dot-1093.pdf' },
    { unit: '1104', kind: 'Registration', expires: 'Dec 2026', file: 'reg-1104.pdf' },
    { unit: '1130', kind: 'Insurance card', expires: 'Jun 2027', file: 'ins-1130.pdf' }
  ],
  inspections: [
    { unit: '1042', comp: 'aerial', type: 'ANSI A92.2 annual', done: 'Sep 24, 2026', due: 'Sep 24, 2027', result: 'Pass', cert: 'ansi-1042-2026.pdf', by: 'CTOS Fredericksburg' },
    { unit: '1042', comp: 'aerial', type: 'Dielectric test', done: 'Sep 24, 2026', due: 'Sep 24, 2027', result: 'Pass · 46 kV', cert: 'diel-1042-2026.pdf', by: 'CTOS Fredericksburg' },
    { unit: '1042', comp: 'chassis', type: 'DOT annual', done: 'Nov 14, 2025', due: 'Nov 14, 2026', result: 'Pass', cert: 'dot-1042.pdf', by: 'CTOS Fredericksburg' },
    { unit: '1058', comp: 'aerial', type: 'ANSI A92.2 annual', done: 'Nov 3, 2025', due: 'Nov 3, 2026', result: 'Pass', cert: 'ansi-1058-2025.pdf', by: 'CTOS Fredericksburg' },
    { unit: '1058', comp: 'aerial', type: 'Dielectric test', done: 'Nov 3, 2025', due: 'Nov 3, 2026', result: 'Pass · 46 kV', cert: 'diel-1058-2025.pdf', by: 'CTOS Fredericksburg' },
    { unit: '1076', comp: 'crane', type: 'ASME B30.5 annual', done: 'Feb 20, 2026', due: 'Feb 20, 2027', result: 'Pass', cert: 'crane-1076-2026.pdf', by: 'CTOS Richmond' },
    { unit: '1081', comp: 'derrick', type: 'ANSI A10.31 annual', done: 'Oct 30, 2025', due: 'Oct 30, 2026', result: 'Pass', cert: 'derrick-1081-2025.pdf', by: 'Third party, Lyons Inspection' },
    { unit: '1081', comp: 'derrick', type: 'Dielectric test', done: 'Oct 30, 2025', due: 'Oct 30, 2026', result: 'Pass · 46 kV', cert: 'diel-1081-2025.pdf', by: 'Third party, Lyons Inspection' },
    { unit: '1093', comp: 'aerial', type: 'ANSI A92.2 annual', done: 'Nov 2, 2025', due: 'Nov 2, 2026', result: 'Pass', cert: 'ansi-1093-2025.pdf', by: 'CTOS Fredericksburg' },
    { unit: '1093', comp: 'aerial', type: 'Dielectric test', done: 'Nov 2, 2025', due: 'Nov 2, 2026', result: 'Pass · 46 kV', cert: 'diel-1093-2025.pdf', by: 'CTOS Fredericksburg' },
    { unit: '1104', comp: 'crane', type: 'ASME B30.5 annual', done: 'Aug 11, 2026', due: 'Aug 11, 2027', result: 'Pass, hoist cable noted', cert: 'crane-1104-2026.pdf', by: 'CTOS Richmond' },
    { unit: '1110', comp: 'aerial', type: 'ANSI A92.2 annual', done: 'Jun 30, 2026', due: 'Jun 30, 2027', result: 'Pass', cert: 'ansi-1110-2026.pdf', by: 'CTOS Fredericksburg' },
    { unit: '1110', comp: 'aerial', type: 'Dielectric test', done: 'Jun 30, 2026', due: 'Jun 30, 2027', result: 'Pass · 46 kV', cert: 'diel-1110-2026.pdf', by: 'CTOS Fredericksburg' },
    { unit: '1117', comp: 'crane', type: 'ASME B30.5 annual', done: 'Oct 6, 2025', due: 'Oct 6, 2026', result: 'Pass', cert: 'crane-1117-2025.pdf', by: 'CTOS Richmond' },
    { unit: '1122', comp: 'derrick', type: 'ANSI A10.31 annual', done: 'Mar 12, 2026', due: 'Mar 12, 2027', result: 'Pass', cert: 'derrick-1122-2026.pdf', by: 'CTOS Richmond' },
    { unit: '1122', comp: 'derrick', type: 'Dielectric test', done: 'Mar 12, 2026', due: 'Mar 12, 2027', result: 'Pass · 46 kV', cert: 'diel-1122-2026.pdf', by: 'CTOS Richmond' },
    { unit: '1130', comp: 'aerial', type: 'ANSI A92.2 annual', done: 'Aug 18, 2026', due: 'Aug 18, 2027', result: 'Pass', cert: 'ansi-1130-2026.pdf', by: 'CTOS Fredericksburg' },
    { unit: '1130', comp: 'aerial', type: 'Dielectric test', done: 'Aug 18, 2026', due: 'Aug 18, 2027', result: 'Pass · 46 kV', cert: 'diel-1130-2026.pdf', by: 'CTOS Fredericksburg' },
    { unit: '1145', comp: 'aerial', type: 'ANSI A92.2 annual', done: 'Oct 27, 2025', due: 'Oct 27, 2026', result: 'Pass', cert: 'ansi-1145-2025.pdf', by: 'CTOS Fredericksburg' },
    { unit: '1145', comp: 'aerial', type: 'Dielectric test', done: 'Oct 27, 2025', due: 'Oct 27, 2026', result: 'Pass · 46 kV', cert: 'diel-1145-2025.pdf', by: 'CTOS Fredericksburg' },
    { unit: '1138', comp: 'chassis', type: 'DOT annual', done: 'May 2, 2026', due: 'May 2, 2027', result: 'Pass', cert: 'dot-1138.pdf', by: 'CTOS Fredericksburg' }
  ],
  campaigns: [
    { id: 'CP-1', scope: 'aerial', maker: 'Terex', ref: 'SB-2026-014', title: 'Platform leveling cable inspection and replacement', severity: 'Safety bulletin', issued: 'Sep 30, 2026', units: [{ unit: '1058', status: 'open' }], remedy: 'Inspect cable, replace if frayed. About 2 hours. No charge.' },
    { id: 'CP-2', scope: 'chassis', maker: 'International', ref: 'NHTSA 26V-442', title: 'Steering gear sector shaft seal', severity: 'Recall', issued: 'Oct 8, 2026', units: [{ unit: '1058', status: 'open' }, { unit: '1104', status: 'completed', completedOn: 'Oct 2' }], remedy: 'Replace seal and inspect fluid level. No charge.' },
    { id: 'CP-3', scope: 'crane', maker: 'IMT', ref: 'PSB-7500-22', title: 'Hoist drum tie-down bolt torque', severity: 'Service bulletin', issued: 'Jul 14, 2026', units: [{ unit: '1104', status: 'completed', completedOn: 'Aug 11' }], remedy: 'Verify torque at annual inspection.' },
    { id: 'CP-4', scope: 'chassis', maker: 'Freightliner', ref: 'NHTSA 26V-301', title: 'Brake light switch bracket', severity: 'Recall', issued: 'Jun 2, 2026', units: [{ unit: '1042', status: 'completed', completedOn: 'Sep 24' }, { unit: '1130', status: 'completed', completedOn: 'Aug 18' }, { unit: '1081', status: 'open' }], remedy: 'Replace bracket. 30 minutes. No charge.' }
  ],
  compliance: {
    '1042': { title: 'Clear, held by Shenandoah Line Services', mso: 'MSO on file, converted to title Apr 2022', lien: 'None' },
    '1058': { title: 'Clear', mso: 'Converted May 2021', lien: 'None' },
    '1076': { title: 'Lien, Kenworth Financial', mso: 'Converted Mar 2023', lien: 'Kenworth Financial, through Feb 2028' },
    '1081': { title: 'Clear', mso: 'Not on file, bought used', lien: 'None' },
    '1093': { title: 'Clear', mso: 'Converted May 2022', lien: 'None' },
    '1104': { title: 'Clear', mso: 'Not on file, bought used', lien: 'None' },
    '1110': { title: 'Lien, PACCAR Financial', mso: 'Converted Jul 2023', lien: 'PACCAR Financial, through Jun 2028' },
    '1117': { title: 'Clear', mso: 'Converted Oct 2021', lien: 'None' },
    '1122': { title: 'Clear', mso: 'Not on file, bought used', lien: 'None' },
    '1130': { title: 'Clear', mso: 'Converted Sep 2022', lien: 'None' },
    '1138': { title: 'Clear', mso: 'Converted Jun 2022', lien: 'None' },
    '1145': { title: 'Lien, Ford Credit', mso: 'Converted Jul 2023', lien: 'Ford Credit, through Jun 2028' }
  },
  bom: {
    'Altec AA55': [['ALT-1182-9','Upper boom hydraulic hose, 46 kV',1,312],['ALT-2207','Platform leveling cable',1,186],['ALT-4410','Jib winch rope, 60 ft',1,148],['ALT-5520','Rotation bearing grease, 14 oz',4,19],['ALT-7730','Platform liner, 24x30',1,264]],
    'Altec AT40G': [['ALT-1182-9','Upper boom hydraulic hose, 46 kV',1,312],['ALT-2201','Platform leveling cable',1,172],['ALT-5520','Rotation bearing grease, 14 oz',4,19],['ALT-7731','Platform liner, 24x24',1,238]],
    'Terex Hi-Ranger XT55': [['TRX-30412','Leveling cable assembly',1,214],['TRX-30890','Upper boom hose, insulated',1,340],['TRX-5101','Hydraulic filter element',1,46],['TRX-7120','Bucket liner, 24x30',1,255]],
    'Versalift VST-52': [['VST-1140','Leveling cable',1,168],['VST-2270','Jib hose kit',1,196],['VST-5100','Hydraulic filter',1,42]],
    'Dur-A-Lift DTAX-45': [['DAL-1012','Leveling chain',1,152],['DAL-2100','Upper boom hose',1,288],['DAL-5100','Hydraulic filter',1,44]],
    'Palfinger PK 18500': [['PAL-3081','Rotation bearing bolts, set',1,24],['PAL-4402','Radio remote battery',2,58],['PAL-5120','Hydraulic filter element',1,52],['PAL-6610','Hook latch kit',1,36]],
    'IMT 7500': [['IMT-WC75','Hoist cable, 7500, 85 ft',1,82],['IMT-4401','Remote receiver',1,318],['IMT-5120','Hydraulic filter',1,48],['IMT-6610','Hook block, 2 ton',1,224]],
    'Auto Crane 6406H': [['AC-3380','Hoist cable, 60 ft',1,74],['AC-4410','Wireless remote',1,342],['AC-5120','Hydraulic filter',1,41]],
    'Altec DC47': [['ALT-D-2210','Digger motor seal kit',1,58],['ALT-D-3350','Auger teeth, set of 12',1,96],['ALT-D-4410','Pole guide liner',1,88],['ALT-D-5520','Rotation bearing grease, 14 oz',4,19]],
    'Terex Commander C4047': [['TRX-D-2210','Digger motor seal kit',1,62],['TRX-D-3350','Auger teeth, set of 12',1,102],['TRX-D-4420','Pole claw pads',2,44]],
    'Freightliner M2 106': [['FL-OIL-15','Oil filter, Cummins B6.7',1,34],['FL-FUEL-9','Fuel filter kit',1,52],['BW-7421','Brake pads, front axle set',1,286],['FL-AIR-M2','Air filter',1,61]],
    'Freightliner M2 112': [['FL-OIL-DD8','Oil filter, DD8',1,41],['FL-FUEL-DD8','Fuel filter kit',1,68],['BW-7421','Brake pads, front axle set',1,286]],
    'Freightliner 114SD': [['FL-OIL-DD13','Oil filter, DD13',1,48],['FL-FUEL-DD13','Fuel filter kit',1,74],['BW-7421','Brake pads, front axle set',1,286]],
    'International MV607': [['FL-OIL-15','Oil filter, Cummins B6.7',1,34],['FL-FUEL-9','Fuel filter kit',1,52],['BW-7421','Brake pads, front axle set',1,286]],
    'International 4300': [['FL-OIL-15','Oil filter, Cummins B6.7',1,34],['FL-FUEL-9','Fuel filter kit',1,52],['BW-7421','Brake pads, front axle set',1,286],['LT-DOT-A','DOT marker lamp, amber',2,41]],
    'Kenworth T380': [['FL-OIL-PX7','Oil filter, PX-7',1,38],['FL-FUEL-PX7','Fuel filter kit',1,56],['BW-7421','Brake pads, front axle set',1,286]],
    'Peterbilt 548': [['FL-OIL-PX7','Oil filter, PX-7',1,38],['FL-FUEL-PX7','Fuel filter kit',1,56]],
    'Ford F-750': [['FD-OIL-73','Oil filter, 7.3L',1,22],['FD-AIR-75','Air filter',1,48],['BW-7421','Brake pads, front axle set',1,286]],
    'Ram 5500': [['RM-OIL-67','Oil filter, 6.7L Cummins',1,26],['RM-FUEL-67','Fuel filter kit',1,61]],
    'Reading Classic II SL, 14 ft': [['RDG-LATCH','Compartment door latch',2,38],['RDG-STEP','Rear step, bolt-on',1,142],['RDG-GAS','Door gas strut',2,27]],
    'Reading Classic II SL, 11 ft': [['RDG-LATCH','Compartment door latch',2,38],['RDG-GAS','Door gas strut',2,27]],
    'Knapheide KMT1 mechanics, 11 ft': [['KNP-LATCH','Compartment latch, stainless',2,41],['KNP-DRW','Drawer slide pair',1,66]],
    'Altec Line body, 11 ft': [['ALT-B-LATCH','Compartment latch',2,36],['ALT-B-GAS','Door gas strut',2,25]],
    'Vanair Viper G80': [['VNR-FLT','Air filter',1,29],['VNR-BELT','Drive belt',1,44]],
    'Altec AT37G': [['ALT-1182-9','Upper boom hydraulic hose, 46 kV',1,312],['ALT-2201','Platform leveling cable',1,172],['ALT-5520','Rotation bearing grease, 14 oz',4,19]],
    'Fontaine Fifth wheel and pole trailer': [['FNT-PIN','Kingpin lock',1,64],['FNT-LT','Trailer lamp kit',1,88]],
    'Terex Utility body, 10 ft': [['TRX-B-LATCH','Compartment latch',2,34],['TRX-B-RACK','Ladder rack roller',1,58]],
    'Altec Derrick flatbed, 16 ft': [['ALT-B-PAD','Outrigger pad, 24 in',2,96],['ALT-B-RACK','Pole rack strap',4,22]],
    'Terex Derrick flatbed, 18 ft': [['TRX-B-PAD','Outrigger pad, 24 in',2,98],['TRX-B-WINCH','Winch rope, 100 ft',1,164]],
    'Versalift Line body, 11 ft': [['VST-B-LATCH','Compartment latch',2,35],['VST-B-GAS','Door gas strut',2,26]],
    'Dur-A-Lift Line body, 11 ft': [['DAL-B-LATCH','Compartment latch',2,33],['DAL-B-GAS','Door gas strut',2,24]]
  },
  freight: [
    { id: 'F-3310', unit: '1122', what: 'Reposition', from: 'Richmond yard', to: 'Harrisonburg job site', date: 'Oct 29', miles: 118, stage: 'quoted', amount: 640, note: 'Lowboy, permit not required at 66,000 GVWR.' },
    { id: 'F-3298', unit: 'T-2051', what: 'Delivery', from: 'Altec, Burnsville NC', to: 'Shenandoah yard, Stafford', date: 'Dec 12', miles: 410, stage: 'booked', amount: 1850, note: 'Included in the truck order; driven delivery with temp tags.' },
    { id: 'F-3271', unit: '1081', what: 'Reposition', from: 'Shenandoah yard, Stafford', to: 'Richmond yard', date: 'Oct 6', miles: 62, stage: 'completed', amount: 420, note: '' }
  ],

  // Sites and geofences: a named circle. Units inside it are computed from position.
  sites: [
    { id: 's1', name: 'Shenandoah yard', type: 'Yard', project: '', lat: 38.96, lng: -77.36, radius: 600, address: '1180 Garrisonville Rd, Stafford, VA', hours: '5:30 AM to 7:00 PM', afterHours: true, note: 'Home yard. After-hours movement alerts on.' },
    { id: 's2', name: 'Richmond yard', type: 'Yard', project: '', lat: 37.54, lng: -77.43, radius: 500, address: '2100 Commerce Rd, Richmond, VA', hours: '6:00 AM to 6:00 PM', afterHours: true, note: '' },
    { id: 's3', name: 'Garrisonville substation', type: 'Job site', project: 'DOM-4417 · Dominion 230 kV rebuild', lat: 38.42, lng: -77.41, radius: 400, address: 'Garrisonville Rd at Onville Rd, Stafford, VA', hours: '7:00 AM to 5:00 PM', afterHours: false, note: 'Through Nov 21. Dielectric current required on every aerial on site.' },
    { id: 's4', name: 'Dulles substation', type: 'Job site', project: 'DOM-4402 · Dulles feeder upgrade', lat: 38.95, lng: -77.45, radius: 450, address: 'Route 28 at Old Ox Rd, Sterling, VA', hours: '7:00 AM to 5:00 PM', afterHours: false, note: 'Night work Thursdays.' },
    { id: 's5', name: 'Harrisonburg job site', type: 'Job site', project: 'SVEC-1180 · Shenandoah Valley EC line extension', lat: 38.45, lng: -78.87, radius: 800, address: 'US-33 at Rawley Pike, Harrisonburg, VA', hours: '7:00 AM to 4:30 PM', afterHours: false, note: 'Unit #1122 repositions here Oct 29.' },
    { id: 's6', name: 'CTOS Fredericksburg', type: 'CTOS location', project: '', lat: 38.30, lng: -77.46, radius: 300, address: '2200 Jefferson Davis Hwy, Fredericksburg, VA', hours: '6:00 AM to 8:00 PM', afterHours: false, note: 'Service and parts.' },
    { id: 's7', name: 'CTOS Richmond', type: 'CTOS location', project: '', lat: 37.50, lng: -77.52, radius: 300, address: '7500 Midlothian Tpke, Richmond, VA', hours: '6:00 AM to 10:00 PM', afterHours: false, note: 'Service, parts and rentals.' }
  ],
  siteEvents: [
    { t: '1:52 PM', unit: '1104', text: 'Arrived at CTOS Richmond', kind: '' },
    { t: '7:35 AM', unit: '1145', text: 'Arrived at CTOS Fredericksburg for dielectric test', kind: '' },
    { t: '7:10 AM', unit: '1138', text: 'Arrived at Harrisonburg job site', kind: '' },
    { t: '11:40 AM', unit: '1081', text: 'Arrived at Richmond yard', kind: '' },
    { t: '6:48 AM', unit: '1058', text: 'Arrived at Garrisonville substation', kind: '' },
    { t: '6:12 AM', unit: '1117', text: 'Arrived at Dulles substation', kind: '' },
    { t: '5:55 AM', unit: '1042', text: 'Left Shenandoah yard', kind: '' },
    { t: '12:10 PM', unit: '1042', text: 'Arrived at Garrisonville substation', kind: '' },
    { t: '6:30 AM', unit: '1093', text: 'Arrived at Dulles substation', kind: '' },
    { t: '2:05 PM', unit: '1110', text: 'Left Dulles substation, returning to yard', kind: '' },
    { t: '11:20 PM', unit: '1130', text: 'After-hours ignition at Shenandoah yard, 4 min, no movement', kind: 'fault' }
  ],
  posts: [
    { id: 'storm-season', date: 'Oct 18, 2026', title: 'Preparing your aerial fleet for storm season', author: 'Luis Ortega, Service Advisor', read: '4 min', img: 'https://images.unsplash.com/photo-1734903251828-b8d4c0423e56?w=1200&q=70&auto=format&fit=crop', tag: 'Service',
      summary: 'Storm work is the most hours your booms will see all year. Here is what we check on every unit before November, and what you can do at the yard this week.',
      pull: 'A cable with one broken strand passes a casual look and fails under a loaded platform in sleet.',
      takeaways: ['Book any dielectric test due before December now', 'Walk the yard: leveling cables at the sheave, hose jackets, platform liners', 'Load-test batteries that were marginal in summer', 'Check registration, FET exemption and certificates are on each unit page'],
      cta: 'Book a storm readiness check',
      body: [
        'The first big storm of the season is when a fleet finds out what it skipped. Mutual-aid calls come in, every bucket truck that can roll does, and a unit that was marginal in October becomes the one parked at the side of the road in a hurricane remnant.',
        'Dielectric tests come first. An aerial device that is due or overdue is a unit you cannot legally put near energized lines, and the test takes a few hours in the shop. We pull the due list for every customer in September and book the ones inside sixty days. If your portal shows an inspection due before December, book it now while there is still shop time to spare.',
        'Next are the things that fail in the cold and wet: leveling cables, platform liners, boom hoses and hydraulic fluid. A cable with one broken strand passes a casual look and fails under a loaded platform in sleet. Our annual inspection catches these, but a walk-around at the yard catches the obvious ones for free. Look at the cable where it passes the sheave and anywhere the jacket is chafed.',
        'Then the chassis. Batteries drop a third of their cranking power at freezing, so a battery that tested marginal in summer is a no-start on the first cold morning. Tires on digger derricks working off-road take a beating in mud; check tread and sidewalls before the ground freezes.',
        'Finally, the paperwork. Storm work means crossing county and state lines, and the unit that cannot produce its registration, its FET exemption and its inspection certificates on request is the one that gets held up. Every document on file in the portal is on the unit page under Documents, and expiry dates feed Coming due so nothing lapses quietly.',
        'If you want us to run the whole list, Schedule service from any unit and choose Storm readiness. We do the dielectric, the cable and hose inspection, batteries, tires and lights in one visit.'
      ] },
    { id: 'downtime', date: 'Oct 10, 2026', title: 'Five ways utility fleets lose a truck for a week', author: 'Priya Nair, Service Advisor', read: '5 min', img: 'https://images.unsplash.com/photo-1771340012319-0b4fca008b54?w=1200&q=70&auto=format&fit=crop', tag: 'Service',
      summary: 'Most week-long downtime is not a big failure. It is a small one that waited on a part, a signature or a shop slot. The five we see most, and how each one is avoidable.',
      pull: 'When a crane service truck sits for a week, the repair itself was usually a day.',
      takeaways: ['Order from the unit\u2019s bill of materials, not a cross-reference', 'Approve estimates from the phone; the lines are split by component', 'Book annuals the day the reminder lands', 'Turn on after-hours and no-report alerts for every yard'],
      cta: 'Review estimates waiting on you',
      body: [
        'When a crane service truck sits for a week, the repair itself was usually a day. The other four were spent waiting: for a part that was not on the shelf, for an estimate to be approved, for a slot in a shop that was already full, or for someone to notice the truck was down at all.',
        'The part. A hoist cable, a leveling cable or a digger motor seal is not a part most shops stock for every make. The fix is the bill of materials on your unit page: parts matched to the serial of the crane or aerial on that truck, not a cross-reference. Order from there and the right part is on the truck before the shop slot opens.',
        'The approval. An estimate that waits two days for a signature is two days of downtime. Approvals in the portal show the line items by component, chassis against crane against body, so the person signing can see what they are paying for and sign from their phone.',
        'The shop slot. Both of our Virginia shops book up in October and March. If a unit is coming due for its annual, book it the day the reminder lands. Coming due on the Service page sorts by miles left and by inspection date for exactly this reason.',
        'The campaign nobody saw. A manufacturer bulletin on the aerial, a recall on the chassis: either one can ground a unit when an inspector asks. The portal shows recalls and bulletins for every component together, with the ones still open at the top.',
        'The truck nobody noticed. A unit parked at a remote yard with a dead battery can sit for days. Telematics with after-hours and no-report alerts, and a geofence around each yard, mean the portal tells you before the crew does.'
      ] },
    { id: 'telematics', date: 'Oct 3, 2026', title: 'What PTO hours tell you that odometers cannot', author: 'Sarah Mitchell, Account Manager', read: '4 min', img: 'https://images.unsplash.com/photo-1720811559371-7b0ebd219127?w=1200&q=70&auto=format&fit=crop', tag: 'Telematics',
      summary: 'A bucket truck that drives twenty miles a day and runs the boom for six hours is not a low-use truck. Why we track PTO hours on every unit, and what the numbers changed for one customer.',
      pull: 'By odometer they were twins. By PTO hours one had done 2,300 and the other 1,100.',
      takeaways: ['Aerial and crane intervals run on hours, not miles', 'Idle with the PTO off is waste; idle with it on is work', 'Trucks bought elsewhere take the same device, or bring your own through the API'],
      cta: 'See boom hours on your units',
      body: [
        'Odometers were built for trucks that make money by moving. Vocational trucks make money standing still with the PTO engaged, and that is where the wear happens: hydraulic pumps, rotation bearings, boom cylinders and the engine idling at 1,200 rpm for hours.',
        'That is why every CTOS telematics device logs PTO engagement alongside position and odometer. The portal shows boom and crane hours on each unit, and the maintenance intervals on the aerial and crane components run on hours, not miles.',
        'One Virginia line contractor had two Altec AA55s bought the same month. By odometer they were twins. By PTO hours one had done 2,300 and the other 1,100, because one worked substation jobs and the other did pole replacement. The first was eight months ahead on its boom service and nobody knew until a cylinder seal went.',
        'Idle with the PTO off is the other number worth watching. An engine idling to keep a cab warm at a yard burns fuel for nothing; one idling to run a boom is working. The portal splits the two, so an idle alert means what it says.',
        'If your units came from somewhere else, the same device fits them. Bring-your-own telematics connects through our API, and either way the hours show up on the unit page next to the odometer.'
      ] }
  ],
  accountTax: { fetStatus: 'Exempt', fetCert: 'fet-exempt-sls-2026.pdf', fetBasis: 'State and local government contractor exemption, IRS Form 637 registration', fetExpires: 'Dec 31, 2026', iftaPermit: 'IFTA-VA-204418', iftaExpires: 'Dec 31, 2026' },
  fleetInsurance: { carrier: 'Great Lakes Commercial', policy: 'GLC-77-41920', expires: 'Jun 30, 2027' },
  salesforce: { connected: true, lastSync: '4 min ago', instance: 'customtruck.my.salesforce.com' },
  // Salesforce Quotes. Each Quote Line is one truck configuration; an accepted line becomes a truck order.
  quotes: [
    { no: 'Q-10422', sfId: '0Q0Hs00000A7kQ2', stage: 'ready', requested: 'Oct 20', updated: 'Oct 26', owner: 'Sarah Mitchell', validUntil: 'Nov 20', note: 'Includes the fleet discount and delivery to Stafford. Both lines must be accepted together for the discount.',
      lines: [
        { ql: 'QL-01', spec: '2026 Freightliner M2 106 · Altec AT40G', detail: 'B6.7 · Allison 2500 · 11 ft line body · AT40G 45 ft · white', qty: 2, unitPrice: 246300, eta: 'Mar 2027' },
        { ql: 'QL-02', spec: '2026 Ford F-750 · Versalift VST-52', detail: '7.3L gas · 11 ft fiberglass body · VST-52 · white', qty: 1, unitPrice: 189800, eta: 'Feb 2027' }
      ] },
    { no: 'Q-10419', sfId: '0Q0Hs00000A7hR9', stage: 'review', requested: 'Oct 24', updated: 'Oct 27', owner: 'Sarah Mitchell', validUntil: '', note: 'Sarah is confirming availability at the Richmond lot.',
      lines: [ { ql: 'QL-01', spec: '2023 International MV · Terex XT60, used', detail: '41k mi · 1,100 boom hrs · certified, fresh dielectric', qty: 1, unitPrice: 0, eta: 'In stock, Richmond' } ] },
    { no: 'Q-10388', sfId: '0Q0Hs00000A6zL4', stage: 'accepted', requested: 'Sep 22', updated: 'Sep 30', owner: 'Sarah Mitchell', validUntil: '', note: 'Accepted Sep 30. Line 1 became order T-2066.',
      lines: [ { ql: 'QL-01', spec: '2026 Kenworth T380 · Palfinger PK 23500', detail: 'PX-7 · Allison 3000 · 14 ft Reading body', qty: 1, unitPrice: 214900, eta: 'Feb 2027', orderNo: 'T-2066' } ] },
    { no: 'Q-10301', sfId: '0Q0Hs00000A5mB8', stage: 'accepted', requested: 'Jul 29', updated: 'Aug 14', owner: 'Sarah Mitchell', validUntil: '', note: 'Accepted Aug 14. Line 1 became order T-2051.',
      lines: [ { ql: 'QL-01', spec: '2026 Freightliner M2 106 · Altec AA55', detail: 'Cummins B6.7 · Allison 2500 · 11 ft aluminum line body · AA55 aerial', qty: 1, unitPrice: 268400, eta: 'Dec 12', orderNo: 'T-2051' } ] }
  ],
  accountNotes: [
    { when: 'Oct 26', who: 'Sarah Mitchell', text: 'Mike wants both AA55s before storm season; pushing Altec on the T-2051 build slot.' },
    { when: 'Oct 22', who: 'Priya Nair', text: '#1104 alternator was a warranty gray area; we covered labor as goodwill. IMT crane is out of warranty, flagged for the hoist cable.' }
  ],
  personas: {
    mike: { name: 'Mike Brown', initials: 'MB', org: 'Shenandoah Line Services', role: 'Owner', kind: 'customer' },
    taylor: { name: 'Taylor Reyes', initials: 'TR', org: 'Blue Ridge Produce Co.', role: 'Owner', kind: 'new' },
    sarah: { name: 'Sarah Mitchell', initials: 'SM', org: 'Custom Truck One Source', role: 'Account Manager', kind: 'employee' }
  }
};
