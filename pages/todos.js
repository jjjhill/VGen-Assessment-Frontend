import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Colours, Typography } from '../definitions';
import PageLayout from '../components/PageLayout';
import apiFetch from '../functions/apiFetch';
import InlineEdit from '../components/InlineEdit';
import Alert from '../components/Alert';
import useSubmitTodo from '../hooks/useSubmitTodo';

const TodoList = () => {
    /*
    I recognize that Redux is used for every state in the application,
    and I opted not to follow that pattern for the sake of this
    exercise, and for the sake of discussion. In my opinion, it is
    overkill here because the todo list state is only required in
    this component.
    */
    const [isLoading, setIsLoading] = useState(true);
    const [todos, setTodos] = useState([]);
    const [newTodoValue, setNewTodoValue] = useState('');
    const [error, setError] = useState('');

    const onSuccess = () => {
        fetchTodos()
    }
    const onError = (errorMessage) => {
        setError(errorMessage)
    }

    const {
        actions: {
            submitTodo,
        }
    } = useSubmitTodo({ name: newTodoValue, onSuccess, onError })

    const fetchTodos = async () => {
        const response = await apiFetch("/todo")
        setTodos(response.body)
        setIsLoading(false)
    };

    const updateTodoCompletionStatus = async (todoID, completed) => {
        try {
            const response = await apiFetch(`/todo/${todoID}`, {
                body: { completed }, 
                method: "PATCH"
            })
    
            if (response.status !== 200) {
                // revert optimistic update on error
                fetchTodos()
            }
        } catch (err) {
            // revert optimistic update on error
            fetchTodos()
        }
    };

    const handleTodoClicked = (todo, checked) => {
        updateTodoCompletionStatus(todo.todoID, checked)

        // Optimistic update, in case of high server load
        // This is an unneccessary optimization here, but it is what
        // I would do in a larger scale application
        setTodos((prevTodos) => prevTodos.map(prevTodo => {
            if (todo.todoID === prevTodo.todoID) {
                return { ...prevTodo, completed: checked }
            }
            
            return prevTodo
        }))
    }

    // load todos on component mount
    useEffect(() => {
        fetchTodos()
    }, [])

    const todosPending = todos.filter(todo => !todo.completed)
    const todosCompleted = todos.filter(todo => todo.completed)

    return (
        <PageLayout title="Todo List">
            <Container>
                {isLoading ? <span>Loading Todos...</span> : (
                    <div className="content">
                        <h1>Todo List</h1>
                        { todosPending.length === 0 && (
                            <span>Nothing left to do!</span>
                        )}
                        <InlineEdit value={newTodoValue} setValue={setNewTodoValue} onSubmit={submitTodo} />
                        <Alert message={error} onClose={() => setError('')} />
                        <ul>
                            {todosPending.map((todo) => (
                                <li key={todo.todoID}>
                                    <input type="checkbox" id={todo.todoID} checked={todo.completed} onChange={e => handleTodoClicked(todo, e.target.checked)} />
                                    <Label htmlFor={todo.todoID} completed={todo.completed}>{todo.name}</Label>
                                </li>
                            ))}
                        </ul>
                        {todosCompleted.length > 0 && (
                            <>
                                <h2>Completed ({todosCompleted.length})</h2>
                                <ul>
                                    {todosCompleted.map((todo) => (
                                        <li key={todo.todoID}>
                                            <input type="checkbox" id={todo.todoID} checked={todo.completed} onChange={e => handleTodoClicked(todo, e.target.checked)} />
                                            <Label htmlFor={todo.todoID} completed={todo.completed}>{todo.name}</Label>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                )}
            </Container>
        </PageLayout>
    );
};

export default TodoList;

const Container = styled.div`
    width: 100%;

    .content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding-left: 1rem;

        h1, h2 {
            color: ${Colours.BLACK};
            font-size: ${Typography.HEADING_SIZES.M};
            font-weight: ${Typography.WEIGHTS.LIGHT};
            margin-bottom: 1rem;
            margin-top: 1rem;
        }

        h2 {
            font-size: ${Typography.HEADING_SIZES.XS};
            margin-top: 2rem;
            margin-bottom: 0.5rem;
        }

        ul {
            width: 100%;
        }

        li {
            text-align: left;
            margin: 0.5rem 0;
            padding: 0.35rem 0;
            border-bottom: 1px solid rgba(0,0,0,0.2);

            label {
                margin-left: 0.25rem;
            }
        }
    }
`;

const Label = styled.label`
    text-decoration: ${(props) => props.completed ? 'line-through' : 'none'}
`