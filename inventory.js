import fs from "fs";
import chalk from "chalk";
import { load } from "cheerio";
import { readFile } from "fs/promises";

export const processInventory = async () => {
  console.log(chalk.yellow("Processing inventory history..."));

  try {
    const data = await readFile("./input/input.html", "utf8");
    const $ = load(data);
    const events = [];

    const rows = $(".tradehistoryrow").toArray();

    for (const row of rows) {
      const date = $(row).find(".tradehistory_date").text().trim();
      const time = $(row).find(".tradehistory_timestamp").text().trim();
      const eventDescription = $(row).find(".tradehistory_event_description").text().trim();

      const items = [];
      $(row)
        .find(".tradehistory_items_group")
        .each((j, itemGroup) => {
          $(itemGroup)
            .find(".history_item")
            .each((k, item) => {
              const itemName = $(item).find(".history_item_name").text().trim();
              if ($(item).data("appid") !== 730) return;
              items.push(itemName);
            });
        });

      if (["Unlocked a container", "Crafted"].includes(eventDescription)) {
        const richEvent = await richEventInfo(eventDescription, items);
        events.push({
          date: date.split("\t")[0],
          time,
          ...richEvent,
        });
      }
    }

    await fs.promises.writeFile("./data/inventory_history.json", JSON.stringify(events, null, 2));
    console.log("Transactions successfully saved to data/inventory_history.json");

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error(chalk.red("Error processing inventory history:"), error);
    return {
      success: false,
      error,
    };
  }
};

const richEventInfo = async (event, items) => {
  if (event === "Unlocked a container") {
    const caseName = items.find((item) => item.includes("Key")) ?? "";
    const weapon = items.find((item) => item.includes(" | ")) ?? "";

    return {
      event: "Unboxed",
      case: caseName.split("Key")[0]?.trim() ?? "",
      weapon: weapon.split(" | ")[0]?.trim() ?? "",
      skin: weapon.split(" | ")[1]?.trim() ?? "",
      full_name: weapon,
      rarity: await rarityLookup(
        weapon.replace("StatTrak™ ", "").replace("Souvenir ", "").replace("★ ", "")
      ),
    };
  } else if (event === "Crafted") {
    const winner = items[0];
    return {
      event: "Trade-up Contract",
      winning_item: winner,
      traded_items: items.slice(1),
    };
  }
};

const rarityLookup = async (skinName) => {
  try {
    const file_data_raw = await readFile("./data/case_data.json", "utf8");
    const case_data = JSON.parse(file_data_raw);

    for (const caseItem of case_data.Cases) {
      for (const marketPlace of caseItem.MarketPlaces) {
        const skin = marketPlace.Skins.find((s) => s.Name === skinName);
        if (skin) return skin.Rarity;
      }
    }
  } catch (err) {
    console.error(
      "Error reading or parsing case data file. Try running the update:cases script and try again."
    );
  }
  return null;
};
