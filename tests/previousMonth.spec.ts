import { config } from "dotenv";
import { Page, test } from '@playwright/test';
import { fillHours, goToReport, woffuURL } from "./utils";

config();

const buildSetup = (page: Page) => ({
    doLogin: async () => {
        await page.goto(woffuURL);
        await page.locator('[placeholder="Introduce tu email"]').fill(process.env.EMAIL);
        await page.locator('text=Siguiente').click();
        await page.locator('[placeholder="Escribe tu contraseña"]').fill(process.env.PASSWORD);

        await Promise.all([
            page.waitForNavigation(),
            page.locator('button:has-text("Iniciar sesión")').click()
        ]);
    }
});

test('fill hours of previous month in Woffu', async ({ page }) => {
    const { doLogin } = buildSetup(page);
    await doLogin();
    await goToReport(page);
    // TODO repeat number of month back
    // await page.frameLocator('#woffu-legacy-app').locator('text=< mes anterior').click();

    // TODO repeat number of month to fill
    // await fillHours(page);
    // await page.frameLocator('#woffu-legacy-app').locator('text=mes siguiente >').click();
    await fillHours(page);
});
