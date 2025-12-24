import React, { useState, useMemo, useCallback, useEffect } from "react";

export type Priority = "low" | "medium" | "high";

export type TodoFormState = {
    title: string;
    description: string;
    priority: Priority;
    date?: string;
    assignee?: string;
};

type ChangeEvent =
    | React.ChangeEvent<HTMLInputElement>
    | React.ChangeEvent<HTMLTextAreaElement>
    | React.ChangeEvent<HTMLSelectElement>;

export function useForm(initial?: Partial<TodoFormState>) {
    const initialState: TodoFormState = useMemo(
        () => ({
            title: initial?.title ?? "",
            description: initial?.description ?? "",
            priority: initial?.priority ?? "low",
            date: initial?.date,
            assignee: initial?.assignee,
        }), [initial]
    )
    const [form, setForm] = useState<TodoFormState>(initialState);
    // Tự động reset form khi initial thay đổi
    useEffect(() => {
        setForm(initialState);
        setError(null);
    }, [initialState]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const setField = useCallback(
        <K extends keyof TodoFormState>(field: K, value: TodoFormState[K]) => {
            setForm(prev => ({ ...prev, [field]: value }));
        },
        []
    );

    const handleChange =
        <K extends keyof TodoFormState>(field: K) =>
            (e: ChangeEvent) => {
                setField(field, e.target.value as TodoFormState[K]);
            };

    const setPriority = useCallback((priority: Priority) => {
        setField("priority", priority);
    }, [setField]);

    const resetForm = useCallback(() => {
        setForm(initialState);
        setError(null);
    }, [initialState]);

    return {
        form,
        loading,
        error,

        setForm,
        setField,
        setPriority,

        handleChange,
        resetForm,

        setLoading,
        setError,
    };
}
