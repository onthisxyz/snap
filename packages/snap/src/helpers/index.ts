import { createClient } from '@supabase/supabase-js';

export const validateShortcut = (shortcuts: any, to: string) => {
  return shortcuts.find(
    (i: any) =>
      i.address?.toLowerCase() === to.toLowerCase() ||
      i.shortcut_address?.toLowerCase() === to.toLowerCase(),
  );
};

export const createSupabaseClient = async () => {
  return await createClient(
    'https://ogofkfgmjjhakgojhhiy.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nb2ZrZmdtampoYWtnb2poaGl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIzMjA2NzUsImV4cCI6MjAxNzg5NjY3NX0.ebyMLVX98bSCxBxMB2JGAQqF4h0XBEQzmBsCwM71rgg',
  );
};

export const estimateRewardPoints = async (
  value: any,
  validatedShortcutData: any,
  supabase: any,
): Promise<string> => {
  const { data: stage } = await supabase
    .from('points_distribution_state')
    .select('*');

  return stage.length
    ? (
        (value * validatedShortcutData.complexity * stage[0].stage_multiplier) /
        10 ** 19
      ).toFixed(0)
    : '0';
};

export const validateChain = (shortcutOriginChain: number, mmEip: string) => {
  const chainIds = new Map([
    ['eip155:e708', 59144],
    ['eip155:a4b1', 42161],
    ['eip155:89', 137],
    ['eip155:2105', 8453],
    ['eip155:a', 10],
    ['eip155:1', 1],
  ]);

  const cId = chainIds.get(mmEip);

  return cId == shortcutOriginChain;
};

export const getNameByChainEip = (eip: string) => {
  const address = new Map([
    ['eip155:e708', 'Linea'],
    ['eip155:a4b1', 'Arbitrum'],
    ['eip155:89', 'Polygon'],
    ['eip155:2105', 'Base'],
    ['eip155:a', 'Optimism'],
    ['eip155:1', 'Mainnet']
  ]);

  return address.get(eip);
};

export const getNameByChainId = (chainId: number) => {
  const address = new Map([
    [1, "Mainnet"],
    [42161, "Arbitrum"],    
    [8453, "Base"],
    [10, "Optimism"],
    [137, "Polygon"],
    [59144,'Linea']
  ]);

  return address.get(chainId);
};