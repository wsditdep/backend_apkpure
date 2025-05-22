import dynamic from "next/dynamic";

import Loader from "@/components/progress/Loader";

const Login = dynamic(() => import("@/components/auth/Login"), {
  loading: () => <Loader />
});

export default function Home() {
  return (
    <>
      <Login />
    </>
  );
}
