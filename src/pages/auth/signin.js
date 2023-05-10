import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Signin() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="flex justify-center h-screen">
      {session ? (
        <div className="grid m-auto text-center">
          <div className="m-4">안녕하세요, {session.user.name}님! 오늘의 할 일을 확인해볼까요? 😀</div>
          <button
            className={`w-40
                      justify-self-center
                      p-1 mb-4
                    bg-blue-500 text-white
                      border border-blue-500 rounded
                    hover:bg-white hover:text-blue-500 fond-bold`}
            onClick={() => router.push("/")}
          >
            Todo List
          </button>
          <button
            className={`w-40
                      justify-self-center
                      p-1 mb-4
                    text-gray-500
                      border border-gray-500 rounded
                    hover:bg-white hover:text-gray-500`}
            onClick={() => signOut()}
          >
            Log Out
          </button>
        </div>
      ) : (
        <div className="grid m-auto text-center">
          <div className="m-4">
            <span className="font-bold">Todo List</span>에 오신 것을 환영합니다!
          </div>
          <button
            className={`w-40
                      justify-self-center
                      p-1 mb-4
                    bg-blue-500 text-white
                      border border-blue-500 rounded
                    hover:bg-white hover:text-blue-500`}
            onClick={() => signIn()}
          >
            <span className="font-bold">Todo List</span> 로그인
          </button>
        </div>
      )}
    </div>
  );
}