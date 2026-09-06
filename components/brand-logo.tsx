import Image from 'next/image';

export function BrandLogo({
  alt,
  priority = false,
}: {
  alt: string;
  priority?: boolean;
}) {
  return (
    <span className="brand-logo">
      <Image
        alt={alt}
        className="brand-logo-light"
        height={113}
        priority={priority}
        src="/brand/logo-light.svg"
        width={545}
      />
      <Image
        alt={alt}
        className="brand-logo-dark"
        height={113}
        priority={priority}
        src="/brand/logo-dark.svg"
        width={545}
      />
    </span>
  );
}
