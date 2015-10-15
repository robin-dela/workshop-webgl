'use strict';

import Tunnel from './objects/Tunnel';
import THREE from 'three';
window.THREE = THREE;

export default class Webgl {
  constructor(width, height) {

    this.scene = new THREE.Scene();

    // Set up camera
    this.camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 10000 );
    this.camera.position.set = (0, 0, 7);
    this.camera.lookAt(this.scene.position);
    this.scene.add(this.camera);

    // Add fog in the end of the tunnel
    this.scene.fog = new THREE.FogExp2( 0x000000, 0.15 );

    this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000);

    // Use post processing to look like toon
    this.usePostprocessing = true;
    this.toon = true;
    this.invert = false;
    this.grayscale = false;
    this.composer = new WAGNER.Composer(this.renderer);
    this.composer.setSize(width, height);
    this.initPostprocessing();

    // Load tunnel
    this.tunnel = new Tunnel();
    this.tunnel.position.set(0, 0, 0);
    this.scene.add(this.tunnel);

    // this.dom = this.renderer.domElement;
    // this.controls = new THREE.OrbitControls( this.camera, this.dom );
  }

  initPostprocessing() {
    if (!this.usePostprocessing) return;

    // Load Pass
    this.toonPass = new WAGNER.ToonPass();
    this.invertPass = new WAGNER.InvertPass();
    this.grayscalePass = new WAGNER.GrayscalePass();
  }

  resize(width, height) {
    this.composer.setSize(width, height);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  };

  render(average, frequencys, treble, bass, medium) {

    if (this.usePostprocessing) {
      this.composer.reset();
      this.composer.renderer.clear();
      this.composer.render(this.scene, this.camera);

      if (this.toon) {
        this.composer.pass(this.toonPass);
      }
      if (this.invert) {
          this.composer.pass(this.invertPass);
      }
      if (this.grayscale) {
        this.composer.pass(this.grayscalePass)
      }
      this.composer.toScreen();

      if(treble > 30) {
        this.invert = true;
      } else {
        this.invert = false;
      }

      if (bass > 200) {
        this.grayscale = true;
        console.log('up');
      } else {
        this.grayscale = false;
      }

    } else {
      this.renderer.autoClear = false;
      this.renderer.clear();
      this.renderer.render(this.scene, this.camera);
    }

    // move camera
    var seconds   = Date.now() / 1000;
    var radius    = 0.70;
    var angle   = Math.sin(0.75 * seconds * Math.PI) / 4;

    //angle = (seconds*Math.PI)/4;
    this.camera.position.x = Math.cos(angle - Math.PI/2) * radius;
    this.camera.position.y = Math.sin(angle - Math.PI/2) * radius;
    this.camera.rotation.z = angle;

    // Update tunnel with audio values
    this.tunnel.update(average, frequencys, treble, bass, medium);
  }
}
