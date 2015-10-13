class Stage extends Emitter {

  constructor() {
    super()

    this.width = 0
    this.height = 0

    this._binds = {}
    this._binds.onResize = this._onResize.bind( this )
    this._binds.update = this._update.bind( this )
  }

  _onResize() {
    setTimeout( this._binds.update, 10 )
  }

  init( andDispatch = true ) {
    window.addEventListener( "resize", this._binds.onResize, false )
    window.addEventListener( "orientationchange", this._binds.onResize, false )

    if( andDispatch ) {
      this._update()
    }
  }

  _update() {
    this.width = window.innerWidth
    this.height = window.innerHeight

    this.emit( "resize" )
  }

  forceResize( withDelay = false ) {
    if( withDelay ) {
      this._onResize()
      return
    }
    this._update()
  }

}

module.exports = new Stage()
