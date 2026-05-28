# Instagram Automation — Notes & Failures

חשבון: @atomic.cafe.tlv
פלטפורמה: Instagram Business (מקושר ל-Facebook Page)
תקופה: ניסיונות 2024-2025
סטטוס: לא עובד. פוסטים ידניים בלבד.

---

## ניסיון 1: Buffer (פברואר 2024)

**מטרה:** לתזמן 3 פוסטים בשבוע ל-Instagram ולשחרר את רובי מהמשימה.

**מה עשינו:**
1. נפתח חשבון Buffer Free
2. חיברנו את הדף בפייסבוק ל-Buffer
3. ה-Instagram חובר אוטומטית דרך FB Business
4. הקלדנו 4 פוסטים מתוזמנים — תמונות + טקסט

**מה קרה:**
- 2 פוסטים נשלחו כ-Image post — עבדו ✓
- ניסינו לתזמן Reels — Buffer Free לא תמך
- ניסינו לתזמן Stories — נדרש upgrade ל-paid
- שדרגנו ל-Buffer Essentials ($6/month)
- אחרי upgrade — Reels עדיין נכשלו ("requires Instagram Mobile API")

**התקלה:** Reels דורש publish דרך אפליקציית Instagram, לא דרך Graph API.
Workaround שהציעו: לעלות mp4, להגדיר reminder, ידנית לאשר באפליקציה.
זה לא automation אמיתי.

**הקרסה:** אחרי 3 שבועות הפסקנו. בילינו 3 שעות + ₪25 על מנוי. ביטלנו.

---

## ניסיון 2: Later (אוגוסט 2025)

**מטרה:** אותו דבר, אבל Later נחשב יותר טוב ל-Instagram.

**מה עשינו:**
1. נפתח חשבון Later Free
2. חיבור Instagram Business דרך OAuth ל-Meta
3. ניסינו לחבר את Atomic Cafe IG account

**מה קרה:**
- OAuth flow נכשל עם הודעה:
  ```
  "We can't connect your Instagram account at this time.
  Please verify the account is a Business or Creator account."
  ```
- ה-IG כן business account (בדקנו)
- ניסינו 5 פעמים — אותה תקלה
- פתחנו support ticket ב-Later

**תגובת Later (אחרי 8 ימים):**
> "We are experiencing increased restrictions from Meta on third-party API access.
> Please ensure your Facebook Page is properly linked to the Instagram account
> and that you have admin access to both."

בדקנו — הכל מקושר נכון.

**הסיבה האמיתית (גילינו מאוחר):**
Meta הקפיא חיבורי API חדשים ל-third party tools בקיץ 2025 בעקבות שינויי policy.
חשבונות שכבר היו מקושרים — המשיכו לעבוד.
חשבונות חדשים — חסומים.

**הקרסה:** ויתרנו. הסרנו את החשבון מ-Later.

---

## ניסיון 3 (שכמעט קרה): Meta Business Suite Direct

**מה זה:** הכלי הרשמי של Meta לתזמון פוסטים.
**מצב:** רובי פתח, התחבר, ראה את הממשק.
**הקרסה:** הסתבך, לא הצליח לחבר את ה-Page. נטש אחרי 15 דקות.

הערה: זה בעצם הכלי שאמור לעבוד. צריך לחזור אליו עם זמן.

---

## מה אנחנו עושים היום

- רובי מעלה פוסט בערך פעם בשבועיים-שלושה
- ידני, מהטלפון, באפליקציית Instagram
- בלי תכנון מראש
- בלי קמפיינים
- בלי הסטוריות מתוזמנות
- בלי reels (אף פעם)

**תוצאה:** 1,247 followers, growth ~1% / month. רובם לקוחות קיימים.

---

## מסקנות + מה עכשיו

1. **Automation דרך third-party = פתח בעיות.** Meta כל הזמן משנה.
2. **Meta Business Suite זה ה-path הרשמי** — צריך זמן ולמידה אבל זה היחיד שלא ייחסם.
3. **Reels זה ה-driver לגדילה אורגנית ב-2025/2026** — אנחנו לא מעלים אפילו אחד.
4. **רובי לא מסוגל לעמוד בקצב לבד.** צריך:
   - או להעסיק מישהו (creator part-time)
   - או להגיע למודל שיוצר תוכן מ-data שכבר קיים (לקוחות, מנות, אירועים)

---

## TODO

- [ ] לחזור ל-Meta Business Suite, לחבר את החשבון פעם אחת ולתעד
- [ ] להחליט: ידני (רובי) או מקצועי (freelancer)?
- [ ] להגדיר תוכן calendar בסיסי (3 פוסטים בשבוע)
- [ ] לבדוק אם אפשר לעשות Reel אחד בשבוע
- [ ] לחשוב על אסטרטגיית UGC (לקוחות מתייגים אותנו)
