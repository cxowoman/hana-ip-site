const SPREADSHEET_ID = "15RUfmIkwgZwlFfdXJ9LXaSxQZwarSdVCX9cIk0j2qFM";
const SHEET_NAME = "報名名單";
const READ_TOKEN = "請換成一組只有你知道的讀取密碼";
const HEADERS = [
  "報名時間",
  "課程ID",
  "課程名稱",
  "課程類型",
  "活動日期",
  "開始時間",
  "結束時間",
  "活動地點",
  "名額",
  "費用",
  "講師名稱",
  "講師Email",
  "姓名",
  "居住區域",
  "小聚群",
  "小聚群連結",
  "Email",
  "手機",
  "備註",
  "來源網址",
  "狀態",
];

function doPost(e) {
  const payload = parsePayload_(e);
  if (text_(payload.website)) return output_({ ok: true, ignored: true });

  const name = text_(payload.memberName);
  const email = text_(payload.email);
  const phone = text_(payload.phone);
  if (!name || !email || !phone) {
    return output_({ ok: false, error: "missing_required_fields" });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSheet_();
    ensureHeaders_(sheet);
    sheet.appendRow([
      text_(payload.createdAt) || new Date().toISOString(),
      text_(payload.courseId),
      text_(payload.courseTitle),
      text_(payload.courseType),
      text_(payload.eventDate),
      text_(payload.eventTime),
      text_(payload.eventEndTime),
      text_(payload.eventLocation),
      text_(payload.eventCapacity),
      text_(payload.eventPrice),
      text_(payload.teacherName),
      text_(payload.teacherEmail),
      name,
      text_(payload.meetupArea),
      text_(payload.meetupGroup),
      text_(payload.meetupGroupUrl),
      email,
      phone,
      text_(payload.note),
      text_(payload.sourceUrl),
      text_(payload.status) || "已收到",
    ]);
  } finally {
    lock.releaseLock();
  }

  return output_({ ok: true });
}

function doGet(e) {
  const params = (e && e.parameter) || {};
  const callback = text_(params.callback);
  if (text_(params.action) !== "list") {
    return output_({ ok: true, message: "Hana registration webhook is running." }, callback);
  }
  if (text_(params.token) !== READ_TOKEN) {
    return output_({ ok: false, error: "unauthorized" }, callback);
  }

  const sheet = getSheet_();
  ensureHeaders_(sheet);
  const values = sheet.getDataRange().getValues();
  const headers = values.shift().map(text_);
  const registrations = values
    .filter((row) => row.some((cell) => text_(cell)))
    .map((row) => rowToRegistration_(headers, row))
    .reverse();

  return output_({ ok: true, registrations }, callback);
}

function parsePayload_(e) {
  if (e && e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (error) {
      return {};
    }
  }
  return (e && e.parameter) || {};
}

function getSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  return spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeaders_(sheet) {
  const range = sheet.getRange(1, 1, 1, HEADERS.length);
  const currentHeaders = range.getValues()[0].map(text_);
  if (currentHeaders.join("|") === HEADERS.join("|")) return;
  range.setValues([HEADERS]);
  sheet.setFrozenRows(1);
}

function rowToRegistration_(headers, row) {
  const record = {};
  headers.forEach((header, index) => {
    const value = row[index];
    record[header] = value instanceof Date ? value.toISOString() : value;
  });
  return {
    createdAt: record["報名時間"] || "",
    courseId: record["課程ID"] || "",
    courseTitle: record["課程名稱"] || "",
    courseType: record["課程類型"] || "",
    eventDate: record["活動日期"] || "",
    eventTime: record["開始時間"] || "",
    eventEndTime: record["結束時間"] || "",
    eventLocation: record["活動地點"] || "",
    eventCapacity: record["名額"] || "",
    eventPrice: record["費用"] || "",
    teacherName: record["講師名稱"] || "",
    teacherEmail: record["講師Email"] || "",
    memberName: record["姓名"] || "",
    meetupArea: record["居住區域"] || "",
    meetupGroup: record["小聚群"] || "",
    meetupGroupUrl: record["小聚群連結"] || "",
    email: record["Email"] || "",
    phone: record["手機"] || "",
    note: record["備註"] || "",
    sourceUrl: record["來源網址"] || "",
    cloudStatus: record["狀態"] || "",
  };
}

function output_(data, callback) {
  const json = JSON.stringify(data);
  const safeCallback = /^[A-Za-z_$][0-9A-Za-z_$]*$/.test(callback) ? callback : "";
  const body = safeCallback ? `${safeCallback}(${json});` : json;
  const mimeType = safeCallback ? ContentService.MimeType.JAVASCRIPT : ContentService.MimeType.JSON;
  return ContentService.createTextOutput(body).setMimeType(mimeType);
}

function text_(value) {
  return String(value == null ? "" : value).trim();
}
