import { useState } from "react";

export type TodoFormState = {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
};

export function useTodoForm(initial?: Partial<TodoFormState>) {
    const [form, setForm] = useState<TodoFormState>({
        title: initial?.title || "",
        description: initial?.description || "",
        priority: initial?.priority || "low",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (field: keyof TodoFormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }));
    };

    const resetForm = () => {
        setForm({ title: "", description: "", priority: "low" });
        setError(null);
    };

    return {
        form,
        setForm,
        loading,
        setLoading,
        error,
        setError,
        handleChange,
        resetForm,
    };
}
