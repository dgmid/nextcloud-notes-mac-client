# Nextcloud Notes Client
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT) [![GitHub release (latest by date)](https://img.shields.io/github/v/release/dgmid/nextcloud-notes-mac-client?label=latest%20release&logo=github)](https://github.com/dgmid/nextcloud-notes-mac-client/releases/latest) ![GitHub All Releases](https://img.shields.io/github/downloads/dgmid/nextcloud-notes-mac-client/total)

A replacement for the Mac Notes app that syncs with a Nextcloud server running the Nextcloud Notes app

![Nextcloud Notes Client in edit mode](https://user-images.githubusercontent.com/1267580/65714112-c539dd80-e09a-11e9-8ff8-22e2d293ace4.png)
<small>*Nextcloud Notes Client in edit mode*</small>

![Nextcloud Notes Client in preview mode](https://user-images.githubusercontent.com/1267580/65714113-c539dd80-e09a-11e9-8960-580421a0e77d.png)
<small>*Nextcloud Notes Client in preview mode*</small>

## Requirements

[node.js / npm](https://www.npmjs.com/get-npm)

To build this project you will need to install **electron packager** and **asar**

```shell
npm install -g electron-packager
npm install -g asar
```

## Usage

`cd` to the project directory and run:
```shell
npm install
```

To modify the `html` / `css` / `js` run:
```shell
gulp watch
```

To test the app run:
```shell
npm start
```

To package the final app run:
```shell
npm run package
```
The packaged app will be written to `build/Nextcloud Notes Client-darwin-x64/` in the project directory.
