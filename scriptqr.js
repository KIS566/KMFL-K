const qrContainer = document.getElementById("qrContainer");
const qrText = document.getElementById("qrText");
const qrColor = document.getElementById("qrColor");
const bgColor = document.getElementById("bgColor");
const eyeStyle = document.getElementById("eyeStyle");
const dotStyle = document.getElementById("dotStyle");
const logoUpload = document.getElementById("logoUpload");

let qrCode;

document.getElementById("generateBtn").addEventListener("click", () => {
  const text = qrText.value.trim();
  if (!text) return alert("Please enter text or link!");
  
  const logoFile = logoUpload.files[0];
  let logoUrl = null;
  if (logoFile) logoUrl = URL.createObjectURL(logoFile);
  
  qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    data: text,
    dotsOptions: {
      color: qrColor.value,
      type: dotStyle.value
    },
    backgroundOptions: {
      color: bgColor.value
    },
    cornersSquareOptions: {
      type: eyeStyle.value,
      color: qrColor.value
    },
    image: logoUrl,
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 5
    }
  });
  
  qrContainer.innerHTML = "";
  qrCode.append(qrContainer);
});

document.getElementById("downloadPng").addEventListener("click", () => {
  if (!qrCode) return alert("Generate QR first!");
  qrCode.download({ name: "qr_code", extension: "png" });
});

document.getElementById("downloadJpg").addEventListener("click", () => {
  if (!qrCode) return alert("Generate QR first!");
  qrCode.download({ name: "qr_code", extension: "jpg" });
});

document.getElementById("downloadSvg").addEventListener("click", () => {
  if (!qrCode) return alert("Generate QR first!");
  qrCode.download({ name: "qr_code", extension: "svg" });
});

document.getElementById("copyLink").addEventListener("click", () => {
  if (!qrText.value.trim()) return;
  navigator.clipboard.writeText(qrText.value);
  alert("Link copied!");
});

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
});

document.body.classList.add("dark");