# ตัวอย่าง Consumer Driven Contract Testing

โปรเจ็กต์ตัวอย่างนี้แสดงการทำ **Consumer Driven Contract Testing** ด้วย [Pact](https://pact.io/) โดยแยกโค้ดออกเป็นสามส่วนอย่างชัดเจน:

- `consumer_a/` – ผู้บริโภคคนแรก (InventoryWebA) ต้องการข้อมูลสินค้าแบบพื้นฐาน
- `consumer_b/` – ผู้บริโภคคนที่สอง (InventoryWebB) ต้องการข้อมูลสถานะสินค้าเพิ่มเติม
- `provider/` – ระบบฝั่งผู้ให้บริการ (ProductService) ที่ให้บริการ API และยืนยันสัญญาจากทั้งสอง Consumer

## โครงสร้างโปรเจ็กต์

```
consumer_a/
  package.json
  src/
    client.js
  tests/
    product.pact.test.js
consumer_b/
  package.json
  src/
    client.js
  tests/
    product.pact.test.js
provider/
  package.json
  src/
    server.js
  tests/
    pactVerification.js
README.md
```

## ขั้นตอนการใช้งาน

> ต้องติดตั้ง Node.js (แนะนำเวอร์ชัน 18 ขึ้นไป)

### 1. ติดตั้ง Dependencies

```bash
cd consumer_a
npm install

cd ../consumer_b
npm install

cd ../provider
npm install
```

### 2. รันเทสฝั่ง Consumer เพื่อสร้าง Pact File

```bash
cd consumer_a
npm test

cd ../consumer_b
npm test
```

คำสั่งเหล่านี้จะสร้างไฟล์สัญญา

- `consumer_a/pacts/inventoryweba-productservice.json`
- `consumer_b/pacts/inventorywebb-productservice.json`

### 3. ยืนยันสัญญาฝั่ง Provider

```bash
cd ../provider
npm run verify
```

คำสั่งนี้จะสตาร์ตเซิร์ฟเวอร์ Provider ชั่วคราว และใช้ Pact Verifier ตรวจสอบว่า endpoint ตรงตามสัญญาหรือไม่

### 4. รันเซิร์ฟเวอร์ Provider แบบจริงจัง

```bash
cd provider
npm start
```

ระบบจะเปิดบริการ API ที่ `http://localhost:4001/api/products/:id`

## แนวทางต่อยอด

- เพิ่มสถานการณ์ (Provider States) ที่หลากหลาย เพื่ออธิบายว่าต้องจัดเตรียมข้อมูลหรือสภาพของระบบอย่างไร
- ขยายผู้บริโภค (Consumers) เพิ่มเติม พร้อมระบุ endpoint หรือ field ที่ต้องการ
- เชื่อมต่อ Pact Broker เพื่อจัดการเวอร์ชันของสัญญาเมื่อมีหลาย Consumer/Provider
- ผูกเข้ากับ CI/CD เพื่อให้เทสสัญญาถูกรันทุกครั้งที่มีการเปลี่ยนแปลงโค้ด

## อ้างอิงที่น่าสนใจ

- [Pact Documentation](https://docs.pact.io/)
- [Consumer Driven Contracts 101](https://martinfowler.com/articles/consumerDrivenContracts.html)
