class CommandProcessorService {
  constructor() {
    this.commands = new Map();
    this.notes = [];
    this.reminders = [];
    this.registerDefaultCommands();
  }

  registerDefaultCommands() {
    this.register('help', () => {
      const commandList = Array.from(this.commands.entries())
        .map(([cmd, { description }]) => `${cmd}: ${description}`)
        .join(', ');
      return {
        success: true,
        message: `Available commands: ${commandList}`,
      };
    }, 'Show all available commands');

    this.register('time', () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString();
      return {
        success: true,
        message: `The current time is ${timeStr}`,
        data: { time: timeStr },
      };
    }, 'Get current time');

    this.register('date', () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      return {
        success: true,
        message: `Today is ${dateStr}`,
        data: { date: dateStr },
      };
    }, 'Get current date');

    this.register('calculate', (args) => {
      try {
        const expression = args.join(' ');
        const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, '');
        const result = Function('"use strict"; return (' + sanitized + ')')();
        return {
          success: true,
          message: `${expression} equals ${result}`,
          data: { result },
        };
      } catch (error) {
        return {
          success: false,
          message: 'Invalid calculation',
        };
      }
    }, 'Perform calculations');

    this.register('note', (args) => {
      const content = args.join(' ');
      const note = {
        id: Date.now().toString(),
        content,
        timestamp: new Date(),
      };
      this.notes.push(note);
      return {
        success: true,
        message: `Note saved: ${content}`,
        data: { note },
      };
    }, 'Create a note');

    this.register('read', (args) => {
      if (args[0] === 'notes') {
        if (this.notes.length === 0) {
          return {
            success: true,
            message: 'You have no notes',
          };
        }
        const notesList = this.notes
          .map((n, i) => `${i + 1}. ${n.content}`)
          .join('. ');
        return {
          success: true,
          message: `Your notes: ${notesList}`,
          data: { notes: this.notes },
        };
      }
      return {
        success: false,
        message: 'Please specify what to read',
      };
    }, 'Read notes');

    this.register('clear', (args) => {
      if (args[0] === 'notes') {
        this.notes = [];
        return {
          success: true,
          message: 'All notes cleared',
        };
      }
      return {
        success: false,
        message: 'Please specify what to clear',
      };
    }, 'Clear notes');

    this.register('search', async (args) => {
      const query = args.join(' ');
      return {
        success: true,
        message: `Searching for: ${query}`,
        action: 'search',
        data: { query },
      };
    }, 'Search the web');

    this.register('open', (args) => {
      const target = args.join(' ');
      return {
        success: true,
        message: `Opening ${target}`,
        action: 'open',
        data: { target },
      };
    }, 'Open applications or websites');

    this.register('weather', (args) => {
      const location = args.join(' ') || 'your location';
      return {
        success: true,
        message: `Checking weather for ${location}. This would require an API integration.`,
        action: 'weather',
        data: { location },
      };
    }, 'Get weather information');

    this.register('reminder', (args) => {
      const text = args.join(' ');
      const reminder = {
        id: Date.now().toString(),
        text,
        time: new Date(),
      };
      this.reminders.push(reminder);
      return {
        success: true,
        message: `Reminder set: ${text}`,
        data: { reminder },
      };
    }, 'Set a reminder');

    this.register('hello', () => {
      const greetings = [
        'Hello! How can I assist you today?',
        'Greetings! What can I do for you?',
        'Hi there! Ready to help!',
        'Hello! Friday at your service!',
      ];
      const message = greetings[Math.floor(Math.random() * greetings.length)];
      return {
        success: true,
        message,
      };
    }, 'Say hello');

    this.register('shutdown', () => {
      return {
        success: true,
        message: 'Shutting down Friday. Goodbye!',
        action: 'shutdown',
      };
    }, 'Shutdown Friday');
  }

  register(command, handler, description) {
    this.commands.set(command.toLowerCase(), { handler, description });
  }

  async process(input) {
    const trimmed = input.toLowerCase().trim();
    const [commandName, ...args] = trimmed.split(/\s+/);

    const command = this.commands.get(commandName);
    if (!command) {
      return {
        success: false,
        message: `Unknown command: ${commandName}. Say "help" for available commands.`,
      };
    }

    try {
      return await command.handler(args);
    } catch (error) {
      return {
        success: false,
        message: `Error executing command: ${error}`,
      };
    }
  }

  getCommands() {
    return Array.from(this.commands.entries()).map(([name, { description }]) => ({
      name,
      description,
    }));
  }

  getNotes() {
    return this.notes;
  }

  getReminders() {
    return this.reminders;
  }
}

export const commandProcessor = new CommandProcessorService();
