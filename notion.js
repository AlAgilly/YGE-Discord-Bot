// import { Client } from '@notionhq/client';
// import Discord from 'discord.js';

const { Client: DiscordClient, Events, GatewayIntentBits } = require('discord.js');
const Discord = require('discord.js');
const { Client: NotionClient } = require('@notionhq/client')
require('dotenv').config();

const notion = new NotionClient({
  auth: process.env.NOTION_TOKEN,
});

async function getDiscordUsernames() {
  const databaseId = process.env.NOTION_DATABASE_ID;

  // Fetch the Notion database and retrieve the usernames
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
//   .results.map((result) => result.properties.Username.title[0].text.content);
// console.log(usernames)
  return usernames;
}


  async function updateRoles(usernames, guild, role) {

    for (const member of guild.members.cache.values()) {
        const username = member.user.username;
        // Check if the member's username is in the notionUsernames array
        if (usernames.includes(username)) {
          // Add the specified role to the member
          await member.roles.add(role);
          console.log(`Role added to ${username}`);
        }
      }
  }

module.exports = {
  getDiscordUsernames,
  updateRoles,
};