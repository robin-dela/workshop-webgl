'use strict';

import domready from 'domready';
import Webgl from './Webgl';
import raf from 'raf';
import dat from 'dat-gui';
import 'gsap';

let webgl,
    gui,
    pathSound = 'app/sound/lean.mp3',
    frequencys,
    average,
    isLaunch = 0,
    soundStarted = 0,
    launcher,
    inputFile;

domready(() => {
  // webgl settings
  webgl = new Webgl(window.innerWidth, window.innerHeight);
  document.body.appendChild(webgl.renderer.domElement);

  // GUI settings
  gui = new dat.GUI();
  gui.add(webgl, 'usePostprocessing');

  // handle resize
  window.onresize = resizeHandler;

  // let's play !
  animate();

  setupAudioNodes();
  loadSound(pathSound);
  isLaunch = 1;
  webgl.render(average, frequencys);
});

function resizeHandler() {
  webgl.resize(window.innerWidth, window.innerHeight);
}

function animate() {
  raf(animate);
  webgl.render(average, frequencys);
}

if (! window.AudioContext) {
  if (! window.webkitAudioContext) {
      alert('no audiocontext found');
  }
  window.AudioContext = window.webkitAudioContext;
}

let context = new AudioContext(),
    audioBuffer,
    sourceNode = context.createBufferSource(),
    analyser = context.createAnalyser(),
    arrayData =  new Uint8Array(analyser.frequencyBinCount),
    javascriptNode;

function loadSound (url) {
  console.log('load');
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    request.onload = function() {
        context.decodeAudioData(request.response, function(buffer) {
            playSound(buffer);
        });
    }
    request.send();
}

function playSound (buffer) {
    sourceNode.buffer = buffer;
    sourceNode.start(0);
}


function setupAudioNodes () {
    javascriptNode = context.createScriptProcessor(2048, 1, 1);
    javascriptNode.connect(context.destination);

    analyser = context.createAnalyser();
    analyser.smoothingTimeConstant = 0.1;
    analyser.fftSize = 1024;

    sourceNode = context.createBufferSource();

    sourceNode.connect(analyser);

    analyser.connect(javascriptNode);

    sourceNode.connect(context.destination);

    javascriptNode.onaudioprocess = function() {
      var array =  new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(array);
      average = getAverageVolume(array);
      frequencys = getByteFrequencyData(array);

      if (average != 0) {
        soundStarted = 1;
      }

      if (soundStarted == 1 && average == 0) {
        soundStarted = 0;
        isLaunch = 0;
      }
    }
}

function getByteFrequencyData (array) {
    var values = 0;
    var frequencys;

    var length = array.length;
    for (var i = 0; i < length; i++) {
        values += array[i];
    }

    frequencys = values / length;
    return frequencys;
}


function getAverageVolume (array) {
    var values = 0;
    var average;

    var length = array.length;
    for (var i = 0; i < length; i++) {
        values += array[i];
    }

    average = values / length;
    return average;
}

function handleFileSelect (evt) {
    if (evt) {
      evt.stopPropagation();
      evt.preventDefault();
      var files = evt.srcElement.files;
    } else {
      var files = document.getElementById('fileinput').files;
    }
    var reader = new FileReader();

    if (files[0].type.match('audio.*')) {
      console.log(evt.target.result);
    }
}
