import Image from "next/image";
import Link from "next/link";

export function Logo({
  variant = "color",
  className = "",
  href = "/",
}: {
  variant?: "color" | "white";
  className?: string;
  href?: string | null;
}) {
  const src =
    variant === "white" ? "/lockerly-logo-white.png" : "/lockerly-logo.png";
  const img = (
    <Image
      src={src}
      alt="Lockerly"
      width={640}
      height={140}
      priority
      className={`h-8 w-auto ${className}`}
    />
  );
  if (href === null) return img;
  return (
    <Link href={href} className="inline-flex items-center">
      {img}
    </Link>
  );
}
