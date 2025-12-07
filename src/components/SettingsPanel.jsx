import { X, Volume2, Mic, Info } from 'lucide-react';
import { commandProcessor } from '../services/commandProcessor';

export function SettingsPanel({ isOpen, onClose, voiceEnabled, onVoiceToggle }) {
  const commands = commandProcessor.getCommands();
  const notes = commandProcessor.getNotes();
  const reminders = commandProcessor.getReminders();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Friday Control Panel</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Voice Settings
            </h3>
            <div className="flex items-center justify-between p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700">
              <div>
                <p className="text-white font-medium">Voice Recognition</p>
                <p className="text-sm text-gray-400">Enable wake word detection</p>
              </div>
              <button
                onClick={onVoiceToggle}
                className={`relative w-14 h-8 rounded-full transition-colors ${
                  voiceEnabled ? 'bg-gray-400' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    voiceEnabled ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Mic className="w-5 h-5" />
              Available Commands
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {commands.map((cmd) => (
                <div
                  key={cmd.name}
                  className="p-3 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700"
                >
                  <p className="text-white font-mono text-sm font-medium">{cmd.name}</p>
                  <p className="text-xs text-gray-400 mt-1">{cmd.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Info className="w-5 h-5" />
              Your Data
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700">
                <p className="text-white font-medium mb-2">Notes ({notes.length})</p>
                {notes.length > 0 ? (
                  <ul className="space-y-1">
                    {notes.slice(-5).map((note) => (
                      <li key={note.id} className="text-sm text-gray-400">
                        • {note.content}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No notes yet</p>
                )}
              </div>

              <div className="p-4 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700">
                <p className="text-white font-medium mb-2">Reminders ({reminders.length})</p>
                {reminders.length > 0 ? (
                  <ul className="space-y-1">
                    {reminders.slice(-5).map((reminder) => (
                      <li key={reminder.id} className="text-sm text-gray-400">
                        • {reminder.text}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No reminders yet</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg border border-gray-700">
            <h4 className="text-white font-semibold mb-2">Quick Start Guide</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Say "Hey Friday" to wake up the assistant</li>
              <li>• Follow with your command (e.g., "what time is it?")</li>
              <li>• Use "help" command to see all available commands</li>
              <li>• Click the microphone button to manually toggle listening</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
