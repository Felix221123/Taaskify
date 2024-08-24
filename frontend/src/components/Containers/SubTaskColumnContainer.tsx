import React from 'react';
import { useFieldArray, Controller } from 'react-hook-form';
import { useTheme } from '../../Context/UseTheme';
import { SecondaryBtn } from '../Buttons/SecondaryBtn';
import { CrossIcon } from '../../Icons/Cross';
import './ContainersStyles.css';

interface SubTaskInputContainerProps {
  control: any;
  register: any;
  name: string;
}

export const SubTaskInputContainer: React.FC<SubTaskInputContainerProps> = ({ control, name }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const { theme } = useTheme();

  // Styles based on theme
  const TitleColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#000112' : '#FFFFFF',
  };

  const addNewSubtask = () => {
    append({ title: '' });
  };

  return (
    <div className="boardColumnsContainer">
      <p className="boardColumnsText font-bold" style={TitleColorOnChange}>
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
                      style={TitleColorOnChange}
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
              <CrossIcon onClick={() => remove(index)} />
            </div>
          ))}
        </div>
      </div>

      <SecondaryBtn buttonName="+ Add New Subtask" onClickProp={addNewSubtask} btnType="button" />
    </div>
  );
};
