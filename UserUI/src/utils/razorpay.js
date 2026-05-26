/**
 * Returns a promise that resolves when window.Razorpay is available.
 * The script is injected in main.jsx — this just waits for it to finish loading.
 */
export const waitForRazorpay = (timeoutMs = 10000) =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }

    const start = Date.now();
    const interval = setInterval(() => {
      if (window.Razorpay) {
        clearInterval(interval);
        resolve(window.Razorpay);
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(interval);
        reject(new Error("Razorpay script failed to load"));
      }
    }, 100);
  });
