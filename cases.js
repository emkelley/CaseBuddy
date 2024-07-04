import fs from "fs";
import axios from "axios";

// Case data json file comes from the CS:GO Case ROIs project
// https://github.com/jonese1234/Csgo-Case-Data

const url = "https://raw.githubusercontent.com/jonese1234/Csgo-Case-Data/master/latest.json";

async function fetchLatestCsCaseData() {
  try {
    const response = await axios.get(url);
    const data = response.data;
    return data;
  } catch (error) {
    console.error("There has been a problem with the fetch operation:", error);
  }
}

const format = (latest) => {
  let data = [];
  latest.Cases.forEach((c) => {
    data.push({
      name: c.Name,
      pricing: c.MarketPlaces[0].Average,
      skins: c.MarketPlaces[0].Skins,
    });
  });

  return data;
};

const latest = await fetchLatestCsCaseData();
const new_data = format(latest);

fs.writeFile("./data/case_data.json", JSON.stringify(new_data, null, 2), (err) => {
  if (err) {
    console.error("Error writing file:", err);
  } else {
    console.log("Transactions successfully saved to case_data.json");
  }
});
