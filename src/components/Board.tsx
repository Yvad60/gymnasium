import { useState } from "react";
import { DragDropContext, Draggable, OnDragEndResponder } from "react-beautiful-dnd";
import { StrictModeDroppable } from "../StrictModeDroppable";
import { columns } from "../boardData";

const Board = () => {
  const [boardData, setBoardData] = useState(columns);

  const handleDrag: OnDragEndResponder = ({ source, destination }) => {
    if (destination == null) return;
    const boardDataCopy = [...boardData];
    if (source.droppableId === destination.droppableId) {
      // moved in the same column
      const activeColumn = boardDataCopy.find((column) => column.id === source.droppableId);
      if (activeColumn == null) return;
      const [draggedCard] = activeColumn.items.splice(source.index, 1);
      activeColumn.items.splice(destination.index, 0, draggedCard);
      setBoardData(
        boardData.map((column) => (column.id === activeColumn.id ? activeColumn : column))
      );
    } else {
      const sourceColumn = boardDataCopy.find((column) => column.id === source.droppableId);
      const destinationColumn = boardDataCopy.find(
        (column) => column.id === destination.droppableId
      );
      if (sourceColumn == null || destinationColumn == null) return;
      const [draggedCard] = sourceColumn.items.splice(source.index, 1);
      draggedCard.column = destinationColumn.id;
      destinationColumn.items.splice(destination.index, 0, draggedCard);
      setBoardData(
        boardData.map((column) => {
          if (column.id === sourceColumn.id) return sourceColumn;
          if (column.id === destinationColumn.id) return destinationColumn;
          return column;
        })
      );
    }
  };

  return (
    <div>
      <DragDropContext onDragEnd={handleDrag}>
        <div className="grid grid-cols-4 gap-10 h-full">
          {boardData.map((column) => (
            <div className="bg-slate-100 w-full h-[70vh] rounded-lg" key={column.id}>
              <StrictModeDroppable droppableId={column.id}>
                {({ innerRef, droppableProps, placeholder }) => (
                  <div
                    className="space-y-4 h-full p-4 rounded-lg"
                    ref={innerRef}
                    {...droppableProps}
                  >
                    <h2 className="text-lg font-bold">{column.title}</h2>
                    {column.items.map((lead, index) => (
                      <Draggable draggableId={lead.id} index={index} key={lead.id}>
                        {({ innerRef, draggableProps, dragHandleProps }) => (
                          <div
                            className="p-3 bg-white min-h-[100px] rounded-md"
                            ref={innerRef}
                            {...dragHandleProps}
                            {...draggableProps}
                          >
                            <div>
                              <h3>{lead.title}</h3>
                            </div>
                            <div>
                              <h3>ggggg</h3>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {placeholder}
                  </div>
                )}
              </StrictModeDroppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
export default Board;
