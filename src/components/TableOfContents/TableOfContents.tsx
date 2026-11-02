import type { MarkdownHeading } from 'astro';
import styles from './TableOfContents.module.css';
import { useTableOfContents } from './useTableOfContents';

interface Props {
  headings: MarkdownHeading[];
}

export default function TableOfContents({ headings }: Props) {
  const { items, activeSlug } = useTableOfContents(headings);

  if (items.length === 0) return null;

  return (
    <nav className={styles.toc} aria-label="目次">
      <p className={styles.title}>目次</p>
      <ul className={styles.list}>
        {items.map((h) => (
          <li key={h.slug} className={h.depth === 3 ? styles.depth3 : undefined}>
            <a href={`#${h.slug}`} aria-current={h.slug === activeSlug ? 'true' : undefined}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
