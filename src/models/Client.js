const { Client, GatewayIntentBits, Partials, ActivityType, PresenceUpdateStatus, Collection } = require("discord.js");

module.exports = class extends Client {
  constructor(
    options = {
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
      ], 
      partials: [Partials.User, Partials.Channel, Partials.GuildMember, Partials.Message, Partials.Reaction],
      allowedMentions: {
        parse:["roles", "users"],
        repliedUser: false,
      },
      presence: {
        activities: [{name: process.env.STATUS, type: ActivityType[process.env.STATUS_TYPE]}],
        status: PresenceUpdateStatus.Online
      },
    }) {
      super({...options});
      this.commands = new Collection();
      this.slashCommands= new Collection();
      this.slashArray = [];
    }
  }
