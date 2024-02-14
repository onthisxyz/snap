import { OnTransactionHandler } from '@metamask/snaps-types';
import { panel, text, divider } from '@metamask/snaps-ui';
import {
  createSupabaseClient,
  estimateRewardPoints,
  validateShortcut,
} from './helpers';

export const onTransaction: OnTransactionHandler = async ({ transaction, chainId }) => {
  if(chainId !== 'eip155:1') {
    return {
      content: panel([
        divider(),
        text(`Shortcuts availabe ONLY`),        
        text(`for MAINNET addresses`),
        divider(),
      ]),
    };
  }

  const supabase = await createSupabaseClient();
  const { data: shortcuts } = await supabase.from('shortcuts').select('*');
  const validatedShortcutData = validateShortcut(
    shortcuts,
    transaction.to as string,
  );

  if (validatedShortcutData) {
    const estimatedPoints = await estimateRewardPoints(      
      transaction?.value,      
      validatedShortcutData,
      supabase
    );
    return {
      content: panel([
        text(`Shortcut: ${validatedShortcutData.ens_name}`),
        divider(),
        text(`Shortcut contract: ${transaction.to}`),
        divider(),
        text(`Verified by ONTHIS ✅`),        
        divider(),
        text(`Est. Points Receive: ${estimatedPoints}`)
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
