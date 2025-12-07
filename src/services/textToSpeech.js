class TextToSpeechService {
  constructor() {
    if ('speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.voice = null;
      this.loadVoices();

      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.loadVoices();
      }
    } else {
      this.synth = null;
      this.voice = null;
    }
  }

  loadVoices() {
    if (!this.synth) return;

    const voices = this.synth.getVoices();
    this.voice = voices.find(v => v.name.includes('Google') || v.name.includes('Female')) || voices[0];
  }

  speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.synth) {
        reject(new Error('Text-to-speech is not supported'));
        return;
      }

      this.synth.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = this.voice;
      utterance.rate = options.rate || 1;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;

      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);

      this.synth.speak(utterance);
    });
  }

  cancel() {
    this.synth?.cancel();
  }

  isSupported() {
    return this.synth !== null;
  }
}

export const textToSpeech = new TextToSpeechService();
