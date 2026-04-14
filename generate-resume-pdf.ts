import fs from 'fs';
import puppeteer from 'puppeteer';
import { marked } from 'marked';

interface ResumeOptions {
  inputFile: string;
  outputFile: string;
  title: string;
  subtitle: string;
}

function parseArgs(args: string[]): ResumeOptions | null {
  const options: Partial<ResumeOptions> = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const value = args[i + 1];
      
      if (!value || value.startsWith('--')) {
        console.error(`❌ Missing value for ${arg}`);
        return null;
      }
      
      switch (key) {
        case 'input':
          options.inputFile = value;
          break;
        case 'output':
          options.outputFile = value;
          break;
        case 'title':
          options.title = value;
          break;
        case 'subtitle':
          options.subtitle = value;
          break;
        default:
          console.error(`❌ Unknown argument: ${arg}`);
          return null;
      }
      
      i++; // Skip the value in next iteration
    }
  }
  
  // Validate all required fields are present
  if (!options.inputFile || !options.outputFile || !options.title || !options.subtitle) {
    console.error('❌ Missing required arguments');
    return null;
  }
  
  return options as ResumeOptions;
}

async function generateResumePDF(options: ResumeOptions): Promise<void> {
  const { inputFile, outputFile, title, subtitle } = options;

  if (!fs.existsSync(inputFile)) {
    console.error(`❌ File not found: ${inputFile}`);
    process.exit(1);
  }

  // Read the markdown file
  const resumeMarkdown = fs.readFileSync(inputFile, 'utf-8');
  
  // Convert markdown to HTML
  const contentHtml = marked.parse(resumeMarkdown);
  
  // Create a complete HTML document with professional styling
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    @page {
      margin: 0.75in;
      size: A4;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 10pt;
      line-height: 1.5;
      color: #222;
      max-width: 100%;
    }
    
    h2 {
      font-size: 16pt;
      font-weight: 700;
      color: #1a1a1a;
      margin-top: 20pt;
      margin-bottom: 4pt;
      border-bottom: 2px solid #333;
      padding-bottom: 4pt;
      page-break-after: avoid;
    }
    
    h2:first-child {
      margin-top: 0;
    }
    
    h3 {
      font-size: 11pt;
      font-weight: 600;
      color: #666;
      margin-top: 4pt;
      margin-bottom: 10pt;
      page-break-after: avoid;
    }
    
    p {
      margin-bottom: 8pt;
      text-align: justify;
    }
    
    ul {
      margin-bottom: 10pt;
      padding-left: 0;
      list-style: none;
    }
    
    li {
      margin-bottom: 3pt;
    }
    
    strong {
      font-weight: 600;
      color: #1a1a1a;
    }
    
    /* Prevent page breaks inside sections */
    h2, h3 {
      page-break-inside: avoid;
    }
    
    p {
      orphans: 3;
      widows: 3;
    }
    
    /* Add spacing between positions */
    h2 + h3 {
      margin-top: 0;
    }
  </style>
</head>
<body>
  <h1 style="text-align: center; font-size: 24pt; margin-bottom: 10pt; color: #000;">${title}</h1>
  <p style="text-align: center; margin-bottom: 30pt; color: #666;">${subtitle}</p>
  
  ${contentHtml}
</body>
</html>
  `;
  
  // Launch puppeteer and generate PDF
  console.log(`Generating PDF from ${inputFile}...`);
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
  await page.pdf({
    path: outputFile,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0.75in',
      right: '0.75in',
      bottom: '0.75in',
      left: '0.75in'
    }
  });
  
  await browser.close();
  
  console.log(`✅ PDF generated successfully: ${outputFile}`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: tsx generate-resume-pdf.ts --input <file> --output <file> --title <text> --subtitle <text>');
    console.log('Example: tsx generate-resume-pdf.ts --input resume-en.md --output resume-en.pdf --title "Oscar Waldell" --subtitle "Full Stack Developer"');
    process.exit(1);
  }

  const options = parseArgs(args);
  
  if (!options) {
    console.log('\nUsage: tsx generate-resume-pdf.ts --input <file> --output <file> --title <text> --subtitle <text>');
    process.exit(1);
  }

  await generateResumePDF(options);
}

main().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
