# SmartyPants
Fetches the latest release data for a particular github project

## TODO
+ Make this work for any user ( Not just Storj )

## Configuration
To add your OAUTH2 token, set it via command line or environment variable

Via command line...
`$ GITHUB_API_TOKEN=[yourapitoken] node index.js`

Via ENV variable
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
