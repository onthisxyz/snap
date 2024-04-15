import { OnTransactionHandler } from '@metamask/snaps-types';
import { panel, text, divider } from '@metamask/snaps-ui';
import {
  createSupabaseClient,
  estimateRewardPoints,
  getNameByChainEip,
  getNameByChainId,
  validateChain,
  validateShortcut,
} from './helpers';

export const onTransaction: OnTransactionHandler = async ({
  transaction,
  chainId,
}) => {
  const supabase = await createSupabaseClient();

  const { data: onthisShortcuts, error: er1 } = await supabase
    .from('shortcuts')
    .select('*')
    .eq('address', transaction?.to);
  const { data: communityEtfShortcuts, error: er2 } = await supabase
    .from('etf_shortcuts')
    .select('*')
    .eq('shortcut_address', transaction?.to);
  const { data: communityBridgeSwapShortcuts, error: er3 } = await supabase
    .from('bridge_swap_shortcuts')
    .select('*')
    .eq('shortcut_address', transaction?.to);

  if (er1 || er2 || er3)
    return {
      content: panel([
        divider(),
        text(`Error!`),
        text(`Please contract us`),
        divider(),
      ]),
    };
    console.log('transaction?.to',transaction?.to)
  console.log('onthisShortcuts', onthisShortcuts);
  console.log('communityBridgeSwapShortcuts', communityBridgeSwapShortcuts);
  console.log('communityEtfShortcuts', communityEtfShortcuts);
  if (
    !onthisShortcuts.length &&
    !communityBridgeSwapShortcuts.length &&
    !communityEtfShortcuts.length
  ) {
    return {
      content: panel([
        text(`ADDRESS ${transaction?.to} IS NOT VERIFIED BY ONTHIS ❌`),
        divider(),
        text(`Visit https://onthis.xyz/shortcuts`),
        text(`To see all verified shortcuts`),
      ]),
    };
  }
  let dataToValidate = [];

  if (communityEtfShortcuts.length > 0) {
    dataToValidate.push(
      ...communityEtfShortcuts?.map((i: any) => {
        const etfPools = JSON.parse(i.etfTokens);

        return {
          ...i,
          desciption: `Swaps your native value at ${etfPools.map(
            (item: any) =>
              `${item.pool} pool - ${item.percent * 10 ** 18}%`,
          )} at ${getNameByChainId(i.chain_id)}`,
        };
      }),
    );
  }
  if (communityBridgeSwapShortcuts.length > 0) {
    dataToValidate.push(
      ...communityBridgeSwapShortcuts?.map((i: any) => {
        return {
          ...i,
          desciption: `Bridges from ${getNameByChainId(
            i.origin_chain,
          )} to ${getNameByChainId(i.destination_chain)} and swap at ${
            i.pool
          } pool`,
        };
      }),
    );
  }
  if (onthisShortcuts.length > 0) {
    dataToValidate.push(...onthisShortcuts);
  }
  console.log('dataToValidate',dataToValidate)
  const validatedShortcutData = validateShortcut(
    dataToValidate,
    transaction.to as string,
  );
  console.log('validatedShortcutData',validatedShortcutData)
  const cId = validatedShortcutData?.origin_chain
    ? validatedShortcutData?.origin_chain
    : validatedShortcutData?.chain_id;

  if (!validateChain(cId, chainId)) {
    return {
      content: panel([
        divider(),
        text(`This Shortcuts availabe ONLY at`),
        text(
          `${getNameByChainId(
            cId,
          )} network, DO NOT SEND FUNDS FROM ${getNameByChainEip(chainId)}`,
        ),
        divider(),
      ]),
    };
  }
  if (validatedShortcutData) {
    const estimatedPoints = await estimateRewardPoints(
      transaction?.value,
      validatedShortcutData,
      supabase,
    );
    return {
      content: panel([
        text(
          `Shortcut: ${
            validatedShortcutData.ens_name
              ? validatedShortcutData.ens_name
              : 'No ens name found'
          }`,
        ),
        divider(),
        text(`Shortcut contract: ${transaction.to}`),
        divider(),
        text(
          ` ${
            validatedShortcutData.desciption
              ? ` Shortcut Description:` + validatedShortcutData.desciption
              : ' '
          }`,
        ),
        divider(),
        text(`Verified by ONTHIS ✅`),
        divider(),
        text(`Est. Points Receive: ${estimatedPoints}`),
      ]),
    };
  }

  return {
    content: panel([
      text(`CONTRACT ${transaction?.to} IS NOT VERIFIED BY ONTHIS ❌`),
      divider(),
      text(`Visit https://onthis.xyz/shortcuts`),
      text(`To see all verified shortcuts`),
    ]),
  };
};
