import { Locator, Page } from "@playwright/test";

export const woffuURL = 'https://the_agile_monkeys.woffu.com/#/login';

export const exists = async (locator: Locator): Promise<boolean> => {
    try {
        return !!await locator.first();
    } catch (e) {
        return false;
    }
};

const woffuActions = (page: Page) => {
    const frameLocator = page.frameLocator('#woffu-legacy-app');
    return ({
        goToReport: async () => {
            await page.goto('https://the_agile_monkeys.woffu.com/v2/personal/diary/user');
        },
        dismissModal: async () => {
            await page.locator('button:has-text("Dismiss modal")').click();
        },
        getDayToFill: async () => await frameLocator.locator('.ng-binding.ng-scope.text-danger').first(),
        getModifyButton: async (): Promise<Locator | undefined> => {
            const modifyButton = await frameLocator.locator('text=Modificar');
            if (await exists(modifyButton)) {
                return modifyButton;
            }
        },
        fillHours: async modifyButton => {
            await modifyButton.click();

            await frameLocator.locator('[placeholder="\\30 9\\:30\\:00"]').click();
            await frameLocator.locator('[placeholder="\\30 9\\:30\\:00"]').fill('09:30');

            await frameLocator.locator('[placeholder="\\31 7\\:30\\:00"]').click();
            await frameLocator.locator('[placeholder="\\31 7\\:30\\:00"]').fill('17:30');

            await frameLocator.locator('form[name="diaryEditForm"] >> text=Aceptar').click();
        },
        hasErrorFillingFutureDays: async () => {
            const warningMessage = await frameLocator.locator('text=Fichajes futuros no permitidos');
            const exist = await exists(warningMessage);

            console.log({ warningMessage, exist });
            return exist;
        },
        close: async () => {
            await frameLocator.locator('#diary-edit >> text=×').click();
            await page.close();
        }
    });
};

export const dismissModal = async (page: Page) => {
    await page.locator('button:has-text("Dismiss modal")').click();
};

export const goToReport = async (page: Page) => {
    const {
        goToReport
    } = woffuActions(page);
    await goToReport();
};

export const fillHours = async (page: Page) => {
    const {
        getDayToFill,
        getModifyButton,
        fillHours,
        hasErrorFillingFutureDays,
        close
    } = woffuActions(page);

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
        console.log("while: ", !!dayToFill, "&&", canFillCurrentDay);
    } while (dayToFill && canFillCurrentDay);
};
