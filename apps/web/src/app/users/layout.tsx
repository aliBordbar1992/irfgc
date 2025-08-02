interface UsersLayoutProps {
  children: React.ReactNode;
}

export default function UsersLayout({ children }: UsersLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8">{children}</main>
    </div>
  );
}
