# ACUFY

This is a simple jQuery plugin that allows you to add digital camouflage backgrounds to elements on a page.

WARNING: this plugin generates a unique SVG every time the function is run. The SVG will match the background dimensions. That being said, 
having too many elements or very large elements can make it run slow.

## Usage

```js
$('selector').acufy({
  size: 10, // default width and height of each digi box
  colors: [
    '#1d1a13',
    '#806c3a',
    '#4d5b38'
  ]
});
```

For right now, the colors must be arrays. I will consider adding text support using comma separated values in the future.

## Request

This is my first jQuery plugin that I am publishing and I am open to criticism. I am doing this is as a learning experience. Please 
tell me what you think.

## Demo

[Here is a demo](http://irwinproject.com/demo) using the colors in the usage example above
