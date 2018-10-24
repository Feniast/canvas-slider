export const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onerror = function(event) {
      reject(new Error('fail to load image'));
    }
    img.onload = function() {
      resolve(img);
    }
    img.src = src;
  });
}