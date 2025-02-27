class AudioPlayer {
  constructor(url,config={}){
    this.audio = document.createElement("audio");
    this.audio.src = url
  }
  play(time) {
    if (time) {
      this.audio.currentTime = time;
    }
    this.audio.play()
  }
  pause() {
    this.audio.pause()
  }
  setSrc(src) {
    this.audio.src = src
  }
  setCurrentTime(time){
    this.audio.currentTime = time
  }
}
export default AudioPlayer
export const bgAudioPlayer = new AudioPlayer("../../static/audio/bg.mp3")
export const startAudioPlayer = new AudioPlayer("../../static/audio/launch-arrow.mp3")
export const countdownAudioPlayer = new AudioPlayer("../../static/audio/countdown.mp3")