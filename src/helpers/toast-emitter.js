import { toast } from "react-toastify";

let lastErrorTimestamp = 0;

export function showsuccess(message) {
  const currentTime = Date.now();
  if (currentTime - lastErrorTimestamp >= 1000) {
    toast.success(message, {
      position: "bottom-right",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  }
}

export function showerror(message) {
  const currentTime = Date.now();
  if (currentTime - lastErrorTimestamp >= 5 * 60 * 1000) {
    toast.error(message, {
      position: "bottom-right",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    lastErrorTimestamp = currentTime;
  }
}

export function showinfo(message) {
  if (currentTime - lastErrorTimestamp >= 5 * 60 * 1000) {
    toast.info(message, {
      position: "bottom-right",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    lastErrorTimestamp = currentTime;
  }
}

export function showinfoMainMenu(message) {
  const currentTime = Date.now();
  if (currentTime - lastErrorTimestamp >= 5000) {
    toast.info(message, {
      position: "bottom-right",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    lastErrorTimestamp = currentTime;
  }
}

export function showerrorMainMenu(message) {
  const currentTime = Date.now();
  if (currentTime - lastErrorTimestamp >= 5000) {
    toast.error(message, {
      position: "bottom-right",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    lastErrorTimestamp = currentTime;
  }
}

export function showsuccessMainMenu(message) {
  const currentTime = Date.now();
  if (currentTime - lastErrorTimestamp >= 5000) {
    toast.success(message, {
      position: "bottom-right",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    lastErrorTimestamp = currentTime;
  }
}
