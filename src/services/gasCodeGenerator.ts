export const GOOGLE_APPS_SCRIPT_CODE = `/**
 * =========================================================================
 *  লাইফসেভার ব্লাড ব্যাংক - Google Apps Script (Code.gs)
 *  Blood Bank Management System Backend API & Google Sheets Connector
 * =========================================================================
 * 
 *  নির্দেশিকা (Instructions):
 *  ১. script.google.com এ যান এবং নতুন প্রোজেক্ট খুলুন।
 *  ২. এই সম্পূর্ণ কোডটি Code.gs এ পেস্ট করুন।
 *  ৩. 'initialSetup()' ফাংশনটি রান করে ৫টি প্রয়োজনীয় শিট স্বয়ংক্রিয়ভাবে তৈরি করে নিন।
 *  ৪. 'Deploy' -> 'New Deployment' -> 'Web App' নির্বাচন করুন।
 *     - Execute as: "Me"
 *     - Who has access: "Anyone"
 *  ৫. প্রাপ্ত Web App URL টি অ্যাডমিন ড্যাশবোর্ডের Google Apps Script Sync বক্সে পেস্ট করুন।
 */

// শিটের নামসমূহ
const SHEETS = {
  USERS: 'Users',
  DONATIONS: 'Donations',
  REQUESTS: 'Requests',
  BLOOD_STOCK: 'BloodStock',
  ACTIVITY_LOG: 'ActivityLog'
};

/**
 * প্রাথমিক শিট ও হেডার সেটআপ (এক ক্লিকে ৫টি শিট স্বয়ংক্রিয় তৈরি)
 */
function initialSetup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // ১. Users শিট
  let usersSheet = ss.getSheetByName(SHEETS.USERS);
  if (!usersSheet) {
    usersSheet = ss.insertSheet(SHEETS.USERS);
    usersSheet.appendRow([
      'ID', 'Name', 'Email', 'PasswordHash', 'Phone', 'BloodGroup', 
      'DOB', 'Address', 'District', 'LastDonation', 'Role', 'Status', 
      'IsAvailable', 'TotalDonations', 'CreatedAt'
    ]);
    // ডিফল্ট অ্যাডমিন যোগ
    usersSheet.appendRow([
      'USR-1001', 'অ্যাডমিন পরিচালক', 'admin@blood.com', hashPassword('Admin@123'), 
      '+8801711000001', 'O+', '1988-04-12', 'ধানমন্ডি, ঢাকা', 'ঢাকা (Dhaka)', 
      '2026-05-10', 'admin', 'active', 'true', 14, new Date().toISOString()
    ]);
    formatHeaderRow(usersSheet);
  }

  // ২. Donations শিট
  let donSheet = ss.getSheetByName(SHEETS.DONATIONS);
  if (!donSheet) {
    donSheet = ss.insertSheet(SHEETS.DONATIONS);
    donSheet.appendRow([
      'ID', 'UserID', 'UserName', 'BloodGroup', 'DonationDate', 
      'NextEligibleDate', 'HospitalName', 'Units', 'Status', 'Notes', 'CreatedAt'
    ]);
    formatHeaderRow(donSheet);
  }

  // ৩. Requests শিট
  let reqSheet = ss.getSheetByName(SHEETS.REQUESTS);
  if (!reqSheet) {
    reqSheet = ss.insertSheet(SHEETS.REQUESTS);
    reqSheet.appendRow([
      'ID', 'RequesterName', 'Contact', 'AlternateContact', 'BloodGroup', 
      'Hospital', 'District', 'Urgency', 'UnitsNeeded', 'Status', 
      'PatientProblem', 'DateNeeded', 'AdminNote', 'CreatedAt'
    ]);
    formatHeaderRow(reqSheet);
  }

  // ৪. BloodStock শিট
  let stockSheet = ss.getSheetByName(SHEETS.BLOOD_STOCK);
  if (!stockSheet) {
    stockSheet = ss.insertSheet(SHEETS.BLOOD_STOCK);
    stockSheet.appendRow(['BloodGroup', 'UnitCount', 'MinimumThreshold', 'LastUpdated']);
    const defaultGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    defaultGroups.forEach(bg => {
      stockSheet.appendRow([bg, 10, 5, new Date().toLocaleString('bn-BD')]);
    });
    formatHeaderRow(stockSheet);
  }

  // ৫. ActivityLog শিট
  let logSheet = ss.getSheetByName(SHEETS.ACTIVITY_LOG);
  if (!logSheet) {
    logSheet = ss.insertSheet(SHEETS.ACTIVITY_LOG);
    logSheet.appendRow(['ID', 'UserID', 'UserName', 'Action', 'Details', 'Timestamp', 'IP']);
    formatHeaderRow(logSheet);
  }

  Logger.log('✅ লাইফসেভার ব্লাড ব্যাংক ডাটাবেজ সফলভাবে সেটআপ হয়েছে!');
  return { success: true, message: 'Google Sheets Database Initialized Successfully!' };
}

function formatHeaderRow(sheet) {
  const header = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  header.setBackground('#B71C1C');
  header.setFontColor('#FFFFFF');
  header.setFontWeight('bold');
  header.setHorizontalAlignment('center');
  sheet.setFrozenRows(1);
}

/**
 * SHA-256 পাসওয়ার্ড হ্যাশিং
 */
function hashPassword(password) {
  if (!password) return '';
  const rawHash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256, 
    password, 
    Utilities.Charset.UTF_8
  );
  let hex = '';
  for (let i = 0; i < rawHash.length; i++) {
    let byteVal = rawHash[i];
    if (byteVal < 0) byteVal += 256;
    let byteHex = byteVal.toString(16);
    if (byteHex.length === 1) byteHex = '0' + byteHex;
    hex += byteHex;
  }
  return hex;
}

/**
 * GET রিকোয়েস্ট হ্যান্ডলার (ডাটা ফেচ ও সিস্টেম স্ট্যাটাস)
 */
function doGet(e) {
  try {
    const action = e.parameter.action || 'ping';

    if (action === 'ping') {
      return jsonResponse({
        status: 'success',
        message: '🩸 লাইফসেভার ব্লাড ব্যাংক API সচল রয়েছে!',
        timestamp: new Date().toISOString()
      });
    }

    if (action === 'getAllData') {
      return jsonResponse({
        status: 'success',
        data: fetchAllSheetData()
      });
    }

    if (action === 'getDonors') {
      const donors = getRowsAsObjects(SHEETS.USERS).filter(u => u.Role === 'user' && u.Status === 'active');
      return jsonResponse({ status: 'success', donors: donors });
    }

    if (action === 'getStock') {
      const stock = getRowsAsObjects(SHEETS.BLOOD_STOCK);
      return jsonResponse({ status: 'success', stock: stock });
    }

    return jsonResponse({ status: 'error', message: 'অজানা অ্যাকশন (Unknown action)' });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

/**
 * POST রিকোয়েস্ট হ্যান্ডলার (ডাটা সংরক্ষণ, সিঙ্ক ও অ্যাকশন সম্পাদন)
 */
function doPost(e) {
  try {
    let payload = {};
    if (e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    } else {
      payload = e.parameter;
    }

    const action = payload.action;

    // ১. সম্পূর্ণ ডাটা সিঙ্ক (Full Sync from Frontend to Sheets)
    if (action === 'syncAllData') {
      return handleSyncAllData(payload);
    }

    // ২. নতুন ইউজার/ডোনার রেজিস্ট্রেশন
    if (action === 'registerUser') {
      return handleRegisterUser(payload.user);
    }

    // ৩. ইউজার লগইন ভ্যালিডেশন
    if (action === 'validateUser') {
      return handleValidateUser(payload.email, payload.password);
    }

    // ৪. নতুন ব্লাড রিকোয়েস্ট তৈরি
    if (action === 'createRequest') {
      return handleCreateRequest(payload.request);
    }

    // ৫. রিকোয়েস্ট স্ট্যাটাস আপডেট
    if (action === 'updateRequestStatus') {
      return handleUpdateRequestStatus(payload.requestId, payload.status, payload.adminNote);
    }

    // ৬. ব্লাড স্টক আপডেট
    if (action === 'updateStock') {
      return handleUpdateStock(payload.bloodGroup, payload.unitCount);
    }

    // ৭. ডোনেশন রেকর্ড যোগ
    if (action === 'recordDonation') {
      return handleRecordDonation(payload.donation);
    }

    // ৮. ইমেইল নোটিফিকেশন প্রেরণ (GAS MailApp)
    if (action === 'sendEmailAlert') {
      return handleSendEmail(payload.to, payload.subject, payload.bodyHtml);
    }

    return jsonResponse({ status: 'error', message: 'Action not supported: ' + action });
  } catch (err) {
    logActivity('SYSTEM', 'System Error', err.toString());
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

/**
 * শিট থেকে অবজেক্ট হিসেবে ডাটা রিড করা
 */
function getRowsAsObjects(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const headers = data[0];
  const rows = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    rows.push(obj);
  }
  return rows;
}

/**
 * সকল শিটের ডাটা একত্রিত করা
 */
function fetchAllSheetData() {
  return {
    users: getRowsAsObjects(SHEETS.USERS),
    donations: getRowsAsObjects(SHEETS.DONATIONS),
    requests: getRowsAsObjects(SHEETS.REQUESTS),
    stock: getRowsAsObjects(SHEETS.BLOOD_STOCK),
    logs: getRowsAsObjects(SHEETS.ACTIVITY_LOG)
  };
}

/**
 * টু-ওয়ে ফুল সিঙ্ক হ্যান্ডলার (Frontend -> Google Sheets)
 */
function handleSyncAllData(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (payload.users && Array.isArray(payload.users)) {
    overwriteSheet(SHEETS.USERS, [
      'ID', 'Name', 'Email', 'PasswordHash', 'Phone', 'BloodGroup', 
      'DOB', 'Address', 'District', 'LastDonation', 'Role', 'Status', 
      'IsAvailable', 'TotalDonations', 'CreatedAt'
    ], payload.users.map(u => [
      u.id, u.name, u.email, u.passwordHash || '', u.phone, u.bloodGroup,
      u.dob, u.address, u.district, u.lastDonation, u.role, u.status,
      u.isAvailableForDonation ? 'true' : 'false', u.totalDonationsCount || 0, u.createdAt
    ]));
  }

  if (payload.requests && Array.isArray(payload.requests)) {
    overwriteSheet(SHEETS.REQUESTS, [
      'ID', 'RequesterName', 'Contact', 'AlternateContact', 'BloodGroup', 
      'Hospital', 'District', 'Urgency', 'UnitsNeeded', 'Status', 
      'PatientProblem', 'DateNeeded', 'AdminNote', 'CreatedAt'
    ], payload.requests.map(r => [
      r.id, r.requesterName, r.contact, r.alternateContact || '', r.bloodGroup,
      r.hospital, r.district, r.urgency, r.unitsNeeded, r.status,
      r.patientProblem || '', r.donationDateNeeded || '', r.adminNote || '', r.createdAt
    ]));
  }

  if (payload.stock && Array.isArray(payload.stock)) {
    overwriteSheet(SHEETS.BLOOD_STOCK, [
      'BloodGroup', 'UnitCount', 'MinimumThreshold', 'LastUpdated'
    ], payload.stock.map(s => [
      s.bloodGroup, s.unitCount, s.minimumThreshold, s.lastUpdated
    ]));
  }

  logActivity('ADMIN_SYNC', 'Admin Sync', 'Google Sheets-এ সম্পূর্ণ ডাটাবেজ অটো-সিঙ্ক সম্পন্ন হয়েছে।');
  
  return jsonResponse({
    status: 'success',
    message: 'Google Sheets ডাটাবেজ সফলভাবে আপডেট ও সিঙ্ক হয়েছে!',
    timestamp: new Date().toISOString()
  });
}

function overwriteSheet(sheetName, headers, rows) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  } else {
    sheet.clear();
  }
  
  sheet.appendRow(headers);
  formatHeaderRow(sheet);
  
  if (rows && rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
}

/**
 * ইউজার রেজিস্ট্রেশন হ্যান্ডলার
 */
function handleRegisterUser(u) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.USERS);
  
  // ডুপ্লিকেট ইমেইল চেক
  const users = getRowsAsObjects(SHEETS.USERS);
  const exists = users.some(item => item.Email && item.Email.toLowerCase() === u.email.toLowerCase());
  if (exists) {
    return jsonResponse({ status: 'error', message: 'এই ইমেইল দিয়ে ইতোমধ্যে অ্যাকাউন্ট রয়েছে।' });
  }

  const newId = 'USR-' + (1000 + users.length + 1);
  const passHash = u.password ? hashPassword(u.password) : (u.passwordHash || '');
  
  sheet.appendRow([
    newId, u.name, u.email, passHash, u.phone, u.bloodGroup,
    u.dob || '', u.address || '', u.district || '', u.lastDonation || '',
    'user', 'active', 'true', 0, new Date().toISOString()
  ]);

  logActivity(newId, u.name, 'নতুন ডোনার রেজিস্ট্রেশন সম্পন্ন হয়েছে।');

  // ঐচ্ছিক ওয়েলকাম ইমেইল
  try {
    MailApp.sendEmail({
      to: u.email,
      subject: '🩸 লাইফসেভার ব্লাড ব্যাংকে স্বাগতম!',
      htmlBody: '<h3>প্রিয় ' + u.name + ',</h3><p>লাইফসেভার ব্লাড ব্যাংকে স্বেচ্ছায় রক্তদাতা হিসেবে যুক্ত হওয়ার জন্য আপনাকে আন্তরিক ধন্যবাদ। আপনার একটি উদ্যোগ বাঁচাতে পারে একটি মূল্যবান প্রাণ।</p>'
    });
  } catch(e) {
    Logger.log('Email send failed: ' + e);
  }

  return jsonResponse({
    status: 'success',
    message: 'রেজিস্ট্রেশন সফল হয়েছে!',
    user: { id: newId, name: u.name, email: u.email, bloodGroup: u.bloodGroup, role: 'user' }
  });
}

/**
 * ইউজার লগইন ভ্যালিডেশন
 */
function handleValidateUser(email, password) {
  const users = getRowsAsObjects(SHEETS.USERS);
  const passHash = hashPassword(password);

  const found = users.find(u => 
    u.Email && u.Email.toLowerCase() === email.toLowerCase() && 
    (u.PasswordHash === passHash || u.PasswordHash === password)
  );

  if (!found) {
    return jsonResponse({ status: 'error', message: 'ভুল ইমেইল অথবা পাসওয়ার্ড।' });
  }

  if (found.Status === 'blocked') {
    return jsonResponse({ status: 'error', message: 'আপনার অ্যাকাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে।' });
  }

  logActivity(found.ID, found.Name, 'সফলভাবে লগইন করেছেন');

  return jsonResponse({
    status: 'success',
    user: found
  });
}

/**
 * ব্লাড রিকোয়েস্ট তৈরি
 */
function handleCreateRequest(r) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.REQUESTS);
  const requests = getRowsAsObjects(SHEETS.REQUESTS);
  const newId = 'REQ-' + (500 + requests.length + 1);

  sheet.appendRow([
    newId, r.requesterName, r.contact, r.alternateContact || '', r.bloodGroup,
    r.hospital, r.district, r.urgency || 'medium', r.unitsNeeded || 1, 'approved',
    r.patientProblem || '', r.donationDateNeeded || '', '', new Date().toISOString()
  ]);

  logActivity(newId, r.requesterName, 'জরুরি রক্তের আবেদন জমা হয়েছে: ' + r.bloodGroup);

  return jsonResponse({ status: 'success', message: 'রক্তের অনুরোধ সফলভাবে জমা হয়েছে!', id: newId });
}

/**
 * রিকোয়েস্ট স্ট্যাটাস আপডেট
 */
function handleUpdateRequestStatus(requestId, status, note) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.REQUESTS);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === requestId) {
      sheet.getRange(i + 1, 10).setValue(status); // Status Column
      if (note) sheet.getRange(i + 1, 13).setValue(note); // AdminNote Column
      logActivity('ADMIN', 'Admin', requestId + ' স্ট্যাটাস পরিবর্তন: ' + status);
      return jsonResponse({ status: 'success', message: 'রিকোয়েস্ট স্ট্যাটাস আপডেট হয়েছে।' });
    }
  }
  return jsonResponse({ status: 'error', message: 'রিকোয়েস্ট পাওয়া যায়নি।' });
}

/**
 * ব্লাড স্টক আপডেট
 */
function handleUpdateStock(bloodGroup, unitCount) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEETS.BLOOD_STOCK);
  const data = sheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === bloodGroup) {
      sheet.getRange(i + 1, 2).setValue(unitCount);
      sheet.getRange(i + 1, 4).setValue(new Date().toLocaleString('bn-BD'));
      logActivity('ADMIN', 'Admin', bloodGroup + ' স্টক আপডেট: ' + unitCount + ' ইউনিট');
      return jsonResponse({ status: 'success', message: 'স্টক আপডেট হয়েছে।' });
    }
  }
  return jsonResponse({ status: 'error', message: 'ব্লাড গ্রুপ পাওয়া যায়নি।' });
}

/**
 * অ্যাক্টিভিটি লগ সংরক্ষণ
 */
function logActivity(userId, userName, action, details) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEETS.ACTIVITY_LOG);
    if (!sheet) return;
    const logId = 'LOG-' + Math.floor(Math.random() * 90000 + 10000);
    sheet.appendRow([
      logId, userId, userName, action, details || '', new Date().toLocaleString('bn-BD'), 'GAS-Cloud'
    ]);
  } catch(e) {
    Logger.log('Log error: ' + e);
  }
}

/**
 * ইমেইল প্রেরণ হ্যান্ডলার
 */
function handleSendEmail(to, subject, htmlBody) {
  try {
    MailApp.sendEmail({
      to: to,
      subject: subject,
      htmlBody: htmlBody
    });
    return jsonResponse({ status: 'success', message: 'ইমেইল সফলভাবে পাঠানো হয়েছে।' });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

/**
 * JSON রেসপন্স বিল্ডার
 */
function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

export const GOOGLE_SHEETS_SETUP_STEPS = [
  {
    step: 1,
    title: 'Google Spreadsheet তৈরি করুন',
    description: 'drive.google.com এ গিয়ে একটি নতুন Google Sheets স্প্রেডশিট তৈরি করুন এবং নাম দিন "Lifesaver Blood Bank DB"।'
  },
  {
    step: 2,
    title: 'Apps Script এডিটর ওপেন করুন',
    description: 'স্প্রেডশিটের মেনুবার থেকে Extensions > Apps Script এ ক্লিক করুন।'
  },
  {
    step: 3,
    title: 'Code.gs পেস্ট করুন',
    description: 'এডিটরের ডিফল্ট কোড মুছে দিয়ে অ্যাডমিন ড্যাশবোর্ডে দেওয়া সম্পূর্ণ Code.gs কপি করে পেস্ট করুন।'
  },
  {
    step: 4,
    title: 'initialSetup() রান করুন',
    description: 'উপরে ড্রপডাউন থেকে "initialSetup" ফাংশন নির্বাচন করে "Run" এ ক্লিক করে একবার পারমিশন অনুমতি দিন। ৫টি শিট স্বয়ংক্রিয়ভাবে তৈরি হয়ে যাবে।'
  },
  {
    step: 5,
    title: 'Web App হিসেবে ডিপ্লয় করুন',
    description: 'Deploy > New deployment > Select type (Web app) নির্বাচন করুন। Execute as: "Me", Who has access: "Anyone" দিয়ে Deploy করুন।'
  },
  {
    step: 6,
    title: 'Web App URL কানেক্ট করুন',
    description: 'প্রাপ্ত Web App URL টি কপি করে এই অ্যাডমিন ড্যাশবোর্ডের "Google Apps Script Sync" ফিল্ডে পেস্ট করে "টেস্ট ও সিঙ্ক" বাটনে ক্লিক করুন।'
  }
];
