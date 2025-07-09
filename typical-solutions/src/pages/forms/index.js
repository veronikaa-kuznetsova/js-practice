import load from '../load.js';

export default function Forms() {
  function serializeForm(formNode) {
    const data = new FormData(formNode);
    console.log(Array.from(data.entries()));
  }

  async function handleFormSubmit(event) {
    event.preventDefault();
    const data = serializeForm(event.target);

    const response = await sendData(data);
  }

  async function sendData(data) {
    return await fetch('', {
      method: 'POST',
      body: data,
    })
  }

  load('forms', () => {
    const form = document.querySelector('.form');
    if (form) {
      form.addEventListener('submit', handleFormSubmit);
    } else {
      console.error('Форма не найдена');
    }
  });
}