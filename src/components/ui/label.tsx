import * as React from "react"

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> { }

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, style, ...props }, ref) => (
        <label
            ref={ref}
            style={{
                fontSize: "14px",
                fontWeight: "500",
                lineHeight: "1",
                color: "var(--text-main)",
                cursor: "pointer",
                userSelect: "none",
                ...style
            }}
            className={`label ${className || ""}`}
            {...props}
        />
    )
)
Label.displayName = "Label"

export { Label }
