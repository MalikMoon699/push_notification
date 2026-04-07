import { toast } from "sonner";

export const handleCopy = (text) => {
  navigator.clipboard
    .writeText(text)
    .then(() => toast.success("Text copied to clipboard!"))
    .catch(() => toast.error("Failed to copy text!"));
};
