import { useState, useCallback } from "react";

// ----------------- Nested get -----------------
const getNested = (obj, path, defaultValue = undefined) => {
  const keys = path.split(".");
  let result = obj;
  for (let key of keys) {
    if (result === undefined || result === null) return defaultValue;
    result = result[key];
  }
  return result === undefined ? defaultValue : result;
};
const normalizePath = (path) => {
  return path.replace(/\[(\d+)\]/g, ".$1");
};

// ----------------- Nested set (immutable) -----------------
const setNested = (obj, path, value) => {
  const keys = path.split(".");
  const lastKey = keys.pop();
  let temp = { ...obj }; // clone top-level

  let current = temp;
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    // ensure we clone each nested level
    current[key] = current[key] ? { ...current[key] } : {};
    current = current[key];
  }

  current[lastKey] = value;
  return temp;
};

// ----------------- useForm hook -----------------
export const useForm = ({ defaultValues = {}, schema = null, validate = null } = {}) => {
  const [formData, setFormData] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ----------------- handleChange -----------------
  const handleChange = useCallback((fieldPath, value) => {
    setFormData((prev) => setNested(prev, fieldPath, value));
    setErrors((prev) => setNested(prev, fieldPath, ""));
  }, []);

  // ----------------- validate -----------------
  const validateFields = useCallback(() => {
    if (!schema && !validate) return true;

    let validationErrors = {};

    // Yup validation
    if (schema?.validateSync) {
      try {
        schema.validateSync(formData, { abortEarly: false });
      } catch (err) {
       err.inner.forEach((e) => {
  if (!e.path) return;

  const path = normalizePath(e.path); // ✅ YAHI FIX HAI
  validationErrors = setNested(validationErrors, path, e.message);
});

      }
    }

    // Custom validator
    if (typeof validate === "function") {
      const customErrors = validate(formData);
      if (customErrors) {
        validationErrors = { ...validationErrors, ...customErrors };
      }
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [formData, schema, validate]);

  // ----------------- handleSubmit -----------------
  const handleSubmit = useCallback(
    (submitFn) => async (e) => {
      e?.preventDefault?.();
      setIsSubmitting(true);
      setErrors({});

      const isValid = validateFields();
      if (!isValid) {
        setIsSubmitting(false);
        return;
      }

      try {
        await submitFn(formData);
      } catch (error) {
        console.error("Submit error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateFields]
  );

  const reset = useCallback(() => {
    setFormData(defaultValues);
    setErrors({});
  }, [defaultValues]);

  return {
    formData,
    setFormData,
    handleChange,
    errors,
    handleSubmit,
    reset,
    isSubmitting,
    setErrors
  };
};
