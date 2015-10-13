// Want to customize things ?
// http://www.airtightinteractive.com/demos/js/uberviz/audioanalysis/

class Sound extends Emitter {

  constructor() {
    super()

    this._context = new AudioContext()

    this._bufferSize = 512 // change this value for more or less data

    this._analyser = this._context.createAnalyser()
    this._analyser.fftSize = this._bufferSize
    this._binCount = this._analyser.frequencyBinCount // this._bufferSize / 2
    console.log( this._binCount )

    this._dataFreqArray = new Uint8Array( this._binCount )
    this._dataTimeArray = new Uint8Array( this._binCount )

    this._binds = {}
    this._binds.onLoad = this._onLoad.bind( this )
  }

  load( url ) {
    this._request = new XMLHttpRequest()
    this._request.open( "GET", url, true )
    this._request.responseType = "arraybuffer"

    this._request.onload = this._binds.onLoad
    this._request.send()
  }

  _onLoad() {
    this._context.decodeAudioData( this._request.response, ( buffer ) => {
      this._source = this._context.createBufferSource()
      this._source.connect( this._analyser )
      this._source.buffer = buffer
      this._source.connect( this._context.destination )
      this._source.start( 0 )

      this.emit( "start" )
    }, () => {
      console.log( "error" )
    } )
  }

  getData() {
    this._analyser.getByteFrequencyData( this._dataFreqArray )
    this._analyser.getByteTimeDomainData( this._dataTimeArray )
    return {
      freq: this._dataFreqArray, // from 0 - 256, no sound = 0
      time: this._dataTimeArray // from 0 -256, no sound = 128
    }
  }

}

module.exports = new Sound()
