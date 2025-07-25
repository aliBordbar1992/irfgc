import { SignInForm } from "@/features/auth/components/SignInForm";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">IRFGC</h1>
          <p className="mt-2 text-sm text-gray-600">
            Iranian Fighting Game Community
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  );
}
