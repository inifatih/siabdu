// app/landing/page.tsx
import { Button } from 'shadcn/ui/button';
import { Card } from 'shadcn/ui/card';
import { Typography } from 'shadcn/ui/typography';

export default function LandingPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <Card className="max-w-md w-full p-8 shadow-lg rounded-xl">
        <Typography variant="h4" className="text-center mb-4">
          Selamat datang di Aplikasi Si Abdu
        </Typography>
        <Typography className="text-center mb-6 text-lg text-gray-600">
          Masuk ke dalam aplikasi Si Abdu untuk melakukan skrining kesehatan dan memantau perkembangan anak. Aplikasi ini dirancang untuk membantu orang tua dan tenaga medis dalam memantau tumbuh kembang anak dengan lebih mudah.
        </Typography>
        <Button
          className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg"
          onClick={() => window.location.href = "/login"}
        >
          Masuk ke dalam aplikasi Si Abdu untuk melakukan skrining -login-
        </Button>
      </Card>
    </div>
  );
}
