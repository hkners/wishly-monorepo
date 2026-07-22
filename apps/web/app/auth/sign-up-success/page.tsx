import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              Kayıt başarılı!
            </CardTitle>
            <CardDescription>E-postanızı kontrol edin</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Başarıyla kayıt oldunuz. Giriş yapmadan önce lütfen e-postanızı
              kontrol edip hesabınızı onaylayın.
            </p>
            <Button asChild className="w-full">
              <Link href="auth/login">Giriş Sayfasına Git</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
