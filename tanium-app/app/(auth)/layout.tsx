interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      {children}
    </div>
  );
};

export default AuthLayout;
