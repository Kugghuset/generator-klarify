
# <%= name %>

### Setting up the project

The project runs on [Node.js](https://nodejs.org/en/), and is written in JavaScript. The database type is Microsoft SQL.

To install Node.js, simply install it by clicking the big green button on [their website](https://nodejs.org/en/).

Clone the repository using Git (if you don't have Git on your computer, [here's the download link](https://git-scm.com/download))

```
git clone <%= git.rawUrl %>
```

If you don't have [Gulp](http://gulpjs.com/), [Express](http://expressjs.com/), [Mocha](http://mochajs.org/) or [DocToc](https://github.com/thlorenz/doctoc), install them via npm, using the `-g` flag (to install them globally).

```
npm install -g gulp express mocha doctoc
```

Install the packages.

```
npm install
```

To ensure changes to `userConfig.js` doesn't sneak into the repository, run: 

```
git update-index --assume-unchanged userConfig.js
``` 