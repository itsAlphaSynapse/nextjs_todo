import addTodo from "@/controllers/addTodo"
import deleteTodo from "@/controllers/deleteTodo";
import getTodos from "@/controllers/getTodos"
import handleDone from "@/controllers/handleDone";
import updateTodo from "@/controllers/updateTodo";

export const GET = getTodos;
// export const POST = addTodo;
export const POST = addTodo;
// put is used for updating a resource.
export const PUT = updateTodo;
// patch is used for partial update of a resource.
export const PATCH = handleDone;
export const DELETE = deleteTodo;