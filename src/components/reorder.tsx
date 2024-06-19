'use client'

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { GripVertical } from "lucide-react";

export type ReorderType = {
    id: string;
    name: string;
    order: number;
}

interface ReorderProps {
    onConfirm: (data: ReorderType[]) => void;
    loading: boolean;
    initialData: ReorderType[]
}


const Reorder: React.FC<ReorderProps> = ({
    initialData,
    loading,
    onConfirm
}) => {
    const [todos, setTodos] = useState<ReorderType[]>(initialData);

    const handleDragEnd = (result: DropResult) => {
        // console.log(result)
        if (!result.destination) return;

        const updatedTodos = Array.from(todos);
        const [movedTodo] = updatedTodos.splice(result.source.index, 1);
        updatedTodos.splice(result.destination.index, 0, movedTodo);

        const reorderedTodos = updatedTodos.map((todo, index) => ({
            ...todo,
            order: index,
        }));

        setTodos(reorderedTodos);
    }
    
    return (
        <div>
            <div className="overflow-y-auto max-h-[60vh]">
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="todos">
                    {(droppableProvider) => (
                        <ul
                        ref={droppableProvider.innerRef}
                        {...droppableProvider.droppableProps}
                        >
                        {todos.map((todo, index) => (
                            <Draggable
                            isDragDisabled={loading}
                            index={index}
                            key={todo.id}
                            draggableId={`${todo.id}`}
                            >
                            {(draggableProvider) => (
                                <li
                                ref={draggableProvider.innerRef}
                                {...draggableProvider.draggableProps}
                                {...draggableProvider.dragHandleProps}
                                className="flex justify-between items-center gap-16 w-full py-2 pl-4 pr-2 border bg-white mb-2 shadow rounded"
                                >
                                    <span>{todo.name}</span>
                                    <GripVertical />
                                </li>
                            )}
                            </Draggable>
                        ))}
                        {droppableProvider.placeholder}
                        </ul>
                    )}
                    </Droppable>
                </DragDropContext>
            </div>
            <div className="pt-6 space-x-2 flex items-center justify-end flex-wrap-reverse w-full">
                <Button
                    disabled={loading}
                    onClick={() => onConfirm(todos)}
                >
                    Confirmar
                </Button>
            </div>
        </div>
    );
}
 
export default Reorder;