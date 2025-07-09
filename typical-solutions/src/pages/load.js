export default async function load(pageName, callback) {
  const templateModule = await import(`./${pageName}/template.html?raw`);
  const template = templateModule.default;

  await import(`./${pageName}/style.scss`);

  const app = document.getElementById('app');
  app.innerHTML = template;

  if (callback && typeof callback === 'function') {
    callback();
  }
}