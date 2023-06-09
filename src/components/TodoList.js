/* 
  할 일 목록을 관리하고 렌더링하는 주요 컴포넌트입니다.
  상태 관리를 위해 `useState` 훅을 사용하여 할 일 목록과 입력값을 관리합니다.
  할 일 목록의 추가, 삭제, 완료 상태 변경 등의 기능을 구현하였습니다.
*/
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

import TodoItem from "@/components/TodoItem";
import styles from "@/styles/TodoList.module.css";

// firebase 관련 모듈을 불러옵니다.
import { db } from "@/firebase";
import {
  collection,
  query,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  where,
} from "firebase/firestore"

// DB의 todos 컬렉션 참조를 만듭니다. 컬렉션 사용시 잘못된 컬렉션 이름 사용을 방지합니다.
const todoCollection = collection(db, "todos");

// TodoList 컴포넌트를 정의합니다.
const TodoList = () => {
  // 상태를 관리하는 useState 훅을 사용하여 할 일 목록과 입력값을 초기화합니다.
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  const { data } = useSession();

  const getTodos = async () => {
    // Firesotre 쿼리를 만듭니다.
    // const q = query(todoCollection);
    // const q = query(collection(db, "todos"), where("user", "==", user.uid));
    // const q = query(todoCollection, orderBy("datetime", "asc"));
    if (!data?.user?.name) return;

    const q = query(
      todoCollection,
      where("userId", "==", data?.user?.id),
      orderBy("timestamp", "asc")
    );

    // Firestore에서 할 일 목록을 조회합니다.
    const results = await getDocs(q);
    const newTodos = [];

    // 가져온 할 일 목록을 newTodos 배열에 담습니다.
    results.docs.forEach((doc) => {
      // console.log(doc.data());
      // id 값을 Firestore 에 저장한 값으로 지정하고, 나머지 데이터를 newTodos 배열에 담습니다.
      newTodos.push({ id: doc.id, ...doc.data() });
    })

    setTodos(newTodos);
  };

  useEffect(() => {
    getTodos();
  }, [data]);

  // addTodo 함수는 입력값을 이용하여 새로운 할 일을 목록에 추가하는 함수입니다.
  const addTodo = async () => {
    // 입력값이 비어있는 경우 함수를 종료합니다.
    if (input.trim() === "") return;
    // 기존 할 일 목록에 새로운 할 일을 추가하고, 입력값을 초기화합니다.
    // {
    //   id: 할일의 고유 id,
    //   text: 할일의 내용,
    //   completed: 완료 여부,
    // }
    // ...todos => {id: 1, text: "할일1", completed: false}, {id: 2, text: "할일2", completed: false}}, ..

    // Firestore 에 추가한 할 일을 저장합니다.
    const docRef = await addDoc(todoCollection, {
      userId: data?.user?.id,
      userName: data?.user?.name,
      text: input,
      completed: false,
      timestamp: Date.now(),
    });

    // id 값을 Firestore 에 저장한 값으로 지정합니다.
    setTodos([...todos, {
      id: docRef.id, 
      userId: data?.user?.id,
      userName: data?.user?.name,
      text: input,
      completed: false,
      timestamp: Date.now()
    }]);
    setInput("");
    const container = document.querySelector(`.${styles.container}`);
    container.classList.add("animate__animated", "animate__bounce");
    setTimeout(() => {
      container.classList.remove("animate__animated", "animate__bounce");
    }, 1000);
  };


  
  // toggleTodo 함수는 체크박스를 눌러 할 일의 완료 상태를 변경하는 함수입니다.
  const toggleTodo = (id) => {
    // 할 일 목록에서 해당 id를 가진 할 일의 완료 상태를 반전시킵니다.
    const newTodos = todos.map((todo) => {
      if (todo.id === id && todo.userId === data?.user?.id) {
        // Firestore 에서 해당 id를 가진 할 일을 찾아 완료 상태를 업데이트합니다.
        const todoDoc = doc(todoCollection, id);
        updateDoc(todoDoc, { completed: !todo.completed });
        // ...todo => id: 1, text: "할일1", completed: false
        return { ...todo, completed: !todo.completed };
      } else {
        return todo;
      }
    });

    setTodos(newTodos);
  };

  // deleteTodo 함수는 할 일을 목록에서 삭제하는 함수입니다.
  const deleteTodo = (id) => {
    // Firestore 에서 해당 id를 가진 할 일을 삭제합니다.
    const todoDoc = doc(todoCollection, id);
    deleteDoc(todoDoc);

    // 해당 id를 가진 할 일을 제외한 나머지 목록을 새로운 상태로 저장합니다.
    // setTodos(todos.filter((todo) => todo.id !== id));
    setTodos(
      todos.filter((todo) => {
        return todo.id !== id;
      })
    );
  };

  // 컴포넌트를 렌더링합니다.
  return (
    <div className={styles.container}>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl mb-4 font-bold" style={{ 
        textDecoration: "underline dotted", color: "gray" }}>
          <span className="font-bold">{data?.user?.name}</span>의 Todo List
        </h1>
        {/* 로그아웃 버튼 추가 */}
        {data?.user?.name && (
          <button
            className="shadow-lg w-20 justify-self-end p-1 text-xs font-bold bg-gray-500 text-white border border-gray-500 rounded hover:bg-white hover:text-gray-500"
            onClick={() => signOut()}
          >
            Log Out
          </button>
        )}
      </div>
      
      {/* 할 일을 입력받는 텍스트 필드입니다. */}
      <input
        type="text"
        // className={styles.itemInput}
        // -- itemInput CSS code --
        // input[type="text"].itemInput {
        //   width: 100%;
        //   padding: 5px;
        //   margin-bottom: 10px;
        // }
        className="shadow-lg w-full p-1 mb-4 border border-gray-300 rounded"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addTodo();
          }
        }}
      />
      {/* 할 일을 추가하는 버튼입니다. */}
      <div className="grid">
        <button
          // className={styles.addButton}
          // -- addButton CSS code --
          // button.addButton {
          //   padding: 5px;
          //   background-color: #0070f3;
          //   color: white;
          //   border: 1px solid #0070f3;
          //   border-radius: 5px;
          //   cursor: pointer;
          // }
          //
          // button.addButton:hover {
          //   background-color: #fff;
          //   color: #0070f3;
          // }
          className="shadow-lg w-40 justify-self-end p-1 mb-4 font-bold bg-blue-500 text-white border border-blue-500 rounded hover:bg-white hover:text-blue-500"
          onClick={addTodo}
        >
          Add Todo
        </button>
      </div>
      {/* 할 일 목록을 렌더링합니다. */}
      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => toggleTodo(todo.id)}
            onDelete={() => deleteTodo(todo.id, todo.userId)}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
