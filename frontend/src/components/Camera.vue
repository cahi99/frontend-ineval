<template>
  <div class="camera-container">
    <img src="../assets/ineval.svg" alt="Logo de la Aplicación" class="logo">
    <h1>Captura de Imagen</h1>

    <video ref="cameraFeed" autoplay class="camara"></video>
    <button @click="capturePhoto" class="take-button">Tomar Foto</button>

    <div class="canvas-text-container">
      <canvas ref="capturedCanvas" @click="openImagePopup" class="captura"></canvas>
      <textarea v-model="imageData" rows="10" cols="50" readonly  class="texto"></textarea>
    </div>
    
    <button @click="sendImageData" class="take-button">Enviar</button>
    <div v-if="cameraError" class="error-alert">
      Cámara desconectada o no permitida.
    </div>
  </div>
</template>

<script>
import { ref, onMounted} from 'vue';
import axios from 'axios';

function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
}

export default {
  name: 'CameraView',
  setup() {
    const cameraFeed = ref(null);
    const capturedCanvas = ref(null);
    const imageData = ref('');
    const context = ref(null);
    const cameraConnected = ref(false);
    const stream = ref(null);
    const cameraError = ref(false);

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((s) => {
        stream.value = s;
        cameraFeed.value.srcObject = stream.value;
        context.value = capturedCanvas.value.getContext('2d');
        cameraError.value = false;
      })
      .catch((error) => {
        console.error('Error accessing media devices.', error);
        cameraError.value = true;
      });
      
      
    onMounted(() => {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((s) => {
          stream.value = s;
          cameraFeed.value.srcObject = stream.value;
          context.value = capturedCanvas.value.getContext('2d');
          cameraConnected.value = true;
        })
        .catch((error) => {
          console.error('No existe acceso a la camara', error);
          cameraConnected.value = false;
        });
    });
    
    
    const capturePhoto = () => {
      if (cameraFeed.value && context.value && cameraConnected.value) {
        context.value.drawImage(cameraFeed.value, 0, 0, capturedCanvas.value.width, capturedCanvas.value.height);
        imageData.value = capturedCanvas.value.toDataURL('image/png'); 
      }else if (!cameraConnected.value) {
        alert('La cámara no está conectada.');
      }
    };
    
    

    const sendImageData = async () => {
      if (cameraFeed.value && context.value && cameraConnected.value) {
          const imageDataToSend = imageData.value;
          const apiUrl = 'http://localhost:8000/api/images';

          const blob = dataURLtoBlob(imageDataToSend);
          const formData = new FormData();
          formData.append('image', blob, 'captured_image.png');
          formData.append('token', localStorage.getItem('authToken'));

          try {
            const response = await axios.post(apiUrl, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
              },
            });

            console.log('Imagen subida exitosamente:', response.data);
            alert('Foto guardada en el backend exitosamente!');

          } catch (error) {
            console.error('Error al guardar la foto:', error);
            alert('Error al guardar la foto en el backend.');
            if (error.response && error.response.data) {
              console.log('Error del backend (detalles):', error.response.data);
            }
          }
          } else if (!cameraConnected.value) {
        alert('La cámara no está conectada.');
      } else if (!imageData.value) {
        alert('Por favor, captura una foto primero.');
      }
    };

    const openImagePopup = () => {
      if (imageData.value) {
        const popupWindow = window.open('', 'Imagen Capturada', 'resizable=yes,scrollbars=no');
        if (popupWindow) {
          popupWindow.document.body.innerHTML = `
                  <style>
                    body {
                      background-color: #e9ecef;
                      margin: 0;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      min-height: 100vh;
                    }
                    .image-container {
                      background-color: white;
                      padding: 20px;
                      border-radius: 5px;
                      box-shadow: 3px 3px 10px rgba(0,0,0,0.1);
                    }
                    img {
                      max-width: 95vw;
                      max-height: 95vh;
                      display: block;
                      margin: 0 auto;
                    }
                  </style>
                  <div class="image-container">
                    <img src="${imageData.value}" alt="Imagen Capturada">
                  </div>
                `;
        } else {
          alert('La ventana emergente fue bloqueada. Por favor, permite las ventanas emergentes para ver la imagen.');
        }
      } else {
        alert('Por favor, captura una foto primero.');
      }
    };

    return {
      cameraFeed,
      capturePhoto,
      capturedCanvas,
      imageData,
      sendImageData,
      cameraError,
      openImagePopup,
    };
  },
};
</script>

<style scoped>

.camera-container {
  display: flex;
  flex-direction: column;
  align-items: center; 
  justify-content: center; 
  width: 85vw;
  height: 90vh; 
  padding: 20px;
  margin: 5vm;
  border-radius: 5%;
  background-color: #ffffff;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);
}


.canvas-text-container {
  display: flex; 
  flex-direction: row; 
  align-items: flex-start; 
  gap: 20px; 
  margin-bottom: 15px; 
}
.camara {
  border-radius: 10%;
  margin-bottom: 20px;
  width: 55vw;
  height: auto; 
}
.texto {
  width: 50%;
  height: 15vh;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ced4da;
  box-sizing: border-box;
}
.captura {
  border-radius: 10%;
  margin-bottom: 20px;
  width: 45%;
  height: auto; 
}

.take-button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 10vh;
}

.logo {
  width: 15vw;
  height: auto;
  margin-bottom: -10px;
}

.error-alert {
  color: red;
  margin-top: 10px;
}



</style>