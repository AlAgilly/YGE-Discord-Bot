// require('dotenv').config();
// const Discord = require('discord.js');


// const { Client, Intents } = require('discord.js');
const { getDiscordUsernames, updateRoles } = require('./notion');

// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require('discord.js');
// const { token } = require('./config.json');
require('dotenv').config();
// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });
const cron = require('node-cron')

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});


async function update() {
  try {
    const usernames = await getDiscordUsernames();

    const guildId = '1155742859903914014';
    const roleId = '1171272378790191104';
    const guild = client.guilds.cache.get(guildId);
    const role = guild.roles.cache.get(roleId);

    await guild.members.fetch();
    await updateRoles(usernames, guild, role);
    console.log('Roles updated successfully!');
    // await client.destroy();

  } catch (error) {
    console.error('Error updating roles:', error);
    console.log('An error occurred while updating roles.');
  }
}

cron.schedule('* * * * *', () => {
  console.log('Updating roles');
  update();
});

client.login(process.env.DISCORD_TOKEN);
