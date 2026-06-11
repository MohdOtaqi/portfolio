import { Marquee } from "@/components/ui/marquee";

const items = [
  "C# / .NET 10",
  "SWIFT · ISO 15022",
  "FIX Protocol",
  "ASP.NET Core",
  "React",
  "SignalR",
  "TypeScript",
  "SQL Server",
  "Flutter",
  "Market Data",
  "IKVM",
  "Cryptography",
  "Azure Key Vault",
  "Node.js",
];

export function Ticker() {
  return (
    <div className="relative w-full overflow-hidden border-y border-border bg-card/30 py-6">
      <Marquee className="[--duration:38s] [--gap:0px]">
        {items.map((t) => (
          <span key={t} className="flex items-center">
            <span className="font-display px-8 text-2xl text-muted-foreground transition-colors hover:text-foreground sm:text-3xl">
              {t}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
          </span>
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
