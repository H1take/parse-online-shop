const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");

const link = "https://www.muztorg.ru/category/klassicheskie-gitary?page=";

const parse = async () => {
  try {
    let result = [];
    let page = 1;
    let flag = false;

    while (true) {
      await axios
        .get(link + page)
        .then((res) => res.data)
        .then((res) => {

          let html = res;
          $ = cheerio.load(html);
          let pagination = $("li.next.disabled").html();

          $(html).find("section.product-thumbnail").each((i, elem) => {
            let item = {
                name: $(elem).find("div.title").text().replace(/\s+/g, ""),
                price: $(elem).find("p.price").text().replace(/\s+/g, ""),
                img: $(elem).find("img.img-responsive").attr("data-src")
            }

            result.push(item);
            console.log(item);
          });

          if (pagination !== null) {
            flag = true;
          }

        }).catch((err) => console.log("Response error - ", err));

      if (flag) {

        fs.writeFile('muztorg.json', JSON.stringify(result), (err) => {
            if (err) throw err;

            console.log("Saved new file muztorg.json")
        });

        break;
      }

      page++;
    }
  } catch (err) {
    console.log("Error - ", err);
  }
};

parse();
