function Button({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = "default", // 'default', 'primary', 'secondary'
  className = "",
  ...props
}) {
  const variantClass = variant !== "default" ? variant : "";
  const loadingClass = loading ? "loading" : "";

  return (
    <button
      className={`converter-btn ${variantClass} ${loadingClass} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "⟳ Translating..." : children}
    </button>
  );
}

export default Button;
