import { OnTransactionHandler } from '@metamask/snaps-types';
import { panel, text, divider } from '@metamask/snaps-ui';
import {
  createSupabaseClient,
  estimateRewardPoints,
  validateShortcut,
} from './helpers';

export const onTransaction: OnTransactionHandler = async ({ transaction, chainId }) => {
  const supabase = await createSupabaseClient();
  const { data: shortcuts } = await supabase.from('shortcuts').select('*');
  const validatedShortcutData = validateShortcut(
    shortcuts,
    transaction.to as string,
  );
  
  if(chainId !== '1') {
    return {
      content: panel([
        divider(),
        text(`Shortcuts availabe ONLY`),        
        text(`for MAINNET addresses`),
        divider(),
      ]),
    };
  }

  if (validatedShortcutData) {
    const estimatedPoints = await estimateRewardPoints(
      transaction?.to,
      transaction?.value,      
      validatedShortcutData,
      supabase
    );
    return {
      content: panel([
        text(`Shortcut: ${validatedShortcutData.ens_name}`),
        divider(),
        text(`Contract: ${validatedShortcutData.address}`),
        divider(),
        text(`Verified by ONTHIS ✅`),        
        divider(),
        text(`Est. Points Receive: ${estimatedPoints}`)
      ]),
    };
  }

  return {
    content: panel([
      text(`CONTRACT ${transaction?.to} IS NOT VERIFI12ED BY ONTHIS ❌`),
      divider(),
      text(`Visit https://onthis.xyz/shortcuts`),
      text(`To see all verified shortcuts`),
    ]),
  };
};
