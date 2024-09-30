async function parseTariffs(json_rp_available_api) {
    const response = json_rp_available_api.data.attributes.tariffs;
    const dict_rp_available = {};

    for (let i = 0; i < response.length; i++) {
        for (let z = 0; z < response[i].tariffInfo.length; z++) {
            const groupType = response[i].tariffInfo[z].productOffering.groupType;
            const nameRp = response[i].tariffInfo[z].productOffering.name;
            let description = response[i].tariffInfo[z].productOffering.description;
            description = description.replace(/\xa0/g, ' ');

            dict_rp_available[nameRp] = [groupType.trim(), description.trim()];

            const rcValue = response[i].tariffInfo[z].productOffering.prices[0].value;
            dict_rp_available[nameRp.trim()].push(rcValue.trim());
        }
    }

    console.log(dict_rp_available)
    return dict_rp_available;
}

module.exports = { parseTariffs} 