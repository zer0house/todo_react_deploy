import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";


export default function Signin() {
  const router = useRouter();
  const { data: session } = useSession();
  const [showId, setShowId] = useState(false);
  const [buttonWidth, setButtonWidth] = useState("w-40");

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      window.confirm(
        "클립보드에 복사되었습니다😀\n관리자에게 말해주시면 권한 드릴께요😎"
      );
    } catch (err) {
      console.error("클립보드 복사 실패🤔", err);
    }
  };
  

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
            className={`${buttonWidth}
                          justify-self-center
                          p-1 mb-4
                        bg-green-500 text-white
                          border border-green-500 rounded
                        hover:bg-white hover:text-green-500`}
            onClick={() => {
              setShowId(!showId);
              setButtonWidth(showId ? "w-40" : "w-auto");
              if (showId) {
                copyToClipboard(session.user.id);
              }
            }}
          >
            {showId ? session.user.id : "user.id 확인하기"}
          </button>
          {session?.user.id === "107116436055246186922" ? (
            <button
              className={`w-40
                      justify-self-center
                      p-1 mb-4
                    bg-violet-500 text-white
                      border border-violet-500 rounded
                    hover:bg-white hover:text-violet-500`}
              onClick={() => router.push("/admin")}
            >
              관리자 페이지
            </button>
          ) : (
            <div></div>
          )}
          {console.log()}

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