import { Page, test } from '@playwright/test';
import { config } from 'dotenv';
import { exists, woffuActions, woffuURL } from "./utils";

config();

const buildSetup = (page: Page) => ({
    doLogin: async () => {
        await page.goto(woffuURL);
        await Promise.all([
            page.waitForNavigation(),
            page.locator('text=Entrar con Google').click()
        ]);

        await page.locator('[aria-label="Correo electrónico o teléfono"]').fill(process.env.EMAIL);
        await page.locator('button:has-text("Siguiente")').click();

        await page.locator('[aria-label="Introduce tu contraseña"]').fill(process.env.PASSWORD);
        await page.locator('button:has-text("Siguiente")').click();
    },
    ...woffuActions(page)
});

test('fill hours in Woffu', async ({ page }) => {
    const {
        doLogin,
        dismissModal,
        goToReport,
        getDayToFill,
        getModifyButton,
        fillHours,
        hasErrorFillingFutureDays,
        close
    } = buildSetup(page);

    await doLogin();
    await dismissModal();
    await goToReport();

    let dayToFill;
    let canFillCurrentDay = true;
    do {
        dayToFill = await getDayToFill();
        if (dayToFill) {
            dayToFill.click();

            const modifyButton = await getModifyButton();
            if (!await exists(modifyButton)) {
                await close();
                return;
            }

            await fillHours(modifyButton);
            canFillCurrentDay = !await hasErrorFillingFutureDays();
        }
    } while (dayToFill && canFillCurrentDay)

});
