"use client";

import { GooeyToaster } from "goey-toast";
import type { ComponentProps } from "react";

type ToasterProps = ComponentProps<typeof GooeyToaster>;

export function Toaster(props: Partial<ToasterProps>) {
  return (
    <GooeyToaster
      position="top-center"
      closeButton
      richColors
      showTimestamp={false}
      {...props}
    />
  );
}

export default Toaster;

