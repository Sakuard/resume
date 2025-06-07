const puppeteer = require('puppeteer');
const path = require('path');
require('dotenv').config();

async function convertHTMLtoPDF() {
  const browser = await puppeteer.launch({
    headless: 'new'
  });
  
  try {
    const page = await browser.newPage();

    const html = process.env.HTML_PATH;
    const pdf = process.env.PDF_PATH;
    console.log(html, pdf);

    
    // 讀取 HTML 檔案
    const htmlPath = path.resolve(`./${html}`);
    await page.goto(`file://${htmlPath}`, {
      waitUntil: 'networkidle0'
    });
    
    // 產生 PDF
    await page.pdf({
      path: `${pdf}`,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15px',
        right: '15px',
        bottom: '15px',
        left: '15px'
      }
    });
    
    console.log('PDF 已成功產生：resume.pdf');
  } catch (error) {
    console.error('轉換失敗：', error);
  } finally {
    await browser.close();
  }
}

convertHTMLtoPDF();