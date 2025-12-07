import { useState, useEffect, useRef } from 'react';
import { Mic, Settings, Trash2, Power } from 'lucide-react';
import { RobotVisual } from './components/RobotVisual';
import { CommandHistory } from './components/CommandHistory';
import { SettingsPanel } from './components/SettingsPanel';
import { voiceRecognition } from './services/voiceRecognition';
import { textToSpeech } from './services/textToSpeech';
import { commandProcessor } from './services/commandProcessor';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [isAwake, setIsAwake] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [interactions, setInteractions] = useState([]);
  const [statusMessage, setStatusMessage] = useState('Click the microphone to activate Friday');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const interactionsEndRef = useRef(null);

  useEffect(() => {
    interactionsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [interactions]);

  useEffect(() => {
    if (!voiceRecognition.isSupported()) {
      setStatusMessage('Voice recognition is not supported in this browser');
    } else if (!textToSpeech.isSupported()) {
      setStatusMessage('Text-to-speech is not supported in this browser');
    }
  }, []);

  const addInteraction = (type, text, success = true) => {
    const interaction = {
      id: Date.now().toString() + Math.random(),
      type,
      text,
      timestamp: new Date(),
      success,
    };
    setInteractions((prev) => [...prev, interaction]);
  };

  const handleWakeWord = () => {
    setIsAwake(true);
    setStatusMessage('Listening for command...');
    addInteraction('response', 'Yes? How can I help you?');

    textToSpeech.speak('Yes?').catch(console.error);
  };

  const handleCommand = async (command) => {
    setIsAwake(false);
    setStatusMessage('Processing command...');
    addInteraction('command', command);

    try {
      const result = await commandProcessor.process(command);

      if (result.action === 'shutdown') {
        addInteraction('response', result.message, result.success);
        setIsSpeaking(true);
        await textToSpeech.speak(result.message);
        setIsSpeaking(false);
        setTimeout(() => {
          stopListening();
          setIsActive(false);
          setStatusMessage('Friday is offline');
        }, 1000);
        return;
      }

      if (result.action === 'search') {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(result.data.query)}`, '_blank');
      }

      if (result.action === 'open') {
        const target = result.data.target.toLowerCase();
        if (target.includes('http')) {
          window.open(result.data.target, '_blank');
        }
      }

      addInteraction('response', result.message, result.success);
      setStatusMessage(isListening ? 'Listening... Say "Hey Friday" to wake' : 'Ready');

      setIsSpeaking(true);
      await textToSpeech.speak(result.message);
      setIsSpeaking(false);
    } catch (error) {
      const errorMessage = 'I encountered an error processing that command';
      addInteraction('response', errorMessage, false);
      setStatusMessage('Error occurred');

      setIsSpeaking(true);
      await textToSpeech.speak(errorMessage);
      setIsSpeaking(false);
    }
  };

  const startListening = () => {
    if (!voiceRecognition.isSupported()) {
      addInteraction('response', 'Voice recognition is not supported in this browser', false);
      return;
    }

    setIsActive(true);
    voiceRecognition.start({
      wakeWord: 'friday',
      continuous: true,
      onWakeWordDetected: handleWakeWord,
      onCommand: handleCommand,
      onError: (error) => {
        console.error('Voice recognition error:', error);
        if (error !== 'no-speech') {
          setStatusMessage(`Error: ${error}`);
        }
      },
      onListeningChange: (listening) => {
        setIsListening(listening);
        if (listening) {
          setStatusMessage('Listening... Say "Hey Friday" to wake');
        }
      },
    });

    addInteraction('response', 'Friday is now active. Say "Hey Friday" to wake me up.');
    textToSpeech.speak('Friday activated. Say Hey Friday when you need me.').catch(console.error);
  };

  const stopListening = () => {
    voiceRecognition.stop();
    setIsListening(false);
    setIsAwake(false);
    setIsActive(false);
    setStatusMessage('Friday is offline');
  };

  const toggleListening = () => {
    if (isListening || isActive) {
      stopListening();
      addInteraction('response', 'Going offline. Goodbye!');
      textToSpeech.speak('Going offline').catch(console.error);
    } else {
      startListening();
    }
  };

  const clearHistory = () => {
    setInteractions([]);
    addInteraction('response', 'Conversation history cleared');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-transparent to-transparent opacity-40" />

      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gray-700 rounded-full filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gray-600 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10">
        <header className="p-6 flex items-center justify-between border-b border-gray-800 bg-black bg-opacity-50 backdrop-blur-sm">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-300 via-white to-gray-400 bg-clip-text text-transparent">
              FRIDAY
            </h1>
            <p className="text-sm text-gray-500">Voice-Controlled AI Assistant</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all border border-gray-700 hover:border-gray-600"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            <button
              onClick={clearHistory}
              className="p-3 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all border border-gray-700 hover:border-gray-600"
              title="Clear History"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center gap-8 mb-12">
            <RobotVisual
              isListening={isListening}
              isAwake={isAwake}
              isSpeaking={isSpeaking}
            />

            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-600'
                }`} />
                <p className="text-xl font-medium text-gray-300">
                  {statusMessage}
                </p>
              </div>

              {isAwake && (
                <div className="flex items-center justify-center gap-2 text-gray-400 animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              )}

              <button
                onClick={toggleListening}
                className={`group relative px-8 py-4 rounded-2xl font-semibold transition-all transform hover:scale-105 active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-500/50'
                    : 'bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 shadow-lg shadow-gray-500/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isActive ? (
                    <>
                      <Power className="w-6 h-6" />
                      <span>Deactivate Friday</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-6 h-6" />
                      <span>Activate Friday</span>
                    </>
                  )}
                </div>
              </button>

              <p className="text-sm text-gray-500 max-w-md">
                {isActive
                  ? 'Say "Hey Friday" followed by your command'
                  : 'Click the button above to start voice control'}
              </p>
            </div>
          </div>

          {interactions.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-400">Conversation</h2>
                <div className="text-sm text-gray-600">
                  {interactions.length} {interactions.length === 1 ? 'message' : 'messages'}
                </div>
              </div>

              <div className="space-y-4 p-6 bg-black bg-opacity-30 rounded-2xl border border-gray-800 backdrop-blur-sm max-h-96 overflow-y-auto">
                <CommandHistory interactions={interactions} />
                <div ref={interactionsEndRef} />
              </div>
            </div>
          )}

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="p-4 bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Voice Control</h3>
              <p className="text-xs text-gray-500">
                Hands-free operation with wake word detection
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Smart Commands</h3>
              <p className="text-xs text-gray-500">
                Time, calculations, notes, reminders, and more
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800">
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Natural Language</h3>
              <p className="text-xs text-gray-500">
                Speak naturally and Friday will understand
              </p>
            </div>
          </div>
        </main>

        <footer className="mt-12 p-6 text-center text-gray-600 text-sm border-t border-gray-800 bg-black bg-opacity-50 backdrop-blur-sm">
          <p>Built with advanced voice recognition and AI processing</p>
        </footer>
      </div>

      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        voiceEnabled={isListening}
        onVoiceToggle={toggleListening}
      />
    </div>
  );
}

export default App;
