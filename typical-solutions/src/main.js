import { navigate } from './router.js';
import './style.scss';
window.addEventListener('load', () => {
  const hash = window.location.hash || '#forms';
  navigate(hash);
});
window.addEventListener('hashchange', () => {
  const hash = window.location.hash;
  navigate(hash);
});