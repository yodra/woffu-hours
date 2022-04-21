import { Locator, Page } from "@playwright/test";

export const woffuURL = 'https://the_agile_monkeys.woffu.com/#/login';

export const exists = async (locator: Locator): Promise<boolean> => {
    try {
        return !!await locator.first();
    } catch (e) {
        return false;
    }
};

export const woffuActions = (page: Page) => ({
    goToReport: async () => {
        await page.goto('https://the_agile_monkeys.woffu.com/v2/personal/diary/user');
    },
    dismissModal: async () => {
        await page.locator('button:has-text("Dismiss modal")').click();
    },
    getDayToFill: async () => await page
        .frameLocator('#iFrameResizer0')
        .locator('.ng-binding.ng-scope.text-danger')
        .first(),
    getModifyButton: async (): Promise<Locator | undefined> => {
        const modifyButton = await page.frameLocator('#iFrameResizer0').locator('text=Modificar');
        if (await exists(modifyButton)) {
            return modifyButton;
        }
    },
    fillHours: async modifyButton => {
        await modifyButton.click();

        await page.frameLocator('#iFrameResizer0').locator('[placeholder="\\30 9\\:30\\:00"]').click();
        await page.frameLocator('#iFrameResizer0').locator('[placeholder="\\30 9\\:30\\:00"]').fill('09:30');

        await page.frameLocator('#iFrameResizer0').locator('[placeholder="\\31 7\\:30\\:00"]').click();
        await page.frameLocator('#iFrameResizer0').locator('[placeholder="\\31 7\\:30\\:00"]').fill('17:30');

        await page.frameLocator('#iFrameResizer0').locator('form[name="diaryEditForm"] >> text=Aceptar').click();
    },
    hasErrorFillingFutureDays: async () => {
        const hasError = !!await page
            .frameLocator('#iFrameResizer0')
            .locator('text=Fichajes futuros no permitidos')
            .first();

        console.info('⚠️ Future work log not allowed!')
        return hasError;
    },
    close: async () => {
        await page.frameLocator('#iFrameResizer0').locator('#diary-edit >> text=×').click();
        await page.close();
    }
});
