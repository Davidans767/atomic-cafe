# Integrations — מה מחובר למה

עדכון: ינואר 2026
TL;DR: כמעט כלום לא מחובר. הכל איים.

## אינטגרציות פעילות (כן עובדות)

### 1. Square ↔ Bank Account
- **מה:** Square מעביר את ההכנסות לחשבון העסק (Mizrahi)
- **תדירות:** יומי (T+1)
- **סטטוס:** עובד יציב
- **עמלה:** 2.6% + ₪0.30 לעסקה

### 2. Wix ↔ Google Analytics
- **מה:** Wix שולח data ל-GA4
- **סטטוס:** מחובר אבל אף אחד לא בודק
- **בעיה:** לא בטוח שהקוד עובד נכון — bounce rate 89% חשוד

### 3. Gmail ↔ Mailchimp
- **מה:** Mailchimp שולח בשם info@atomic-cafe.co.il
- **סטטוס:** SPF/DKIM מוגדר (נראה לי)
- **קמפיין אחרון:** יולי 2025

## אינטגרציות שניסינו ונכשלו

### 4. Instagram ↔ Auto-poster (failed)
- ניסיון 1: Buffer (2024) — לא עבד עם reels
- ניסיון 2: Later (2025) — Meta חסם API access
- ראה: `instagram-api-notes.md`

### 5. Square ↔ ICOUNT (never happened)
- רובי בדק ב-2024
- ICOUNT לא תומך ב-Square ישירות
- צריך מתווך (Zapier? Make?) — לא יצא לפועל
- **התוצאה:** יעל מזינה ידנית פעמיים בשבוע

### 6. WhatsApp Business ↔ Auto-replies (failed)
- הוגדרו תגובות אוטומטיות
- לא נשלחו אף פעם
- ראה: `whatsapp-business-setup.md`

## אינטגרציות חסרות (שצריך)

| מה ל-מה | למה | דחיפות |
|---------|------|--------|
| Square → ICOUNT | חיסכון 2h/week ליעל | גבוהה |
| POS → CRM (לא קיים) | זיהוי לקוחות חוזרים | גבוהה |
| Google Calendar → WhatsApp | תזכורות לאירועים | בינונית |
| Mailchimp → Square customers | רשימת תפוצה אמיתית | בינונית |
| Wix → Mailchimp signup | איסוף emails מהאתר | נמוכה (אין תנועה) |
| Google Business → תגובות אוטו' | מענה לביקורות | נמוכה |

## מפת חיבורים (סכמטית)

```
[Square POS] --$$$--> [Bank Account]
[Square POS] --manual entry--> [ICOUNT]
[Wix Site]   --weak signal--> [GA4]
[Mailchimp]  --SMTP--> [Gmail]
[Instagram]  --nothing--> []
[WhatsApp]   --manual reply--> [Customers]
[Asana]      --abandoned--> []
[Slack]      --abandoned--> []
```

## הערכה כללית

מעבר ל-Square→Bank שעובד פיננסית, אנחנו בעצם **מנוהלים ידנית**.
כל מערכת היא איי בודד. הלקוח קונה ב-Square, האיימיל יושב ב-Gmail, החשבונית ב-ICOUNT, התגובה ב-Insta — כלום לא מחבר ביניהם.

זה הסיבה שאי אפשר לענות על שאלות כמו:
- מי הלקוחות החוזרים שלנו?
- מי קנה מאיתנו ולא חזר?
- איזה קמפיין email הביא יותר מכירות?
- כמה עולה לנו לקוח?

**אין data layer. אין single source of truth.**
