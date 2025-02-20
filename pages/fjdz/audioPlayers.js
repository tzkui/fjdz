class AudioPlayer {
  constructor(url,config={}){
    console.log(url,config)
    this.audio = document.createElement("audio");
    this.audio.src = url
  }
  play(time) {
    if (time) {
      this.audio.currentTime = time
    }
    this.audio.play()
  }
  pause() {
    this.audio.pause()
  }
  setSrc(src) {
    this.audio.src = src
  }
}
export default AudioPlayer
export const bgAudioPlayer = new AudioPlayer("../../static/audio/bg.mp3")
export const dieAudioPlayer = new AudioPlayer("../../static/audio/die.mp3")