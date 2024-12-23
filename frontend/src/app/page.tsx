"use client";
import Header from "./components/internal/Header";
import { useEffect, useState } from "react";
import { Contract } from "starknet";
import TodoABI from "../app/ABIs/TodoABI.json";
import { useAccount } from "@starknet-react/core";
import { feltToString } from "../app/helper";

export default function Home() {
  const contractAddress = "0x01250ad1d1d74c69d73c342c41cebb5d796e98c8b9873604635ebae5fadb8b38";
  const { account } = useAccount();

  const todoContract = new Contract(TodoABI, contractAddress, account);

  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);

  const handleTodo = async () => {
    try {
      await todoContract.add_todo(todo);
      setTodo("");
      alert("Todo added successfully!");

    } catch (error) {
      console.error("Error adding todo:", error);
      alert(error)
    }
  }

  useEffect(() => {
    const getTodos = async () => {
        const allTodos = await todoContract.get_all_todos();
        setTodos(allTodos);
        console.log(allTodos)
    }

    getTodos();
  }, []);

  return (
    <main className="flex min-h-svh flex-col justify-between gap-16">
      <Header />
      <div className="flex-col w-full mt-[200px]">
        <div className="m-auto p-5 bg-slate-300 rounded-md flex flex-col w-9/12 gap-y-4">
          <h4 className="font-bold text-center">Add Todo</h4>
          <input type="text" placeholder="Todo title..." className="p-2" value={todo} onChange={ (e) => setTodo(e.target.value)}/>
          <button className="p-2 bg-primary-gradient text-white" onClick={handleTodo}>Add Todo</button>
        </div>
      </div>
      <div className="flex-col w-full">
        <div className="mx-auto bg-slate-300 flex flex-col w-9/12 gap-y-4 p-5">
        <h4 className="font-bold text-center text-[30px]">TODOS</h4>
        <hr/>
        {todos.length > 0 ? todos.map((todo, index) => (
          <div key={index} className="flex gap-2">
            <p>{index+1}. {feltToString(todo?.title)}</p>
          </div>
        )): "No todos found"}
        </div>
      </div>

    </main>
  );
}
