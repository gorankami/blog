# Delayed DOM update
## Problem
> I want to update DOM elements in JS, but doing it frequently is too expensive in my scenario.
## Problem example

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="render-functions.js"></script>
    <script>
      function updateCanvasSize(){
          const canvas = document.querySelector("canvas");
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          renderData();
      }

      window.onresize = function(){
          updateCanvasSize();
      }
    </script>
  </head>
  <body>
    <canvas></canvas>
  </body>
</html>
```
[Demo](https://gorankami.github.io/blog/delayed-dom-updating/problem-example.html) | [Source](https://github.com/gorankami/blog/blob/master/delayed-dom-updating/problem-example.html)

The code above changes the size of the canvas to fit the inner space of the page every time the page size is changed for some reason, but canvas re-rendering takes a toll on processing. When the user resizes the width of the browser by 10px, the DOM element would be updated 10 times, since the event is quick to fire - once for each pixel change. 

Since the most valuable information here is the end result of width, we may need to tolerate some of the updates to save processing.

## Solution #1


```html
<!DOCTYPE html>
<html>
  <head>
    <script src="render-functions.js"></script>
    <script>
      function updateCanvasSize(){
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          isTimeoutSet = false
          renderData();
      }

      let isTimeoutSet = false;

      window.onresize = function(){
          if(isTimeoutSet) return;
          isTimeoutSet = true
          setTimeout(updateCanvasSize, 250)
      }
    </script>
  </head>
  <body>
    <canvas></canvas>
  </body>
</html>
```
[Demo](https://gorankami.github.io/blog/delayed-dom-updating/solution-1.html) | [Source](https://github.com/gorankami/blog/blob/master/delayed-dom-updating/solution-1.html)


Setting the timeout will skip some updates. Time it takes for user to set desired size of the screen can vary, but in the presented problem the fastest users are causing the most expensive DOM rendering, so setting the timeout to a low value that seems responsive would take care of most usecases.

## Solution #2

```html
<!DOCTYPE html>
<html>
  <head>
    <script src="render-functions.js"></script>
    <script>
      function updateCanvasSize(){
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight
          renderData();
      }

      let timeoutId = undefined;

      window.onresize = function(){
          if(timeoutId) clearTimeout(timeoutId);
          timeoutId = setTimeout(updateCanvasSize, 250);
      }
    </script>
  </head>
  <body>
    <canvas></canvas>
  </body>
</html>
```
[Demo](https://gorankami.github.io/blog/delayed-dom-updating/solution-2.html) | [Source](https://github.com/gorankami/blog/blob/master/delayed-dom-updating/solution-2.html)


This code solves a problematic usecase where users play with window size. Every time window updates, timeout is reset all over again. Therefore, the DOM is updated only when the updating stops for set time, i.e. frequency is lower than set time.