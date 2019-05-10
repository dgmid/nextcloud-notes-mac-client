# ![nextcloud-note-client-icon](https://user-images.githubusercontent.com/1267580/47951470-86220b80-df61-11e8-87bc-38ca8bd4c665.png) Nextcloud Notes Client

A replacement for the Mac Notes app that syncs with the Nextcloud Notes app

![nextcloud-notes-client](https://user-images.githubusercontent.com/1267580/47951471-86220b80-df61-11e8-81d3-cd37f1e2c5ea.png)

## Requirements

[node.js / npm](https://www.npmjs.com/get-npm)

To modify a/o build this project you will need to install electron packager

```shell
npm install electron-packager -g
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

To update all files prior to packaging run:
```shell
gulp build
```

To package the final app run:
```shell
npm run package
```
The packaged app will be written to `build/Nextcloud Notes Client-darwin-x64/` in the project directory.

**Note**: packaging the app runs `npm prune -production` and so you will need to run `npm install` again before making any further modifications.

## License

**Nextcloud Notes Client** is released under the MIT License
