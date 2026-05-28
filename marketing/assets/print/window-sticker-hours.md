# Window Sticker — Opening Hours

## Spec

- **Size:** 250x350mm (A4-ish, portrait)
- **Material:** Static cling vinyl, transparent background
- **Print:** White ink + ink color (#22262D), 2-color
- **Position:** Inside of front door, eye-level (165cm from floor)
- **Replacement:** When edges peel (~12 months)

## Sticker Text

```
+---------------------+
|                     |
|   שעות פתיחה        |
|   ─────────         |
|                     |
|   ראשון  07:00-22:00|
|   שני    07:00-22:00|
|   שלישי  07:00-22:00|
|   רביעי  07:00-22:00|
|   חמישי  07:00-23:00|
|   שישי   07:00-15:00|
|   שבת    סגור       |
|                     |
|   ─────────         |
|                     |
|   חגי ישראל:        |
|   סגור בערבי חג     |
|   ובחגים            |
|                     |
|   050-XXXXXXX       |
|                     |
+---------------------+
```

## Typography

- כותרת "שעות פתיחה": Heebo 900, 32pt
- ימי השבוע: Heebo 700, 18pt
- שעות: Heebo 400, 18pt, יישור-שמאל
- "סגור": Heebo 700, 18pt, צבע אדום עמום (#8B2C2C)
- תחתונה (חגים + טלפון): Heebo 400, 12pt

## Layout

- צבע טקסט יחיד: ink (#22262D)
- ללא לוגו (יש כבר על הזכוכית של החנות)
- ריווח שורות 1.4
- יישור: שם יום בימין, שעות בשמאל, מסודר בעמודות

## Variants

| Variant | When | What changes |
|---------|------|--------------|
| **base** | תמיד | המסטיקר הזה |
| **summer** | יולי-אוגוסט | מוסיף "פתוח עד 24:00 בחמישי" |
| **holidays** | לפני חגים | overlay זמני (נייר רגיל) עם תאריכים ספציפיים |

## File Locations

- Source: Figma "Atomic Cafe / Print / Window"
- Print-ready: `window-sticker-hours-v3.pdf`
- Vendor: דפוס אביב, רמת גן (~₪80 לסטיקר)

## TODO
- [ ] לעדכן כשנפתח בשבתות (אם בכלל)
- [ ] להוסיף גרסה באנגלית לתיירים? (החלטה תלויה ב-Noam)
