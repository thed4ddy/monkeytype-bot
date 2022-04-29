/** @format */

import { Event } from "../interfaces/Event";

export default {
  event: "interactionCreate",
  run: async (client, interaction) => {
    if (interaction.isCommand() && interaction.channel?.type !== "DM") {
      const commandName = interaction.commandName;

      const command = client.commands.get(commandName);

      if (command === undefined) {
        interaction.reply("Could not find this command.");

        return;
      }

      if (
        !client.clientOptions.dev &&
        !client.permissionsAdded.has(interaction.guild?.id ?? "") &&
        command.name !== "unlock-commands"
      ) {
        interaction.reply(
          `:x: Commands have not been unlocked for this server.\nServer owner must run /unlock-commands to unlock commands`
        );

        return;
      }

      console.log(`Running command "${command.name}"`);
      try {
        await command.run(interaction, client);
      } catch (err) {
        console.log(
          `An error occured running command "${command.name}"\n${err}`
        );

        client.logInBotLogChannel(
          `:x: An error occured running command "${command.name}"\n${err}`
        );

        const msg = `:x: Unexpected error occured. Please report this.`;

        interaction.reply(msg).catch(() => {
          console.log("Couldn't reply, sending followUp instead.");

          interaction.followUp(msg).catch(console.log);
        });
      }
    } else if (interaction.isButton()) {
      console.log(`Button clicked "${interaction.customId}"`);
    }
  }
} as Event<"interactionCreate">;
