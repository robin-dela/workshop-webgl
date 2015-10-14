'use strict';

import Tunnel from './objects/Tunnel';
import THREE from 'three';
window.THREE = THREE;

export default class Webgl {
  constructor(width, height) {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(100, width / height, 0.1, 10000 );
    this.camera.position.set = (0, 0, 7);
    this.camera.lookAt(this.scene.position);
    this.scene.add(this.camera);

    this.scene.fog = new THREE.FogExp2( 0x000000, 0.15 );

    this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x000000);

    this.usePostprocessing = false;
    //this.composer = new WAGNER.Composer(this.renderer);
    //this.composer.setSize(width, height);
    //this.initPostprocessing();

    this.tunnel = new Tunnel();
    this.tunnel.position.set(0, 0, 0);
    this.scene.add(this.tunnel);

    this.dom = this.renderer.domElement;
    this.controls = new THREE.OrbitControls( this.camera, this.dom );

    this.shaderTime = 0;
    this.mirrorParams;
    this.mirrorPass;
    this.composer;
  }

  initPostprocessing() {
    if (!this.usePostprocessing) return;

    //this.vignette2Pass = new WAGNER.Vignette2Pass();
  }

  resize(width, height) {
    this.composer.setSize(width, height);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  };

  render(average, frequencys) {
    if (this.usePostprocessing) {
      //this.composer.reset();
      //this.composer.renderer.clear();
      // this.composer.render(this.scene, this.camera);
      // this.composer.pass(this.vignette2Pass);
      // this.composer.toScreen();

      this.renderPass = new THREE.RenderPass( this.scene, this.camera );
      this.mirrorPass = new THREE.ShaderPass( THREE.MirrorShader );
      this.composer = new THREE.EffectComposer( this.renderer);
      this.composer.addPass( this.renderPass );
      this.composer.addPass( this.mirrorPass );
      this.mirrorPass.renderToScreen = true;

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

    this.tunnel.update(average, frequencys);

    // console.log(average);
  }
}
