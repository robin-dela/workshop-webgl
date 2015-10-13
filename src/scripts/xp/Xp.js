class Xp extends THREE.Object3D {

  constructor() {
    super()

    this._createTunnel()
    this.sphere
    this.texture
    this.lightGlobal
    this.lightTop


    this.BEAT_HOLD_TIME = 40; //num of frames to hold a beat
    this.BEAT_DECAY_RATE = 0.98;
    this.BEAT_MIN = 0.2; //a volume less than this is no beat
    this.beatCutOff = 0;
    this.beatTime = 0;
    this.beatHoldTime = 20
    this.beatDecayRate = 0.8
  }

  _createTunnel() {

    this.geometry  = new THREE.CylinderGeometry( 1, 1, 30, 32, 1, true );
    this.texture   = THREE.ImageUtils.loadTexture( "imgs/water.jpg" );
    this.texture.wrapT = THREE.RepeatWrapping;
    this.material  = new THREE.MeshLambertMaterial({color : 0xFFFFFF, map : this.texture, side: THREE.DoubleSide});


    this.tunnel  = new THREE.Mesh( this.geometry, this.material );
    this.tunnel.rotation.x = Math.PI/2;

    this.add(this.tunnel);
    this.tunnel.flipSided  = true;

    var lightOne = new THREE.DirectionalLight( 0x006159, 1.5 );
    lightOne.position.set( 1, 1, 0 ).normalize();
    this.add( lightOne );
    
    var lightTwo = new THREE.DirectionalLight( 0x006159, 1.5 );
    lightTwo.position.set( -1, 1, 0 ).normalize();
    this.add( lightTwo );
    
    this.lightTop = new THREE.PointLight( 0x009589, 15, 25 );
    this.lightTop.position.set( 0, -3, 0 );
    this.add( this.lightTop );
    
    this.lightGlobal = new THREE.PointLight( 0x00796F, 20, 30 );
    this.lightGlobal.position.set( 3, 3, 0 );
    this.add( this.lightGlobal );
  }

  update( data ) {
    if( !data ) {
      return
    }

    this.texture.offset.y  -= 0.008;
    this.texture.offset.y  %= 1;
    this.texture.needsUpdate = true;


    // Want to customize things ?
    // http://www.airtightinteractive.com/demos/js/uberviz/audioanalysis/

    // for bar // from 0 - 256, no sound = 0
    let n = data.freq
    var total = 0;
    for( var i = 0; i < n.length; i++ ) {
      total += n[i]
    }
    //console.log(total)
    var avg = total / n.length
    //console.log('avg', avg)

    // for beat
    if (avg  > this.beatCutOff && avg > this.BEAT_MIN){
      this.beatCutOff = avg *1.1;
      this.beatTime = 0;
      this.lightGlobal.intensity = 20;
      this.lightTop.intensity = 20;
    } else{
      if (this.beatTime <= this.beatHoldTime){
        this.beatTime ++;
        this.lightGlobal.intensity = 6;
        this.lightTop.intensity = 6;
      } else{
        this.beatCutOff *= this.beatDecayRate;
        this.beatCutOff = Math.max(this.beatCutOff, this.BEAT_MIN);
        this.lightGlobal.intensity = 2;
        this.lightTop.intensity = 2;
      }
    }


    // for wave // from 0 -256, no sound = 128
    n = data.time 
    for( i = 0; i < n.length; i++ ) {
      total += n[i]
    }
    avg = total / n.length

    //this.texture.offset.y  -= avg / 20000;

  }
}

module.exports = Xp
