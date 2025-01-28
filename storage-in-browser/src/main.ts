document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form') as HTMLFormElement;
  const imageInput = document.getElementById('image') as HTMLInputElement;
  const previewImage = document.querySelector('.preview') as HTMLImageElement;
  const textArea = document.getElementById('textarea') as HTMLTextAreaElement;
  const readOnlyField = document.getElementById('readonly') as HTMLInputElement;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('The form is sent!');
  });

  function saveImage() {
    if (imageInput.files && imageInput.files[0]) {
      const file = imageInput.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          localStorage.setItem('imageData', e.target.result);
          previewImage.src = e.target.result;
          broadcastUpdate('imageData', e.target.result);
        }
      };
      reader.onerror = (err) => {
        console.error('File reading error:', err);
      };
      reader.readAsDataURL(file);
    } else {
      console.log("File not found");
    }
  }

  function restoreImage() {
    const imgData = localStorage.getItem('imageData');
    if (imgData) {
      previewImage.src = imgData;
    }
  }

  function saveTextArea() {
    sessionStorage.setItem('textAreaValue', textArea.value);
    sessionStorage.setItem('textAreaHeight', textArea.style.height);
    sessionStorage.setItem('textAreaWidth', textArea.style.width);
    broadcastUpdate('textAreaValue', textArea.value);
  }

  function restoreTextArea() {
    const value = sessionStorage.getItem('textAreaValue');
    const height = sessionStorage.getItem('textAreaHeight');
    const width = sessionStorage.getItem('textAreaWidth');
    if (value && height && width) {
      textArea.value = value;
      textArea.style.height = height;
      textArea.style.width = width;
    }
  }

  let timer: number;
  function updateReadOnlyField() {
    clearTimeout(timer);
    const currentTime = new Date().toLocaleString();
    readOnlyField.value = `latest update: ${currentTime}`;
    timer = setTimeout(updateReadOnlyField, 300000);
  }

  function broadcastUpdate(key: string, value: string) {
    const channel = new BroadcastChannel('sync-form-data');
    channel.postMessage({ key, value });
  }

  function receiveUpdates() {
    const channel = new BroadcastChannel('sync-form-data');
    channel.onmessage = (event: MessageEvent) => {
      const { key, value } = event.data as { key: string, value: string };
      switch (key) {
        case 'imageData':
          previewImage.src = value;
          break;
        case 'textAreaValue':
          textArea.value = value;
          break;
      }
    };
  }

  imageInput.addEventListener('change', saveImage);
  textArea.addEventListener('input', saveTextArea);
  window.addEventListener('beforeunload', () => {
    saveTextArea();
  });

  restoreImage();
  restoreTextArea();
  updateReadOnlyField();
  receiveUpdates();
});
