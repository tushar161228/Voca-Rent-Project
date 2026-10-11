import AuthLayout from '@/components/templates/AuthLayout';
import Signin from '@/components/pages/auth/Signin';

export const metadata = {
  title: "Sign In",
  description: "Login to your account",
};

const page = () => {
  return (
    <AuthLayout>
      <Signin />
    </AuthLayout>
  )
}

export default page
