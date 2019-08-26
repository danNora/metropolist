# Web Boilerplate

This provides basic files and folders for a basic website using HTML, SASS, and JS.

Features include:
1. HTML Skeleton
2. Folders for images, JavaScript, and CSS
3. SASS partials already imported into styles.scss file
    * `_setup.scss` partial for normalize.css, clearfix, border-box, and visuallyHidden
    * Empty `_typography.scss` partial
    * Empty `_variables.scss` partial

## Dependencies

This boilerplate uses the VS Code extension [Live Sass Compiler](https://marketplace.visualstudio.com/items?itemName=ritwickdey.live-sass) to compile `styles.scss` to a `styles.css` file.

## Instructions to use

Copy+paste the following lines of code into command line:

```
git clone https://github.com/danielfitz/webBoilerplate.git
read -p "Enter your repository name: " repoName && mv webBoilerplate $repoName && cd $repoName && rm -rf .git
```