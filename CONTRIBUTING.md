# CONTRIBUTING
Contributions are always welcome regardless of issue or PR.

Before steps, [install Node.js 10.12.0 or newer.](https://nodejs.org/en/download/)

### 1st Step : Clone
```
git clone https://github.com/HyunSangHan/WhaleBrowserSync.git
```

### 2nd Step : Install packages
```
cd WhaleBrowserSync && npm install
```

* Do not use yarn.

### 3rd Step : Code yourself
- Make your own branch before changing codes.
- Please remember that there are also test codes.

### 4th Step : Test in Whale browser
- Run the script for `prepare`(prepublish) as below :
    ```
    npm run prepare
    ```

- Upload all files in `dist` directory to your local Whale browser. (whale://extensions/)

### 5th Step : Submit the code
- Commit your changes, push it and PR.