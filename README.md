# Mobile Web Specialist Certification Course

For the **Restaurant Reviews** projects, you will incrementally convert a static webpage to a mobile-ready web application. In **Stage One**, you will take a static design that lacks accessibility and convert the design to be responsive on different sized displays and accessible for screen reader use. You will also add a service worker to begin the process of creating a seamless offline experience for your users.

## Getting Started

### Environment

Works for node v8.9.4 and npm v6.1.0.

If you encounter installation or build issue, start a web server in the `public` folder.

```
python -m SimpleHTTPServer 8083
```

### Installing

Clone the repo and run:

```
npm install
```

### Building

```
npm run build
```

It will trigger the gulp tasks in order.

### Run the app

```
npm run http
```

You can now test the app at `http://localhost:8083`.

### Running on https

At the root of the project, do:
```
openssl genrsa -out key.pem 1024
openssl req -newkey rsa:1024 -new -key key.pem -out csr.pem
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
rm csr.pem
```
**Tip: use a unix-like console.**

#### Run

```
npm run https -- [options]
```
The https server will run by default on port 8083 and will serve files under `public/`.
For the complete list of options, please check the http-server node module [readme](https://github.com/indexzero/http-server#available-options).

In case of difficulty with browser caching the script files, you may use the following command instead:
```
node startServer.js -S -c-1
```
The –c-1 instructs the local nodejs server to set response headers so that the browser does not cache the files.

### Note about ES6

Most of the code in this project has been written to the ES6 JavaScript specification for compatibility with modern web browsers and future proofing JavaScript code. As much as possible, try to maintain use of ES6 in any additional JavaScript you write.