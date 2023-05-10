import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import AdminList from "../components/AdminList";

export default function Home() {
  const router = useRouter();
  const { data } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/auth/signin");
    },
  });

  useEffect(() => {
    if (data?.user.id !== "107116436055246186922") {
      alert("관리자만 접근할 수 있습니다.");
      router.replace("/");
    }
  }, []);

  return (
    <div>
      <AdminList />
    </div>
  );
}