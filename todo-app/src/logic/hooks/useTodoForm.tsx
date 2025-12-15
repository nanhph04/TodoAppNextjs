import { useState } from "react";

export type TodoFormState = {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    date?: string;
    assignee?: string;
};

export function useTodoForm(initial?: Partial<TodoFormState>) {
    const [form, setForm] = useState<TodoFormState>({
        title: initial?.title || "",
        description: initial?.description || "",
        priority: initial?.priority || "low",
        date: initial?.date || "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (field: keyof TodoFormState) => (e: React.ChangeEvent<any>) => {
        setForm(prev => ({ ...prev, [field]: e.target.value }));
    };

    const resetForm = () => {
        setForm({ title: "", description: "", priority: "low", date: "" });
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
