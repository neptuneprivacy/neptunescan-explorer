import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export enum ActionButtonState {
  Destructive = "destructive",
  Active = "active",
  Disabled = "disabled",
  Default = "default",
}

export type ActionButtonProps = {
  size?: "xs" | "m" | "l" | "xl";
  state?: ActionButtonState;
  styleCss?: React.CSSProperties;
} & Omit<ButtonProps, "size" | "variant">;

const ActionButton = React.forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    {
      className,
      size = "m",
      state = ActionButtonState.Default,
      styleCss,
      children,
      ...props
    },
    ref
  ) => {
    let variant: ButtonProps["variant"] = "secondary";
    if (state === ActionButtonState.Destructive) variant = "destructive";
    if (state === ActionButtonState.Active) variant = "default";
    if (state === ActionButtonState.Disabled) variant = "ghost"; // or just disabled prop

    let btnSize: ButtonProps["size"] = "default";
    if (size === "xs") btnSize = "sm";
    if (size === "m") btnSize = "default";
    if (size === "l") btnSize = "lg";
    if (size === "xl") btnSize = "lg";

    return (
      <Button
        variant={variant}
        size={btnSize}
        className={cn(className)}
        ref={ref}
        style={styleCss}
        disabled={state === ActionButtonState.Disabled || props.disabled}
        {...props}
      >
        {children}
      </Button>
    );
  }
);
ActionButton.displayName = "ActionButton";

export default ActionButton;
export { ActionButton };
