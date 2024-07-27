import { FieldType } from "../components/Forms/Form";

export const validators: Record<FieldType, (value: string) => boolean> = {
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  password: (value: string): boolean => {
    return value.length > 8;
  },
  text: (value: string): boolean => {
    return value.length > 0;
  },
};

export function getErrorMessage(type: FieldType): string {
  switch (type) {
    case "email":
      return "Please enter a valid email address";
    case "password":
      return "Password must be at least 8 characters";
    case "text":
      return "Text field is required";
    default:
      return "Invalid input";
  }
}

export function getFirstError(errors: Record<string, string>): string | null {
  const firstKey = Object.keys(errors)[0];
  return firstKey ? errors[firstKey] : null;
}
