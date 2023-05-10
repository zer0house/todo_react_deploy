/*
  각각의 할 일 항목을 렌더링하는 컴포넌트입니다.
  각 할 일의 완료 상태에 따라 체크박스와 텍스트 스타일을 동기화하며,
  삭제 버튼을 통해 해당 할 일을 삭제할 수 있습니다.
  이 컴포넌트는 `AdminList.js`에서 사용되어 할 일 목록을 구성합니다.
*/
import React from "react";
import styles from "@/styles/TodoList.module.css";

// TodoItem 컴포넌트를 정의합니다.
const AdminItem = ({ todo, onDelete, userName }) => {
  // 각 할 일 항목을 렌더링합니다.
  return (
    <li className={styles.todoItem}>

      {/* 할 일의 텍스트를 렌더링하고, 완료 상태에 따라 텍스트에 취소선을 적용합니다. */}
      <span
        className={styles.todoText}
        style={{ textDecoration: todo.completed ? "line-through" : "none" }}
      >
        {todo.text}
      </span>      

      {/* 입력 시간을 표시합니다. */}
      <span className={styles.todoTime}>
        {new Date(todo.timestamp).toLocaleString()}
      </span>
      
      {/* 작성자를 표시합니다 */}
      <span
        className={styles.todoAuthor}
        style={{ textDecoration: todo.completed ? "line-through" : "none" }}
      >
        작성자: {userName}
      </span>


      {/* 삭제 버튼을 렌더링하고, 클릭 시 onDelete 함수를 호출하여 해당 할 일을 삭제합니다. */}
      <button onClick={onDelete}> 🗑️ </button>
    </li>
  );
};

// AdminItem 컴포넌트를 내보냅니다.
export default AdminItem;
