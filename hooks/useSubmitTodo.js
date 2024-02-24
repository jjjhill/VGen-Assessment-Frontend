import apiFetch from '../functions/apiFetch';
import { useState } from 'react'
import { useDispatch } from 'react-redux';
import { clearTodoAlerts } from '../actions/todo';

function useSubmitTodo({ name, onSuccess, onError }) {
    const [isSaving, setIsSaving] = useState(false);
    const dispatch = useDispatch();

    const submitTodo = async () => {
        if (name) {
            setIsSaving(true);
            dispatch(clearTodoAlerts());
            let response = await apiFetch("/todo", {
                body: { name }, 
                method: "POST"
            });
            setIsSaving(false);
            if (response.status === 201) {
                onSuccess()
            }
            else {
                onError(response.body.error)
            }
        }
    };

    return {
        selectors: {
            isSaving,
        },
        actions: {
            submitTodo
        }
    }
}

export default useSubmitTodo