const { Client: DiscordClient, Events, GatewayIntentBits } = require('discord.js');
const Discord = require('discord.js');
const { Client: NotionClient } = require('@notionhq/client')
require('dotenv').config();

const notion = new NotionClient({
  auth: process.env.NOTION_TOKEN,
});

async function getStaffUsernames() {
  const databaseId = process.env.NOTION_DATABASE_ID;

  const response = await notion.databases.query({
    database_id: databaseId,
    filter: {
        and: [
            {
                property: 'Status',
                select: {
                    is_empty: true
                }
            },
        ]
    },
  });

  const usernames = response.results.map((resp) => resp.properties.Discord?.rich_text[0]?.plain_text)
  return usernames;
}

  async function updateRoles(usernames, guild, role) {

    for (const member of guild.members.cache.values()) {
        const username = member.user.username;
        if (usernames.includes(username)) {
          // Add the specified role to the member
          if(member.roles.cache.find(r => r === role)) {
            // console.log(username + " already has staff role")
          } else {
            await member.roles.add(role);
            console.log(`Role added to ${username}`);
          }
        } else if(member.roles.cache.find(r => r === role)) {
          await member.roles.remove(role);
          console.log(`Role removed from ${username}`);
        }
      }
  }

module.exports = {
  getDiscordUsernames: getStaffUsernames,
  updateRoles,
};