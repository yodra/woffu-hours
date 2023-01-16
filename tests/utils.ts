import {Locator, Page} from "@playwright/test";

export const woffuURL = 'https://the_agile_monkeys.woffu.com/V2/login';

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
        goToReport: async () => await page.goto('https://the_agile_monkeys.woffu.com/v2/personal/diary/user'),
        getDayToFill: async () => await frameLocator.locator('.ng-binding.ng-scope.text-danger').first(),
        countTotalDaysToFill: async page => {
            await page.waitForTimeout(5000);
            return await frameLocator.getByText('-8h').count()
        },
        getModifyButton: async (): Promise<Locator | undefined> => {
            const modifyButton = await frameLocator.getByText('Modificar');
            if (await exists(modifyButton)) {
                return modifyButton;
            }
        },
        fillHours: async modifyButton => {
            await modifyButton.click();
            const acceptButton = { name: 'Aceptar' };

            await frameLocator.getByPlaceholder('09:30:00').click();
            await frameLocator.getByPlaceholder('09:30:00').fill(process.env.INI_HOUR);
            await frameLocator.getByPlaceholder('17:30:00').click();
            await frameLocator.getByPlaceholder('17:30:00').fill(process.env.END_HOUR);

            await frameLocator.getByRole('button', acceptButton).click();
        },
        hasErrorFillingFutureDays: async () => {
            const totalWarnings = await frameLocator.getByText('Fichajes futuros no permitidos').count();
            return totalWarnings > 1;
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
    const { goToReport } = woffuActions(page);
    await goToReport();
};

export const fillHours = async (page: Page) => {
    const {
        getDayToFill,
        getModifyButton,
        countTotalDaysToFill,
        fillHours,
        hasErrorFillingFutureDays,
    } = woffuActions(page);

    let canFillCurrentDay = true;
    let totalDaysToFill = await countTotalDaysToFill(page);
    while (totalDaysToFill > 1 && canFillCurrentDay) {
        const dayToFill = await getDayToFill();
        if (dayToFill) {
            dayToFill.click();

            const modifyButton = await getModifyButton();
            await fillHours(modifyButton);
            canFillCurrentDay = await hasErrorFillingFutureDays();
        }

        totalDaysToFill = await countTotalDaysToFill(page);
    }
};
