import { OnTransactionHandler } from '@metamask/snaps-types';
import { heading, panel, text, divider } from '@metamask/snaps-ui';
import {
  createSupabaseClient,
  estimateRewardPoints,
  validateShortcut,
} from './helpers';

export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
  console.log('transactionTo:', transaction?.to);
  const supabase = await createSupabaseClient();

  const { data: shortcuts } = await supabase.from('shortcuts_info').select('*');
  console.log('q123');
  const validatedShortcutData = validateShortcut(
    shortcuts,
    transaction.to as string,
  );
  console.log('q123');
  if (validatedShortcutData) {
    const estimatedPoints = await estimateRewardPoints(
      transaction?.to,
      transaction?.value,
    );
    return {
      content: panel([
        text(`Shortcut: ${validatedShortcutData.ens_name}`),
        divider(),
        text(`Contract: ${validatedShortcutData.address}`),
        divider(),
        text(`Verified by ONTHIS ✅`),
        divider(),
        text(`Est points earning: ${(estimatedPoints[0] / 10 ** 18).toFixed(2)}`),
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
