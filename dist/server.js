// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"../package.json":[function(require,module,exports) {
module.exports = {
  "name": "api",
  "version": "1.0.0",
  "description": "API for mueller plumbing and heating salary application",
  "main": "server.js",
  "scripts": {
    "dev": "parcel ./src/server.js --target node --public-url .",
    "build": "parcel build ./src/server.js --target node --public-url .",
    "start": "node src/server.js",
    "test": "NODE_ENV=test node node_modules/lab/bin/lab -v -L -C -c -t 0",
    "testloc": "node node_modules/lab/bin/lab -v -L -C -c -t 0",
    "test-cov-html": "lab -r html -o coverage.html"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/MuellerPlumbingPayroll/API.git"
  },
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/MuellerPlumbingPayroll/API/issues"
  },
  "homepage": "https://github.com/MuellerPlumbingPayroll/API#readme",
  "dependencies": {
    "boom": "^7.3.0",
    "eslint-plugin-promise": "^4.0.1",
    "firebase-admin": "^6.5.1",
    "google-auth-library": "^0.12.0",
    "hapi": "^17.8.1",
    "hapi-swagger": "^9.3.0",
    "inert": "^5.1.2",
    "joi": "^14.3.1",
    "promise": "^8.0.2",
    "vision": "^5.4.4"
  },
  "devDependencies": {
    "babel-core": "^6.26.3",
    "babel-preset-env": "^1.7.0",
    "code": "^5.2.4",
    "eslint": "^5.12.0",
    "eslint-config-hapi": "^12.0.0",
    "eslint-plugin-hapi": "^4.1.0",
    "eslint-plugin-import": "^2.14.0",
    "lab": "^18.0.1",
    "nodemon": "^1.18.9",
    "parcel-bundler": "^1.11.0"
  }
};
},{}],"routes/index.js":[function(require,module,exports) {
const routes = [];
module.exports = routes;
},{}],"server.js":[function(require,module,exports) {
"use strict";

var _index = require("./routes/index");

const Hapi = require('hapi');

const Inert = require('inert');

const Vision = require('vision');

const HapiSwagger = require('hapi-swagger');

const Pack = require('../package.json');

const Fs = require('fs');

const _ = require('lodash');

console.log('Here');
const server = new Hapi.Server({
  host: 'localhost',
  port: 1234
});

(async () => {
  const HapiSwaggerConfig = {
    plugin: HapiSwagger,
    options: {
      info: {
        title: Pack.name,
        description: Pack.description,
        version: Pack.version
      },
      swaggerUI: true,
      basePath: '/',
      pathPrefixSize: 2,
      jsonPath: '/docs/swagger.json',
      sortPaths: 'path-method',
      lang: 'en',
      tags: [{
        name: 'api'
      }],
      documentationPath: '/',
      securityDefinitions: {}
    }
  };
  /* register plugins */

  await server.register([Inert, Vision, HapiSwaggerConfig]); // require routes

  server.route({
    method: 'GET',
    path: '/a',
    handler: function (request, h) {
      return 'Hello!';
    }
  });
  await server.start();
  console.log('Server rundfsdfning at:', server.info.uri);
})();

module.exports = server;
},{"../package.json":"../package.json","./routes/index":"routes/index.js"}]},{},["server.js"], null)
//# sourceMappingURL=server.map