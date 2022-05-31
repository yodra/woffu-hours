import { config } from "dotenv";
import { Page, test } from '@playwright/test';
import { fillHours, goToReport, woffuURL } from "./utils";

config();

const emailInput = '[placeholder="Tu e-mail"]';
const passwordInput = '[placeholder="Contraseña"]';
const enterButton = 'form[name="loginForm"] button:has-text("Entrar")';

const buildSetup = (page: Page) => ({
    doLogin: async () => {
        await page.goto(woffuURL);

        await page.locator(emailInput).click();
        await page.locator(emailInput).fill(process.env.EMAIL);

        await page.locator(passwordInput).click();
        await page.locator(passwordInput).fill(process.env.PASSWORD);

        await Promise.all([
            page.waitForNavigation(),
            page.locator(enterButton).click()
        ]);
    }
});

test('fill hours of previous month in Woffu', async ({ page }) => {
    const { doLogin } = buildSetup(page);
    await doLogin();
    await goToReport(page);
    await page.frameLocator('#iFrameResizer0').locator('text=< mes anterior').click();
    await fillHours(page);
});
