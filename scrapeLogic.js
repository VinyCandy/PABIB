const puppeteer = require("puppeteer");

const scrapeLogic = async (res) => {
    const browser = await puppeteer.launch();
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

module.exports = { scrapeLogic }