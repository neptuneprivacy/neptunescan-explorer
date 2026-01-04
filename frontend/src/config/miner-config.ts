export const MINER_CONFIG = [
    {
        minerID: "500e09a386ad3ac0b3562ac0b6d918a292fe2bc6dc5f8b81cc97adcf78faf98bac644ebff95199c8",
        name: "PoolHub",
        iconURL: "https://poolhub.io/assets/PH.png",
        website: "https://poolhub.io/pool-overview",
    },
    {
        minerID: "8fbee79adc237ab71a578dedc063a436705ebe0a836af7a86756fc655d070d3cdeb596b9ec190840",
        iconURL: "https://drpool.io/logo.jpg",
        name: "DRPool",
        website: "https://drpool.io/",
    }
] 

export function getMinerConfigByID(minerID: string) {
    let minerConfig = MINER_CONFIG.find((config) => config.minerID === minerID);
    return minerConfig;
}