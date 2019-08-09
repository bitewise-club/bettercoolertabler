import axios from "axios";

//const SPOON_KEY = "da70221b4bfd4192922aa75c3f306071";
const SPOON_KEY = "e123b779a9f24070a3b93a3a3c8b7eb3";
const SPOON_URL = "https://api.spoonacular.com/food/";

async function findFirstEntryWithPrice(ingredient) {
    let numProducts = ingredient["products"].length;
    let lastPrice = 0;
    let index = 0;
    let lastResponse = undefined;
    while (lastPrice == 0 && index < numProducts && index < 1) {
        let response = await axios.get(SPOON_URL + "products/" + ingredient["products"][index]["id"]
            + "?apiKey=" + SPOON_KEY);

        lastResponse = response;

        let price = response.data["price"];
        lastPrice = price;

        index++;
    }

    console.log(lastResponse.data);

    return lastResponse.data;
}

async function priceProcess(ingredientList) {
    let ingredientNames = ingredientList.map(ingredient => ingredient.getName());

    let idResponse = (await axios.post(SPOON_URL + "ingredients/map?apiKey=" + SPOON_KEY, {
        "ingredients": ingredientNames,
        "servings": 1
    })).data;

    let idRequests = [];
    for (let ingredient of idResponse) {
        idRequests.push(
            findFirstEntryWithPrice(ingredient)
        );
    }

    let responses = await Promise.all(idRequests);

    return ingredientList.map((ingredient, index) => {
        ingredient.setPrice(responses[index]["price"]);
        ingredient.productName = responses[index]["title"];
        //ingredient.productImage = responses[index][""];
        return ingredient;
    });
}

export default priceProcess;