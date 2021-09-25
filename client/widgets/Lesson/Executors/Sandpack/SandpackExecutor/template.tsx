import {
  SandpackLayout,
  SandpackPreview,
  useActiveCode,
  useSandpack,
} from '@codesandbox/sandpack-react';
import React from 'react';

import CTA from '👨‍💻widgets/CTA';
import Console from '👨‍💻widgets/Lesson/Console';
import EditorFiles from '👨‍💻widgets/Lesson/EditorFiles';
import SandpackEditor from '👨‍💻widgets/Lesson/Executors/Sandpack/SandpackEditor';
import Separator from '👨‍💻widgets/Lesson/Separator';

import { Props as OwnProps } from '.';

const SandpackTemplate: React.FC<Props> = (props) => {
  const {
    editorRef,
    files,
    filesHeight,
    filesRef,
    loading,
    maxDragWidth,
    nextStep,
    onDragEnd,
    previewRef,
    step,
    updateWidths,
  } = props;
  const { updateCode } = useActiveCode();
  const { dispatch, sandpack } = useSandpack();
  const { activePath } = sandpack;

  return (
    <SandpackLayout>
      <div
        className="md:w-48 w-2/6 flex flex-col justify-between bg-bg-primary z-50 border-bg-nav-offset-faded border-r sm:border-b-0"
        ref={filesRef}
        style={{ minHeight: '20rem' }}
      >
        <div className="h-full">
          <EditorFiles
            activePath={activePath}
            codeModules={step.codeModules}
            stepId={step.id}
            {...props}
            files={files!}
            selectFile={sandpack.openFile}
          />
        </div>
        <div className="p-2">
          <CTA {...props} loading={loading} nextStep={nextStep} step={step} />
        </div>
      </div>
      <div
        className="md:w-2/6 w-4/6 lg:h-full h-96 z-20 sm:border-b-0 border-b border-bg-nav-offset"
        ref={editorRef}
        style={{ height: filesHeight, maxHeight: filesHeight }}
      >
        <SandpackEditor
          activePath={activePath}
          codeModules={step.codeModules}
          refreshPreview={() => dispatch({ type: 'refresh' })}
          setupTypes
          stepId={step.id}
          updateCode={updateCode}
          {...props}
        />
        <Separator
          iframeName="sp-preview-iframe"
          maxDrag={maxDragWidth}
          onChangeX={updateWidths}
          onDragEnd={onDragEnd}
        />
      </div>
      <div
        className="md:w-3/6 md:h-full w-full flex flex-col flex-grow"
        ref={previewRef}
      >
        <SandpackPreview />
        <Console />
      </div>
    </SandpackLayout>
  );
};

type Props = OwnProps & {
  files?: { [key in string]: { code: string } };
};

export default SandpackTemplate;
