import fs from 'fs';
import puppeteer from 'puppeteer';
import Papa from 'papaparse';
import puppeteer from 'puppeteer';

export async function exportOrderCSV(data) {
  return Papa.unparse(data);
}

export async function exportPDF(data) {
  const html = renderTemplate(data);
  return await generatePDF(html);
}

function renderTemplate(data) {
  let html = fs.readFileSync('./invoiceTemplate.html', 'utf-8');

  const rows = data.items.map((item, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${item.name}</td>
      <td>${item.qty}</td>
      <td>${item.unit}</td>
      <td>${item.price}</td>
      <td>${item.qty * item.price}</td>
    </tr>
  `).join('');

  return html
    .replace('{{schoolName}}', data.schoolName)
    .replace('{{invoiceNo}}', data.invoiceNo)
    .replace('{{date}}', data.date)
    .replace('{{department}}', data.department)
    .replace('{{rows}}', rows)
    .replace('{{total}}', data.total);
}
async function generatePDF(html) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({ format: 'A4', printBackground: true });
  await browser.close();
  return pdf;
}

