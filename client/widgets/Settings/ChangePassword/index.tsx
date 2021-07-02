import { Field, Form, Formik } from 'formik';
import React from 'react';
import { mapTheme } from 'styles/appThemes/utils';

import Button from '👨‍💻components/Button';
import InputField from '👨‍💻components/Form/InputField';
import { useChangePasswordFromPasswordMutation } from '👨‍💻generated/graphql';
import { toErrorMap } from '👨‍💻utils/index';

const ChangePassword: React.FC<Props> = () => {
  const [changePassword] = useChangePasswordFromPasswordMutation();

  return (
    <div>
      <div className="md:w-1/4">
        <h2 className="underline text-xl text-text-primary font-bold mb-3">
          Change Password
        </h2>
        <Formik
          initialValues={{
            confirmPassword: '',
            newPassword: '',
            oldPassword: '',
          }}
          onSubmit={async (values, { resetForm, setErrors }) => {
            if (values.newPassword !== values.confirmPassword) {
              setErrors({ confirmPassword: 'Passwords do not match.' });
              return;
            }

            const { data } = await changePassword({
              variables: {
                ...values,
              },
            });
            if (data?.changePasswordFromPassword.errors) {
              setErrors(toErrorMap(data.changePasswordFromPassword.errors));
              return;
            }

            resetForm();

            window.alert('Your password has been changed.');
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col gap-3">
              <InputField
                label="Current Password"
                name="oldPassword"
                type="password"
              />
              <InputField
                label="New Password"
                name="newPassword"
                type="password"
              />
              <InputField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
              />
              <Button
                className="justify-center"
                disabled={isSubmitting}
                type="submit"
              >
                Submit
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

type Props = {};

export default ChangePassword;
