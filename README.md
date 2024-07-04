# CaseBuddy

### A CS:GO & CS2 Unbox History Data Extractor

This is a fairly simple Node utility that will extract case unboxing and trade-up history from your Steam Inventory History page. It will generate a JSON file containing machnine-readable data that can be used for further analysis.

Example Object generated for an Unboxed item:
```json
{
  "date": "Jul 2, 2024",
  "time": "8:54pm",
  "event": "Unboxed",
  "case": "Dreams & Nightmares Case",
  "weapon": "★ Shadow Daggers",
  "skin": "Autotronic",
  "full_name": "★ Shadow Daggers | Autotronic",
  "rarity": "Special"
}
```

Example Object generated for a Trade Up:
```json
{
  "date": "Jul 2, 2024",
  "time": "9:00pm",
  "event": "Trade-up Contract",
  "winning_item": "USP-S | Jawbreaker",
  "traded_items": [
    "P90 | Neoqueen",
    "SG 553 | Darkwing",
    "M4A1-S | Night Terror",
    "PP-Bizon | Space Cat",
    "PP-Bizon | Space Cat",
    "SCAR-20 | Enforcer",
    "SCAR-20 | Enforcer",
    "Sawed-Off | Analog Input",
    "Sawed-Off | Analog Input",
    "Sawed-Off | Analog Input"
  ]
}
```

> [!NOTE]
> Due to the way Steam loads inventory history, this utility is not able to extract the wear or float value of the items unboxed. This is a limitation of the Steam Inventory History page itself, and not the utility.


## Installation & Prerequisites

1. Clone the repository and run `npm install` to install the dependencies. Node >20 is recommended.
2. If this is your first time using the utility, you'll need to run the `npm run update:cases` command to fetch the latest case data from  [cases.jonesy.moe](https://github.com/jonese1234/Csgo-Case-Data) . This will populate the `data/case_data.json` file with the latest case data.
3. Open your Steam Inventory History page. Next, depending on how much history you want to analyze, keep scrolling down to the bottom and clicking load more until everything is loaded that you want. If you have an old Steam account or unbox a lot of cases, this could take quite a long time and is very tedious.
   * You can use this link to go directly to your inventory history: `https://steamcommunity.com/my/inventoryhistory/`
   * Alternatively, you can find it by going to your inventory page, click the three dot menu in the top right next to the trade offers button, and select "View Inventory History".
4. Next, right-click on the page and click "Save As" to save the page as a complete webpage. Save it in the `input/` folder of this project and re-name the html file to `input.html`.
   * Feel free to delete the extra folder containing images and other assets that are saved with the page. We only need the HTML file.

## Usage

1. Run the utility with `npm start`.
2. The utility will parse the HTML file and generate a JSON file to `data/inventory_history.json`.