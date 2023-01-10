# Woffu hours
Fill hours in Woffu automatically

## ⚙️ Pre requirements

You need to install [brew](https://brew.sh/).

And also install:

````shell
brew install node
npx playwright install
````

Duplicate the `.env.sample` file and change the name to `.env`.
Check the file and make sure to update the values with your personal information:

- EMAIL: that you use to login in woffu
- PASSWORD: that you use to login in woffu
- HAS_GOOGLE_LOGIN: `true` if you use Google to login if it is not `false`
- TOTAL_MONTH: number of total month you need to fill
- INI_HOUR: The hour you want fill as **the initial hour in your day**
- END_HOUR: The hour you want fill as **the end hour in your day**

🙋‍♀ **️Remember**: The total hours between the initial and end hour can't be greater than 8h

File example:

```
EMAIL=youremail@yourcompany.com
PASSWORD=yourpassword
HAS_GOOGLE_LOGIN=true
TOTAL_MONTH=3
INI_HOUR=9:30
END_HOUR=17:30
```

You can copy the sample file using:

```shell
cp .env.sample .env
```

## 👷‍♀️ Install

Execute the following command to install it:

```shell
npm run i
```

## 🚀 Fill hours 

### with user and password

If you want to fill your hours in Woffu execute the following command:

```shell
make fill-hours
```

To show the browser: 
```shell
make fill-hours-headed
```
