import { MessageSquare, User } from 'lucide-react';

export function CommandHistory({ interactions }) {
  return (
    <div className="w-full max-w-4xl space-y-3">
      {interactions.map((interaction) => (
        <div
          key={interaction.id}
          className={`flex items-start gap-3 ${
            interaction.type === 'command' ? 'justify-end' : 'justify-start'
          }`}
        >
          {interaction.type === 'response' && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-gray-600">
              <MessageSquare className="w-4 h-4 text-gray-300" />
            </div>
          )}

          <div
            className={`max-w-md px-4 py-3 rounded-2xl ${
              interaction.type === 'command'
                ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white border border-gray-700'
                : interaction.success === false
                ? 'bg-gradient-to-r from-red-950 to-gray-900 text-red-200 border border-red-800'
                : 'bg-gradient-to-r from-gray-900 to-black text-gray-300 border border-gray-700'
            }`}
          >
            <p className="text-sm leading-relaxed">{interaction.text}</p>
            <span className="text-xs opacity-50 mt-1 block">
              {interaction.timestamp.toLocaleTimeString()}
            </span>
          </div>

          {interaction.type === 'command' && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center border border-gray-500">
              <User className="w-4 h-4 text-gray-200" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
