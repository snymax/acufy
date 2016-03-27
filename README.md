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

## Seed Options
I plan on elaborating a lot on seed options however for the time being they are rather simple, to pick a color for each individual cell Acufy tests the colors of the blocks directly above, below, left and right. which ever is the most common color it picks, if no neighboring colors it picks a color at random. you can slightly alter the general pattern of your backgrounds by changing the seeding size, for instance you would increase the x seed to make the pattern have more horizontal sections of color. 

### Example
```js
$('selector').acufy({
  size:10,
  colors: [
      '#1d1a13',
      '#806c3a',
      '#4d5b38'
  ],
  seed:{
    x:2, have it test 2 cells on the left and right rather then just one
    y:1
  }


## Request

This is my first jQuery plugin that I am publishing and I am open to criticism. I am doing this is as a learning experience. Please 
tell me what you think.

## Demo

[Here is a demo](http://irwinproject.com/demo) using the colors in the usage example above

## Bugfix
- Firefox doesnt like the # character in its uft8, this has been fixed
