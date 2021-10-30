import { Field, Form, Formik } from 'formik';
import { useRouter } from 'next/router';
import React from 'react';

import { LessonTemplate } from '👨‍💻generated/graphql';
import { templates } from '👨‍💻modals/CreateLesson';

const Languages: React.FC<Props> = () => {
  const router = useRouter();

  return (
    <div className="p-2 rounded-md bg-bg-nav">
      <h4 className="mb-2 text-lg font-semibold underline text-text-primary">
        Languages and Templates
      </h4>
      <Formik
        initialValues={{
          checked: [] as string[],
        }}
        onSubmit={() => Promise.resolve()}
        validate={(values) => {
          router.replace({
            pathname: '/',
            query: {
              ...router.query,
              template: values.checked,
            },
          });
        }}
      >
        {({ values }) => (
          <Form>
            {Object.keys(LessonTemplate).map((t) => {
              const template = templates.find(
                (template) => template.value === t
              );
              if (!template) return null;

              return (
                <label
                  className="flex justify-between mb-0.5 text-sm font-light cursor-pointer"
                  htmlFor={t}
                  key={t}
                >
                  <div>
                    <Field id={t} name="checked" type="radio" value={t} />{' '}
                    <div className="inline-block text-text-primary">
                      <div className="flex items-center ml-1">
                        {template.name}
                        <img
                          className={`ml-2 h-4 ${
                            template.withBackground
                              ? 'bg-white rounded-full'
                              : ''
                          }`}
                          src={template.imageUrl}
                        />
                      </div>
                    </div>
                  </div>
                </label>
              );
            })}
          </Form>
        )}
      </Formik>
    </div>
  );
};

type Props = {};

export default Languages;
