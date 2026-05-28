# Style Guide — DRAFT

> ⚠️ מסמך לא גמור. עובדים עליו מאז דצמבר 2024. צריך להשלים לפני הצילומים החדשים.

## Colors

### Primary
- **Ink** `#22262D` — טקסט עיקרי, לוגו, רקע צד אחורי של כרטיסים
- **Cream** `#FAF3E7` — רקע ראשי, "הנייר"
- **Amber** `#E8A33D` — accent, מחירים, CTAs

### Secondary (Use Sparingly)
- **Coffee Brown** `#3B2A1E` — לוואריאציות חמות
- **Sage Green** `#5B8C5A` — לפוסטי lunch / "טבעי"
- **Deep Navy** `#1A2238` — לערב, לאווירה אינטימית

### Status Colors (לא בשימוש שיווקי)
- **Error Red** `#8B2C2C` — רק לסימון "סגור" / שגיאות בממשק

### TODO
- [ ] להחליט אם Sage Green נשאר או יוצא — נועם אמר שהוא לא בטוח שזה מתאים
- [ ] להוסיף "guidance" — באיזה אחוזי שטח כל צבע אמור להופיע
- [ ] להגדיר accessibility contrast ratios

---

## Typography

### Primary Font
**Heebo** (Google Fonts) — Hebrew + Latin

| Weight | Use |
|--------|-----|
| 900 (Black) | Headlines, hero text |
| 700 (Bold) | Subheads, important info |
| 400 (Regular) | Body text, default |
| 300 (Light) | Captions, fine print |

### Font Scale (לאתר ולמסמכים דיגיטליים)

| Size | Use |
|------|-----|
| 48pt | Hero headlines |
| 32pt | Section titles |
| 24pt | Subsection titles |
| 18pt | Large body / important |
| 14pt | Default body |
| 12pt | Captions, fine print |

### TODO
- [ ] להוסיף Latin pairing — Heebo Latin OK אבל לא נהדר. אולי Inter?
- [ ] להגדיר line-height per size
- [ ] להחליט על letter-spacing לכותרות (כרגע כל אחד עושה מה שבא לו)

---

## Logo

### Versions
- **Primary** — לוגו מלא + שם
- **Compact** — רק האייקון
- **Wordmark** — רק הטקסט "Atomic Cafe"

### Clear Space
מינימום שטח ריק סביב הלוגו = גובה ה-"A" של הלוגו עצמו.

### Don't
- אל תמתח / תעוות
- אל תוסיף אפקטים (צל, חתימה, glow)
- אל תשנה צבעים — רק ink, cream, או היפוך לבן על רקע כהה
- אל תשים על רקע עמוס בלי overlay

### TODO
- [ ] להפיק קבצי לוגו SVG בכל הגרסאות (יש רק PNG כרגע)
- [ ] להוסיף דוגמאות "כן" / "לא" עם תמונות
- [ ] לדבר על לוגו favicon לאתר

---

## Tone of Voice

### מה אנחנו

- **חם** — כמו לדבר עם שכן ותיק
- **קצר** — לא ארוך, לא מסביר יותר מדי
- **משחקי** — לפעמים שובב, לפעמים פיוטי
- **לא מתחנף** — לא "מבצע ענק! לא להחמיץ!!!"

### מה אנחנו לא

- ❌ פורמלי / קורפורייטי ("אנו שמחים להודיע על...")
- ❌ "אינסטגרם-ית" מוגזמת (לא "kawaii vibes only ✨")
- ❌ מכירתי-אגרסיבי ("רק עוד 3 ימים!!!")
- ❌ ביקורתי / סנובי ("הקפה שלנו לא בשבילך אם אתה אוהב נסקפה")

### דוגמאות

✅ **טוב:** "קמנו, טחנו, אפינו. בואו לאכול."
❌ **רע:** "אנחנו שמחים להזמין אתכם לטעימה מהמאפים הטריים שלנו!"

✅ **טוב:** "סגורים שבת. נתראה ראשון 07:00."
❌ **רע:** "לידיעת לקוחותינו היקרים: ביום שבת נהיה סגורים. ניפגש אי"ה ביום ראשון."

✅ **טוב:** "הקפה הזה מאתיופיה. פירותי. תנסו."
❌ **רע:** "מערב הקפה החדש שלנו מציע חוויה גוטמית-יחודית עם נימוקים פירותיים..."

### TODO
- [ ] להוסיף עוד דוגמאות ל-good vs. bad
- [ ] להוסיף guidance לאיך לכתוב פוסט מודעה ממומנת (כללים אחרים)
- [ ] להחליט: emoji — באיזה מינון? איפה כן, איפה לא?

---

## Imagery

### Photography Style
ראה: `gallery/photo-shoot-2025-brief.md`

### Illustration Style
**טרם הוגדר.** אנחנו לא משתמשים באיורים כרגע. השאלה: האם כדאי להתחיל?

### Iconography
**טרם הוגדר.** השתמשנו ב-Lucide / Heroicons בצורה אקראית. צריך לבחור set אחד.

---

## Layout & Spacing

### Grid
**טרם הוגדר.** בפועל משתמשים בגריד 12 עמודות לאתר, אבל אין spec רשמי.

### Spacing Scale (Tailwind-like)
4 / 8 / 12 / 16 / 24 / 32 / 48 / 64px

---

## Components

**טרם הוגדר.** אין רכיב UI library. כל פעם מאלתרים. צריך:
- כפתורים (primary, secondary, ghost)
- כרטיסים
- formים
- טוסטים / הודעות

---

## הערות פתוחות

- האם להפריד מסמך זה ל-Brand Guide (high-level) + Design System (component-level)?
- מי הבעלים של המסמך? כרגע אף אחד = הוא לא מתעדכן
- צריך לעשות workshop של חצי יום עם הצוות לסגור את כל ה-TODO
