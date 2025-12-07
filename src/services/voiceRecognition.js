class VoiceRecognitionService {
  constructor() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
    } else {
      this.recognition = null;
    }

    this.isListening = false;
    this.isAwake = false;
    this.wakeWord = 'friday';
    this.options = null;
  }

  isSupported() {
    return this.recognition !== null;
  }

  start(options) {
    if (!this.recognition) {
      options.onError?.('Speech recognition is not supported in this browser');
      return;
    }

    this.options = options;
    this.wakeWord = options.wakeWord.toLowerCase();
    this.isListening = true;
    this.isAwake = false;

    this.recognition.onstart = () => {
      console.log('Voice recognition started');
      this.options?.onListeningChange?.(true);
    };

    this.recognition.onresult = (event) => {
      const results = event.results;
      const lastResult = results[results.length - 1];

      if (lastResult.isFinal) {
        const transcript = lastResult[0].transcript.toLowerCase().trim();
        console.log('Transcript:', transcript);

        if (!this.isAwake) {
          if (transcript.includes(this.wakeWord) || transcript.includes(`hey ${this.wakeWord}`)) {
            this.isAwake = true;
            this.options?.onWakeWordDetected?.();
          }
        } else {
          const command = transcript.replace(this.wakeWord, '').replace('hey', '').trim();
          if (command) {
            this.options?.onCommand?.(command);
            this.isAwake = false;
          }
        }
      }
    };

    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        return;
      }
      this.options?.onError?.(event.error);
    };

    this.recognition.onend = () => {
      if (this.isListening) {
        this.recognition?.start();
      } else {
        this.options?.onListeningChange?.(false);
      }
    };

    this.recognition.start();
  }

  stop() {
    this.isListening = false;
    this.isAwake = false;
    this.recognition?.stop();
  }

  getIsAwake() {
    return this.isAwake;
  }

  setAwake(awake) {
    this.isAwake = awake;
  }
}

export const voiceRecognition = new VoiceRecognitionService();
