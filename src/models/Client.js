const {
  Client,
  GatewayIntentBits,
  Partials,
  ActivityType,
  PresenceUpdateStatus,
  Collection,
} = require("discord.js");

class MyClient extends Client {
  constructor(options = {}) {
    const defaultOptions = {
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
      ],
      partials: [
        Partials.User,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
      ],
      allowedMentions: {
        parse: ["roles", "users"],
        repliedUser: false,
      },
      presence: {
        activities: [
          {
            name: process.env.STATUS,
            type: ActivityType[process.env.STATUS_TYPE],
          },
        ],
        status: PresenceUpdateStatus.Online,
      },
    };

    super({ ...defaultOptions, ...options });

    this.commands = new Collection();
    this.slashCommands = new Collection();
    this.slashArray = [];
    this.utils = new BotUtils(this);

    this.start();
  }

  async start() {
    console.log('start');
    await this.loadHandlers();
    await this.loadEvents();
    await this.loadCommands();
    await this.loadSlashCommands();

    this.login(process.env.BOT_TOKEN);
  }

  klk() {
    return 'klk';
  }

  async loadCommands() {
    console.log(`(${process.env.PREFIX}) Loading Commands`.yellow);
    this.commands.clear();

    const FILES_PATH = await this.utils.loadFiles("/src/commands");

    if (FILES_PATH.length) {
      FILES_PATH.forEach((filePath) => {
        try {
          const COMMAND = require(filePath);
          const COMMAND_NAME = filePath.split(/[\\/]/).pop().split(".")[0];
          COMMAND.NAME = COMMAND_NAME;

          if (COMMAND_NAME) this.commands.set(COMMAND_NAME, COMMAND);
        } catch (e) {
          console.log(`ERROR LOADING FILE [${filePath}]`.bgRed);
          console.log(e);
        }
      });
    }

    console.log(
      `(${process.env.PREFIX}) ${this.commands.size} Commands Loaded`.green
    );
  }

  async loadSlashCommands() {
    console.log(`(/) Loading Slash Commands`);
    this.slashCommands.clear();
    this.slashArray = [];

    const FILES_PATH = await this.utils.loadFiles("/src/slashCommands");

    if (FILES_PATH.length) {
      FILES_PATH.forEach((filePath) => {
        try {
          const COMMAND = require(filePath);
          const COMMAND_NAME = filePath.split(/[\\/]/).pop().split(".")[0];
          COMMAND.CMD.NAME = COMMAND_NAME;

          if (COMMAND_NAME) this.slashCommands.set(COMMAND_NAME, COMMAND);

          this.slashArray.push(COMMAND.CMD.toJSON());
        } catch (e) {
          console.log(`ERROR LOADING FILE [${filePath}]`);
          console.log(e);
        }
      });
    }

    if (this.application?.commands) {
      this.application.commands.set(this.slashArray);
      console.log(`(-) ${this.slashCommands.size} Slash Commands Loaded`);
    }
  }

  async loadHandlers() {
    console.log(`(-) Loading Commands`.yellow);
    this.slashCommands.clear();
    this.slashArray = [];

    const FILES_PATH = await this.utils.loadFiles("/src/slashCommands");

    if (FILES_PATH.length) {
      FILES_PATH.forEach((filePath) => {
        try {
          const COMMAND = require(filePath)(this);
          const COMMAND_NAME = filePath.split(/[\\/]/).pop().split(".")[0];

          if (COMMAND_NAME) this.slashCommands.set(COMMAND_NAME, COMMAND);

          this.slashArray.push(COMMAND.CMD.toJSON());
        } catch (e) {
          console.log(`ERROR LOADING FILE [${filePath}]`.bgRed);
          console.log(e);
        }
      });
    }

    console.log(`(/) ${this.slashCommands.size} Commands Loaded`.green);

    if (this.application?.commands) {
      this.application.commands.set(this.slashArray);
      console.log(`(/) ${this.slashCommands.size} Handlers Loaded`.green);
    }
  }

  async loadEvents() {
    console.log(`(+) Loading Events`.yellow);

    const FILES_PATH = await this.utils.loadFiles("/src/events");
    this.removeAllListeners();

    if (FILES_PATH.length) {
      FILES_PATH.forEach((filePath) => {
        try {
          const EVENT = require(filePath);
          const EVENT_NAME = filePath.split(/[\\/]/).pop().split(".")[0];
          this.on(EVENT_NAME, EVENT.bind(null, this));
        } catch (e) {
          console.log(`ERROR LOADING FILE [${filePath}]`.bgRed);
          console.log(e);
        }
      });
    }

    console.log(`(+) ${this.listenerCount()} Events Loaded`.green);
  }
}

module.exports = MyClient;
