export default function RecitalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Clean layout - no navbar, no footer
  // Background is handled by RecitalProgram based on background_type
  return <>{children}</>;
}
