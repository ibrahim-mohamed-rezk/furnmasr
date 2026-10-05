export default function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
    >
      {/* Blue circle background */}
      <circle cx="12" cy="12" r="10" fill="#1877F2" />

      {/* White f — arc segment removed, path closes directly */}
      <path
        d="M11.193,19.929V13.159h2.358l.354-2.667H11.193v-1.7c0-.779.231-1.3,1.356-1.3H14V5.106A19.937,19.937,0,0,0,11.887,5,3.269,3.269,0,0,0,8.365,8.525v1.966H6v2.667H8.365v6.709Z"
        transform="translate(2 2)"
        fill="white"
      />
    </svg>
  );
}