const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const cheerio = require('cheerio');
require('dotenv').config();

// 尋找 LibreOffice 執行檔
function findSoffice() {
  const candidates = [
    'soffice',
    '/Applications/LibreOffice.app/Contents/MacOS/soffice',
    '/usr/bin/soffice',
    '/usr/local/bin/soffice',
  ];
  for (const bin of candidates) {
    try {
      execSync(`${bin} --version`, { stdio: 'ignore' });
      return bin;
    } catch (_) {}
  }
  return null;
}

// 將 flex layout 轉成 table，讓 LibreOffice 正確渲染
function transformFlexToTable($) {
  // .position-header：職稱靠左，日期靠右
  $('.position-header').each((_, el) => {
    const children = $(el).children();
    if (children.length === 2) {
      const left = $(children[0]).html();
      const right = $(children[1]).html();
      $(el).replaceWith(
        `<table style="border-collapse:collapse;width:100%;margin:0;padding:0;">
          <tr>
            <td style="border:none;font-weight:bold;padding:0;">${left}</td>
            <td style="border:none;text-align:right;white-space:nowrap;padding:0;">${right}</td>
          </tr>
        </table>`
      );
    }
  });

  // .company-location：只保留公司名（去 flex）
  $('.company-location').each((_, el) => {
    const children = $(el).children();
    const left = children.length > 0 ? $(children[0]).html() : $(el).html();
    $(el).replaceWith(`<div style="font-style:italic;margin:0;">${left}</div>`);
  });

  // .skills-grid：兩欄並排
  $('.skills-grid').each((_, el) => {
    const cells = $(el).find('.skills-cell');
    if (cells.length === 2) {
      const col1 = $(cells[0]).html();
      const col2 = $(cells[1]).html();
      $(el).replaceWith(
        `<table style="border-collapse:collapse;width:100%;margin:0;padding:0;">
          <tr>
            <td style="border:none;padding:0 5px;width:50%;vertical-align:top;">${col1}</td>
            <td style="border:none;padding:0 5px;width:50%;vertical-align:top;">${col2}</td>
          </tr>
        </table>`
      );
    }
  });

  // .education-item：名稱靠左，日期靠右
  $('.education-item').each((_, el) => {
    const children = $(el).children();
    if (children.length === 2) {
      const left = $(children[0]).html();
      const right = $(children[1]).html();
      $(el).replaceWith(
        `<table style="border-collapse:collapse;width:100%;margin:0;padding:0;">
          <tr>
            <td style="border:none;padding:0 5px;">${left}</td>
            <td style="border:none;text-align:right;white-space:nowrap;padding:0 5px;">${right}</td>
          </tr>
        </table>`
      );
    }
  });

  // Languages inline flex div
  $('div[style*="display: flex"]').each((_, el) => {
    const children = $(el).children();
    if (children.length >= 2) {
      const cols = [];
      children.each((_, child) => cols.push(`<td style="border:none;padding:0 20px 0 0;">${$(child).html()}</td>`));
      $(el).replaceWith(
        `<table style="border-collapse:collapse;margin:0;padding:0 5px;">
          <tr>${cols.join('')}</tr>
        </table>`
      );
    }
  });
}

async function convertHTMLtoWord() {
  const html = process.env.HTML_PATH;
  const docx = process.env.DOCX_PATH;
  console.log(html, docx);

  const soffice = findSoffice();
  if (!soffice) {
    console.error('找不到 LibreOffice，請先安裝：https://www.libreoffice.org/download/');
    process.exit(1);
  }

  // 讀取並預處理 HTML（flex → table）
  const htmlPath = path.resolve(`./${html}`);
  const rawHtml = fs.readFileSync(htmlPath, 'utf8');
  const $ = cheerio.load(rawHtml);
  transformFlexToTable($);
  const processedHtml = $.html();

  // 寫入暫存檔
  const tmpPath = path.resolve('./._tmp_resume.html');
  fs.writeFileSync(tmpPath, processedHtml, 'utf8');

  const outDir = path.resolve('./');

  try {
    execSync(`"${soffice}" --headless --convert-to "docx:MS Word 2007 XML" "${tmpPath}" --outdir "${outDir}"`, {
      stdio: 'inherit'
    });

    // 將 LibreOffice 產生的檔案 rename 到目標路徑
    const generatedPath = path.join(outDir, '._tmp_resume.docx');
    fs.renameSync(generatedPath, path.resolve(docx));
    console.log('Word 已成功產生：', docx);
  } finally {
    // 清除暫存 HTML
    fs.unlinkSync(tmpPath);
  }
}

convertHTMLtoWord();
