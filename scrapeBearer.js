const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeBearer = async (res) => {
    const browser = await puppeteer.launch({
        headless: 'new',
        args: [
          "--disable-setuid-sandbox",
          "--no-sandbox",
          "--single-process",
          "--no-zygote",
        ],
        executablePath:
          process.env.NODE_ENV === "production"
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath(),
      });
      try {
        const page = await browser.newPage();
    
        await page.goto('https://cwv.ycdes.org/newworld.cadview',{ waitUntil: 'networkidle0' })
    
        // Log in
        await page.type('#Username', 'FIRESTA44');
        await page.type('#passwordField', 'Engine44');
        // click and wait for navigation
        await Promise.all([
            page.click('#loginbtn'),
            page.waitForNavigation({ waitUntil: 'networkidle0' }),
        ]);
    
        const Bearer = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('oidc.user:https://cwv.ycdes.org/newworld.cadview/:NewWorld.CadView2')).access_token});
        await browser.close()
        // Print the full title
        const logStatement = `Bearer ${Bearer}`;
        console.log('we got it ');
        res.send(logStatement);
        
      } catch (e) {
        console.error(e);
        res.send(`Something went wrong while running Puppeteer: ${e}`);
      } finally {
        await browser.close();
      }
}

module.exports = { scrapeBearer }