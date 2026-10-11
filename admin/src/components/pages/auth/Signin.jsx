// Signin.jsx

"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Input from "@/components/common/Input";
import { useForm } from "@/components/hooks/useForm";
import {
  errorToast,
  successToast,
} from "@/components/utils/toastMessage";
import { loginSchema } from "@/components/validations/loginSchema";
import Button from "@/components/common/Button";
import { loginUser } from "@/components/redux/slice/auth-slice";

const Signin = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.auth);

  const { formData, handleChange, handleSubmit, errors, reset } =
    useForm({
      defaultValues: {
        mobile: "",
        password: "",
      },
      schema: loginSchema,
    });

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(
        loginUser({
          mobile: data.mobile,
          password: data.password,
        })
      ).unwrap();

      successToast(response?.message || "Login successful");

      reset();
      router.replace("/")

    } catch (error) {
      errorToast(error?.message || "Failed to login");
    }
  };

  return (
    <div className="bg-white rounded-lg md:rounded-xl lg:rounded-2xl p-4 md:p-5 lg:p-6 lg:py-8">
      <h1 className="text-2xl font-extrabold tracking-wide text-blue-600 mb-4">
        Sign in
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          type="tel"
          name="mobile"
          label="Mobile Number"
          placeholder="Enter your mobile number"
          value={formData.mobile}
          maxLength={10}
          onChange={(e) =>
            handleChange("mobile", e.target.value)
          }
          error={errors.mobile}
          className="py-2.5"
        />

        <Input
          type="password"
          name="password"
          label="Password"
          iconEye={true}
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) =>
            handleChange("password", e.target.value)
          }
          error={errors.password}
          className="py-2.5"
          maxLength={30}
        />

        <Button
          disabled={loading}
          loading={loading}
          type="submit"
          variant="gradient"
          className="w-full rounded-lg py-[12px]"
        >
          Sign In
        </Button>
      </form>
    </div>
  );
};

export default Signin;
