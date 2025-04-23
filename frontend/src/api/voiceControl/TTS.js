const TTS = (text, rate = 0.71) => {
  if (!text) return;

  const synth = window.speechSynthesis;
  const toSpeak = new SpeechSynthesisUtterance(text);

  toSpeak.rate = rate;

  if (synth.speaking) {
    return;
  }

  const voices = synth.getVoices();
  if (voices.length > 0) {
    toSpeak.voice = voices[3];
  }

  synth.speak(toSpeak);



};

export const stopTTS = () => {
  const synth = window.speechSynthesis;
  if (synth.speaking) {
    synth.cancel();
  }
};

export default TTS;
