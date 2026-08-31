import { apiConfig } from './apiConfig';

export interface ProblemDetails {
  title: string;
  status: number;
  detail?: string | null;
}

export class ApiError extends Error {
  readonly status: number;
  readonly title: string;
  readonly detail?: string | null;

  constructor(problem: ProblemDetails) {
    super(problem.detail ?? problem.title);
    this.name = 'ApiError';
    this.status = problem.status;
    this.title = problem.title;
    this.detail = problem.detail;
  }
}

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
}

export async function apiRequest<TResponse>(
  path: string,
  { method = 'GET', body }: ApiRequestOptions = {},
): Promise<TResponse> {
  let response: Response;

  try {
    response = await fetch(`${apiConfig.baseUrl}${path}`, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError({ title: 'Network error', status: 0 });
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  if (!response.ok) {
    const problem: Partial<ProblemDetails> = await response.json().catch(() => ({}));
    throw new ApiError({
      title: problem.title ?? response.statusText ?? 'Request failed',
      status: problem.status ?? response.status,
      detail: problem.detail,
    });
  }

  try {
    return (await response.json()) as TResponse;
  } catch {
    throw new ApiError({ title: 'Unexpected response from server', status: response.status });
  }
}
