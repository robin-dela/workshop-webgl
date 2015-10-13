class Xp extends THREE.Object3D {

  constructor() {
    super()

    this._createTunnel()
    this.sphere
    this.texture
    this.lightGlobal
    this.lightTop
    this.magicLight


    this.BEAT_HOLD_TIME = 40; //num of frames to hold a beat
    this.BEAT_DECAY_RATE = 0.98;
    this.BEAT_MIN = 0.2; //a volume less than this is no beat
    this.beatCutOff = 0;
    this.beatTime = 0;
    this.beatHoldTime = 20
    this.beatDecayRate = 0.8

    this.gui = new dat.GUI();
   // this.guiInit()
  }

  _createTunnel() {

    this.geometry  = new THREE.CylinderGeometry( 1, 1, 30, 32, 1, true );
    this.texture   = THREE.ImageUtils.loadTexture( "imgs/water.jpg" );
    this.texture.wrapT = THREE.RepeatWrapping;
    this.material  = new THREE.MeshLambertMaterial({color : 0xFFFFFF, map : this.texture, side: THREE.DoubleSide});


    this.tunnel  = new THREE.Mesh( this.geometry, this.material );
    this.tunnel.rotation.x = Math.PI/2;
    //this.tunnel.rotation.z = 0.2;

    this.add(this.tunnel);
    this.tunnel.flipSided  = true;

    // var lightOne = new THREE.DirectionalLight( 0x006159, 1.5 );
    // lightOne.position.set( 1, 1, 0 ).normalize();
    // this.add( lightOne );
    
    // var lightTwo = new THREE.DirectionalLight( 0x006159, 1.5 );
    // lightTwo.position.set( -1, 1, 0 ).normalize();
    // this.add( lightTwo );
    
    this.lightTop = new THREE.PointLight( 0x009589, 15, 25 );
    this.lightTop.position.set( 0, -3, 0 );
    this.add( this.lightTop );
    
    this.lightGlobal = new THREE.PointLight( 0x00796F, 20, 30 );
    this.lightGlobal.position.set( 3, 3, 0 );
    this.add( this.lightGlobal );

    //this.magicLight = new THREE.AmbientLight(0xE67E22);
    //this.magicLight.position.set( 3, 3, 0 );
    //this.magicLight.intensity = -10;
    //this.add( this.magicLight );


    // var geometry = new THREE.SphereGeometry( 5, 32, 32 );
    // var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    // this.sphere = new THREE.Mesh( geometry, material );
    // this.add( this.sphere );

    // var radius   = 1,
    // segments = 64,
    // material = new THREE.LineBasicMaterial( { color: 0x0000ff } ),
    // geometry = new THREE.CircleGeometry( radius, segments );
    // this.circle =  new THREE.Line( geometry, material);

    // Remove center vertex
    //geometry.vertices.shift();

    //this.add(this.circle);
    
  }

  guiInit() {
    this.sphere.position.z = 7;
    this.circle.position.z = 7;
    this.gui.add(this.sphere.position, 'z', -70, 70);
    //this.gui.add(this.circle.position, 'z', -70, 70);
  }

  update( data ) {
    if( !data ) {
      return
    }

    this.texture.offset.y  -= 0.006;
    this.texture.offset.y  %= 1;
    this.texture.needsUpdate = true;

    //this.sphere.position.z -= 7;
    //this.sphere.position.z %= 1;
    //this.sphere.needsUpdate = true;


    // Want to customize things ?
    // http://www.airtightinteractive.com/demos/js/uberviz/audioanalysis/

    // for bar // from 0 - 256, no sound = 0
    let n = data.freq
    var total = 0;
    for( var i = 0; i < n.length; i++ ) {
      total += n[i]
    }
    var avg = total / n.length
    //this.lightGlobal.intensity = avg / 10
    //this.texture.offset.y  -= avg / 100000;

    // for beat
    if (avg  > this.beatCutOff && avg > this.BEAT_MIN){
      this.beatCutOff = avg *1.1;
      this.beatTime = 0;
    } else{
      if (this.beatTime <= this.beatHoldTime){
        this.beatTime ++;
      } else{
        this.beatCutOff *= this.beatDecayRate;
        this.beatCutOff = Math.max(this.beatCutOff, this.BEAT_MIN);
      }
    }


    // for wave // from 0 -256, no sound = 128
    n = data.time 
    for( i = 0; i < n.length; i++ ) {
      total += n[i]
    }
    avg = total / n.length
    this.lightTop.intensity = avg/40;
    this.lightGlobal.intensity = avg/40;
    //this.texture.offset.y  -= avg / 40000;

    //this.magicLight.intensity = avg/10;
  }
}

module.exports = Xp
