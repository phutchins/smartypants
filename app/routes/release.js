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
    var osKey;
    var project = req.param('project');

    switch(os) {
      case "Windows":
        osKey = 'win32';
        break;
      case "Mac OS":
        osKey = 'osx64';
        break;
      case "Linux":
        osKey = 'amd64';
        break;
    }

    console.log("[Request] Looking for OS: " + os + " which translates to osTag: " + osKey + " project: " + project);

    var buildResponse = function(releases) {
      var releaseURL = "https://github.com/Storj/" + project + "/releases/latest";

      if (releases) {
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

        if (osKey) {
          releaseURL = releaseURLs[osKey] || releaseURL;
        }
      }

      sendResponse(releaseURL);
    }

    var sendResponse = function(assetURL) {
      var responseJSON = {
        "url": assetURL
      }
      console.log("[sendResponse] Sending response: " + assetURL);
      res.send(responseJSON);
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

    if (os && project) {
      var request = https.request(requestOptions, function(resp) {
        var data = "";
        resp.setEncoding('utf8');
        resp.on('data', function (chunk) {
          data += chunk;
        });

        resp.on('end', function () {
          var responseCode = resp.statusCode;

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
    } else {
      res.send("Please provide valid os and project");
    }
  });
};

