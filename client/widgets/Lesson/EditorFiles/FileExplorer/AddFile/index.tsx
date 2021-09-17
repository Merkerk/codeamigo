import React from 'react';

import Icon from '👨‍💻components/Icon';
import { FileSystemStateType } from '👨‍💻widgets/Lesson/EditorFiles/FilesList';

const AddFile: React.FC<Props> = (props) => {
  const {
    addFileState,
    depth = 0,
    error,
    handleBlur,
    handleKeyDown,
    inputRef,
    setError,
  } = props;

  return (
    <div
      className="mt-1 pr-4 relative"
      style={{ paddingLeft: 8 * (depth + 1) + 'px' }}
    >
      <div className="flex items-center">
        <Icon
          className="text-xs mr-1 text-text-primary hover:text-accent cursor-pointer"
          name={addFileState.type === 'file' ? 'file-empty' : 'folder'}
        />
        <input
          className="w-full text-sm px-2 py-1"
          onBlur={handleBlur}
          onChange={() => setError('')}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          type="text"
        />
      </div>
      {addFileState.active && error && (
        <div className="text-red-600 mt-1 text-xs w-full">{error}</div>
      )}
    </div>
  );
};

type Props = {
  addFileState: FileSystemStateType;
  depth?: number;
  error?: string;
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  setError: React.Dispatch<React.SetStateAction<string>>;
};

export default AddFile;
