"use client"

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import Modal from ".";
import { GripVertical } from "lucide-react";

export type ReoderType = {
    id: string;
    name: string;
    order: number;
}

interface ReoderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: ReoderType[]) => void;
    loading: boolean;
    initialData: ReoderType[]
}

export const ReoderModal: React.FC<ReoderModalProps> = ({
    isOpen,
    onClose,
    initialData,
    loading,
    onConfirm
}) => {
  const [todos, setTodos] = useState<ReoderType[]>(initialData);

  const handleDragEnd = (result: DropResult) => {
    // console.log(result)
    if(!result.destination) return; 
    const startIndex = result.source.index
    const endIndex = result.destination.index
    const copyTodos = [...todos]
    const [reorderTodo] = copyTodos.splice(startIndex,1)
    copyTodos.splice(endIndex,0,reorderTodo)
    setTodos(copyTodos)
  }

  return (
    <Modal
            title="Reordenar"
            isOpen={isOpen}
            onClose={onClose}
        > 
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
                variant="outline"
                onClick={onClose}
            >
                Cancelar
            </Button>
            <Button
                disabled={loading}
                onClick={() => onConfirm(todos)}
            >
                Confirmar
            </Button>
        </div>
    </Modal>
  );
};