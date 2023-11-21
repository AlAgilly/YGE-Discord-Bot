// require('dotenv').config();
// const Discord = require('discord.js');


// const { Client, Intents } = require('discord.js');
const { getDiscordUsernames: getStaffUsernames, updateRoles } = require('./notion');

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

async function getMembers(staffUsernames, guildid, roleid) {
  const guild = client.guilds.cache.get(guildid);
  const role = guild.roles.cache.get(roleid);
  await guild.members.fetch();
  await updateRoles(staffUsernames, guild, role);
}

async function update() {
  try {
    const staffUsernames = await getStaffUsernames();
    const playerUsernames = await getStaffUsernames();

    // TFT
    const serverTFT = '1155742859903914014';
    const roleTFT = '1171272378790191104';
    await getMembers(staffUsernames, serverTFT, roleTFT)
    console.log('TFT roles updated successfully!');

    // Valorant
    const serverVAL = '901275394517368842';
    const roleVAL = '919037546598629466';
    await getMembers(staffUsernames, serverVAL, roleVAL)
    console.log('VAL roles updated successfully!');

    // League of Legends
    const serverLOL = '1036869286356074516';
    const roleLOL = '1036869286356074519';
    await getMembers(staffUsernames, serverLOL, roleLOL)
    console.log('LOL roles updated successfully!');

    // Overwatch
    const serverOW = '1029476466402017473';
    const roleOW = '1163167721568088154';
    await getMembers(staffUsernames, serverOW, roleOW)
    console.log('OW roles updated successfully!');

    // // League of Legends
    // const serverLOL = '1036869286356074516';
    // const roleLOL = '1036869286356074519';
    // await getMembers(usernames, serverLOL, roleLOL)
    // console.log('LOL roles updated successfully!');

    // // League of Legends
    // const serverLOL = '1036869286356074516';
    // const roleLOL = '1036869286356074519';
    // await getMembers(usernames, serverLOL, roleLOL)
    // console.log('LOL roles updated successfully!');

    // // League of Legends
    // const serverLOL = '1036869286356074516';
    // const roleLOL = '1036869286356074519';
    // await getMembers(usernames, serverLOL, roleLOL)
    console.log('LOL roles updated successfully!');
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
