<template>
  <svg class="host-spinner">
    <circle cx="40" cy="40" r="35" />
    <circle class="small" cx="40" cy="40" r="25" />
  </svg>
</template>

<style lang="scss">
$brand-color-2: #4d49be;
$brand-color-3: #6a6dcd;

$spinnerSize: 80;
svg.host-spinner {
  zoom: 200%;
  width: $spinnerSize + px;
  height: $spinnerSize + px;
  /*
  x: 0px;
  y: 0px;
  viewBox: 0 0 $spinnerSize $spinnerSize;
  */
  circle {
    fill: transparent;
    stroke: $brand-color-3;
    stroke-width: 5;
    stroke-linecap: round;
    stroke-dasharray: 150;
    transform-origin: (0.5px * $spinnerSize) (0.5px * $spinnerSize) 0;
    animation: spinner 3s linear infinite;
    &.small {
      position: absolute;
      stroke: $brand-color-2;
      top: 0;
      left: 0;
      stroke-dasharray: 60;
      animation: spinnerreverse 3s linear infinite;
    }
  }
}
@keyframes spinner {
  0% {
    // stroke-dashoffset: (0.66 * $spinnerSize);
    transform: rotate(0deg);
  }
  50% {
    // stroke-dashoffset: (3.14 * $spinnerSize);
    transform: rotate(420deg);
  }
  100% {
    // stroke-dashoffset: (0.66 * $spinnerSize);
    transform: rotate(1080deg);
  }
}
@keyframes spinnerreverse {
  0% {
    // stroke-dashoffset: (0.66 * $spinnerSize);
    transform: rotate(0deg);
  }
  50% {
    // stroke-dashoffset: (3.14 * $spinnerSize);
    transform: rotate(-420deg);
  }
  100% {
    // stroke-dashoffset: (0.66 * $spinnerSize);
    transform: rotate(-1080deg);
  }
}
</style>
