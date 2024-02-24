import React, { useState } from 'react';
import styled from 'styled-components';
import { Typography, Colours } from '../definitions';
import Button from './Button';
import InputField from './InputField';

const InlineEdit = ({ value, setValue, onSubmit }) => {
  const [editing, setEditing] = useState(false);

  const handleEdit = () => {
    setValue('')
    setEditing(true);
  };

  const handleCancelEdit = () => {
    setEditing(false)
  }

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = () => {
    handleCancelEdit()
    onSubmit()
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
        handleSubmit()
    }
  };

  return (
    <Container>
      {editing ? (
            <InputRow>
                <InputField
                    type="text"
                    value={value}
                    onChange={handleChange}
                    autoFocus
                    placeholder='New Task'
                    onKeyDown={handleKeyDown}
                    className='fullWidth'
                />
                <Button text="Add Task" variant='primary' onClick={handleSubmit} />
                <Button text="Cancel" variant='secondary' onClick={handleCancelEdit} />
            </InputRow>
      ) : (
        // Normally I'd add an 'icon' prop to the Button component
        <StyledButton text={<><span className='plus'>+</span>Add Task</>} variant='neutral-light' onClick={handleEdit}></StyledButton>
      )}
    </Container>
  );
};

export default InlineEdit;

const Container = styled.div`
    display: flex;
    justify-content: flex-start;
    margin: 1rem 0;
    width: 100%;
`

const InputRow = styled.div`
    display: flex;
    gap: 0.5rem;
    width: 100%;

    .fullWidth {
        flex: 1;
    }
`

const StyledButton = styled(Button)`
    .plus {
        color: ${Colours.PRIMARY_DARK};
        margin-right: 0.5rem;
        font-size: ${Typography.HEADING_SIZES.S};
        border-radius: 50%;

        height: 100%;
        aspect-ratio: 1;
    }
`

// const InlineButton = styled.button`
//     background: transparent;
//     border: none;
//     display: flex;
//     align-items: center;
//     cursor: pointer;
//     font-size: ${Typography.BODY_SIZES.L};

//     .plus {
//         color: ${Colours.PRIMARY_DARK};
//         margin-right: 0.5rem;
//         font-size: ${Typography.HEADING_SIZES.S};
//         border-radius: 50%;
//         height: 1.5rem;
//         width: 1.5rem;
//         line-height: 1.5rem;
//     }
    
//     &:hover {
//         .plus {
//             background: ${Colours.PRIMARY_DARK};
//             color: white;
//         }
//     }
// `;