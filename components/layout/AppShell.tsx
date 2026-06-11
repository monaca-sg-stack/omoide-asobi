import { BottomNav } from "@/components/layout/BottomNav";

type Props = {
  children: React.ReactNode;
  showNav?: boolean;
};

export function AppShell({ children, showNav = true }: Props) {
  return (
    <div className={showNav ? "pb-20" : ""}>
      {children}
      {showNav && <BottomNav />}
    </div>
  );
}
