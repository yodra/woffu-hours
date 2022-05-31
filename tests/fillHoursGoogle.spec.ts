import { Page, test } from '@playwright/test';
import { fillHours, goToReport, woffuURL } from "./utils";

const buildSetup = (page: Page) => ({
    doLoginWithGoogle: async () => {
        await page.goto(woffuURL);
        await Promise.all([
            page.waitForNavigation(),
            page.locator('text=Entrar con Google').click()
        ]);

        await page.locator('[aria-label="Correo electrónico o teléfono"]').fill(process.env.EMAIL);
        await page.locator('button:has-text("Siguiente")').click();

        await page.locator('[aria-label="Introduce tu contraseña"]').fill(process.env.PASSWORD);
        await page.locator('button:has-text("Siguiente")').click();
    }
});

test('fill hours in Woffu with Google authentication', async ({ page }) => {
    const { doLoginWithGoogle } = buildSetup(page);
    await doLoginWithGoogle();
    await goToReport(page);
    await fillHours(page);
});
