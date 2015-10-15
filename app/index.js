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
    treble,
    bass,
    medium,
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
  gui.add(webgl, 'toon');
  gui.add(webgl, 'invert');
  gui.add(webgl, 'grayscale');

  // handle resize
  window.onresize = resizeHandler;

  // Intro scene
  var start = document.getElementById('start');
  var title = document.getElementById('title');
  start.onclick = startXp;

  // Add konami code
  var easter_egg = new Konami();
  var wmp = document.getElementById('wmp');
  easter_egg.code = function() {
    $('.konami').addClass('show');
  };
  easter_egg.load();
});

function startXp() {
  start.classList.add('fade');
  title.classList.add('fade');

  setupAudioNodes();
  loadSound(pathSound);

  // let's play !
  animate();
}

function resizeHandler() {
  webgl.resize(window.innerWidth, window.innerHeight);
}

function animate() {
  var test = raf(animate);
  var click = false;

  // Play Pause in konami code / Don't work
  // $('.play').on('click', function(){
  //   if (!click) {
  //     raf.cancel(test);
  //     click = true;
  //   } else {
  //       raf(animate);
  //       click = false;
  //   }
  // });
  webgl.render(average, frequencys, treble, bass, medium);
}

// Get sound
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

      splitFrenquencyArray(array);

      $('#player').css('left', context.currentTime + 12 +'px');
      $('.progress').css('width', context.currentTime + 12 +'px');

      if (average != 0) {
        soundStarted = 1;
      }

      if (soundStarted == 1 && average == 0) {
        soundStarted = 0;
        isLaunch = 0;
      }
    }
}

// Split sound array in a bass, medium and treble array
function splitFrenquencyArray(array) {
    var n = 3;
    var tab = Object.keys(array).map(function(key) {
        return array[key]
    });
    var len = tab.length,
        frequencyArray = [],
        i = 0;

    while (i < len) {
        var size = Math.ceil((len - i) / n--);
        frequencyArray.push(tab.slice(i, i + size));
        i += size;
    }

    // 0 = bass
    // 1 = medium
    // 2 = treble
    getBass(frequencyArray[0]);
    getMedium(frequencyArray[1]);
    getTreble(frequencyArray[2]);
}

function getBass(array) {
  var values = 0;
  var length = array.length;
  for (var i = 0; i < length; i++) {
      values += array[i];
  }
  bass = values / length;
  return bass;
}

function getMedium(array) {
  var values = 0;
  var length = array.length;
  for (var i = 0; i < length; i++) {
      values += array[i];
  }
  medium = values / length;
  return medium;
}

function getTreble(array) {
  var values = 0;
  var length = array.length;
  for (var i = 0; i < length; i++) {
      values += array[i];
  }
  treble = values / length;
  return treble;
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
