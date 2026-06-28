# เชื่อมต่อช่องความคิดเห็นกับ Google Sheets (ฟรี)

`viewer.html` ส่งความคิดเห็นไปเก็บใน **Google Sheet** ของคุณเอง ผ่าน **Google Apps Script**
เหมาะกับการนำไปวิเคราะห์ต่อ — เรียงลำดับ กรอง และส่งออก CSV ได้ และข้อมูลเป็นของคุณทั้งหมด

ตั้งค่าครั้งเดียว ใช้เวลาประมาณ 5 นาที ไม่มีค่าใช้จ่าย

## ขั้นตอน

1. ไปที่ <https://sheets.google.com> สร้างสเปรดชีตใหม่ ตั้งชื่อ เช่น `CEP3D Comments`
2. ในสเปรดชีต เลือกเมนู **Extensions ▸ Apps Script**
3. ลบโค้ดตัวอย่างทั้งหมด แล้ววางเนื้อหาจากไฟล์ [`Code.gs`](./Code.gs) ลงไป → กดบันทึก (ไอคอนดิสก์)
4. กดปุ่ม **Deploy ▸ New deployment**
   - ไอคอนเฟือง (Select type) → เลือก **Web app**
   - **Description**: อะไรก็ได้ เช่น `comments v1`
   - **Execute as**: **Me** (อีเมลของคุณ)
   - **Who has access**: **Anyone**  ← สำคัญ เพื่อให้เว็บส่งข้อมูลได้
   - กด **Deploy** → อนุญาตสิทธิ์ (Authorize) ให้สคริปต์เข้าถึงสเปรดชีต
5. คัดลอก **Web app URL** (ลงท้ายด้วย `/exec`)
6. เปิดไฟล์ `viewer.html` แก้ค่า `CONFIG.ENDPOINT` ให้เป็น URL ที่คัดลอกมา:

   ```js
   const CONFIG = {
     ENDPOINT: "https://script.google.com/macros/s/XXXXXXXX/exec",
     ...
   };
   ```
7. commit + push ไฟล์ `viewer.html` → GitHub Pages จะอัปเดตใน 1–2 นาที

เสร็จแล้ว ทุกความคิดเห็นจะถูกเพิ่มเป็นแถวใหม่ในชีต `comments` โดยอัตโนมัติ

## ทดสอบ

- เปิดหน้า `viewer.html` กรอกแบบฟอร์มแล้วกดส่ง — ควรเห็นข้อความ "บันทึกเรียบร้อยแล้ว ✓"
- กลับไปดูสเปรดชีต ควรมีแถวข้อมูลเพิ่มขึ้น
- เปิด Web app URL ตรง ๆ ในเบราว์เซอร์ ควรเห็นข้อความ `comment endpoint is live.`

## หมายเหตุ

- หากแก้ไข `Code.gs` ภายหลัง ต้อง **Deploy ▸ Manage deployments ▸ แก้ไข ▸ Version: New version** เพื่อให้มีผล
- คอลัมน์ที่บันทึก: เวลา, ชื่อ, หน่วยงาน, อีเมล, ประเภท, พื้นที่, ความคิดเห็น, หน้าเว็บ, อุปกรณ์, เวลาฝั่งเซิร์ฟเวอร์
- มีกันสแปมเบื้องต้นด้วย honeypot (ช่อง `website` ที่ซ่อนไว้)
- หากยังไม่ตั้งค่า `ENDPOINT` ฟอร์มจะเก็บสำเนาไว้ในเบราว์เซอร์ และเปิดอีเมลสำรองให้แทน เพื่อไม่ให้ความคิดเห็นสูญหาย

## ทางเลือกอื่น (หากไม่อยากใช้ Google Sheets)

- **Formspree** (<https://formspree.io>) — ง่ายที่สุด เปลี่ยน `ENDPOINT` เป็น URL ของ Formspree
  และเปลี่ยนการส่งใน `viewer.html` ให้แนบ header `Accept: application/json` (ดูคอมเมนต์ในโค้ด)
- **Giscus** (<https://giscus.app>) — คอมเมนต์สาธารณะแบบกระทู้ เก็บใน GitHub Discussions
- **Netlify Forms** — ต้องย้ายโฮสต์จาก GitHub Pages ไป Netlify (ฟรีเช่นกัน)
