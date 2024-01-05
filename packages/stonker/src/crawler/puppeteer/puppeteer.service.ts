import { PuppeteerBrowserProcess } from '@myawesomeorg/constants';
import { FileSystem } from '@myawesomeorg/file-system';
import { getProcessDetails, processArg0IsPuppeteer } from '@myawesomeorg/utils';
import { CDPSession, Protocol } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import AdblockerPlugin from 'puppeteer-extra-plugin-adblocker';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

export class PuppeteerService {
  constructor(private readonly fileSystem: FileSystem) {}

  async getCookie(): Promise<Protocol.Network.CookieParam[]> {
    return this.fileSystem.puppeteerCookie.getCookie();
  }

  async saveCurrentCookies(cdt: CDPSession) {
    // console.log(`> saving cookies...`);
    return this.fileSystem.puppeteerCookie.replaceCookie(
      (await cdt.send('Network.getAllCookies')).cookies
    );
  }
  async openBrowser() {
    console.log(`> opening a browser...`);
    // console.log(
    //   `>> whatToCrawl: ${
    //     whatToCrawl !== "all" ? JSON.stringify(whatToCrawl, null, 2) : "all"
    //   }`
    // );
    let browser;
    puppeteer.use(StealthPlugin());

    // Add Adblocker plugin to block all ads and trackers (saves bandwidth)
    puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

    try {
      browser = await puppeteer.launch({
        headless: false,
        // defaultViewport: { width: 1920, height: 1080 },
        defaultViewport: null,
        userDataDir: this.fileSystem.puppeteerUserDataDir,
        ignoreDefaultArgs: ['--enable-automation'],
        args: [
          '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
          '--disable-infobars',
          '--start-maximized',
          '--single-process',
          '--no-zygote',
          '--no-sandbox',
        ],
      });
    } catch (error) {
      console.log(error);
    }

    if (!browser) {
      throw Error('Cannot open browser');
    }

    const browserPid = browser.process()?.pid ?? null;
    if (!browserPid) {
      throw Error('Cannot get browser pid');
    }
    console.log(`current browser pid: ${browserPid}...`);
    const processDetails = await getProcessDetails(browserPid);
    const browserProcess: PuppeteerBrowserProcess = {
      pid: processDetails.pid,
      browserCommand: processDetails.command,
      arg0: processDetails.arg0,
    };
    if (processArg0IsPuppeteer(browserProcess.arg0) === false) {
      throw new Error(
        `Browser process ${browserProcess.arg0} doesnt look to be chrome`
      );
    }
    const page = await browser.newPage();
    await page.setCookie(...(await this.getCookie()));
    const cdt = await page.target().createCDPSession();
    // minimize window
    const { windowId } = await cdt.send('Browser.getWindowForTarget');
    await cdt.send('Browser.setWindowBounds', {
      windowId,
      bounds: { windowState: 'minimized' },
    });

    browser.on('targetchanged', async () => await this.saveCurrentCookies(cdt));

    await page.goto('https://google.com');

    return {
      browser,
      browserProcess,
      cdt,
    };
  }
}
