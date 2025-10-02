const puppeteer = require('puppeteer');

async function checkConsoleErrors() {
  let browser;
  try {
    console.log('🚀 Launching browser...');
    browser = await puppeteer.launch({
      headless: false, // Set to true if you don't want to see the browser
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Listen for console messages
    const consoleMessages = [];
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        timestamp: new Date().toISOString()
      });
    });

    // Listen for page errors
    const pageErrors = [];
    page.on('pageerror', error => {
      pageErrors.push({
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    });

    console.log('🌐 Navigating to http://localhost:3001...');
    await page.goto('http://localhost:3001', {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    });

    // Wait a bit for any async operations
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('\n📊 Console Messages:');
    consoleMessages.forEach(msg => {
      const icon = msg.type === 'error' ? '❌' : 
                   msg.type === 'warning' ? '⚠️' : 
                   msg.type === 'info' ? 'ℹ️' : '📝';
      console.log(`${icon} [${msg.type.toUpperCase()}] ${msg.text}`);
    });

    console.log('\n🚨 Page Errors:');
    if (pageErrors.length === 0) {
      console.log('✅ No page errors detected!');
    } else {
      pageErrors.forEach(error => {
        console.log(`❌ ${error.error}`);
        if (error.stack) {
          console.log(`   Stack: ${error.stack}`);
        }
      });
    }

    // Take a screenshot for visual verification
    await page.screenshot({ path: 'localhost-check.png', fullPage: true });
    console.log('\n📸 Screenshot saved as localhost-check.png');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

checkConsoleErrors();
