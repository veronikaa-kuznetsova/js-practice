import load from '../load.js';

export default function Forms() {
  async function handleFormSubmit(event) {
    event.preventDefault()
    const data = serializeForm(event.target)

    toggleLoader(event.target)
    const { status, error } = await sendData(data)
    toggleLoader(event.target)

    if (status === 200) {
      onSuccess(event.target)
    } else {
      onError(error)
    }
  }

  async function sendData(data) {
    return await fetch('/', {
      method: 'POST',
      body: data
    })
  }

  function serializeForm(formNode) {
    return new FormData(formNode);
  }

  function onSuccess(formNode) {
    alert('Поздравляем, вы подписали NDA');
    formNode.classList.toggle('hidden');
  }

  function checkValidate(event) {
    const formNode = event.target.form;
    const isValidate = formNode.checkValidity();

    formNode.querySelector('.btn').disabled = !isValidate;
  }

  function toggleLoader(formNode) {
    const loader = formNode.querySelector('.loader');
    const btnText = formNode.querySelector('.btn-text');
    const btn = formNode.querySelector('.btn');

    if (btn.disabled) {
      loader.classList.add('hidden');
      btnText.classList.remove('hidden');
    } else {
      loader.classList.remove('hidden');
      btnText.classList.add('hidden');
    }
  }

  load('forms', () => {
    const form = document.querySelector('.form');

    if (form) {
      form.addEventListener('submit', handleFormSubmit);
      const inputs = form.querySelectorAll('input');
      inputs.forEach(input => {
        input.addEventListener('input', checkValidate);
      });
    } else {
      console.error('Форма не найдена');
    }
  });
}