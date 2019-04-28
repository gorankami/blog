let canvas = undefined;
let ctx = undefined;
let renderTimeoutId = undefined;

window.onload = function () {
  canvas = document.querySelector("canvas");
  ctx = canvas.getContext("2d");
  updateCanvasSize();
}

function renderData() {
  clearTimeout(renderTimeoutId)
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "Black";
  ctx.font = "30px Arial";
  ctx.fillText(`Updating canvas on width=${width} and height=${height}`, 10, 50);
  ctx.fillStyle = "blue";
  const step = width / 10;

  renderStep(step, 0);
}

function renderStep(stepSize, stepCount) {
  if (stepCount >= 10) renderDone();
  ctx.fillRect(stepSize * stepCount, 100, stepSize, 5);
  renderTimeoutId = setTimeout(() => {
    renderStep(stepSize, ++stepCount);
  }, 50);
}

function renderDone() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "green";
  ctx.font = "bold 30px Arial";
  ctx.fillText(`Done.`, 10, 50);
  ctx.fillRect(0, 100, canvas.width, 5);
}