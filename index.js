  require("dotenv").config();
  console.log("Hi");
  //Defining dependencies
  const { Client, Collection } = require('discord.js');
  const { PREFIX } = require('./config.js');
  const discord = require("discord.js");
  const moment = require("moment");
  const ms = require('ms');
  const pms = require('pretty-ms');
  const { LeftImage, JoinImage } = require("./config.json");
  const canvas = require ("discord-canvas");
  const Canvas = require("canvas");
  const Discord = require("discord.js");
  const { MessageEmbed } = require("discord.js");
  const format = require(`humanize-duration`);
  const fetch = require("node-fetch");
  const config = require("./config.json");
  const wb = require("quick.db");
  const bot = new Client({ disableMentions: 'everyone',
    partials: ["MESSAGE", "CHANNEL", "REACTION"]
  });
  const fs = require("fs");
  const db = require('old-wio.db');
  const emojis = require("./emojis.json");
  const Keep_alive = require("./Keep_alive.js")
/////////
  bot.on('run', () => {
    const express = require('express')
    const app = express();
    const port = 3000;

    app.get('/', (req, res) => res.send('Bot is Online'))


    app.listen(port, () => {
      console.log(`Your app is listening at http://localhost:${port}`);
    })
  });
///////streaming status
bot.on("ready", () => {
  console.log(`[INFO]: Ready on client (${bot.user.tag})`);
  console.log(
    `[INFO]: Playing ${bot.guilds.cache.size} Servers, ${
      bot.channels.cache.size
    } channels & ${bot.users.cache.size} users`
  );
  console.log('-------------------------------------');
  const botpresence = bot.config.activity;

  const active = botpresence.replace(/{server}/g, `${bot.guilds.cache.size}`).replace(/{channels}/g, `${bot.channels.cache.size}`).replace(/{users}/g, `${bot.guilds.cache.reduce((users , value) => users + value.memberCount, 0)}`).replace(/{prefix}/g, `${PREFIX}`);

  const bottype = bot.config.type;

  bot.user.setPresence({
    status: bot.config.status,
    activity: {
        name: active,
        type: bottype
    }
  });
});
////////
client.login("ODM5NDE2MDg0NzY3MDQ3NzEw.GRxRVw.FfdkhPsjt9yzpCOOzJihnXWsyhnFNnbLE9MDrY")


////////
bot.commands = new Collection();
bot.aliases = new Collection();
bot.emotes = emojis;
bot.config = config;

["aliases", "commands"].forEach(cmd => bot[cmd] = new Discord.Collection());
bot.categories = fs.readdirSync("./commands/");
["command"].forEach(handler => {
    require(`./handlers/${handler}`)(bot);
});

bot.queue2 = new Map();
bot.queue3 = new Map();
bot.queue = new Map();
bot.games = new Map();

const Enmap = require("enmap");

bot.setups = new Enmap({ name: "setups", dataDir: "./databases/setups" }); 

bot.on("message", async message => {
 
 
  if (message.author.bot || !message.guild || message.webhookID) return;
  
  let Prefix = await db.fetch(`prefix_${message.guild.id}`);
  if (!Prefix) Prefix = PREFIX;

const mentionRegex = RegExp(`^<@!?${bot.user.id}>$`);
     
  if (message.content.match(mentionRegex)) {
    message.channel.send(
      new Discord.MessageEmbed()
      .setThumbnail(`${message.author.displayAvatarURL({ dynamic: true })}`)
      .setDescription(`Hey <@${message.author.id}>, My prefix for this guild is \`\`\`${Prefix}\`\`\`.Use \`\`\`${Prefix}help\`\`\` or <@${bot.user.id}> help to get a list of commands`)
       .setColor("RANDOM")
       .setFooter(`Requested by ${message.author.username}`)
       .setTimestamp()
  )};

  if(db.has(`afk-${message.author.id}+${message.guild.id}`)) {
        const info = db.fetch(`afk-${message.author.id}+${message.guild.id}`)
        await db.delete(`afk-${message.author.id}+${message.guild.id}`)
        await db.delete(`aftime-${message.author.id}+${message.guild.id}`)
        message.channel.send(`Welcome back ${message.author.username}, Great to see you!!`)
    }
    //checking for mentions
    if(message.mentions.members.first()) {
        if(db.has(`afk-${message.mentions.members.first().id}+${message.guild.id}`)) {
          const reason = db.fetch(`afk-${message.mentions.members.first().id}+${message.guild.id}`);
          let time = db.fetch(`aftime-${message.mentions.members.first().id}+${message.guild.id}`);
				time = Date.now() - time;
           return message.channel.send(`**${message.mentions.members.first().user.username} is now afk - ${reason} - ${format(
						time
					)} ago**`);
        }
    }
    
    const escapeRegex = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const prefixRegex = new RegExp(`^(<@!?${bot.user.id}>|${escapeRegex(Prefix)})\\s*`);

    if(!prefixRegex.test(message.content)) return;

    const [, matchedPrefix] = message.content.match(prefixRegex);
     Prefix = matchedPrefix;

    
    if(!message.content.startsWith(Prefix)) return;
    
     if (!message.guild.me.permissionsIn(message.channel).has("EMBED_LINKS"))
        return message.reply("**:x: I am missing the Permission to `EMBED_LINKS`**");

  let args = message.content
    .slice(matchedPrefix.length)
    .trim()
    .split(/ +/g);
  let cmd = args.shift().toLowerCase();
  
  if (cmd.length === 0) return;

  let cmdx = wb.fetch(`cmd_${message.guild.id}`)

  if (cmdx) {
    let cmdy = cmdx.find(x => x.name === cmd)
    if (cmdy) message.channel.send(cmdy.responce.replace(/{user}/g, `${message.author}`)

	 .replace(/{user_tag}/g, `${message.author.tag}`)
        .replace(/{user_name}/g, `${message.author.username}`)
        .replace(/{user_ID}/g, `${message.author.id}`)
        .replace(/{guild_name}/g, `${message.guild.name}`)
        .replace(/{guild_ID}/g, `${message.guild.id}`)
        .replace(/{memberCount}/g, `${message.guild.memberCount}`)
        .replace(/{size}/g, `${message.guild.memberCount}`)
        .replace(/{guild}/g, `${message.guild.name}`)
        .replace(/{member_createdAtAgo}/g, `${moment(message.author.createdTimestamp).fromNow()}`)
        .replace(/{member_createdAt}/g, `${moment(message.author.createdAt).format('MMMM Do YYYY, h:mm:ss a')}`)
  )};
  
  let ops = {
            queue2: bot.queue2,
            queue: bot.queue,
            queue3: bot.queue3,
            games: bot.games
        }

  let command =
    bot.commands.get(cmd) || bot.commands.get(bot.aliases.get(cmd));
  
  if (!message.guild.me.hasPermission("SEND_MESSAGES")) return;

  if (!command)
    return;

   if (command) {
     command.run(bot, message, args, ops);
   } else {
     command.run(bot, message, args)
   }
   
});

/////////// Level feild
bot.on('message', async message => {
    let prefix;
    if (message.author.bot || message.channel.type === "dm") return;
        try {
            let fetched = await db.fetch(`prefix_${message.guild.id}`);
            if (fetched == null) {
                prefix = PREFIX
            } else {
                prefix = fetched
            }
        } catch (e) {
            console.log(e)
    };

    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let messageFetch = db.fetch(`guildMessages_${message.guild.id}`)
    if (messageFetch === null) return;

    db.add(`messages_${message.guild.id}_${message.author.id}`, 1)
    let messagefetch = db.fetch(`messages_${message.guild.id}_${message.author.id}`)

    let messages;
    if (messagefetch == 0) messages = 0; //Level 0
    else if (messagefetch == 100) messages = 100; // Level 1
    else if (messagefetch == 200) messages = 200; // Level 2
    else if (messagefetch == 300) messages = 300; // Level 3
    else if (messagefetch == 400) messages = 400; // Level 4
    else if (messagefetch == 500) messages = 500; // Level 5
    else if (messagefetch == 600) messages = 600; // Level 6
    else if (messagefetch == 700) messages = 700; // Level 7
    else if (messagefetch == 800) messages = 800; // Level 8
    else if (messagefetch == 900) messages = 900; // Level 9
    else if (messagefetch == 1000) messages = 1000; // Level 10
    else if (messagefetch == 1100) messages = 1100; // Level 11
    else if (messagefetch == 1200) messages = 1200; // Level 12
    else if (messagefetch == 1300) messages = 1300; // Level 13
    else if (messagefetch == 1400) messages = 1400; // Level 14
    else if (messagefetch == 1500) messages = 1500; // Level 15
    else if (messagefetch == 1600) messages = 1600; // Level 16
    else if (messagefetch == 1700) messages = 1700; // Level 17
    else if (messagefetch == 1800) messages = 1800; // Level 18
    else if (messagefetch == 1900) messages = 1900; // Level 19
    else if (messagefetch == 2000) messages = 2000; // Level 20
    else if (messagefetch == 2100) messages = 2100; // Level 21
    else if (messagefetch == 2200) messages = 2200; // Level 22
    else if (messagefetch == 2300) messages = 2300; // Level 23
    else if (messagefetch == 2400) messages = 2400; // Level 24
    else if (messagefetch == 2500) messages = 2500; // Level 25
    else if (messagefetch == 2600) messages = 2600; // Level 26
    else if (messagefetch == 2700) messages = 2700; // Level 27
    else if (messagefetch == 2800) messages = 2800; // Level 28
    else if (messagefetch == 2900) messages = 2900; // Level 29
    else if (messagefetch == 3000) messages = 3000; // Level 30
    else if (messagefetch == 3100) messages = 3100; // Level 31
    else if (messagefetch == 3200) messages = 3200; // Level 32
    else if (messagefetch == 3300) messages = 3300; // Level 33
    else if (messagefetch == 3400) messages = 3400; // Level 34
    else if (messagefetch == 3500) messages = 3500; // Level 35
    else if (messagefetch == 3600) messages = 3600; // Level 36
    else if (messagefetch == 3700) messages = 3700; // Level 37
    else if (messagefetch == 3800) messages = 3800; // Level 38
    else if (messagefetch == 3900) messages = 3900; // Level 39
    else if (messagefetch == 4000) messages = 4000; // Level 40
    else if (messagefetch == 4100) messages = 4100; // Level 41
    else if (messagefetch == 4200) messages = 4200; // Level 42
    else if (messagefetch == 4300) messages = 4300; // Level 43
    else if (messagefetch == 4400) messages = 4400; // Level 44
    else if (messagefetch == 4500) messages = 4500; // Level 45
    else if (messagefetch == 4600) messages = 4600; // Level 46
    else if (messagefetch == 4700) messages = 4700; // Level 47
    else if (messagefetch == 4800) messages = 4800; // Level 48
    else if (messagefetch == 4900) messages = 4900; // Level 49
    else if (messagefetch == 5000) messages = 5000; // level 50

    if (!isNaN(messages)) {
        db.add(`level_${message.guild.id}_${message.author.id}`, 1)
        let levelfetch = db.fetch(`level_${message.guild.id}_${message.author.id}`)

        let levelembed = new MessageEmbed()
            .setColor('GREEN')
            .setDescription(`**${message.author}, You Have Leveled Up To Level ${levelfetch}**`)
            .setFooter(`${prefix}disablexp To Disable Level Up Messages`)
        message.channel.send(levelembed);
    };
});
///////////

bot.on("message", async message => {
      let disabled = new MessageEmbed()
    .setColor("#FF0000")
    .setDescription("Chat Bot is disabled by the Owner in this Server!")
    .setFooter(`Requested by ${message.author.username}`)
  
        if(message.author.bot || !message.guild) return;
        bot.setups.ensure(message.guild.id,  {
          enabled: false,
          channel: "",
      }, "aichatsystem");
       
        let chatbot = bot.setups.get(message.guild.id, "aichatsystem");
      
    if(message.channel.id == chatbot.channel){
      if(!chatbot.enabled) return message.author.send(disabled).catch(e => console.log(e));
      
      if(message.attachments.size > 0)
        return message.channel.send("Hey buddy! I cannot read files :(\nPlease try to keep it in chat..")
     
      fetch(`http://api.brainshop.ai/get?bid=${bot.config.bid}&key=${bot.config.key}&uid=1&msg=${encodeURIComponent(message)}`)
     .then(res => res.json())
     .then(data => {
     message.channel.send(new MessageEmbed()
     .setTitle(bot.user.username, bot.user.displayAvatarURL())
     .setDescription(`Your Message : **${message}**\nMy Message : **${data.cnt}**`)
     .setColor("RANDOM")
     .setFooter(`Talking with ${message.author.username}`, message.author.displayAvatarURL({
       dynamic: true
     }))
     ).catch(e => console.log(e));
     });
    }
});

bot.on("guildMemberAdd", async member => {
  if(!member.guild) return;
//autorole -->
bot.setups.ensure(member.guild.id, {
  roles: []
}, "welcome");

let roles = bot.setups.get(member.guild.id, "welcome.roles");
      
      if(roles.length >= 1) {

        for(let i = 0; i < roles.length; i++){
          try{
            
            let roleadd = member.guild.roles.cache.get(roles[i])
             member.roles.add(roleadd.id);
          } catch (e) {
            console.log(e)
          } 
        }
        }
  let toggle = await db.fetch(`Weltog_${member.guild.id}`);
  let togEm = await db.fetch(`Welemtog_${member.guild.id}`);
  
  //code -->
  
  
  if(toggle === true) {
    
    if (togEm === true) {
      try {
      let sChannel = await db.fetch(`Welcome_${member.guild.id}_Channel`);
  if (!sChannel) return;
  let sMessage = await db.fetch(`Welcome_${member.guild.id}_Msg`);
  if (!sMessage) sMessage = `Welcome To The Server!`;
  let sWelcomeImage = await db.fetch(`WelIm_${member.guild.id}`);
  
  if (member.user.username.length > 25) member.user.username = member.user.username.slice(0, 25) + "...";
  if (member.guild.name.length > 15) member.guild.name = member.guild.name.slice(0, 15) + "...";
  
  let sMsg = sMessage.replace(/{user}/g, `${member}`)
        .replace(/{user_tag}/g, `${member.user.tag}`)
        .replace(/{user_name}/g, `${member.user.username}`)
        .replace(/{user_id}/g, `${member.id}`)
        .replace(/{server_name}/g, `${member.guild.name}`)
        .replace(/{server_id}/g, `${member.guild.id}`)
        .replace(/{membercount}/g, `${member.guild.memberCount}`)
        .replace(/{guild}/g, `${member.guild.name}`)
        .replace(/{user_createdAgo}/g, `${moment(member.user.createdTimestamp).fromNow()}`)
        .replace(/{user_createdAt}/g, `${moment(member.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')}`);
        
  let sWelcomed = new canvas.Welcome();
  let sImage = await sWelcomed
  .setUsername(member.user.username)
  .setDiscriminator(member.user.discriminator)
  .setGuildName(member.guild.name)
  .setAvatar(member.user.displayAvatarURL({ dynamic: false, format: "jpg" }))
  .setMemberCount(member.guild.memberCount)
  .setBackground(sWelcomeImage || JoinImage)
  .toAttachment();
  
  let attachment = new Discord.MessageAttachment(sImage.toBuffer(), "welcome.png");
  
  const Embed = new MessageEmbed()
  .setDescription(sMsg)
  .attachFiles([attachment])
  .setImage('attachment://welcome.png')
  .setColor("RANDOM");
  return bot.channels.cache.get(sChannel).send(Embed);
  
      } catch (e) {
        console.log(e);
      }
  
    } else {
  
    try {
  let Channel = await db.fetch(`Welcome_${member.guild.id}_Channel`);
  if (!Channel) return;
  let Message = await db.fetch(`Welcome_${member.guild.id}_Msg`);
  if (!Message) Message = `Welcome To The Server!`;
  let WelcomeImage = await db.fetch(`WelIm_${member.guild.id}`);
  
  if (member.user.username.length > 25) member.user.username = member.user.username.slice(0, 25) + "...";
  if (member.guild.name.length > 15) member.guild.name = member.guild.name.slice(0, 15) + "...";
  
  let Msg = Message.replace(/{user}/g, `${member}`)
        .replace(/{user_tag}/g, `${member.user.tag}`)
        .replace(/{user_name}/g, `${member.user.username}`)
        .replace(/{user_id}/g, `${member.id}`)
        .replace(/{server_name}/g, `${member.guild.name}`)
        .replace(/{server_id}/g, `${member.guild.id}`)
        .replace(/{membercount}/g, `${member.guild.memberCount}`)
        .replace(/{guild}/g, `${member.guild.name}`)
        .replace(/{user_createdAgo}/g, `${moment(member.user.createdTimestamp).fromNow()}`)
        .replace(/{user_createdAt}/g, `${moment(member.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')}`)
        
  let Welcomed = new canvas.Welcome();
  let Image = await Welcomed
  .setUsername(member.user.username)
  .setDiscriminator(member.user.discriminator)
  .setGuildName(member.guild.name)
  .setAvatar(member.user.displayAvatarURL({ dynamic: false, format: "jpg" }))
  .setMemberCount(member.guild.memberCount)
  .setBackground(WelcomeImage || JoinImage)
  .toAttachment();
  
  let Attachment = new Discord.MessageAttachment(Image.toBuffer(), "Welcome.png");
  return bot.channels.cache.get(Channel).send(Msg, Attachment);

  } catch (e) {
    console.log(e);
  }
    }
  } else {
    return;
  }
  });

  bot.on("guildMemberRemove", async member => {
   
   let toggle = await db.fetch(`leavtog_${member.guild.id}`);
   let togEm = await db.fetch(`leavemtog_${member.guild.id}`);
   
   if(toggle === true) {
     
     if (togEm === true) {
     
      try {
      let sChannel = await db.fetch(`Leave_${member.guild.id}_Channel`);
  if (!sChannel) return;
  let sMessage = await db.fetch(`Leave_${member.guild.id}_Msg`);
  if (!sMessage) sMessage = `${member.user.username} Has Left The Server!`;
  let sLeaveImage = await db.fetch(`Leaveim_${member.guild.id}`);
  
  if (member.user.username.length > 25) member.user.username = member.user.username.slice(0, 25) + "...";
  if (member.guild.name.length > 15) member.guild.name = member.guild.name.slice(0, 15) + "...";
  
  let sMsg = sMessage.replace(/{user}/g, `${member}`)
        .replace(/{user_tag}/g, `${member.user.tag}`)
        .replace(/{user_name}/g, `${member.user.username}`)
        .replace(/{user_id}/g, `${member.id}`)
        .replace(/{server_name}/g, `${member.guild.name}`)
        .replace(/{server_id}/g, `${member.guild.id}`)
        .replace(/{membercount}/g, `${member.guild.memberCount}`)
        .replace(/{guild}/g, `${member.guild.name}`)
        .replace(/{user_createdAgo}/g, `${moment(member.user.createdTimestamp).fromNow()}`)
        .replace(/{user_createdAt}/g, `${moment(member.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')}`);
        
  let sLeaved = new canvas.Goodbye();
  let sImage = await sLeaved
  .setUsername(member.user.username)
  .setDiscriminator(member.user.discriminator)
  .setGuildName(member.guild.name)
  .setAvatar(member.user.displayAvatarURL({ dynamic: false, format: "jpg" }))
  .setMemberCount(member.guild.memberCount)
  .setBackground(sLeaveImage || JoinImage)
  .toAttachment();
  
  let attachment = new Discord.MessageAttachment(sImage.toBuffer(), "leave.png");
  
  const Embed = new MessageEmbed()
  .setDescription(sMsg)
  .attachFiles([attachment])
  .setImage('attachment://leave.png')
  .setColor("RANDOM");
  return bot.channels.cache.get(sChannel).send(Embed);
  
      } catch (e) {
        console.log(e);
      }
     } else {
   try {
     
  let Channel = await db.fetch(`Leave_${member.guild.id}_Channel`);
  if (!Channel) return;
  let Message = await db.fetch(`Leave_${member.guild.id}_Msg`);
  if (!Message) Message = `${member.user.username} Has Left The Server!`;
 let LeaveImage = await db.fetch(`Leaveim_${member.guild.id}`);
  
  if (member.user.username.length > 25) member.user.username = member.user.username.slice(0, 25) + "...";
  if (member.guild.name.length > 15) member.guild.name = member.guild.name.slice(0, 15) + "...";
  
  let Msg = Message.replace(/{user}/g, `${member}`)
        .replace(/{user_tag}/g, `${member.user.tag}`)
        .replace(/{user_name}/g, `${member.user.username}`)
        .replace(/{user_id}/g, `${member.id}`)
        .replace(/{server_name}/g, `${member.guild.name}`)
        .replace(/{server_id}/g, `${member.guild.id}`)
        .replace(/{membercount}/g, `${member.guild.memberCount}`)
        .replace(/{guild}/g, `${member.guild.name}`)
        .replace(/{user_createdAgo}/g, `${moment(member.user.createdTimestamp).fromNow()}`)
        .replace(/{user_createdAt}/g, `${moment(member.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')}`);
        
  let Leaved = new canvas.Goodbye();
  let Image = await Leaved
  .setUsername(member.user.username)
  .setDiscriminator(member.user.discriminator)
  .setGuildName(member.guild.name)
  .setAvatar(member.user.displayAvatarURL({ dynamic: false, format: "jpg" }))
  .setMemberCount(member.guild.memberCount)
  .setBackground(LeaveImage || LeftImage)
  .toAttachment();
  
  let Attachment = new Discord.MessageAttachment(Image.toBuffer(), "leave.png");
  return bot.channels.cache.get(Channel).send(Msg, Attachment);

   } catch (e) {
    console.log(e);
  }
    }
  } else {
    return;
  }
  });

bot.on('guildMemberAdd', async member => {
    if(!member.guild) return;
	let age = await wb.get(`age.${member.guild.id}`);
	let logs = await wb.get(`logs.${member.guild.id}`);
	let punishment = wb.get(`punishment.${member.guild.id}`);
	let bypassed = await wb.get(`bypass.${member.guild.id}`);
	if(!bypassed.includes(member.id)) {
	
	let day = Number(age)
    let x = Date.now() - member.user.createdAt;
    let created = Math.floor(x / 86400000);
	
	if (day >= created) {
		member[punishment](
			`Alt detected - Account younger than ${day} days`
		);
		let channel = await bot.channels.cache.get(logs);
		let embed = new discord.MessageEmbed()
			.setTitle(`Suspicious! Account age less than ${day} days`)
			.addField(`Member Username`, member.toString())
			.addField(`Member ID`, member.id)
			.addField(
				`Account Age`, moment(member.user.createdAt).format('MMMM Do YYYY, h:mm:ss a'))
      .addField(`Punishment`, punishment)
			.setColor('#FF0000')
			.setFooter(
				member.guild.name,
				member.guild.iconURL({ dynamic: true })
			);
		if (channel) channel.send({ embed: embed });
	}
	}
});

function parseMs(str) {
		const parts = str.split(' ');
		const msParts = parts.map(part => ms(part));
		if (msParts.includes(undefined)) return undefined;
		const res = msParts.reduce((a, b) => a + b);
		return res;
	};

function decodeMs(num) {
		return pms(num);
	};

////hi

  bot.on("message", SHVAN => {
    if (SHVAN.content.startsWith("سڵاو")) {
      SHVAN.reply("**سلاو لەتۆی دل فەرموو ئەمرکە با من یان بۆتێکی کەخزمەتت بکات گەر ئیشێکت هەیە بە بۆتەکان ناکرێ رۆل بەدەستێک تاک بکە**");
    }
  });


  bot.on("message", SHVAN => {
    if (SHVAN.content.startsWith("سلاڤ")) {
      SHVAN.reply("**سلاو لەتۆی دل فەرموو ئەمرکە با من یان بۆتێکی کەخزمەتت بکات گەر ئیشێکت هەیە بە بۆتەکان ناکرێ رۆل بەدەستێک تاک بکە❤**");
    }
  });

  bot.on("message", SHVAN => {
    if (SHVAN.content.startsWith("slaw")) {
      SHVAN.reply("****سلاو لەتۆی دل فەرموو ئەمرکە با من یان بۆتێکی کەخزمەتت بکات گەر ئیشێکت هەیە بە بۆتەکان ناکرێ رۆل بەدەستێک تاک بکە❤****");
    }
  });

  bot.on("message", SHVAN => {
    if (SHVAN.content.startsWith("سلاو")) {
      SHVAN.reply("**سلاو لەتۆی دل فەرموو ئەمرکە با من یان بۆتێکی کەخزمەتت بکات گەر ئیشێکت هەیە بە بۆتەکان ناکرێ رۆل بەدەستێک تاک بکە❤**");
    }
  });


  bot.on("message", SHVAN => {
    if (SHVAN.content.startsWith("just showed up!")) {
      SHVAN.reply("**Welcome I hope you have a good time Please read the rules**");
    }
  });


  bot.on("message", SHVAN => {
    if (SHVAN.content.startsWith("is here.")) {
      SHVAN.reply("**Welcome I hope you have a good time Please read the rules**");
    }
  });

  bot.on("message", SHVAN => {
    if (SHVAN.content.startsWith("just slid into the server.")) {
      SHVAN.reply("**Welcome I hope you have a good time Please read the rules**");
    }
  });

  bot.on("message", SHVAN => {
    if (SHVAN.content.startsWith("👋")) {
      SHVAN.reply("**Hello I hope you have a good time**");
    }
  });

  bot.on("message", SHVAN => {
    if (SHVAN.content.startsWith("Hello")) {
      SHVAN.reply("**Hello I hope you have a good time**");
    }
  });


  bot.on("message", SHVAN => {
    if (SHVAN.content.startsWith("Yo")) {
      SHVAN.reply("**Yoo I hope you have a good time**");
    }
  });


  bot.on("message", SHVAN => {
    if (SHVAN.content.startsWith("Hi")) {
      SHVAN.reply("**Hello I hope you have a good time**");
    }
});

///////nuke

  
////////
