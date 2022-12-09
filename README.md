# md-badge-generator
A user script to add markdown badges generator form to your github page by using [Shields](https://shields.io/)


## Install

* Install [Tampermonkey](https://www.tampermonkey.net/) browser plugin
* [Install this script](https://github.com/Blackman99/md-badge-generator/raw/main/md-badge-generator.user.js)

## Features

* The badge form only apears when the page is a pull request, issue or a edit *.md file. For example:
  * `https://github.com/foo/bar` :negative_squared_cross_mark:
  * `https://github.com/foo/bar/edit/main/some-script.js` :negative_squared_cross_mark:
  * `https://github.com/foo/bar/edit/main/some-doc.md` :white_check_mark:
  * `https://github.com/foo/bar/edit/branch-name/nested/some-doc.md` :white_check_mark:
  * `https://github.com/foo/bar/pull/123` :white_check_mark:
  * `https://github.com/foo/bar/issues/new` :white_check_mark:
* Supports both refresh and github link spa route jump. 
The badge form will auto diplay/hide when the page changed.  
There's no need to refresh the browser. 

## Usage Demo
![badge](https://user-images.githubusercontent.com/41723543/206615303-6c6cb66e-1bf7-4de6-b815-c8ba2e51c8fb.gif)
