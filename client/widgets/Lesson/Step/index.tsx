import '@codesandbox/sandpack-react/dist/index.css';

import {
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from '@codesandbox/sandpack-react';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';

import {
  LessonQuery,
  RegularStepFragment,
  SessionDocument,
  SessionQuery,
  useCompleteStepMutation,
  useSetNextStepMutation,
  useStepQuery,
} from '👨‍💻generated/graphql';
import Console from '👨‍💻widgets/Lesson/Console';
import EditorFiles from '👨‍💻widgets/Lesson/EditorFiles';
import EditorV2 from '👨‍💻widgets/Lesson/EditorV2';
import { FilesType } from '👨‍💻widgets/Lesson/EditorV2/types';
import Instructions from '👨‍💻widgets/Lesson/Instructions';
import Separator from '👨‍💻widgets/Lesson/Separator';

const Step: React.FC<Props> = ({
  currentStepId: id,
  session,
  setCurrentStepId,
  showSteps,
  ...rest
}) => {
  const [completeStep] = useCompleteStepMutation();
  const [setNextStep] = useSetNextStepMutation();
  const [cachedFiles, setCachedFiles] = useState<
    null | { [key in string]: string }
  >(null);
  const { data } = useStepQuery({
    fetchPolicy: 'cache-and-network',
    variables: { id },
  });

  useEffect(() => {
    if (data?.step?.codeModules) {
      setCachedFiles(
        data.step.codeModules.reduce((acc, curr) => {
          // @ts-ignore
          if (curr.name == 'index.html') return acc;
          // @ts-ignore
          acc[curr.name] = curr.value;
          return acc;
        }, {} as { [key in string]: string })
      );
    }
  }, [data?.step?.codeModules?.length]);

  if (!data) return null;
  if (!data.step) return null;

  const nextStep = () => {
    if (!session?.steps) return;
    if (!setCurrentStepId) return;
    if (!data.step) return;

    const next = session.steps.find(
      (nextStep) =>
        data.step?.createdAt && nextStep.createdAt > data.step.createdAt
    );

    const q = {
      query: SessionDocument,
      variables: { lessonId: session?.lesson.id },
    };

    if (next) {
      setNextStep({
        update: (store) => {
          const sessionData = store.readQuery<SessionQuery>(q);
          if (!sessionData?.session) return;

          store.writeQuery<SessionQuery>({
            ...q,
            data: {
              session: {
                ...sessionData.session,
                currentStep: next.id,
              },
            },
          });
        },
        variables: { sessionId: session.id, stepId: next.id },
      });
    }

    completeStep({
      update: (store, { data }) => {
        const sessionData = store.readQuery<SessionQuery>(q);
        if (!sessionData?.session) return;
        if (!sessionData?.session?.steps) return;

        store.writeQuery<SessionQuery>({
          ...q,
          data: {
            session: {
              ...sessionData.session,
              steps: sessionData.session.steps.map((step) => {
                if (step.id !== data?.completeStep?.id) return step;

                return {
                  ...step,
                  isCompleted: true,
                };
              }),
            },
          },
        });
      },
      variables: { id: data.step.id },
    });

    if (!next) return;

    // TODO: replace setCurrentStepId w/ session.currentStep
    // isEditing ? set lesson current step : set session
    setCurrentStepId(next?.id);
  };

  if (!data.step.codeModules) return null;
  if (!cachedFiles) return null;

  const files = data.step.codeModules.reduce(
    (acc, curr) => ({ ...acc, [curr.name as string]: curr.value }),
    {}
  ) as FilesType | undefined;

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:h-full-minus">
        <Instructions
          nextStep={nextStep}
          showSteps={showSteps}
          step={data.step}
          steps={
            (session?.steps || rest.lesson?.steps) as RegularStepFragment[]
          }
          {...rest}
        />
        {/* <Editor nextStep={nextStep} step={data.step} {...rest} /> */}
        <div className="w-full h-full">
          <SandpackProvider
            customSetup={{
              dependencies: data.step.dependencies?.reduce(
                (acc, curr) => {
                  // @ts-ignore
                  acc[curr.package] = curr.version;
                  return acc;
                },
                {
                  'react-scripts': '4.0.0',
                }
              ),
              files: cachedFiles,
              main:
                data.step.codeModules.find(({ isEntry }) => isEntry)?.name ||
                undefined,
            }}
          >
            <SandpackLayout>
              <div className="md:w-1/6 w-2/6 flex flex-col bg-bg-primary border-r border-bg-nav-offset z-10">
                <EditorFiles
                  codeModules={data.step.codeModules}
                  // currentPath={currentPath}
                  // deleteFile={deleteFile}
                  files={files!}
                  stepId={data.step.id}
                  {...rest}
                />
              </div>
              <div className="md:w-2/6 w-4/6 flex">
                <EditorV2 codeModules={data.step.codeModules} {...rest} />
              </div>
              {/* <Separator /> */}
              <div className="md:w-3/6 md:h-full w-full flex flex-col flex-grow">
                <SandpackPreview showSandpackErrorOverlay={false} />
                <Console />
              </div>
            </SandpackLayout>
          </SandpackProvider>
        </div>
      </div>
    </>
  );
};

type Props = {
  currentStepId: number;
  isEditing?: boolean;
  isPreviewing?: boolean;
  lesson: LessonQuery['lesson'];
  session?: SessionQuery['session'];
  setCurrentStepId?: (n: number) => void;
  setShowSteps: (val: boolean) => void;
  showSteps: boolean;
};

export default Step;
