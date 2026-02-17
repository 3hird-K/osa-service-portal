declare module "*.avif" {
  import type { StaticImageData } from "next/image";
  const src: string | StaticImageData;
  export default src;
}

declare module "*.bmp" {
  import type { StaticImageData } from "next/image";
  const src: string | StaticImageData;
  export default src;
}

declare module "*.gif" {
  import type { StaticImageData } from "next/image";
  const src: string | StaticImageData;
  export default src;
}

declare module "*.jpg" {
  import type { StaticImageData } from "next/image";
  const src: string | StaticImageData;
  export default src;
}

declare module "*.jpeg" {
  import type { StaticImageData } from "next/image";
  const src: string | StaticImageData;
  export default src;
}

declare module "*.png" {
  import type { StaticImageData } from "next/image";
  const src: string | StaticImageData;
  export default src;
}

declare module "*.webp" {
  import type { StaticImageData } from "next/image";
  const src: string | StaticImageData;
  export default src;
}

declare module "*.svg" {
  import type { ReactElement, SVGProps } from "react";
  const src: string;
  export const ReactComponent: (props: SVGProps<SVGSVGElement>) => ReactElement;
  export default src;
}
