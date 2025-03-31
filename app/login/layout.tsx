export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="justify-center items-center">
      {children}
    </div>
  );
}
