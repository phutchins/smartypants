// app/routes/release.js

var https = require('https');
var config = require('nconf');

module.exports = function(router) {
  'use strict';

  // This will handle the url calls for /ping
  router.route('/')
  .get(function(req, res) {
    var releaseURLs = {};
    var os = req.param('os');
    var project = req.param('project');

    console.log("[Request] Looking for OS: " + os + " project: " + project);

    var buildResponse = function(releases) {
      releases.forEach(function(release) {
        if (release.name.match('win32')) {
          releaseURLs['win32'] = release.browser_download_url;
          //releaseURLs['win32'] =
        };
        if (release.name.match('osx64')) {
          releaseURLs['osx64'] = release.browser_download_url;
        };
        if (release.name.match('amd64')) {
          releaseURLs['amd64'] = release.browser_download_url;
        };
      });

      sendResponse(releaseURLs[os]);

    }

    var sendResponse = function(assetURL) {
      var responseJSON = {
        "url": assetURL
      }
      console.log("[sendResponse] Sending response: " + assetURL);
      res.send(assetURL);
    };

    var apiToken = config.get('GITHUB_API_TOKEN');

    var requestOptions = {
      host: "api.github.com",
      path: '/repos/Storj/' + project + '/releases/latest',
      method: "GET",
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.86 Safari/537.36',
        'Authorization': 'token ' + apiToken
      }
    }

    console.log("Path: " + requestOptions.path);

    var request = https.request(requestOptions, function(resp) {
      var data = "";
      resp.setEncoding('utf8');
      resp.on('data', function (chunk) {
        data += chunk;
      });

      resp.on('end', function () {
        var responseCode = resp.statusCode;

        console.log("[RESPONSE] " + data);
        if (responseCode == 401) {
          var errorMessage = JSON.parse(data).message;

          console.log("[ERROR](" + responseCode + ") " + errorMessage);

          return res.send("[ERROR](" + responseCode + ") " + errorMessage);
        }

        var releases = JSON.parse(data).assets;

        buildResponse(releases);
      });
    });

    request.end();
  });
};

