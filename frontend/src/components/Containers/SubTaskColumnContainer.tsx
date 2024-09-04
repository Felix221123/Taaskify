import React, { useState } from 'react';
import { useFieldArray, Controller } from 'react-hook-form';
import { useTheme } from '../../Context/Theme/UseTheme';
import { SecondaryBtn } from '../Buttons/SecondaryBtn';
import { CrossIcon } from '../../Icons/Cross';
import './ContainersStyles.css';

interface SubTaskInputContainerProps {
  control: any;
  name: string;
}




export const SubTaskInputContainer: React.FC<SubTaskInputContainerProps> = ({ control, name }) => {
  const { fields, append, remove} = useFieldArray({
    control,
    name,
  });

  const { theme } = useTheme();
  const [firstSubtaskError, setFirstSubtaskError] = useState(false);

  // Styles based on theme
  const TextColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#828FA3' : '#FFFFFF',
  };

  const TitleColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#000112' : '#FFFFFF',
  };

  const ErrorBorder: React.CSSProperties = {
    borderColor: theme === 'light' ? '#EA5555' : '#FF9898',
  };

  const addNewSubtask = () => {
    append({ title: '' });
  };

  // handles remove subtask
  const handleRemove = (index: number) => {
    if (index === 0) {
      setFirstSubtaskError(true);
      return; // Prevent removal of the first subtask
    }
    setFirstSubtaskError(false);
    remove(index);
  };

  return (
    <div className="boardColumnsContainer">
      <p className="boardColumnsText font-bold" style={TextColorOnChange}>
        Subtasks
      </p>
      <div className="containerForColumn">
        <div className="scrollableContainer">
          {fields.map((field, index) => (
            <div className="eachColumnContainer" key={field.id}>
              <label htmlFor={`subtask-${index}`}>
                <Controller
                  control={control}
                  name={`${name}.${index}.title`}
                  render={({ field }) => (
                    <input
                      type="text"
                      id={`subtask-${index}`}
                      {...field}
                      style={{
                        ...TitleColorOnChange,
                        ...(index === 0 && firstSubtaskError ? ErrorBorder : {}),
                      }}
                      placeholder={
                        index === 0
                          ? 'e.g. Make coffee'
                          : index === 1
                            ? 'e.g. Drink coffee & smile'
                            : 'e.g. Sample Text'
                      }
                    />
                  )}
                />
              </label>
              <CrossIcon onClick={() => handleRemove(index)} />
            </div>
          ))}
        </div>
      </div>

      <SecondaryBtn buttonName="+ Add New Subtask" onClickProp={addNewSubtask} btnType="button" />
    </div>
  );
};
