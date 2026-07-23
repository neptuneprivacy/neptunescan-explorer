export const MINER_CONFIG = [
    {
        minerID: "500e09a386ad3ac0b3562ac0b6d918a292fe2bc6dc5f8b81cc97adcf78faf98bac644ebff95199c8",
        name: "PoolHub",
        iconURL: "https://poolhub.io/assets/PH.png",
        website: "https://poolhub.io/pool-overview",
    },
    {
        minerID: "da81fe0cffddc643c59a1624e48349a85b86f1f99b28403a564c0087231882001df911a097f1349b",
        name: "PoolHub",
        iconURL: "https://poolhub.io/assets/PH.png",
        website: "https://poolhub.io/pool-overview",
    },
    {
        minerID: "8fbee79adc237ab71a578dedc063a436705ebe0a836af7a86756fc655d070d3cdeb596b9ec190840",
        iconURL: "https://drpool.io/logo.jpg",
        name: "DRPool",
        website: "https://drpool.io/",
    },
    {
        minerID: "0b336f2f6e2dd470f79b66df0fb1291b6099b614982d0c7dec5611d6940250550e2e5f7fb1f742ce",
        iconURL: "https://minerlab.io/favicon.ico",
        name: "MinerLab",
        website: "https://xnt.minerlab.io/",
    }
] 

export function getMinerConfigByID(minerID: string) {
    let minerConfig = MINER_CONFIG.find((config) => config.minerID === minerID);
    return minerConfig;
}