import { useEffect, useRef } from "react";

function Toast({ message, type = "success", onClose }) {
  const toastRef = useRef(null);

  useEffect(() => {
    // Position above footer dynamically
    const positionToast = () => {
      const footer = document.querySelector("footer");
      if (footer && toastRef.current) {
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const bottomPosition = windowHeight - footerRect.top + 20;
        toastRef.current.style.bottom = `${Math.max(bottomPosition, 20)}px`;
      }
    };

    positionToast();
    window.addEventListener("resize", positionToast);

    // Auto-close after 4 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", positionToast);
    };
  }, [onClose]);

  return (
    <div ref={toastRef} className={`${type}-toast show`}>
      {message}
    </div>
  );
}

export default Toast;
