export const routes = {
  '#forms': () => import('./pages/forms/index.js'),
  '#lazy-loading': () => import('./pages/lazy-loading/index.js'),
  '#drag-and-drop': () => import('./pages/drag-and-drop/index.js'),
  '#debounce': () => import('./pages/debounce/index.js'),
  '#throttle': () => import('./pages/throttle/index.js'),
};

export function navigate(hash) {
  const route = routes[hash];
  if (route) {
    route().then(module => module.default());
  }
}