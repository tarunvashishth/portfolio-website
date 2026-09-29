import { urlFor } from './client';
import { toast } from './components/Toaster/Toaster';

export const imageUrl = (source, width) => {
  if (!source?.asset) return undefined;
  return urlFor(source).width(width).auto('format').url();
};

export const scrollToSection = (id) => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
};

export const copyToClipboard = async (text, message = 'Copied to clipboard') => {
  try {
    await navigator.clipboard.writeText(text);
    toast(message);
    return true;
  } catch (e) {
    toast("Couldn't copy — please select it manually");
    return false;
  }
};

export const isMac = () => /Mac|iPhone|iPad/.test(navigator.userAgentData?.platform || navigator.platform || '');

export const pad = (n) => String(n).padStart(2, '0');
