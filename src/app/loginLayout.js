export default function LoginLayout({ children }) {
  return (
    <body className="h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded">
        {children}
      </div>
    </body>
  );
}
