export function HexagonPattern({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 hexagon-pattern opacity-30 pointer-events-none ${className}`} />
  );
}