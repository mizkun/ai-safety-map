import type { ReactNode } from 'react';

export function detailSection(
  title: string,
  body: ReactNode,
  icon?: ReactNode,
  extraClass = '',
) {
  return (
    <section className={'detail-section ' + extraClass}>
      <h3>
        {icon}
        {title}
      </h3>
      {body}
    </section>
  );
}
