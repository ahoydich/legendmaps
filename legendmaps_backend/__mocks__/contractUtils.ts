export const LEGENDMAPS_CONTRACT_ADDRESS = {} as any;
export const ADVENTURERS_CONTRACT_ADDRESS = {} as any;
export const PARTNER_CONTRACT_ADDRESSES = {} as any;
export async function getLegendMapsContract(_: any) { return {} as any; }
export async function getAdventurersContract(_: any) { return {} as any; }
export async function getProjectContract(_: any) { return {} as any; }
export async function checkProjectOwnership(_: any, __: any, ___: any) { return false; }
export async function getTokenOwnerByProject(_: any, __: any, ___: any) { return "0x0"; }
export async function checkAdventurerOwnership(_: any, __: any, ___: any) { return true; }
export async function checkAdventurerOwnershipDB(_: any, __: any) { return true; }
export async function getTokenOwner(_: any, __: any) { return "0x0"; }
export async function getMapOwner(_: any, __: any) { return "0x0"; }
export async function getHasPowerup(_: any, __: any) { return true; }
export async function getRandomPowerup(_: any) { return null; }
export async function getMapTokenUris(_: any, __: any) { return { legendmaps: [] }; }
export async function getAdventurerTokenUris(_: any, __: any) { return { adventurers: [] }; }
export async function getCCTokenUris(_: any, __: any) { return { adventurers: [] }; }
export async function getFRWCTokenUris(_: any, __: any) { return { adventurers: [] }; }
export function getProvider() { return { getNetwork: async () => ({ chainId: 1 }) } as any; }
export async function getCurrentNonce(_: any) { return 0; }
export async function generateTokenContractSignature(_: any, __: any, ___: any) { return { signature: "0x", nonce: 0 }; }