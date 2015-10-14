'use strict';

import THREE from 'three';

export default class Tunnel extends THREE.Object3D {
  constructor() {
    super();

    this.texture;
    this.lightGlobal;
    this.lightTop;
    this.magicLight;
    this.createTunnel();
  }

  createTunnel() {
    // Create tube and add texture
    var geometry  = new THREE.CylinderGeometry( 1, 1, 30, 32, 1, true );
    this.texture   = THREE.ImageUtils.loadTexture( "../../build/img/water.jpg" );
    this.texture.wrapT = THREE.RepeatWrapping;

    var material  = new THREE.MeshLambertMaterial({
      color : 0xFFFFFF,
      map : this.texture,
      side: THREE.DoubleSide
    });

    var tube  = new THREE.Mesh( geometry, material );
    tube.rotation.x = Math.PI/2;
    this.add(tube);
    tube.flipSided  = true;

    //Add light in the tube
    this.lightTop = new THREE.PointLight( 0x009589, 15, 25 );
    this.lightTop.position.set( 0, -3, 0 );
    this.add( this.lightTop );

    // Add light in the tube
    this.lightGlobal = new THREE.PointLight( 0x00796F, 20, 30 );
    this.lightGlobal.position.set( 1, 3, 0 );
    this.add( this.lightGlobal );

    // Add light in the tube
    this.magicLight = new THREE.PointLight( 0xe74c3c, 20, 30 );
    this.magicLight.position.set( 1, 3, 0 );
    this.add( this.magicLight );

  }

  update(average, frequencys) {
    var maxIntensity = 35;

    this.magicLight.intensity = 20;

    this.texture.offset.y  -= 0.006;
    this.texture.offset.y  %= 1;
    this.texture.needsUpdate = true;

    if (average > maxIntensity) {
      this.lightTop.intensity = average /6;
      this.lightGlobal.intensity = average /6;
    } else {
      this.lightTop.intensity = average/3;
      this.lightGlobal.intensity = average/3;
    }

    if (average > 80) {
      this.lightTop.intensity = 50;
      this.lightGlobal.intensity = 50;
    }

    //console.log(average);
  }
}
