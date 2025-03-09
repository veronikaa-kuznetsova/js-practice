document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form') as HTMLFormElement;
  const imageInput = document.getElementById('image') as HTMLInputElement;
  const previewImage = document.querySelector('.preview') as HTMLImageElement;
  const textArea = document.getElementById('textarea') as HTMLTextAreaElement;
  const readOnlyField = document.getElementById('readonly') as HTMLInputElement;

  interface TextAreaData {
    value: string;
    width: number;
    height: number;
  }

  interface SyncMessage {
    key: 'image' | 'textarea';
    value: string;
  }

  const setCookie = (name: string, value: string, days: number): void => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
  };

  const getCookie = (name: string): string | null => {
    const cookies = document.cookie.split(';').map(c => c.trim());
    const cookie = cookies.find(c => c.startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
  };

  const channel = new BroadcastChannel('sync-form-data') as BroadcastChannel;

  const saveImage = (): void => {
    if (!imageInput.files?.length) return;

    const file = imageInput.files[0];
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const dataURL = e.target?.result as string;

      previewImage.onload = () => {
        localStorage.setItem('imageData', dataURL);
        channel.postMessage({ key: 'image', value: dataURL });
        imageInput.value = '';
      };

      previewImage.onerror = () => {
        imageInput.value = '';
      };

      previewImage.src = dataURL;
    };

    reader.onerror = (error: ProgressEvent<FileReader>) => {
      console.error('error', error);
      imageInput.value = '';
    };

    reader.readAsDataURL(file);
  };

  const restoreImage = (): void => {
    const dataURL = localStorage.getItem('imageData');
    if (dataURL) {
      previewImage.onload = () => {
        console.log('Image restored');
      };
      previewImage.onerror = () => {
        console.error('Failed');
        localStorage.removeItem('imageData');
        previewImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      };
      previewImage.src = dataURL;
    }
  };

  const saveTextArea = (): void => {
    const data: TextAreaData = {
      value: textArea.value,
      width: textArea.offsetWidth,
      height: textArea.offsetHeight
    };
    localStorage.setItem('textAreaData', JSON.stringify(data));
    channel.postMessage({ key: 'textarea', value: textArea.value });
  };

  const restoreTextArea = (): void => {
    const data = localStorage.getItem('textAreaData');
    if (!data) return;

    const parsedData: TextAreaData = JSON.parse(data);
    textArea.value = parsedData.value;
    textArea.style.width = `${parsedData.width}px`;
    textArea.style.height = `${parsedData.height}px`;
  };

  const updateReadOnlyField = (): void => {
    const currentTime = new Date().toLocaleString();
    readOnlyField.value = `Last update: ${currentTime}`;
    setCookie('lastUpdate', currentTime, 1);
    setTimeout(updateReadOnlyField, 300000);
  };

  const restoreReadOnlyField = (): void => {
    const lastUpdate = getCookie('lastUpdate');
    if (lastUpdate) {
      readOnlyField.value = `Last update: ${lastUpdate}`;
    } else {
      updateReadOnlyField();
    }
  };

  imageInput.addEventListener('change', saveImage);
  textArea.addEventListener('input', saveTextArea);

  const resizeObserver = new ResizeObserver(() => saveTextArea());
  resizeObserver.observe(textArea);

  form.addEventListener('submit', (e: SubmitEvent) => {
    e.preventDefault();
    alert('Form submitted!');
  });

  channel.onmessage = (event: MessageEvent<SyncMessage>) => {
    const { key, value } = event.data;
    switch(key) {
      case 'image':
        localStorage.setItem('imageData', value);
        previewImage.src = value;
        break;
      case 'textarea':
        textArea.value = value;
        break;
    }
  };

  restoreImage();
  restoreTextArea();
  restoreReadOnlyField();
  updateReadOnlyField();
});
