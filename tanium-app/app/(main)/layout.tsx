import { Navbar } from "@/components/navbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <>
      <Navbar />
      <main className="bg-black h-full w-full text-white pt-16">
        {children}
      </main>
    </>
  );
};

export default MainLayout;
