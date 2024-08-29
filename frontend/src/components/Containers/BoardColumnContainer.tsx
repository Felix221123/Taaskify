import { useTheme } from "../../Context/UseTheme";
import { Controller, useFieldArray } from 'react-hook-form';
import { CrossIcon } from '../../Icons/Cross';
import { SecondaryBtn } from '../Buttons/SecondaryBtn';


interface BoardColumnProps {
  control: any;
}


export const BoardColumnContainer: React.FC<BoardColumnProps> = ({ control }) => {
  // const to keep track of the columns available
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'columns',
  });

  const { theme } = useTheme();
  const TitleColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#000112' : '#FFFFFF',
  };

  const TextColorOnChange: React.CSSProperties = {
    color: theme === 'light' ? '#828FA3' : '#FFFFFF',
  };



  return (
    <>
      <div className="boardColumnsContainer">
        <p className="boardColumnsText font-bold" style={TextColorOnChange}>
          Board Columns
        </p>
        {/* container for displaying board columns */}
        <div className="containerForColumn">
          <div className="scrollableContainer">
            {fields.map((field, index) => (
              <div className="eachColumnContainer" key={field.id}>
                <label htmlFor={`eachColumnBoard-${index}`}>
                  <Controller
                    control={control}
                    name={`columns.${index}.name`}
                    render={({ field }) => (
                      <input
                        type="text"
                        id={`eachColumnBoard-${index}`}
                        style={TitleColorOnChange}
                        {...field}
                      />
                    )}
                  />
                </label>
                <CrossIcon onClick={() => remove(index)} />
              </div>
            ))}
          </div>
        </div>

        <SecondaryBtn buttonName="+ Add New Column" onClickProp={() => append({ name: '' })} btnType='button' />
      </div>
    </>
  );
};
