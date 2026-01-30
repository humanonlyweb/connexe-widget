<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useCarousel } from '../composables/useCarousel';

const { theme = 'dark', skills, lang = 'en', limit = 5 } = defineProps<{
  theme?: 'light' | 'dark',
  skills?: string
  limit?: number | string,
  lang?: string
}>()

interface Developer {
  id: string
  name: string
  avatar: string
  intro: string
  skills: string[]
  linkToPortfolio: string
}

const developers = ref<Developer[]>([])

const fetchDevelopers = async () => {
  try {
    const url = new URL('https://connexe.dev/api/recommend/developer')
    url.searchParams.set('lang', lang)
    url.searchParams.set('limit', String(limit))

    if (skills) {
      url.searchParams.set('skills', skills)
    }

    const response = await fetch(url.toString())
    if (!response.ok) throw new Error('Network error')

    const data = await response.json()
    developers.value = data.recommendations || []
  } catch (error) {
    console.warn('[connexe-dev] could not fetch developers', error)
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
} = useCarousel(() => developers.value.length)

const currentDeveloper = computed(() => developers.value[currentIndex.value])
const displayedSkills = computed(() => currentDeveloper.value?.skills.slice(0, 4) ?? [])

onMounted(fetchDevelopers)
watch(() => [lang, skills, limit], fetchDevelopers)
</script>

<template>
  <article class="dev-card" :data-theme="theme" aria-labelledby="dev-name" tabindex="0"
    data-badge="talent from the ecosystem" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd"
    @keydown="onKeyDown" v-if="developers.length > 0">
    <div class="dev-card__mask">
      <Transition :name="transitionName" mode="out-in">
        <div v-if="currentDeveloper" :key="currentDeveloper.id" class="dev-card__content">
          <header class="dev-card__header">
            <img :src="currentDeveloper.avatar" :alt="`${currentDeveloper.name}'s avatar`" class="dev-card__avatar"
              loading="lazy" />
            <div class="dev-card__meta">
              <h2 id="dev-name" class="dev-card__name">
                <a :href="currentDeveloper.linkToPortfolio" class="dev-card__link" target="_blank" rel="noopener noreferrer">
                  {{ currentDeveloper.name }}
                </a>
              </h2>
              <p class="dev-card__intro">
                {{ currentDeveloper.intro }}
              </p>
            </div>
          </header>

          <div class="dev-card__skills">
            <span v-for="skill in displayedSkills" :key="skill" class="dev-card__skill">
              {{ skill }}
            </span>
          </div>
        </div>
      </Transition>
    </div>

    <footer class="dev-card__footer">
      <a href="https://github.com/humanonlyweb/connexe.dev" target="_blank" rel="noopener noreferrer"
        class="dev-card__action" aria-label="Add your profile to the network">
        Add your profile
      </a>

      <nav v-if="developers.length > 1" class="dev-card__nav" aria-label="Developer navigation">
        <button @click="prev" class="dev-card__nav-btn" data-dir="prev" :disabled="isPrevDisabled"
          aria-label="Previous developer">
          previous
        </button>
        <button @click="next" class="dev-card__nav-btn" data-dir="next" :disabled="isNextDisabled"
          aria-label="Next developer">
          next
        </button>
      </nav>
    </footer>
  </article>
</template>

<style lang="scss">
@mixin theme-light {
  --dc-bg: var(--connexe-dev-bg, oklch(0.98 0 0));
  --dc-text-main: var(--connexe-dev-text-main, oklch(28.3% 0.021 262.3));
  --dc-text-muted: var(--connexe-dev-text-muted, oklch(49.091% 0.01772 260.746));
  --dc-border: var(--connexe-dev-border, 1px solid oklch(0.94 0 0));
  --dc-accent: var(--connexe-dev-accent, oklch(40.5% 0.081 129.6));
  --dc-footer-bg: var(--connexe-dev-footer-bg, oklch(98.5% 0.003 247.9));
  --dc-footer-border: var(--connexe-dev-footer-border, 1px solid oklch(0.94 0 0));
  --dc-skill-bg: var(--connexe-dev-skill-bg, oklch(97.315% 0.00011 271.152));
}

@mixin theme-dark {
  --dc-bg: var(--connexe-dev-bg, oklch(17.8% 0 0));
  --dc-text-main: var(--connexe-dev-text-main, oklch(93.705% 0.00011 271.152));
  --dc-text-muted: var(--connexe-dev-text-muted, oklch(63.3% 0 0));
  --dc-border: var(--connexe-dev-border, 1px solid oklch(0.59 0 0 / 0.1));
  --dc-accent: var(--connexe-dev-accent, oklch(88.4% 0.169 127.4));
  --dc-footer-bg: var(--connexe-dev-footer-bg, oklch(0% 0 0 / 0.2));
  --dc-footer-border: var(--connexe-dev-footer-border, 1px solid oklch(0.59 0 0 / 0.1));
  --dc-skill-bg: var(--connexe-dev-skill-bg, oklch(0.66 0 0 / 0.08));
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

  .dev-card {
    --dc-font-family: var(--connexe-dev-font-family, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
    --dc-padding: var(--connexe-dev-padding, 14px);
    --dc-radius: var(--connexe-dev-radius, 4px);
    --dc-pseudo-radius: var(--connexe-dev-pseudo-radius, 2px);
    --dc-avatar-radius: var(--connexe-dev-avatar-radius, 2px);

    --dc-avatar-size: var(--connexe-dev-avatar-size, 40px);
    --dc-gap: var(--connexe-dev-gap, 12px);
    --dc-gap-sm: var(--connexe-dev-gap-sm, 8px);

    --dc-font-size-name: var(--connexe-dev-font-size-name, 16px);
    --dc-font-size-intro: var(--connexe-dev-font-size-intro, 13px);
    --dc-font-size-meta: var(--connexe-dev-font-size-meta, 12px);
    --dc-font-size-badge: var(--connexe-dev-font-size-badge, 9px);
    --dc-font-size-skill: var(--connexe-dev-font-size-skill, 10px);

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

  .dev-card {
    position: relative;
    background-color: var(--dc-bg);
    color: var(--dc-text-main);
    border: var(--dc-border);
    border-radius: var(--dc-radius);
    line-height: 1;
    font-family: var(--dc-font-family);
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

      background-color: var(--dc-bg);
      color: var(--dc-text-muted);
      border: var(--dc-border);
      border-radius: var(--dc-pseudo-radius);

      font-size: var(--dc-font-size-badge);
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
      padding: var(--dc-padding);
      gap: var(--dc-gap);
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
      gap: var(--dc-gap);
      align-items: flex-start;
    }

    &__avatar {
      width: var(--dc-avatar-size);
      height: var(--dc-avatar-size);
      background: var(--dc-skill-bg);
      border-radius: var(--dc-avatar-radius);
      flex-shrink: 0;
    }

    &__meta {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }

    &__name {
      font-size: var(--dc-font-size-name);
      font-weight: 600;
      color: var(--dc-accent);
    }

    &__link {
      color: inherit;

      &:hover {
        text-decoration: underline;
      }

      &:focus-visible {
        outline: none;
        text-decoration: underline;
      }
    }

    &__intro {
      font-size: var(--dc-font-size-intro);
      line-height: 1.2;
      color: var(--dc-text-muted);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      font-weight: 300;
      overflow: hidden;
    }

    &__skills {
      display: flex;
      flex-wrap: wrap;
      gap: var(--dc-gap-sm);
    }

    &__skill {
      padding: 4px 8px;
      font-size: var(--dc-font-size-skill);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: var(--dc-skill-bg);
      border-radius: 2px;
      color: var(--dc-text-muted);
    }

    &__footer {
      display: flex;
      justify-content: space-between;
      padding: var(--dc-padding);
      border-top: var(--dc-footer-border);
      background-color: var(--dc-footer-bg);
      color: var(--dc-text-muted);
      font-size: var(--dc-font-size-meta);
      border-bottom-left-radius: var(--dc-radius);
      border-bottom-right-radius: var(--dc-radius);

      position: relative;
      z-index: 5;
      transition:
        background-color 0.3s ease,
        border-color 0.3s ease;

      a:focus-visible,
      button:focus-visible {
        outline: 1px solid var(--dc-accent);
        outline-offset: 4px;
        color: var(--dc-accent);
      }
    }

    &__action,
    &__nav-btn {
      position: relative;
      text-transform: uppercase;
      font-size: var(--dc-font-size-skill);
    }

    &__action {
      &::after {
        content: ' ↗';
      }

      &:hover {
        color: var(--dc-accent);
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
        color: var(--dc-accent);
        text-decoration: underline;
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.3;
        color: var(--dc-text-muted);
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