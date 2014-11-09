![Protractor logo](extension/images/icon-38.png) elementor
=========

Test (Protractor)[http://protractortest.org] selectors from your browser.
Elementor extends Protractor's elementexplorer

##Instructions

```shell
$ npm install elementor
```

Elementor needs chromedriver and a running selenium server. To download the
dependencies and start the server run the following commands:

```shell
$ ./node_modules/elementor/node_modules/.bin/webdriver-manager update
$ ./node_modules/elementor/node_modules/.bin/webdriver-manager start
```

Open a second terminal and start **elementor**

```shell
$ ./node_modules/.bin/elementor [url]
```

!(Elementor architecture)[/doc/elementor.png]

The extension includes two components:

* A popup to enter protractor locators and expressions.
* A developer tools to suggest locators for the selected element.

##Using the popup
You can use the popup to enter Protractor selectors or execute commands that you would normally enter in the element explorer.

When you enter a locator starting with by. (e.g. by.css, by.model, by.binding, etc.) then it will be executed as a count expression element.all(<your locator>).count() by the element explorer.

popup screenshot
##Using the developer tools
The developer tools extension tries to find protractor locators for the currently selected item. To open the extension go to Developer tools > Elements and then on the side pane (Styles, Computed, etc.) choose Protractor.

open dev tools
The DevTools extension is limited because you cannot use it in the same browser tab launched by the element explorer. To use the extension you need to open a new tab with the same page for which you want to find locator suggestions. Once the dev tools in the second tab is open then it will provide locator suggestions every time you change the selected element in the elements tab.

When you open the DevTools window, ChromeDriver is automatically disconnected. When ChromeDriver receives a command, if disconnected, it will attempt to close the DevTools window and reconnect. (source).

