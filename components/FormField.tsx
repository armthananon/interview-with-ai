import { Controller, FieldValues, Path, Control } from "react-hook-form";
import {
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormFieldProps<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
    label: string;
    placeholder: string;
    type?: "text" | "email" | "password" | "file";
}

const FormField = <T extends FieldValues>({
    name,
    control,
    label,
    placeholder,
    type = "text",
}: FormFieldProps<T>) => (
    <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
            <FormItem>
                <FormLabel className="label">{label}</FormLabel>
                <FormControl>
                    <Input
                        className="input"
                        placeholder={placeholder}
                        type={type}
                        {...field}
                    />
                </FormControl>
                {error && <FormMessage>{error?.message}</FormMessage>}
            </FormItem>
        )}
    />
);

export default FormField;
