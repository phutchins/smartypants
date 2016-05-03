# SmartyPants
Fetches the latest release data for a particular github project

## TODO
+ Make this work for any user ( Not just Storj )

## Configuration
To add your OAUTH2 token, set it via command line or environment variable

##### Command Line
```
$ GITHUB_API_TOKEN=[yourapitoken] node index.js
```

##### ENV Variable
```
$ export GITHUB_API_TOKEN=[yourapitoken]
$ node index.js
```

## Usage

Send a GET request to SmartyPants with an OS and Project as query parameters to get the latest release download link for that project

### Params
+ os: [ 'Windows' || 'Mac OS' || 'Linux' ]
+ project: The GitHub Project for which you would like a download URL
+ user: The user that owns the GitHub project (not yet implemented)

#### Example
Request
```
curl -XGET "https://storj.io/release/?os=Mac%20OS&project=farmer-gui"
```

Response
```
{"url":"https://github.com/Storj/farmer-gui/releases/download/v0.7.4/storjshare-gui.osx64.dmg"}
```
## Hints

#### Getting OS
You can get the OS in a browser by using `var os = $.pgwBrowser().os.group;`

#### Sample Code

```
  <script>
    $(function() {

      // StorjShare Download

      var windowsReleaseURL = "";
      var linuxReleaseURL = "";
      var osxReleaseURL = "";

      // Build the latest release links for download
      function buildLatestReleases() {
        // Find the users OS
        var os = $.pgwBrowser().os.group;
        var releaseURL;

        // Get the latest release download link from the smartypants service running locally
        $.getJSON("https://storj.io/release/?os=" + encodeURIComponent(os) + "&project=farmer-gui").done(function (json) {
          // Grab the release url from the returned JSON
          if (json) {
            releaseURL = json.url;
          }

          if (releaseURL) {
            $("#download").attr("href", releaseURL);
          } else {
            $("#download").attr("href", "https://github.com/Storj/farmer-gui/releases/latest");
          }

          // Set the correct link for each type of OS and default to the latest releases page if we cannot derive the OS
          if (os == "Windows") {
            $("#download").addClass('btn-win');
            $("#download").html('Download Storj Share for Windows <span class="label beta">Beta</span>');
          } else if (os == "Mac OS") {
            $("#download").addClass('btn-osx');
            $("#download").html('Download Storj Share for Mac <span class="label beta">Beta</span>');
          } else if (os == "Linux") {
            $("#download").addClass('btn-linux');
            $("#download").html('Download Storj Share for Linux <span class="label beta">Beta</span>');
          } else {
            $("#download").html('Download Storj Share <span class="label beta">Beta</span>');
          };
        });
      }

      buildLatestReleases();

    });
  </script>

```
