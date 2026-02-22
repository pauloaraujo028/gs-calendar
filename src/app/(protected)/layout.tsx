import Navbar from "@/components/navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default DashboardLayout;
