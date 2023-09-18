navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }) // 'environment' to use the rear camera if available
  .then(function(stream) {
    let video = document.createElement("video");
    document.body.appendChild(video);
    video.srcObject = stream;
    video.setAttribute("playsinline", true); // required for iPhones
    video.play();

    requestAnimationFrame(tick);
    
    function tick() {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        let canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        
        if (code) {
          console.log("Found QR code:", code.data);
          // Handle the scanned data here...
        }
      }
      
      requestAnimationFrame(tick);
    }
  })
  .catch(function(err) {
    console.error("Camera access error:", err);
  });
