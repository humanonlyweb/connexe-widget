<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useCarousel } from '../composables/useCarousel';

const { theme = 'dark', lang = 'en', limit = 1, topic } = defineProps<{
  theme?: 'light' | 'dark',
  topic: string
  limit?: number | string,
  lang?: string
}>()

interface Article {
  id: string
  title: string
  author: string
  url: string
}

const articles = ref<Article[]>([])

const fetchRecommendedArticles = async () => {
  if (!topic) return

  try {
    const url = new URL('https://connexe.dev/api/recommend/content')
    url.searchParams.set('lang', lang)
    url.searchParams.set('limit', String(limit))
    url.searchParams.set('topic', topic)

    const response = await fetch(url.toString())
    if (!response.ok) throw new Error('Network error')

    const data = await response.json()
    articles.value = data.recommendations || []
  } catch (error) {
    console.warn('[connexe-article] could not fetch recommended articles', error)
  }
}

const {
  currentIndex,
  transitionName,
  isPrevDisabled,
  isNextDisabled,
  next,
  prev,
  onTouchStart,
  onTouchEnd,
  onKeyDown
} = useCarousel(() => articles.value.length)

const currentArticle = computed(() => articles.value[currentIndex.value])

const currentDomain = computed(() => {
  if (!currentArticle.value?.url) return ''

  try {
    return new URL(currentArticle.value.url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
})

onMounted(fetchRecommendedArticles)
watch(() => [lang, topic], fetchRecommendedArticles)
</script>

<template>
  <article class="article-card" :data-theme="theme" aria-labelledby="article-title" tabindex="0"
    data-badge="similar article from the ecosystem" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd"
    @keydown="onKeyDown" v-if="articles.length > 0">
    <div class="article-card__mask">
      <Transition :name="transitionName" mode="out-in">
        <div v-if="currentArticle" :key="currentArticle.id" class="article-card__content">
          <header class="article-card__header">
            <div class="article-card__meta">
              <p class="article-card__author">
                {{ currentArticle.author }}
              </p>
              <p class="article-card__publisher" id="article-publisher" v-if="currentDomain">
                {{ currentDomain }}
              </p>
            </div>
          </header>

          <h2 id="article-title" class="article-card__title">
            <a :href="currentArticle.url" class="article-card__link">
              {{ currentArticle.title }}
            </a>
          </h2>
        </div>
      </Transition>
    </div>

    <footer class="article-card__footer">
      <a href="https://github.com/humanonlyweb/connexe.dev" target="_blank" rel="noopener noreferrer"
        class="article-card__action" aria-label="Contribute to this article">
        Contribute
      </a>

      <nav v-if="articles.length > 1" class="article-card__nav" aria-label="Article navigation">
        <button @click="prev" class="article-card__nav-btn" data-dir="prev" :disabled="isPrevDisabled"
          aria-label="Previous article">
          previous
        </button>
        <button @click="next" class="article-card__nav-btn" data-dir="next" :disabled="isNextDisabled"
          aria-label="Next article">
          next
        </button>
      </nav>
    </footer>
  </article>
</template>

<style lang="scss">
@mixin theme-light {
  --ac-bg: var(--connexe-article-bg, oklch(0.98 0 0));
  --ac-text-main: var(--connexe-article-text-main, oklch(28.3% 0.021 262.3));
  --ac-text-muted: var(--connexe-article-text-muted, oklch(55.3% 0.019 252));
  --ac-border: var(--connexe-article-border, 1px solid oklch(0.94 0 0));
  --ac-accent: var(--connexe-article-accent, oklch(40.5% 0.081 129.6));
  --ac-footer-bg: var(--connexe-article-border, 1px solid oklch(0.94 0 0));
  --ac-footer-border: var(--connexe-article-footer-border, 1px solid oklch(92.8% 0.006 264.5));
}

@mixin theme-dark {
  --ac-bg: var(--connexe-article-bg, oklch(17.8% 0 0));
  --ac-text-main: var(--connexe-article-text-main, oklch(93.705% 0.00011 271.152));
  --ac-text-muted: var(--connexe-article-text-muted, oklch(63.3% 0 0));
  --ac-border: var(--connexe-article-border, 1px solid oklch(0.59 0 0 / 0.1));
  --ac-accent: var(--connexe-article-accent, oklch(88.4% 0.169 127.4));
  --ac-footer-bg: var(--connexe-article-footer-bg, oklch(0% 0 0 / 0.2));
  --ac-footer-border: var(--connexe-article-footer-border, 1px solid oklch(0.59 0 0 / 0.1));
}

$slide-distance: 15px;
$transition-duration: 0.2s;
$transition-ease: ease-out;

:host {
  all: initial;
  display: block;
  box-sizing: border-box;

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .article-card {
    --ac-font-family: var(--connexe-article-font-family, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
    --ac-padding: var(--connexe-article-padding, 14px);
    --ac-radius: var(--connexe-article-radius, 4px);
    --ac-pseudo-radius: var(--connexe-article-pseudo-radius, 2px);
    --ac-font-size-title: var(--connexe-article-font-size-title, 20px);
    --ac-font-size-meta: var(--connexe-article-font-size-meta, 12px);
    --ac-font-size-badge: var(--connexe-article-font-size-badge, 9px);
    --ac-font-size-author: var(--connexe-article-font-size-author, 10px);

    @include theme-light;

    @media (prefers-color-scheme: dark) {
      @include theme-dark;
    }

    &[data-theme='dark'] {
      @include theme-dark;
    }

    &[data-theme='light'] {
      @include theme-light;
    }
  }

  .article-card {
    position: relative;
    background-color: var(--ac-bg);
    color: var(--ac-text-main);
    border: var(--ac-border);
    border-radius: var(--ac-radius);
    line-height: 1;
    font-family: var(--ac-font-family);
    user-select: none;
    touch-action: pan-y;

    transition:
      background-color 0.3s ease,
      border-color 0.3s ease,
      color 0.3s ease;

    &::before {
      content: attr(data-badge);
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);

      background-color: var(--ac-bg);
      color: var(--ac-text-muted);
      border: var(--ac-border);
      border-radius: var(--ac-pseudo-radius);

      font-size: var(--ac-font-size-badge);
      padding: 2px 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      word-spacing: 2px;
      white-space: nowrap;
      z-index: 10;
      transition:
        background-color 0.3s ease,
        border-color 0.3s ease,
        color 0.3s ease;
    }

    &__mask {
      position: relative;
      overflow: hidden;
    }

    &__content {
      display: flex;
      flex-direction: column;
    }

    a,
    button {
      font-family: inherit;
      color: inherit;
    }

    a {
      text-decoration: none;
      transition:
        color 0.2s ease,
        text-decoration 0.2s ease;
    }

    button {
      background: none;
      border: none;
      cursor: pointer;
    }

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--ac-padding);
    }

    &__meta {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    &__author {
      color: var(--ac-accent);
      font-size: var(--ac-font-size-author);
    }

    &__publisher {
      font-size: var(--ac-font-size-meta);
    }

    &__title {
      display: block;
      font-size: var(--ac-font-size-title);
      font-weight: 600;
      flex-grow: 1;
      padding: 0 var(--ac-padding) var(--ac-padding);

      a {
        &:focus-visible {
          outline: none;
          text-decoration: underline;
          color: var(--ac-accent);
        }
      }
    }

    &__link {
      &:hover {
        color: var(--ac-accent);
        text-decoration: underline;
      }
    }

    &__footer {
      display: flex;
      justify-content: space-between;
      padding: var(--ac-padding);
      border-top: var(--ac-footer-border);
      background-color: var(--ac-footer-bg);
      color: var(--ac-text-muted);
      font-size: var(--ac-font-size-meta);
      border-bottom-right-radius: var(--ac-radius);
      border-bottom-left-radius: var(--ac-radius);

      position: relative;
      z-index: 5;
      transition:
        background-color 0.3s ease,
        border-color 0.3s ease;

      a:focus-visible,
      button:focus-visible {
        outline: 1px solid var(--ac-accent);
        outline-offset: 4px;
        color: var(--ac-accent);
      }
    }

    &__action,
    &__nav-btn {
      position: relative;
      text-transform: uppercase;
      font-size: var(--ac-font-size-author);
    }

    &__action {
      &::after {
        content: ' ↗';
      }

      &:hover {
        color: var(--ac-accent);
        text-decoration: underline;
      }
    }

    &__nav {
      display: flex;
      gap: 20px;
      align-items: center;
    }

    &__nav-btn {
      transition:
        color 0.2s ease,
        outline 0.2s ease,
        text-decoration 0.2s ease;

      &:hover:not([disabled]) {
        color: var(--ac-accent);
        text-decoration: underline;
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.3;
        color: var(--ac-text-muted);
      }

      &[data-dir='prev']::before {
        content: '← ';
      }

      &[data-dir='next']::after {
        content: ' →';
      }
    }
  }

  .slide-next-enter-active,
  .slide-next-leave-active,
  .slide-prev-enter-active,
  .slide-prev-leave-active {
    transition:
      opacity $transition-duration $transition-ease,
      transform $transition-duration $transition-ease;
  }

  .slide-next-enter-from {
    opacity: 0;
    transform: translateX($slide-distance);
  }

  .slide-next-leave-to {
    opacity: 0;
    transform: translateX(-$slide-distance);
  }

  .slide-prev-enter-from {
    opacity: 0;
    transform: translateX(-$slide-distance);
  }

  .slide-prev-leave-to {
    opacity: 0;
    transform: translateX($slide-distance);
  }
}
</style>