import { formatRelativeTime, formatDateTime } from '@/lib/utils/date';

interface Props {
  createdAt: string;
  updatedAt?: string;
}

export function NewsletterTimestamp({ createdAt, updatedAt }: Props) {
  return (
    <p className="text-sm text-gray-500">
      {updatedAt && updatedAt !== createdAt ? (
        <>
          Updated <span title={formatDateTime(updatedAt)}>
            {formatRelativeTime(updatedAt)}
          </span>
          {' · '}
        </>
      ) : null}
      Created <span title={formatDateTime(createdAt)}>
        {formatRelativeTime(createdAt)}
      </span>
    </p>
  );
}