const loop = require( "core/loop" )
const stage = require( "core/stage" )
const engine = require( "core/engine" )
const sound = require( "core/sound" )

stage.init()
engine.init()

document.getElementById( "main" ).appendChild( engine.dom )

const xp = new ( require( "xp/Xp" ) )()
engine.scene.add( xp )

sound.load( "mp3/lean.mp3" )
sound.on( "start", () => {
  loop.add( () => {
    xp.update( sound.getData() )
  })
})

loop.start()