import { createClient } from '@supabase/supabase-js';

export const validateShortcut = (shortcuts: any, to: string) => {
  return shortcuts.find(
    (i: any) => i.address.toLowerCase() === to.toLowerCase(),
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
):Promise<string>  => {
  const { data: stage } = await supabase
    .from('points_distribution_state')
    .select('*');

  return stage.length
    ? (value * validatedShortcutData.complexity * stage[0].stage_multiplier / 10**19).toFixed(0)
    : "0";
};
