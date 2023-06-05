import { config } from "dotenv";
import { Page, test } from '@playwright/test';
import { fillHours, goToReport, woffuURL } from "./utils";

config();

const emailInput = 'Introduce tu email';
const passwordInput = 'Escribe tu contraseña';
const nextButton = { name: 'Siguiente' };
const initSessionButton = { name: 'Iniciar sesión' };

const linkGoogle = { name: 'Entrar con Google' };
const emailTextBox = {name: 'Correo electrónico o teléfono'};
const passwordTextBox = { name: 'Introduce tu contraseña' };

const buildSetup = (page: Page) => ({
    doLogin: async () => {
        await page.goto(`${woffuURL}/V2/login`);
        await page.getByPlaceholder(emailInput).click();
        await page.getByPlaceholder(emailInput).fill(process.env.EMAIL);
        await page.getByRole('button', nextButton).click();
        await page.getByPlaceholder(passwordInput).click();
        await page.getByPlaceholder(passwordInput).fill(process.env.PASSWORD);

        await Promise.all([
            page.waitForNavigation(),
            page.getByRole('button', initSessionButton).click()
        ]);
    },
    doLoginWithGoogle: async () => {
        await page.goto(`${woffuURL}/V2/login`);
        await Promise.all([
            page.waitForNavigation(),
            page.getByRole('link', linkGoogle).click()
        ]);

        await page.getByRole('textbox', emailTextBox).click();
        await page.getByRole('textbox', emailTextBox).fill(process.env.EMAIL);
        await page.getByRole('button', nextButton).click();

        await page.getByRole('textbox', passwordTextBox).click();
        await page.getByRole('textbox', passwordTextBox).fill(process.env.PASSWORD);
        await page.getByRole('button', nextButton).click();
    }
});

test('fill hours of previous month in Woffu', async ({ page }) => {
    if (process.env.HAS_GOOGLE_LOGIN === 'true') {
        const { doLoginWithGoogle } = buildSetup(page);
        await doLoginWithGoogle();
    } else {
        const { doLogin } = buildSetup(page);
        await doLogin();
    }
    console.info('🔐 Logged in');
    await goToReport(page);

    const totalMonth: number = parseInt(process.env.TOTAL_MONTH);
    for (let index = 1; index < totalMonth; index++) {
        await page.frameLocator('#woffu-legacy-app').locator('text=< mes anterior').click();
    }

    for (let index = 1; index <= totalMonth; index++) {
        console.info(`Filling hours. (${index}/${totalMonth})`);
        await fillHours(page);
        await page.frameLocator('#woffu-legacy-app').locator('text=mes siguiente >').click();
    }
});
