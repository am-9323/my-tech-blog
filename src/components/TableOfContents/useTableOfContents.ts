import type { MarkdownHeading } from 'astro';
import { useEffect, useMemo, useState } from 'react';

// 見出しが画面上部からこの距離（px）を通過したら「現在地」とみなす
// 0 だと見出しが画面の一番上に来るまで切り替わらないので、少し余裕を持たせている
const OFFSET = 96;

/**
 * 目次に載せる見出しと、現在地の見出しの slug を返す
 *
 * - items: 目次に表示する見出しの一覧
 * - activeSlug: 今読んでいる見出しの slug（まだどの見出しにも達していなければ undefined）
 */
export function useTableOfContents(headings: MarkdownHeading[]) {
  // Astro の headings には h1〜h6 がすべて含まれるので、h2 と h3 だけに絞る
  // 脚注を書くと「Footnotes」という見出し（slug: footnote-label）が自動で追加されるため、それも除く
  const items = useMemo(
    () => headings.filter((h) => (h.depth === 2 || h.depth === 3) && h.slug !== 'footnote-label'),
    [headings],
  );
  const activeSlug = useActiveSlug(items);

  return { items, activeSlug };
}

/**
 * 画面上部を通過した最後の見出しの slug を返す
 *
 * スクロールのたびに各見出しの位置を調べ、OFFSET より上に出た見出しのうち
 * 一番下にあるもの（＝今読んでいる章）を現在地とする
 */
function useActiveSlug(items: MarkdownHeading[]): string | undefined {
  const [activeSlug, setActiveSlug] = useState<string>();

  useEffect(() => {
    // 目次の各項目に対応する本文の見出し要素を取得する
    // （Astro が見出しに slug と同じ id を付けているので、id で探せる）
    const elements = items
      .map((h) => document.getElementById(h.slug))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    // requestAnimationFrame の予約 ID。0 のときは予約なし
    let frame = 0;

    // 現在地を計算して state を更新する
    const update = () => {
      frame = 0;

      // ページの一番下までスクロールしたかどうか
      // 最後の章が短いと、その見出しが OFFSET まで上がる前にスクロールが止まるため、
      // 一番下に着いたときは最後の見出しを現在地にする（-2 は小数点以下の誤差の分）
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

      // 画面上部（OFFSET）より上に出た見出し。本文の順に並んでいるので、最後の要素が現在地になる
      const passed = elements.filter((el) => el.getBoundingClientRect().top <= OFFSET);

      setActiveSlug((atBottom ? elements.at(-1) : passed.at(-1))?.id);
    };

    // scroll イベントは 1 フレームに何度も発生するので、
    // 計算は次の描画前に 1 回だけ行うよう requestAnimationFrame でまとめる
    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    // ページを開いた時点（途中の見出しへのリンクから来た場合など）の現在地も反映する
    update();
    // passive: true でスクロールを妨げないことをブラウザに伝え、スクロールを滑らかにする
    window.addEventListener('scroll', onScroll, { passive: true });

    // コンポーネントが外れるときは、イベントの登録と予約中の計算を解除する
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [items]);

  return activeSlug;
}
