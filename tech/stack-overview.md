# Tech Stack Overview — Atomic Cafe

עדכון אחרון: ינואר 2026
מי שאחראי על זה: רובי (בעל הקפה) — בלי backup

## מה אנחנו משתמשים בו (היום)

### POS / קופה
- **Square POS** — iPad ליד הברמן + קורא כרטיסים
  - חשבון: רובי
  - חיבור: WiFi של הקפה (לפעמים נופל)
  - תוכניות מנויים: Square Free + Square for Restaurants ($60/חודש)
  - בעיה ידועה: לא מסונכרן עם החשבונאות

### חשבונאות
- **ICOUNT** — מערכת ניהול חשבונאית
  - חשבון: על שם העסק
  - שימוש: חשבוניות, קבלות, דוחות חודשיים
  - מי מזין: יעל (פעמיים בשבוע)
  - בעיה: הזנה ידנית מ-Square ל-ICOUNT, לוקח שעתיים בשבוע

### Google Workspace
- **Plan:** Business Starter ($7.20/user/month)
- **משתמשים:** ruby@atomic-cafe.co.il, yael@atomic-cafe.co.il, info@atomic-cafe.co.il
- שימוש: Gmail, Drive, Docs, Sheets, Calendar
- לא משתמשים: Meet, Forms (אבל יש)

### Website
- **Wix** — atomic-cafe.co.il
  - Plan: Business Basic (~₪150/חודש)
  - מי בנה: רובי לבד ב-2022
  - עדכון אחרון: יוני 2024 (תפריט קיץ)
  - מצב: מיושן, mobile חלש, SEO גרוע

### Email Marketing
- **Mailchimp** — Free plan
  - רשימה: 340 contacts
  - קמפיין אחרון: יולי 2025 (לפני 6 חודשים!)
  - מי מנהל: רובי, אבל בעצם אף אחד

## מה יש לנו אבל לא משתמשים

### Asana
- נפתח חשבון 2023
- היתה תקווה לנהל משימות צוות
- לא נכנס אף אחד יותר משבועיים אחרי הפתיחה
- עדיין משלמים? **צריך לבדוק**

### Slack
- נפתח workspace 2024 — atomic-cafe.slack.com
- 3 משתמשים הצטרפו, אף אחד לא כתב כלום אחרי שבוע
- כל התקשורת בצוות = WhatsApp group

### Google Forms
- כלי שיש ב-Workspace, לא ניגלנו בו

## תשתית פיזית

- **WiFi:** Bezeq Fiber 500/100 — router בחדר אחורי
- **WiFi לקוחות:** רשת נפרדת (atomic-guest), סיסמה: cafelove2024
- **מצלמות:** Hikvision 4 ערוצים — DVR מקומי, אין cloud
- **מדפסת קבלות:** Star Micronics TSP143 — USB ל-iPad

## מה חסר (לדעת רובי)

- ניהול לקוחות (CRM) — אין
- ניהול מלאי דיגיטלי — אין (Excel ידני)
- אפליקציית נאמנות — אין
- הזמנה אונליין — אין
- אוטומציה כלשהי — אין

## הערכת עלות חודשית

| כלי | עלות חודשית |
|-----|-------------|
| Square subscription | ~₪220 |
| Square fees (~2.6%) | ~₪3,500 |
| ICOUNT | ~₪180 |
| Google Workspace (3 users) | ~₪80 |
| Wix Business Basic | ~₪150 |
| Mailchimp | ₪0 (free) |
| Asana | **לא ידוע — לבדוק** |
| **סך הכל ידוע** | **~₪4,130** |

## הערות חשובות

- הכל מבוסס על רובי. אם הוא חולה / בחו"ל — אף אחד לא יודע איך נכנסים למערכות
- אין תיעוד סיסמאות מסודר (ראה api-keys-and-logins.txt)
- אין backups מתוכננים — Square ו-ICOUNT שומרים אצלם, אבל אין export רגיל
- שום דבר לא מדבר עם שום דבר. הכל איים בודדים.
