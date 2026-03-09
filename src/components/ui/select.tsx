import * as React from "react"

import { cn } from "@/lib/utils"

type SelectOption = {
  label: string
  value: string
}

type SelectProps = {
  id?: string
  value: string
  placeholder?: string
  disabled?: boolean
  className?: string
  options: SelectOption[]
  onValueChange: (value: string) => void
}

function Select({
  id,
  value,
  placeholder,
  disabled,
  options,
  onValueChange,
  className,
}: SelectProps) {
  return (
    <select
      id={id}
      value={value}
      disabled={disabled}
      onChange={(event) => onValueChange(event.target.value)}
      className={cn(
        "bg-background focus-visible:border-ring focus-visible:ring-ring/40 h-10 w-full rounded-xl border border-input px-3 text-sm outline-none focus-visible:ring-3 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      {placeholder ? <option value="">{placeholder}</option> : null}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export { Select }

