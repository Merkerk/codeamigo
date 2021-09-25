import React, { useState } from 'react';

import Button from '👨‍💻components/Button';
import CTA from '👨‍💻widgets/CTA';
import EditorFiles from '👨‍💻widgets/Lesson/EditorFiles';
import SandpackEditor from '👨‍💻widgets/Lesson/Executors/Sandpack/SandpackEditor';
import Separator from '👨‍💻widgets/Lesson/Separator';

import { Props as OwnProps } from '.';

const RijuTemplate: React.FC<Props> = (props) => {
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
  const entryFile = step?.codeModules?.find(({ isEntry }) => !!isEntry);
  const [activePath, setActivePath] = useState<string | null>(null);

  const postCodeToRiju = () => {
    // @ts-ignore
    previewRef.current?.contentWindow?.postMessage(
      {
        code: entryFile?.value,
        event: 'runCode',
      },
      '*'
    );
  };

  return (
    <div className="sp-wrapper">
      <div className="sp-layout">
        <div
          className="md:w-48 w-2/6 flex flex-col justify-between bg-bg-primary z-50 border-bg-nav-offset-faded border-r sm:border-b-0"
          ref={filesRef}
          style={{ minHeight: '20rem' }}
        >
          <div className="h-full">
            <EditorFiles
              activePath={activePath || (entryFile?.name as string)}
              codeModules={step.codeModules}
              stepId={step.id}
              {...props}
              files={files!}
              selectFile={setActivePath}
            />
          </div>
          <div className="p-2">
            <Button
              className="h-14 justify-center w-full text-lg"
              onClick={postCodeToRiju}
            >
              Run
            </Button>
            {/* <CTA {...props} loading={loading} nextStep={nextStep} step={step} /> */}
          </div>
        </div>
        <div
          className="md:w-2/6 w-4/6 lg:h-full h-96 z-20 sm:border-b-0 border-b border-bg-nav-offset"
          ref={editorRef}
          style={{ height: filesHeight, maxHeight: filesHeight }}
        >
          <SandpackEditor
            activePath={activePath || (entryFile?.name as string)}
            codeModules={step.codeModules}
            setupTypes={false}
            stepId={step.id}
            {...props}
          />
          <Separator
            iframeName="riju-frame"
            maxDrag={maxDragWidth}
            onChangeX={updateWidths}
            onDragEnd={onDragEnd}
          />
        </div>
        <iframe
          className="md:w-3/6 md:h-full w-full flex flex-col flex-grow riju-frame"
          ref={previewRef}
          src="https://riju.codeamigo.xyz/ruby"
        />
      </div>
    </div>
  );
};

type Props = OwnProps & {
  files?: { [key in string]: { code: string } };
};

export default RijuTemplate;
