import { toast } from "sonner";


export const formateDate = (date) => {
  if (!date) return "-";

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

export const timeAgo = (dateString) => {
  if (!dateString) return "";

  const now = new Date();
  const past = new Date(dateString);
  const diff = Math.floor((now - past) / 1000);

  if (diff < 60) return `${diff}s ago`;

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;

  const years = Math.floor(days / 365);
  return `${years}y ago`;
};

export const formateDateTime = (date) => {
  if (!date) return "";

  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours === 0 ? 12 : hours;

  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
  return `${year}-${month}-${day} ${formattedTime}`;
};

export const handleCopy = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => toast.success("Text copied to clipboard!"))
    .catch(() => toast.error("Failed to copy text!"));
};

export const handleUploadImage = async (avatarFile) => {
  try {
    let avatarUrl = "";
    if (avatarFile) {
      const formData = new FormData();
      formData.append("image", avatarFile);
      const res = await fetch(
        "https://image-upload-backend-three.vercel.app/api/Images/addImage",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to upload avatar");

      avatarUrl = data.url;
    }
    return avatarUrl;
  } catch (err) {
    console.error("Failed to Upload Image:", err);
  }
};

