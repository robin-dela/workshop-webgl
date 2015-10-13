const loop = require( "core/loop" )
const stage = require( "core/stage" )

class Engine {

  constructor() {
    this.scene = new THREE.Scene()

    //this.camera = new THREE.PerspectiveCamera( 75, 0, 1, 1000 )

    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 10000 )
    this.camera.position.set = (0, 0, 7)
    this.camera.lookAt(this.scene.position)
    this.scene.add(this.camera)
    
    this.scene.fog = new THREE.FogExp2( 0x000000, 0.15 );

    this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } )
    this.renderer.setPixelRatio( window.devicePixelRatio )
    this.renderer.setClearColor( 0x000000 )

    this.dom = this.renderer.domElement

    this.controls = new THREE.OrbitControls( this.camera, this.dom );

    this._binds = {}
    this._binds.onUpdate = this._onUpdate.bind( this )
    this._binds.onResize = this._onResize.bind( this )
  }

  _onUpdate() {
    this.renderer.render( this.scene, this.camera )


    // move camera
    var seconds   = Date.now() / 1000;
    var radius    = 0.70;
    var angle   = Math.sin(0.75 * seconds * Math.PI) / 4;
    //angle = (seconds*Math.PI)/4;
    this.camera.position.x = Math.cos(angle - Math.PI/2) * radius;
    this.camera.position.y = Math.sin(angle - Math.PI/2) * radius;
    this.camera.rotation.z = angle;
  }

  _onResize() {
    const w = stage.width
    const h = stage.height

    this.renderer.setSize( w, h )

    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  init() {
    loop.add( this._binds.onUpdate )
    stage.on( "resize", this._binds.onResize )
    this._onResize()
  }
}

module.exports = new Engine()