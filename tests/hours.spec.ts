import { Locator, Page, test } from '@playwright/test';
import { config } from "dotenv";

config();

const exists = async (locator: Locator): Promise<boolean> => {
    try {
        return await locator.count() > 0;
    } catch (e) {
        return false;
    }
};

const buildSetup = (page: Page) => ({
    doLogin: async () => {
        await page.goto('https://the_agile_monkeys.woffu.com/#/login');

        await page.locator('[placeholder="Tu e-mail"]').click();
        await page.locator('[placeholder="Tu e-mail"]').fill(process.env.EMAIL);

        await page.locator('[placeholder="Contraseña"]').click();
        await page.locator('[placeholder="Contraseña"]').fill(process.env.PASSWORD);

        await Promise.all([
            page.waitForNavigation(),
            page.locator('form[name="loginForm"] button:has-text("Entrar")').click()
        ]);
    },
    goToReport: async () => {
        await page.goto('https://the_agile_monkeys.woffu.com/v2/personal/diary/user');
    },
    fillHours: async modifyButton => {
        await modifyButton.click();

        await page.frameLocator('#iFrameResizer0').locator('[placeholder="\\30 9\\:30\\:00"]').click();
        await page.frameLocator('#iFrameResizer0').locator('[placeholder="\\30 9\\:30\\:00"]').fill('09:30');

        await page.frameLocator('#iFrameResizer0').locator('[placeholder="\\31 7\\:30\\:00"]').click();
        await page.frameLocator('#iFrameResizer0').locator('[placeholder="\\31 7\\:30\\:00"]').fill('17:30');

        await page.frameLocator('#iFrameResizer0').locator('form[name="diaryEditForm"] >> text=Aceptar').click();
    }
});

test('test', async ({ page }) => {
    const { doLogin, goToReport, fillHours } = buildSetup(page);
    await doLogin();

    await page.locator('button:has-text("Dismiss modal")').click();

    await goToReport();

    let element;
    do {
        element = await page
            .frameLocator('#iFrameResizer0')
            .locator('.ng-binding.ng-scope.text-danger')
            .first();
        if (element) {
            element.click();

            const modifyButton = await page.frameLocator('#iFrameResizer0').locator('text=Modificar');

            if (!await exists(modifyButton)) {
                await page.frameLocator('#iFrameResizer0').locator('#diary-edit >> text=×').click();
                await page.close();
                return;
            }

            await fillHours(modifyButton);
        }
    } while (element)

});
