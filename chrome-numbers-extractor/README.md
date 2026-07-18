# מחלץ מספרים לגיליון · Numbers → Sheet

תוסף Chrome (Manifest V3) שבלחיצה אחת מעתיק את **כל המספרים בדף** לפי סדר הופעתם,
ומזין אותם לעמודה נבחרת ב‑**Google Sheets** או בקובץ **Excel** מקומי.

A one‑click Chrome extension that copies **every number on the page**, in the
order it appears, into a chosen column of **Google Sheets** or a local **Excel** file.

---

## מה הוא עושה / What it does

- מחלץ מספרים מטקסט הדף ומשדות טופס (`input`/`textarea`/`select`), לפי סדר ההופעה במסמך.
- **ברירות מחדל:**
  - יעד: **Google Sheets** בחשבון Google שמחובר בדפדפן.
  - עמודה: **A**.
  - שם הקובץ/הגיליון: **כותרת דף האינטרנט** (`document.title`).
  - אם נבחר Excel: שמירה בתיקייה `tik/111` (ראו סעיף המגבלות לגבי `C:/`).
- **אם הקובץ לא קיים – נוצר. אם הוא קיים – רק העמודה הנבחרת נכתבת מחדש, שאר העמודות נשמרות.**
- ריצה **חד‑פעמית** (כפתור "הרץ עכשיו") או **חוזרת עם טיימר**.

---

## התקנה / Install

1. פתחו `chrome://extensions`, הפעילו **Developer mode**.
2. לחצו **Load unpacked** ובחרו את התיקייה `chrome-numbers-extractor`.
3. לפעולת Google Sheets יש להשלים הגדרת OAuth (למטה). ל‑Excel אין צורך בהגדרה נוספת.

---

## הגדרת Google Sheets (OAuth) / Google setup

התוסף משתמש ב‑`chrome.identity` וב‑Google Sheets + Drive API. צריך **פעם אחת**:

1. ב‑[Google Cloud Console](https://console.cloud.google.com/): צרו פרויקט.
2. **APIs & Services → Enable APIs**: הפעילו **Google Sheets API** ו‑**Google Drive API**.
3. **Credentials → Create credentials → OAuth client ID → Application type: _Chrome Extension_**.
4. הזינו את **מזהה התוסף (Extension ID)** שמופיע ב‑`chrome://extensions` אחרי טעינת התוסף.
5. העתיקו את ה‑Client ID והדביקו אותו ב‑`manifest.json`, בשדה:
   ```json
   "oauth2": { "client_id": "REPLACE_WITH_YOUR_OAUTH_CLIENT_ID.apps.googleusercontent.com", ... }
   ```
6. טענו מחדש את התוסף. בלחיצה הראשונה תופיע בקשת הרשאה של Google.

> ה‑scopes בשימוש: `spreadsheets` (כתיבה לגיליון) ו‑`drive.file` (מציאת/יצירת קבצים
> שהתוסף עצמו יצר). התוסף אינו ניגש לקבצים אחרים ב‑Drive שלכם.

**התאמה מלאה לדרישות** בערוץ Google Sheets: הגיליון נמצא/נוצר לפי שם הדף,
ורק העמודה הנבחרת נכתבת מחדש (ניקוי העמודה ואז כתיבה) — שאר הנתונים בגיליון נשמרים.

---

## מגבלות דפדפן חשובות — Excel / Important browser limits — Excel

תוספי Chrome פועלים ב‑sandbox, ולכן שני דברים **אינם אפשריים** בערוץ Excel המקומי, ואי אפשר לעקוף אותם מתוך תוסף:

1. **נתיב מוחלט כמו `C:/tik/111` — לא נתמך.**
   דפדפן יכול לשמור הורדות רק בתוך תיקיית ההורדות (Downloads), עם תת‑תיקייה יחסית.
   לכן הקובץ נשמר בפועל ב‑`Downloads/tik/111/<שם הדף>.xlsx`.
   כדי לקבל התנהגות קרובה ל‑`C:/tik/111`, אפשר להגדיר ב‑Chrome
   (`chrome://settings` → Downloads) את מיקום ההורדות ל‑`C:/tik`, ואז הקובץ יגיע ל‑`C:/tik/111/...`.

2. **שמירה על נתונים קיימים בקובץ Excel שכבר על הדיסק — חלקית בלבד.**
   תוסף אינו יכול לקרוא קובץ שרירותי מהדיסק. לכן, בערוץ Excel, התוסף שומר עותק‑צל
   (בזיכרון התוסף) של מה שהוא עצמו כתב, וכך משמר עמודות אחרות **שהוא כתב** בין ריצות.
   עריכות ידניות חיצוניות לקובץ לא נראות לו. **לשמירה מלאה על נתונים קיימים — השתמשו ב‑Google Sheets**,
   שם המגבלה הזו אינה קיימת.

*(בערוץ Google Sheets אין אף אחת מהמגבלות האלה — הוא ממלא את כל הדרישות במלואן.)*

---

## הערות נוספות / Notes

- **טיימר:** המרווח בשניות; Chrome עשוי לעגל מרווחים קצרים (מתחת ל‑60 שניות) בסביבת production.
  הטיימר רץ על הכרטיסייה שהייתה פעילה בהפעלתו; אם היא נסגרת, הטיימר נעצר.
- **פירוש מספרים:** נתמכים מספרים שלמים, עשרוניים ומספרים עם מפרידי אלפים (`1,234.56`).
  שימו לב שמקף נקרא כסימן מינוס (למשל בטלפון `03-1234567`). ניתן לבחור מצב "טקסט מקורי"
  שישמור את המחרוזת כפי שהופיעה בדף במקום ערך מספרי.
- **מצב "רק אלמנטים גלויים"** מדלג על טקסט מוסתר (`display:none` וכו').

---

## מבנה הקוד / Code layout

| קובץ | תפקיד |
|------|-------|
| `manifest.json` | הגדרות התוסף, הרשאות, OAuth |
| `popup.html/.css/.js` | ממשק המשתמש |
| `background.js` | service worker: תזמור, אימות, כתיבה |
| `lib/extractor.js` | חילוץ מספרים מהדף לפי סדר |
| `lib/sheets.js` | קריאות Google Sheets + Drive |
| `lib/xlsx.js` | יוצר `.xlsx` עצמאי (ללא תלויות) |
