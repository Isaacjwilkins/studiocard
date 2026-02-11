export default function RecitalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Clean layout - no navbar, no footer
  // Just the content for standalone recital programs
  return <>{children}</>;
}
