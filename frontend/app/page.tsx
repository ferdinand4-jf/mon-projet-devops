'use client';
import { useState, useEffect, FormEvent } from 'react';

// 1. On définit la structure d'une tâche (le Type)
interface Task {
  id: number;
  title: string;
}

export default function Home() {
  // 2. On dit explicitement à useState que "tasks" est un tableau de "Task"
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');

  // Récupérer les données du backend
  useEffect(() => {
    fetch('http://localhost:5000/api/tasks')
      .then((res) => res.json())
      .then((data: Task[]) => setTasks(data)) // On type la réponse de l'API
      .catch((err) => console.error("Erreur de fetch:", err));
  }, []);

  // Soumettre une nouvelle tâche (on utilise le type natif FormEvent de React)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const res = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTask }),
    });
    
    if (res.ok) {
      const data: Task = await res.json(); // On type la tâche reçue
      setTasks([data, ...tasks]);
      setNewTask('');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 py-10 px-5">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Mon Projet DevOps (Next.js + Express)
        </h1>
        
        <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Nouvelle tâche..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Ajouter
          </button>
        </form>

        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="p-3 bg-gray-50 rounded-lg text-gray-700 border border-gray-200 shadow-sm flex justify-between">
              <span className="text-black">{task.title}</span>
              <span className="text-xs text-gray-400">ID: {task.id}</span>
            </li>
          ))}
          {tasks.length === 0 && (
            <p className="text-gray-500 text-center text-sm">Aucune tâche pour le moment.</p>
          )}
        </ul>
      </div>
    </main>
  );
}