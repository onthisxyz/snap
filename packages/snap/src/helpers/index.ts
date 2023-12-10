import { ethers } from 'ethers';
import { ENS } from '@ensdomains/ensjs';
import { createClient } from '@supabase/supabase-js';
import abi from '../../abi/PointsDistributor.json';

export const validateShortcut = (shortcuts: any, to: string) => {
  return shortcuts.find(
    (i: any) => i.address.toLowerCase() === to.toLowerCase(),
  );
};

const getProvider = () => {
  return new ethers.providers.JsonRpcProvider(
    `https://eth-mainnet.g.alchemy.com/v2/H0EPsQJ2P_G89TbtjWux_6AJI1WR5pUr`,
  );
};

export const createSupabaseClient = async () => {
  return await createClient(
    'https://vmcqqamkkquopdyzdxnv.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtY3FxYW1ra3F1b3BkeXpkeG52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA3NjM5NTMsImV4cCI6MjAxNjMzOTk1M30.tDhro3SGZw6SbB5nxJxjPRrSgJE6oP0XZoqtDntQRI4',
  );
};

export const estimateRewardPoints = async (address: any, value: any) => {
  const pointsContract = new ethers.Contract(
    '0x60298a0A28df3a9fae38dd7f232144C8497c1fE1',
    abi,
    getProvider(),
  );
  
  const shortcut = await pointsContract.shortcuts(address);
  
  return await pointsContract.calculatePoints(value, shortcut.complexity);
};
