module.exports = client => {
  console.log(`Wenaaaaaaas, soy ${client.user.tag}`);
  if (client?.application?.commands) {
    client.aplication.commands.set(this.slashArray);
    console.log(`(/) ${this.slashCommands.size} Handlers Loaded`.green);
  }
}