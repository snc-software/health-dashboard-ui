import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button, Input, InformationPanel, Paragraph } from '@snc-software/snc-ui';
import { useAuthenticateGarminMfaMutation, useAuthenticateGarminMutation } from '@/queries/garmin';
import { credentialsSchema, mfaSchema } from './GarminLoginForm.constants';
import { classes } from './GarminLoginForm.styles';
import type {
  CredentialsFormValues,
  GarminLoginFormProps,
  MfaFormValues,
} from './GarminLoginForm.types';
import { getGarminAuthErrorMessage } from './GarminLoginForm.utils';

type Step = { kind: 'credentials' } | { kind: 'mfa'; mfaSessionId: string };

export function GarminLoginForm({ onAuthenticated }: GarminLoginFormProps) {
  const [step, setStep] = useState<Step>({ kind: 'credentials' });
  const [formError, setFormError] = useState<string | null>(null);

  const authenticateMutation = useAuthenticateGarminMutation();
  const authenticateMfaMutation = useAuthenticateGarminMfaMutation();
  const isSubmitting = authenticateMutation.isPending || authenticateMfaMutation.isPending;

  const credentialsForm = useForm<CredentialsFormValues>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: { email: '', password: '' },
  });

  const mfaForm = useForm<MfaFormValues>({
    resolver: zodResolver(mfaSchema),
    defaultValues: { code: '' },
  });

  async function onSubmitCredentials(values: CredentialsFormValues) {
    setFormError(null);

    try {
      const response = await authenticateMutation.mutateAsync(values);

      if (response.status === 'mfa_required' && response.mfaSessionId) {
        setStep({ kind: 'mfa', mfaSessionId: response.mfaSessionId });
        return;
      }

      onAuthenticated();
    } catch (error) {
      setFormError(getGarminAuthErrorMessage(error));
    }
  }

  if (step.kind === 'mfa') {
    const { mfaSessionId } = step;

    async function onSubmitMfa(values: MfaFormValues) {
      setFormError(null);

      try {
        await authenticateMfaMutation.mutateAsync({ mfaSessionId, code: values.code });
        onAuthenticated();
      } catch (error) {
        setFormError(getGarminAuthErrorMessage(error));
      }
    }

    return (
      <form className={classes.form} onSubmit={mfaForm.handleSubmit(onSubmitMfa)} noValidate>
        <Input
          label="Verification code"
          hasError={Boolean(mfaForm.formState.errors.code)}
          disabled={isSubmitting}
          {...mfaForm.register('code')}
        />
        {mfaForm.formState.errors.code && (
          <Paragraph className={classes.fieldError}>
            {mfaForm.formState.errors.code.message}
          </Paragraph>
        )}
        {formError && <InformationPanel variant="error" subtext={formError} />}
        <Button type="submit" isLoading={isSubmitting}>
          Verify code
        </Button>
      </form>
    );
  }

  return (
    <form
      className={classes.form}
      onSubmit={credentialsForm.handleSubmit(onSubmitCredentials)}
      noValidate
    >
      <Input
        label="Email"
        type="email"
        hasError={Boolean(credentialsForm.formState.errors.email)}
        disabled={isSubmitting}
        {...credentialsForm.register('email')}
      />
      {credentialsForm.formState.errors.email && (
        <Paragraph className={classes.fieldError}>
          {credentialsForm.formState.errors.email.message}
        </Paragraph>
      )}
      <Input
        label="Password"
        type="password"
        hasError={Boolean(credentialsForm.formState.errors.password)}
        disabled={isSubmitting}
        {...credentialsForm.register('password')}
      />
      {credentialsForm.formState.errors.password && (
        <Paragraph className={classes.fieldError}>
          {credentialsForm.formState.errors.password.message}
        </Paragraph>
      )}
      {formError && <InformationPanel variant="error" subtext={formError} />}
      <Button type="submit" isLoading={isSubmitting}>
        Log in
      </Button>
    </form>
  );
}
