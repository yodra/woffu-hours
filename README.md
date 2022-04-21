# Woffu hours
Fill hours in Woffu automatically

## ⚙️ Pre requirements

You need to install [brew](https://brew.sh/), `npm` and `node`.

````shell
brew install node
````

And create a new file called `.env` with your email and password within the file.

```
EMAIL=youremail@yourcompany.com
PASSWORD=yourpassword
```

You can copy the sample file:

```shell
cp .env.sample .env
```

## 👷‍♀️ Install

Execute the following command to install it:

```shell
npm run i
```

## 🚀 Fill hours with user and password

If you want to fill your hours in Woffu execute the following command:

```shell
make fill-hours
```

To show the browser: 
```shell
make fill-hours-headed
```

## 🚀 Fill hours with Google authentication

If you want to fill your hours in Woffu execute the following command:

```shell
make fill-google
```

To show the browser:
```shell
make fill-google-headed
```
