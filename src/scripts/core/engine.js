const loop = require( "core/loop" )
const stage = require( "core/stage" )

class Engine {
  constructor() {
    this.scene = new THREE.Scene()

    this.shaderTime = 0
    this.mirrorParams
    this.mirrorPass
    this.composer
    this.camera

    //this.camera = new THREE.PerspectiveCamera( 75, 1000, 1, 1000 )
    //this.camera.position.z = 40

    this.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 10000 )
    //this.camera.position.z = 20
    this.camera.position.set = (0, 0, 7)
    this.camera.lookAt(this.scene.position)
    this.scene.add(this.camera)

    this.scene.fog = new THREE.FogExp2( 0x000000, 0.15 );

    this.renderer = new THREE.WebGLRenderer( { antialias: false, alpha: true } )
    this.renderer.setPixelRatio( window.devicePixelRatio )
    this.renderer.setClearColor( 0x000000 )

    this.dom = this.renderer.domElement

    this.controls = new THREE.OrbitControls( this.camera, this.dom );

    this._binds = {}
    this._binds.onUpdate = this._onUpdate.bind( this )
    this._binds.onResize = this._onResize.bind( this )

    this.post = {
      renderPass: true,
      mirrorPass: true
    }

    this.gui = new dat.GUI();
    this.gui.add(this.post, 'renderPass');
    this.gui.add(this.post, 'mirrorPass');

    //this.postprocessing()
  }

  postprocessing() {
    //POST PROCESSING
    //render pass renders scene into effects composer
    this.renderPass = new THREE.RenderPass( this.scene, this.camera );
    this.mirrorPass = new THREE.ShaderPass( THREE.MirrorShader );

    //Add Shader Passes to Composer
    this.composer = new THREE.EffectComposer( this.renderer);
    if (this.post.renderPass) this.composer.addPass( this.renderPass );
    if (this.post.mirrorPass) this.composer.addPass( this.mirrorPass );

    //set last pass in composer chain to renderToScreen
    this.mirrorPass.renderToScreen = true;
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

    //this.composer.reset();

    //this.composer.render( 0.1);
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
