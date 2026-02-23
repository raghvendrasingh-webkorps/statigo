import { useState, useEffect, useRef } from "react";
import { statigo, StatigoConfig, StatigoState } from "../core/statigo";


export function useStatigo<T extends Record<string, unknown>>(
  config: StatigoConfig<T>
) {
  const formRef = useRef<ReturnType<typeof statigo<T>> | null>(null);

  if (formRef.current === null) {
    formRef.current = statigo(config);
  }

  const form = formRef.current;

  const [state, setState] = useState<StatigoState<T>>(
    form.getValues()
  );

  useEffect(() => {
    const unsubscribe = form.subscribe(setState);
    return unsubscribe;
  }, [form]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;
    form.setValue(name as keyof T, value as T[keyof T]);
  }

  function handleBlur(
    e: React.FocusEvent<HTMLInputElement>
  ) {
    const { name } = e.target;
    form.setTouched(name as keyof T);
  }

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();      
    form.handleSubmit();     
  }

  return {
    ...state,
    handleSubmit,   
    handleChange,
    handleBlur,
    setValue: form.setValue,
    setTouched: form.setTouched,
  };
}

